import { useEffect, useState } from "react";
import {
  FaBirthdayCake, FaEnvelope, FaPencilAlt, FaPhone, FaRegClock, FaRegStar, FaShareAlt, FaStar, FaTrash,
} from "react-icons/fa";
import { timeAgo } from "../util/time";
import { describeInDays, nextBirthday } from "../util/birthday";

const initials = (name) => {
  const parts = (name || "?").trim().split(/\s+/);
  return ((parts[0]?.[0] || "?") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
};

/** Photo, or the initials on a gradient when there's no photo or it fails to load. */
const ContactAvatar = ({ name, image }) => {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [image]);
  if (image && !broken) {
    return (
      <img src={image} alt="" onError={() => setBroken(true)}
        className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-md" />
    );
  }
  return (
    <div aria-hidden className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-semibold text-white ring-4 ring-white shadow-md">
      {initials(name)}
    </div>
  );
};

/** One button in the footer bar. Renders a link when `href` is set, otherwise a button. */
const Action = ({ label, icon: Icon, href, onClick, disabled, tone = "default" }) => {
  const tones = {
    default: "hover:bg-purple-50 hover:text-purple-700",
    danger: "hover:bg-red-50 hover:text-red-600",
  };
  const cls = `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors focus:outline-none focus-visible:bg-purple-50 ${
    disabled ? "cursor-not-allowed text-gray-300" : `text-gray-600 ${tones[tone]}`}`;
  const body = <><Icon className="h-4 w-4" aria-hidden />{label}</>;
  if (href && !disabled) return <a href={href} className={cls} aria-label={label}>{body}</a>;
  return (
    <button type="button" className={cls} aria-label={label} disabled={disabled}
      onClick={(e) => { e.preventDefault(); onClick?.(); }}>
      {body}
    </button>
  );
};

const ContactCard = ({
  name,
  work,
  image,
  number,
  email,
  tags = [],
  onTagClick,
  lastContactedAt,
  birthday,          // { birthdayMonth, birthdayDay, birthdayYear } or null
  onOpen,            // opens the detail view (notes + timeline)
  selectable = false,
  selected = false,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  onShare,
  onEdit,
  onDelete,
}) => {
  const upcoming = birthday ? nextBirthday(birthday) : null;
  const soon = upcoming && upcoming.inDays <= 7 ? upcoming : null;
  const phone = number?.trim();

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        selected ? "border-purple-500 ring-2 ring-purple-500" : "border-gray-200"}`}
    >
      {/* Soft header band behind the avatar */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-100" />

      {selectable && (
        <label className="absolute left-3 top-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-white shadow-sm">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect?.(e.target.checked)}
            aria-label={`Select ${name}`}
            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
        </label>
      )}

      <button
        type="button"
        aria-label={isFavorite ? `Remove ${name} from favourites` : `Add ${name} to favourites`}
        aria-pressed={isFavorite}
        onClick={(e) => { e.preventDefault(); onToggleFavorite?.(); }}
        className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 shadow-sm transition-colors hover:bg-white"
      >
        {isFavorite
          ? <FaStar className="h-4 w-4 text-yellow-400" />
          : <FaRegStar className="h-4 w-4 text-gray-400 hover:text-yellow-500" />}
      </button>

      {/* Identity */}
      <div className="relative flex flex-col items-center px-5 pt-6 text-center">
        <ContactAvatar name={name} image={image} />
        <h3 className="mt-3 line-clamp-2 break-words text-lg font-semibold leading-snug text-gray-900">
          {onOpen ? (
            <button type="button" onClick={onOpen} title="Open notes and timeline"
              className="rounded hover:text-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
              {name}
            </button>
          ) : name}
        </h3>
        {work && <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">{work}</p>}

        {(soon || lastContactedAt) && (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-xs">
            {soon && (
              <span className="inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 font-medium text-pink-700">
                <FaBirthdayCake className="h-3 w-3" aria-hidden />
                Birthday {describeInDays(soon.inDays)}{soon.turning ? ` · turns ${soon.turning}` : ""}
              </span>
            )}
            {lastContactedAt && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-gray-600"
                title={new Date(lastContactedAt).toLocaleString()}>
                <FaRegClock className="h-3 w-3" aria-hidden />
                Contacted {timeAgo(lastContactedAt)}
              </span>
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTagClick?.(t)}
                title={`Show contacts tagged ${t}`}
                className="rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 hover:bg-purple-100"
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <dl className="mx-5 mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <dt className="sr-only">Email</dt>
          <FaEnvelope className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
          <dd className="min-w-0 truncate">
            {email
              ? <a href={`mailto:${email}`} title={email} className="text-gray-700 hover:text-purple-700 hover:underline">{email}</a>
              : <span className="text-gray-400">No email</span>}
          </dd>
        </div>
        <div className="flex items-center gap-2.5 min-w-0">
          <dt className="sr-only">Phone</dt>
          <FaPhone className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden />
          <dd className="min-w-0 truncate">
            {phone
              ? <a href={`tel:${phone}`} className="text-gray-700 hover:text-purple-700 hover:underline">{phone}</a>
              : <span className="text-gray-400">No phone number</span>}
          </dd>
        </div>
      </dl>

      {/* Actions: pinned to the bottom so cards in a row line up */}
      <div className="mt-auto pt-4">
        <div className="flex divide-x divide-gray-100 border-t border-gray-100">
          <Action label="Call" icon={FaPhone} href={phone ? `tel:${phone}` : undefined} disabled={!phone} />
          <Action label="Email" icon={FaEnvelope} href={email ? `mailto:${email}` : undefined} disabled={!email} />
          <Action label="Share" icon={FaShareAlt} onClick={onShare} disabled={!onShare} />
          {onEdit && <Action label="Edit" icon={FaPencilAlt} onClick={onEdit} />}
          {onDelete && <Action label="Delete" icon={FaTrash} onClick={onDelete} tone="danger" />}
        </div>
      </div>
    </article>
  );
};

export default ContactCard;
