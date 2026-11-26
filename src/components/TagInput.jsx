import { useId, useState } from "react";
import { HiX } from "react-icons/hi";
import { MAX_TAG_LENGTH, MAX_TAGS, cleanTags } from "../util/importContacts";

/**
 * Chips plus a text box. Enter or comma adds a tag, Backspace on an empty box
 * removes the last one, and existing tags are offered as suggestions.
 */
const TagInput = ({ id, value, onChange, suggestions = [] }) => {
  const [draft, setDraft] = useState("");
  const listId = useId();
  const full = value.length >= MAX_TAGS;

  const add = (raw) => {
    const next = cleanTags([...value, ...raw.split(",")]);
    if (next.length !== value.length) onChange(next);
    setDraft("");
  };

  const remove = (tag) => onChange(value.filter((t) => t !== tag));

  const onKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && draft.trim()) {
      e.preventDefault();
      add(draft);
    } else if (e.key === "Enter") {
      e.preventDefault(); // don't submit the whole form from an empty tag box
    } else if (e.key === "Backspace" && !draft && value.length) {
      remove(value[value.length - 1]);
    }
  };

  const lower = new Set(value.map((t) => t.toLowerCase()));
  const options = suggestions.filter((s) => !lower.has(s.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 p-2 focus-within:ring-2 focus-within:ring-cyan-500">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
            {tag}
            <button type="button" onClick={() => remove(tag)} aria-label={`Remove tag ${tag}`} className="hover:text-purple-950">
              <HiX className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <input
          id={id}
          list={listId}
          value={draft}
          disabled={full}
          maxLength={MAX_TAG_LENGTH}
          onChange={(e) => (e.target.value.includes(",") ? add(e.target.value) : setDraft(e.target.value))}
          onKeyDown={onKeyDown}
          onBlur={() => draft.trim() && add(draft)}
          placeholder={full ? `Up to ${MAX_TAGS} tags` : value.length ? "Add another" : "e.g. Work, Family"}
          className="flex-1 min-w-[8rem] border-0 bg-transparent p-1 text-sm focus:ring-0"
        />
        <datalist id={listId}>
          {options.map((s) => <option key={s} value={s} />)}
        </datalist>
      </div>
      <p className="mt-1 text-xs text-gray-500">Press Enter or comma to add. Up to {MAX_TAGS} tags.</p>
    </div>
  );
};

export default TagInput;
