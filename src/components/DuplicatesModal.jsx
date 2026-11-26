import { Avatar, Button, Modal } from "flowbite-react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { timeAgo } from "../util/time";

const name = (c) => [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email;

/**
 * Groups of contacts that share an email or phone number. Editing or deleting
 * closes this list first; it reopens with whatever is still left to review.
 */
const DuplicatesModal = ({ isOpen, onClose, groups = [], onEdit, onDelete }) => (
  <Modal show={isOpen} onClose={onClose} size="2xl" dismissible>
    <Modal.Header>Possible duplicates</Modal.Header>
    <Modal.Body className="max-h-[70vh] overflow-y-auto">
      {groups.length === 0 ? (
        <p className="text-gray-600">No duplicates left. Nice and tidy.</p>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            These contacts share an email address or phone number. Keep the one you want and delete or edit the others.
          </p>
          {groups.map((g) => (
            <section key={`${g.reason}:${g.value}`} className="border border-gray-200 rounded-lg">
              <h3 className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700 rounded-t-lg">
                {g.reason === "email" ? <FaEnvelope className="w-3.5 h-3.5" /> : <FaPhone className="w-3.5 h-3.5" />}
                Same {g.reason}: <span className="font-normal truncate">{g.value}</span>
              </h3>
              <ul className="divide-y divide-gray-100">
                {g.contacts.map((c, i) => (
                  <li key={c.id} className="flex items-center gap-3 px-4 py-3">
                    <Avatar img={c.imageUrl || undefined} placeholderInitials={name(c).charAt(0).toUpperCase()} rounded size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {name(c)}
                        {i === 0 && <span className="ml-2 text-xs font-normal text-gray-500">oldest</span>}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {[c.email, c.phone].filter(Boolean).join(" · ")} · added {timeAgo(c.createdAt)}
                      </p>
                    </div>
                    <Button size="xs" color="light" onClick={() => onEdit(c)}>Edit</Button>
                    <Button size="xs" color="failure" onClick={() => onDelete(c)}>Delete</Button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Modal.Body>
  </Modal>
);

export default DuplicatesModal;
