import { useState } from "react";
import { Avatar, Button, Modal, Select, Spinner, TextInput } from "flowbite-react";
import {
  FaBirthdayCake, FaComment, FaEnvelope, FaHandshake, FaPen, FaPhone, FaRegStickyNote, FaStar, FaTrash,
} from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { useAddInteraction, useContact, useDeleteInteraction, useInteractions } from "../hooks/useContacts";
import { toastActions } from "../store/toast";
import { describeInDays, formatBirthday, nextBirthday } from "../util/birthday";
import { timeAgo } from "../util/time";

const INTERACTION_TYPES = {
  CALL: { label: "Call", icon: FaPhone, color: "text-blue-600 bg-blue-50" },
  MEETING: { label: "Meeting", icon: FaHandshake, color: "text-green-600 bg-green-50" },
  EMAIL: { label: "Email", icon: FaEnvelope, color: "text-purple-600 bg-purple-50" },
  MESSAGE: { label: "Message", icon: FaComment, color: "text-amber-600 bg-amber-50" },
  OTHER: { label: "Other", icon: HiDotsHorizontal, color: "text-gray-600 bg-gray-100" },
};

const name = (c) => [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email;

// datetime-local wants local time without seconds or zone: "2026-11-27T14:05".
const localNow = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

/** Everything about one contact: details, birthday, notes, and the interaction timeline. */
const ContactDetailModal = ({ contact: fromList, onClose, onEdit }) => {
  const dispatch = useDispatch();
  const toast = (message, type = "success") => dispatch(toastActions.setToast({ message, type }));
  const open = Boolean(fromList);
  const id = fromList?.id;
  const contact = useContact(open ? id : null, fromList).data ?? fromList;
  const timeline = useInteractions(open ? id : null);
  const add = useAddInteraction(id);
  const remove = useDeleteInteraction(id);

  const [type, setType] = useState("CALL");
  const [note, setNote] = useState("");
  const [when, setWhen] = useState("");

  const log = (e) => {
    e.preventDefault();
    add.mutate(
      { type, note: note.trim() || null, occurredAt: when ? new Date(when).toISOString() : null },
      {
        onSuccess: () => {
          setNote("");
          setWhen("");
          toast(`Logged ${INTERACTION_TYPES[type].label.toLowerCase()} with ${contact.firstName}`);
        },
        onError: (err) => toast(err.response?.data?.message || "Could not log that", "error"),
      },
    );
  };

  if (!contact) return null;
  const bday = nextBirthday(contact);

  return (
    <Modal show={open} onClose={onClose} size="2xl" dismissible>
      <Modal.Header>
        <span className="flex items-center gap-3">
          <Avatar img={contact.imageUrl || undefined} placeholderInitials={name(contact).charAt(0).toUpperCase()} rounded size="sm" />
          <span className="font-bold text-gray-900">{name(contact)}</span>
          {contact.favorite && <FaStar className="h-4 w-4 text-yellow-500" aria-label="Favourite" />}
        </span>
      </Modal.Header>
      <Modal.Body className="max-h-[70vh] overflow-y-auto space-y-6">
        <section className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
          <p className="flex items-center gap-2 truncate"><FaEnvelope className="h-3.5 w-3.5 text-gray-400" />{contact.email}</p>
          {contact.phone && <p className="flex items-center gap-2"><FaPhone className="h-3.5 w-3.5 text-gray-400" />{contact.phone}</p>}
          {bday && (
            <p className="flex items-center gap-2">
              <FaBirthdayCake className="h-3.5 w-3.5 text-pink-500" />
              {formatBirthday(contact)} · {describeInDays(bday.inDays)}{bday.turning ? `, turns ${bday.turning}` : ""}
            </p>
          )}
          <p className="text-gray-500">
            {contact.lastContactedAt ? `Last contacted ${timeAgo(contact.lastContactedAt)}` : "No interactions logged yet"}
          </p>
          {contact.tags?.length > 0 && (
            <p className="flex flex-wrap gap-1 sm:col-span-2">
              {contact.tags.map((t) => (
                <span key={t} className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">{t}</span>
              ))}
            </p>
          )}
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              <FaRegStickyNote className="h-3.5 w-3.5" /> Notes
            </h3>
            <Button size="xs" color="light" onClick={() => onEdit(contact)}>
              <FaPen className="mr-1 h-3 w-3" /> Edit
            </Button>
          </div>
          {contact.notes ? (
            <p className="whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm text-gray-800">{contact.notes}</p>
          ) : (
            <p className="text-sm text-gray-500">No notes yet. Use Edit to add how you met or things to remember.</p>
          )}
        </section>

        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">Timeline</h3>
          <form onSubmit={log} className="mb-4 grid gap-2 rounded-lg border border-gray-200 p-3 sm:grid-cols-[8rem_1fr]">
            <Select aria-label="Interaction type" value={type} onChange={(e) => setType(e.target.value)} sizing="sm">
              {Object.entries(INTERACTION_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </Select>
            <TextInput sizing="sm" placeholder="What happened? (optional)" maxLength={1000}
              value={note} onChange={(e) => setNote(e.target.value)} aria-label="Note" />
            <TextInput sizing="sm" type="datetime-local" max={localNow()} value={when}
              onChange={(e) => setWhen(e.target.value)} aria-label="When (defaults to now)" title="When (defaults to now)" />
            <Button type="submit" size="sm" gradientDuoTone="purpleToBlue" isProcessing={add.isPending} disabled={add.isPending}>
              Log {INTERACTION_TYPES[type].label.toLowerCase()}
            </Button>
          </form>

          {timeline.isPending ? (
            <div className="flex justify-center py-4"><Spinner /></div>
          ) : timeline.data?.length ? (
            <ol className="relative space-y-4 border-l border-gray-200 pl-6">
              {timeline.data.map((i) => {
                const t = INTERACTION_TYPES[i.type] ?? INTERACTION_TYPES.OTHER;
                const Icon = t.icon;
                return (
                  <li key={i.id} className="group relative">
                    <span className={`absolute -left-[37px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${t.color}`}>
                      <Icon className="h-3 w-3" />
                    </span>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {t.label} <span className="font-normal text-gray-500">· {timeAgo(i.occurredAt)}</span>
                        </p>
                        {i.note && <p className="text-sm text-gray-700">{i.note}</p>}
                        <p className="text-xs text-gray-400">{new Date(i.occurredAt).toLocaleString()}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Delete this entry"
                        onClick={() => remove.mutate(i.id, { onError: () => toast("Could not delete that entry", "error") })}
                        className="rounded p-1 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 focus:opacity-100 group-hover:opacity-100"
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="text-sm text-gray-500">Nothing logged yet. Each entry updates “last contacted”.</p>
          )}
        </section>
      </Modal.Body>
    </Modal>
  );
};

export default ContactDetailModal;
