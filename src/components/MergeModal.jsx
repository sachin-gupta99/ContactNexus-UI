import { useEffect, useMemo, useState } from "react";
import { Avatar, Button, Modal, Textarea } from "flowbite-react";
import { useDispatch } from "react-redux";
import { useMergeContacts } from "../hooks/useContacts";
import { toastActions } from "../store/toast";
import { formatBirthday } from "../util/birthday";

const FIELDS = [
  ["firstName", "First name"], ["lastName", "Last name"], ["email", "Email"], ["phone", "Phone"],
  ["bio", "Bio"], ["birthday", "Birthday"], ["street", "Street"], ["city", "City"], ["state", "State"],
  ["country", "Country"], ["zipCode", "Zip"], ["githubUrl", "GitHub"], ["linkedinUrl", "LinkedIn"],
  ["instagramUrl", "Instagram"],
];

const name = (c) => [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email;
const valueOf = (c, field) => (field === "birthday" ? formatBirthday(c) : c[field]) || "";

/**
 * Merge a group of duplicates into one. For every field where the contacts
 * differ the user picks whose value to keep (defaulting to the kept contact's,
 * or the first that has one). Tags are combined, notes are joined into an
 * editable box, the timeline moves over, and the user picks which photo stays.
 */
const MergeModal = ({ contacts, onClose, onMerged }) => {
  const dispatch = useDispatch();
  const merge = useMergeContacts();
  const open = Boolean(contacts?.length);
  const [keepId, setKeepId] = useState(null);
  const [picks, setPicks] = useState({});
  const [notes, setNotes] = useState("");
  const [photoFromId, setPhotoFromId] = useState(null);

  const list = useMemo(() => contacts ?? [], [contacts]);
  const differing = useMemo(
    () => FIELDS.filter(([f]) => new Set(list.map((c) => valueOf(c, f))).size > 1),
    [list],
  );
  const withPhoto = list.filter((c) => c.hasPhoto || c.imageUrl);

  useEffect(() => {
    if (!open) return;
    const keep = list[0];
    setKeepId(keep.id);
    const initial = {};
    for (const [f] of FIELDS) {
      const source = valueOf(keep, f) ? keep : list.find((c) => valueOf(c, f)) || keep;
      initial[f] = source.id;
    }
    setPicks(initial);
    setNotes([...new Set(list.map((c) => c.notes?.trim()).filter(Boolean))].join("\n\n"));
    setPhotoFromId((withPhoto.find((c) => c.id === keep.id) || withPhoto[0])?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, list]);

  if (!open || keepId === null) return null;
  const byId = Object.fromEntries(list.map((c) => [c.id, c]));
  const from = (f) => byId[picks[f]] || byId[keepId];

  const submit = () => {
    const bday = from("birthday");
    const values = {
      firstName: from("firstName").firstName,
      lastName: from("lastName").lastName,
      email: from("email").email,
      phone: from("phone").phone,
      bio: from("bio").bio,
      street: from("street").street,
      city: from("city").city,
      state: from("state").state,
      country: from("country").country,
      zipCode: from("zipCode").zipCode,
      githubUrl: from("githubUrl").githubUrl,
      linkedinUrl: from("linkedinUrl").linkedinUrl,
      instagramUrl: from("instagramUrl").instagramUrl,
      notes: notes.trim() || null,
      birthdayMonth: bday.birthdayMonth ?? null,
      birthdayDay: bday.birthdayDay ?? null,
      birthdayYear: bday.birthdayYear ?? null,
      tags: null, // server combines everyone's tags
    };
    merge.mutate(
      { keepId, mergeIds: list.filter((c) => c.id !== keepId).map((c) => c.id), values, photoFromId },
      {
        onSuccess: (merged) => {
          dispatch(toastActions.setToast({ message: `Merged ${list.length} contacts into ${name(merged)}`, type: "success" }));
          onMerged?.(merged);
        },
        onError: (err) => {
          const data = err.response?.data;
          const field = data?.fields && Object.entries(data.fields)[0];
          dispatch(toastActions.setToast({
            message: data?.message || (field && `${field[0]}: ${field[1]}`) || "Could not merge those contacts",
            type: "error",
          }));
        },
      },
    );
  };

  const tags = [...new Set(list.flatMap((c) => c.tags || []))];

  return (
    <Modal show={open} onClose={() => !merge.isPending && onClose()} size="3xl" dismissible>
      <Modal.Header>Merge {list.length} contacts</Modal.Header>
      <Modal.Body className="max-h-[70vh] overflow-y-auto space-y-6">
        <section>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Keep this one (the others are deleted)</h3>
          <div className="flex flex-wrap gap-2">
            {list.map((c) => (
              <label key={c.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                keepId === c.id ? "border-purple-500 bg-purple-50" : "border-gray-200"}`}>
                <input type="radio" name="keep" checked={keepId === c.id} onChange={() => setKeepId(c.id)}
                  className="text-purple-600 focus:ring-purple-500" />
                <Avatar img={c.imageUrl || undefined} placeholderInitials={name(c).charAt(0).toUpperCase()} rounded size="xs" />
                {name(c)}
              </label>
            ))}
          </div>
        </section>

        {differing.length > 0 ? (
          <section>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Pick a value where they differ</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-gray-100">
                  {differing.map(([f, label]) => (
                    <tr key={f}>
                      <th className="w-28 bg-gray-50 px-3 py-2 font-medium text-gray-600">{label}</th>
                      {list.map((c) => {
                        const v = valueOf(c, f);
                        return (
                          <td key={c.id} className="px-3 py-2">
                            <label className={`flex items-start gap-2 ${v ? "cursor-pointer" : "opacity-40"}`}>
                              <input type="radio" name={`pick-${f}`} disabled={!v} checked={picks[f] === c.id}
                                onChange={() => setPicks((p) => ({ ...p, [f]: c.id }))}
                                className="mt-0.5 text-purple-600 focus:ring-purple-500" />
                              <span className="break-all">{v || "—"}</span>
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <p className="text-sm text-gray-600">All their details match.</p>
        )}

        {withPhoto.length > 1 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Photo</h3>
            <div className="flex flex-wrap gap-3">
              {withPhoto.map((c) => (
                <label key={c.id} className={`cursor-pointer rounded-lg border p-1 ${photoFromId === c.id ? "border-purple-500" : "border-gray-200"}`}>
                  <input type="radio" name="photo" className="sr-only" checked={photoFromId === c.id} onChange={() => setPhotoFromId(c.id)} />
                  <img src={c.imageUrl} alt={`${name(c)}'s photo`} className="h-16 w-16 rounded object-cover" />
                </label>
              ))}
            </div>
          </section>
        )}

        {tags.length > 0 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold text-gray-700">Tags (combined)</h3>
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 10).map((t) => (
                <span key={t} className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">{t}</span>
              ))}
              {tags.length > 10 && <span className="text-xs text-gray-500">Only the first 10 are kept.</span>}
            </div>
          </section>
        )}

        <section>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Notes (combined, edit if you like)</h3>
          <Textarea rows={3} maxLength={10000} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <p className="mt-1 text-xs text-gray-500">Timelines are combined too.</p>
        </section>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button color="gray" onClick={onClose} disabled={merge.isPending}>Cancel</Button>
        <Button gradientDuoTone="purpleToBlue" onClick={submit} isProcessing={merge.isPending} disabled={merge.isPending}>
          Merge into {name(byId[keepId])}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MergeModal;
