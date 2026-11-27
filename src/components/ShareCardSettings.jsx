import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import { FaCopy, FaExternalLinkAlt, FaSyncAlt } from "react-icons/fa";
import QRCode from "qrcode";
import ConfirmModal from "./ConfirmModal";
import {
  disableCardShareRoute, getCardShareRoute, rotateCardShareRoute, saveCardShareRoute,
} from "../api/userApi";
import { toastActions } from "../store/toast";

const LABELS = {
  EMAIL: "Email", PHONE: "Phone", WORK: "Work", ADDRESS: "Address",
  SOCIAL: "Social links", BIO: "Bio", PHOTO: "Photo",
};

const cardUrl = (token) => `${window.location.origin}/c/${token}`;

/**
 * Public link (and QR code) to your own card. You pick which fields it shows;
 * the name always appears. "New link" invalidates every copy handed out so far.
 */
const ShareCardSettings = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userId = useSelector((state) => state.user?.user?.id);
  const key = ["cardShare", userId];
  const toast = (message, type = "success") => dispatch(toastActions.setToast({ message, type }));

  const share = useQuery({
    queryKey: key,
    queryFn: () => getCardShareRoute().then((res) => res.data),
    enabled: Boolean(userId),
  });
  const [fields, setFields] = useState([]);
  const [qr, setQr] = useState(null);
  const [confirmOff, setConfirmOff] = useState(false);

  useEffect(() => {
    if (share.data) setFields(share.data.fields);
  }, [share.data]);

  const token = share.data?.enabled ? share.data.token : null;
  useEffect(() => {
    if (!token) {
      setQr(null);
      return;
    }
    QRCode.toDataURL(cardUrl(token), { width: 192, margin: 1, color: { dark: "#3b0764" } })
      .then(setQr)
      .catch(() => setQr(null));
  }, [token]);

  const onSaved = (data) => queryClient.setQueryData(key, data);
  const onFail = (err) => toast(err.response?.data?.message || "Something went wrong", "error");

  const save = useMutation({
    mutationFn: () => saveCardShareRoute(fields).then((r) => r.data),
    onSuccess: (data) => { onSaved(data); toast(share.data?.enabled ? "Card updated" : "Your card link is live"); },
    onError: onFail,
  });
  const rotate = useMutation({
    mutationFn: () => rotateCardShareRoute().then((r) => r.data),
    onSuccess: (data) => { onSaved(data); toast("New link created. The old one no longer works."); },
    onError: onFail,
  });
  const disable = useMutation({
    mutationFn: () => disableCardShareRoute(),
    onSuccess: () => { setConfirmOff(false); queryClient.invalidateQueries({ queryKey: key }); toast("Card link turned off"); },
    onError: onFail,
  });

  if (share.isPending) return <div className="flex justify-center py-4"><Spinner /></div>;
  if (share.isError) return <p className="text-sm text-red-600">Couldn’t load your card settings.</p>;

  const available = share.data.available;
  const dirty = token && [...fields].sort().join() !== [...share.data.fields].sort().join();
  const toggle = (f) => setFields((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl(token));
      toast("Link copied");
    } catch {
      toast("Couldn't copy; select the link and copy it manually", "error");
    }
  };

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-gray-700">Show on the card (your name is always shown)</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {available.map((f) => (
            <div key={f} className="flex items-center gap-2">
              <Checkbox id={`share-${f}`} checked={fields.includes(f)} onChange={() => toggle(f)} />
              <Label htmlFor={`share-${f}`} className="text-sm">{LABELS[f] ?? f}</Label>
            </div>
          ))}
        </div>
      </fieldset>

      {!token ? (
        <Button gradientDuoTone="purpleToBlue" onClick={() => save.mutate()} isProcessing={save.isPending}>
          Create my card link
        </Button>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {qr && (
            <a href={qr} download="contact-nexus-card-qr.png" title="Download the QR code"
              className="shrink-0 self-center rounded-lg border border-gray-200 p-2">
              <img src={qr} alt="QR code for your card link" className="h-36 w-36" />
            </a>
          )}
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex gap-2">
              <TextInput readOnly value={cardUrl(token)} className="flex-1" aria-label="Your card link"
                onFocus={(e) => e.target.select()} />
              <Button color="light" onClick={copy} aria-label="Copy link"><FaCopy className="h-4 w-4" /></Button>
              <a href={cardUrl(token)} target="_blank" rel="noopener noreferrer" aria-label="Open card"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 text-gray-700 hover:bg-gray-100">
                <FaExternalLinkAlt className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              {dirty && (
                <Button size="sm" gradientDuoTone="purpleToBlue" onClick={() => save.mutate()} isProcessing={save.isPending}>
                  Save changes
                </Button>
              )}
              <Button size="sm" color="light" onClick={() => rotate.mutate()} isProcessing={rotate.isPending}>
                <FaSyncAlt className="mr-2 h-3 w-3" /> New link
              </Button>
              <Button size="sm" color="light" onClick={() => setConfirmOff(true)}>Turn off</Button>
            </div>
            <p className="text-xs text-gray-500">
              Anyone with the link can see the fields above. Scan the QR code to open it on a phone.
            </p>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmOff}
        onClose={() => !disable.isPending && setConfirmOff(false)}
        onConfirm={() => disable.mutate()}
        title="Turn off your card link?"
        message="The link and QR code stop working. You can create a new one later."
        confirmLabel="Turn off"
        busy={disable.isPending}
      />
    </div>
  );
};

export default ShareCardSettings;
