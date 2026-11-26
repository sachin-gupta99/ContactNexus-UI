import { useRef, useState } from "react";
import { Modal, Button, Progress } from "flowbite-react";
import { FaFileImport, FaExclamationTriangle } from "react-icons/fa";
import { importContactsRoute } from "../api/contactApi";
import { chunk, parseContactsFile } from "../util/importContacts";
import { useSlowHint } from "../util/useSlowHint";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const PREVIEW_ROWS = 5;

const errorMessage = (err, fallback) => {
  const data = err.response?.data;
  if (data?.message) return data.message;
  const first = data?.fields && Object.entries(data.fields)[0];
  return first ? `${first[0]}: ${first[1]}` : fallback;
};

/**
 * Pick a .vcf / .csv file, preview what will be imported, then send it in
 * batches of 500. Duplicates (same email as an existing contact) are skipped
 * by the server and reported back.
 */
const ImportContactsModal = ({ isOpen, onClose, onImported }) => {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState(null); // { valid, invalid }
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(null); // { done, total } while importing
  const busy = progress !== null;
  const slow = useSlowHint(busy);

  const reset = () => {
    setFileName("");
    setParsed(null);
    setError("");
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const close = () => {
    if (busy) return;
    reset();
    onClose();
  };

  const readFile = async (file) => {
    if (!file) return;
    reset();
    setFileName(file.name);
    if (file.size > MAX_FILE_BYTES) {
      setError("That file is larger than 5 MB.");
      return;
    }
    try {
      const result = parseContactsFile(file.name, await file.text());
      if (!result.valid.length && !result.invalid.length) {
        setError("No contacts found. Use a .vcf file or a .csv with a header row.");
        return;
      }
      setParsed(result);
    } catch {
      setError("Could not read that file.");
    }
  };

  const runImport = async () => {
    const batches = chunk(parsed.valid);
    let imported = 0;
    let skippedDuplicates = 0;
    setError("");
    setProgress({ done: 0, total: batches.length });
    for (let i = 0; i < batches.length; i++) {
      try {
        const { data } = await importContactsRoute(batches[i]);
        imported += data.imported;
        skippedDuplicates += data.skippedDuplicates;
        setProgress({ done: i + 1, total: batches.length });
      } catch (err) {
        // Earlier batches are already saved; say so rather than implying nothing happened.
        const msg = errorMessage(err, "Import failed");
        setError(imported ? `${msg} (${imported} contacts were imported before this failed)` : msg);
        setProgress(null);
        if (imported) onImported({ imported, skippedDuplicates, partial: true });
        return;
      }
    }
    onImported({ imported, skippedDuplicates, invalid: parsed.invalid.length });
    reset();
    onClose();
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (!busy) readFile(e.dataTransfer.files?.[0]);
  };

  return (
    <Modal show={isOpen} onClose={close} size="lg">
      <Modal.Header>Import contacts</Modal.Header>
      <Modal.Body>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <label
            htmlFor="import-file"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              dragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:bg-gray-50"
            } ${busy ? "pointer-events-none opacity-60" : ""}`}
          >
            <FaFileImport className="w-8 h-8 text-purple-500" />
            <span className="font-medium text-gray-800">
              {fileName || "Choose a file or drop it here"}
            </span>
            <span className="text-sm text-gray-500">
              .vcf from your phone, Google or Outlook, or a .csv with name and email columns
            </span>
            <input
              ref={inputRef}
              id="import-file"
              type="file"
              accept=".vcf,.vcard,.csv,text/vcard,text/csv"
              className="sr-only"
              disabled={busy}
              onChange={(e) => readFile(e.target.files?.[0])}
            />
          </label>

          {parsed && (
            <div className="space-y-3">
              <p className="text-gray-800">
                <span className="font-semibold">{parsed.valid.length}</span>{" "}
                contact{parsed.valid.length === 1 ? "" : "s"} ready to import.
                {" "}Contacts whose email you already have will be skipped.
              </p>

              {parsed.valid.length > 0 && (
                <ul className="text-sm text-gray-700 divide-y divide-gray-100 border border-gray-200 rounded-lg">
                  {parsed.valid.slice(0, PREVIEW_ROWS).map((c, i) => (
                    <li key={i} className="flex justify-between gap-4 px-3 py-2">
                      <span className="font-medium truncate">
                        {[c.firstName, c.lastName].filter(Boolean).join(" ")}
                      </span>
                      <span className="text-gray-500 truncate">{c.email}</span>
                    </li>
                  ))}
                  {parsed.valid.length > PREVIEW_ROWS && (
                    <li className="px-3 py-2 text-gray-500">
                      and {parsed.valid.length - PREVIEW_ROWS} more
                    </li>
                  )}
                </ul>
              )}

              {parsed.invalid.length > 0 && (
                <details className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <summary className="cursor-pointer text-yellow-800 font-medium">
                    <FaExclamationTriangle className="inline w-3.5 h-3.5 mr-1 align-[-2px]" />
                    {parsed.invalid.length} will be skipped (no valid email)
                  </summary>
                  <ul className="mt-2 space-y-1 text-yellow-900 max-h-40 overflow-y-auto">
                    {parsed.invalid.map((r) => (
                      <li key={r.row}>
                        Row {r.row} · {r.label}: {r.reason}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}

          {busy && (
            <div role="status">
              <Progress progress={Math.round((progress.done / progress.total) * 100)} color="purple" />
              <p className="mt-2 text-sm text-gray-600">
                Importing{progress.total > 1 ? ` batch ${Math.min(progress.done + 1, progress.total)} of ${progress.total}` : ""}…
                {slow && " The server may be waking up, which can take up to 30 seconds."}
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button color="gray" onClick={close} disabled={busy}>
          Cancel
        </Button>
        <Button
          gradientDuoTone="purpleToBlue"
          onClick={runImport}
          disabled={!parsed?.valid.length || busy}
          isProcessing={busy}
        >
          Import {parsed?.valid.length ? parsed.valid.length : ""}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportContactsModal;
