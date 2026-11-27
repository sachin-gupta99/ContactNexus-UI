import { useId, useRef, useState } from "react";
import { HiX } from "react-icons/hi";
import { FaTag } from "react-icons/fa";
import { MAX_TAG_LENGTH, MAX_TAGS, cleanTags } from "../util/importContacts";

const MAX_SUGGESTIONS = 6;

/**
 * Chips plus a text box, styled to match flowbite's TextInput (same height,
 * border, focus ring and icon slot). Enter or comma adds a tag, Backspace on an
 * empty box removes the last one, and existing tags are suggested in a
 * dropdown navigable with the arrow keys.
 */
const TagInput = ({ id, value, onChange, suggestions = [] }) => {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);
  const listId = useId();
  const full = value.length >= MAX_TAGS;

  const chosen = new Set(value.map((t) => t.toLowerCase()));
  const query = draft.trim().toLowerCase();
  const matches = suggestions
    .filter((s) => !chosen.has(s.toLowerCase()) && s.toLowerCase().includes(query))
    .slice(0, MAX_SUGGESTIONS);
  const showList = open && !full && matches.length > 0;

  const add = (raw) => {
    const next = cleanTags([...value, ...raw.split(",")]);
    if (next.length !== value.length) onChange(next);
    setDraft("");
    setActive(-1);
  };

  const remove = (tag) => onChange(value.filter((t) => t !== tag));

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" && matches.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp" && matches.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? matches.length - 1 : i - 1));
    } else if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // never submit the whole form from the tag box
      if (showList && active >= 0) add(matches[active]);
      else if (draft.trim()) add(draft);
    } else if (e.key === "Escape" && showList) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Backspace" && !draft && value.length) {
      remove(value[value.length - 1]);
    }
  };

  return (
    <div className="relative">
      {/* Clicking anywhere in the box focuses the text field, like a normal input. */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex min-h-[42px] w-full cursor-text flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 bg-gray-50 py-1.5 pl-10 pr-2 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500"
      >
        <FaTag className="pointer-events-none absolute left-3 top-[13px] h-4 w-4 text-gray-500" aria-hidden />
        {value.map((tag) => (
          <span key={tag} className="inline-flex h-7 items-center gap-1 rounded-md bg-purple-100 pl-2.5 pr-1.5 text-sm font-medium text-purple-800">
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); remove(tag); }}
              aria-label={`Remove tag ${tag}`}
              className="rounded p-0.5 text-purple-600 hover:bg-purple-200 hover:text-purple-900"
            >
              <HiX className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          value={draft}
          disabled={full}
          maxLength={MAX_TAG_LENGTH}
          onChange={(e) => {
            const v = e.target.value;
            if (v.includes(",")) add(v);
            else {
              setDraft(v);
              setOpen(true);
              setActive(-1);
            }
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            if (draft.trim()) add(draft);
          }}
          placeholder={full ? `Up to ${MAX_TAGS} tags` : value.length ? "Add another…" : "e.g. Work, Family"}
          className="h-7 min-w-[8rem] flex-1 border-0 bg-transparent p-0 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed"
        />
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg"
        >
          {matches.map((s, i) => (
            <li
              key={s}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown (not click) so the input's blur doesn't close the list first
              onMouseDown={(e) => { e.preventDefault(); add(s); }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-gray-700 ${i === active ? "bg-gray-100" : ""}`}
            >
              <FaTag className="h-3 w-3 text-purple-500" aria-hidden />
              {s}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-1 text-xs text-gray-500">
        Press Enter or comma to add. Up to {MAX_TAGS} tags.
      </p>
    </div>
  );
};

export default TagInput;
