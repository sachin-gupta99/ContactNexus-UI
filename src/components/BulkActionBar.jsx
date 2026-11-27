import { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { FaFileExport, FaRegStar, FaStar, FaTag, FaTrash } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import TagInput from "./TagInput";

/**
 * Sticky bar shown while contacts are selected. Tag changes open a small dialog
 * reusing TagInput; deletion asks for confirmation in the parent.
 */
const BulkActionBar = ({ count, busy, tagOptions, onAction, onExport, onDelete, onClear, onSelectPage, allOnPageSelected }) => {
  const [tagMode, setTagMode] = useState(null); // "ADD_TAGS" | "REMOVE_TAGS" | null
  const [tags, setTags] = useState([]);

  const closeTags = () => {
    setTagMode(null);
    setTags([]);
  };

  return (
    <>
      <div role="region" aria-label="Bulk actions"
        className="sticky top-20 z-30 mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-purple-200 bg-white/95 p-3 shadow-lg backdrop-blur">
        <span className="mr-2 text-sm font-semibold text-gray-800">{count} selected</span>
        <Button size="xs" color="light" onClick={onSelectPage}>
          {allOnPageSelected ? "Unselect page" : "Select page"}
        </Button>
        <span className="mx-1 h-5 w-px bg-gray-200" aria-hidden />
        <Button size="xs" color="light" disabled={busy} onClick={() => onAction("FAVORITE")}>
          <FaStar className="mr-1 h-3 w-3 text-yellow-500" /> Favourite
        </Button>
        <Button size="xs" color="light" disabled={busy} onClick={() => onAction("UNFAVORITE")}>
          <FaRegStar className="mr-1 h-3 w-3" /> Unfavourite
        </Button>
        <Button size="xs" color="light" disabled={busy} onClick={() => setTagMode("ADD_TAGS")}>
          <FaTag className="mr-1 h-3 w-3" /> Add tags
        </Button>
        <Button size="xs" color="light" disabled={busy} onClick={() => setTagMode("REMOVE_TAGS")}>
          <FaTag className="mr-1 h-3 w-3" /> Remove tags
        </Button>
        <Button size="xs" color="light" disabled={busy} onClick={onExport}>
          <FaFileExport className="mr-1 h-3 w-3" /> Export
        </Button>
        <Button size="xs" color="failure" disabled={busy} onClick={onDelete}>
          <FaTrash className="mr-1 h-3 w-3" /> Delete
        </Button>
        <button type="button" onClick={onClear} aria-label="Clear selection"
          className="ml-auto rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800">
          <HiX className="h-4 w-4" />
        </button>
      </div>

      <Modal show={Boolean(tagMode)} onClose={closeTags} size="md" dismissible>
        <Modal.Header>{tagMode === "ADD_TAGS" ? "Add tags" : "Remove tags"} ({count} contacts)</Modal.Header>
        <Modal.Body>
          <TagInput id="bulk-tags" value={tags} onChange={setTags} suggestions={tagOptions} />
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button color="gray" onClick={closeTags}>Cancel</Button>
          <Button gradientDuoTone="purpleToBlue" disabled={!tags.length || busy} isProcessing={busy}
            onClick={() => { onAction(tagMode, tags); closeTags(); }}>
            {tagMode === "ADD_TAGS" ? "Add" : "Remove"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BulkActionBar;
