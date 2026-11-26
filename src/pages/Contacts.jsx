import { useEffect, useState } from "react";
import { Pagination, TextInput, Button, Badge, Spinner } from "flowbite-react";
import { FaSearch, FaPlus, FaUserFriends, FaStar, FaFileExport, FaFileImport } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import ContactCard from "../components/ContactCard";
import ContactFormModal from "../components/ContactFormModal";
import ConfirmModal from "../components/ConfirmModal";
import ImportContactsModal from "../components/ImportContactsModal";
import { useContactList, useDeleteContact, useToggleFavorite } from "../hooks/useContacts";
import { buildVCard, contactToCard, shareVCard } from "../util/vcard";
import { exportAllContacts } from "../util/exportContacts";
import { useDispatch } from "react-redux";
import { toastActions } from "../store/toast";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;
const EMPTY_PAGE = { content: [], totalElements: 0, totalPages: 0 };

const displayName = (c) => [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email;

const Contacts = () => {
  // UI holds 1-indexed page (flowbite's Pagination wants it); API is 0-indexed.
  const [uiPage, setUiPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);         // null => create mode
  const [deleteTarget, setDeleteTarget] = useState(null);     // contact to delete, or null
  const [exporting, setExporting] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const dispatch = useDispatch();
  const toast = (message, type = "success") => dispatch(toastActions.setToast({ message, type }));

  // ?favorites=1 filters to starred contacts; ?new=1 (from Home's quick actions)
  // opens the create form once and is then removed from the URL.
  const [searchParams, setSearchParams] = useSearchParams();
  const favoritesOnly = searchParams.get("favorites") === "1";

  // The query key includes every parameter, so a newer search can't be
  // overwritten by a slow older response (what reqIdRef used to guard against).
  const listQuery = useContactList({
    q: debouncedQ,
    page: uiPage - 1,
    size: PAGE_SIZE,
    favorite: favoritesOnly,
  });
  const page = listQuery.data ?? EMPTY_PAGE;
  const contacts = page.content;

  const deleteContact = useDeleteContact();
  const toggleFavorite = useToggleFavorite();

  useEffect(() => {
    document.title = "Contacts - Contact Nexus";
  }, []);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditTarget(null);
      setFormOpen(true);
      const next = new URLSearchParams(searchParams);
      next.delete("new");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // A delete, unstar or import can leave us past the last page; step back.
  useEffect(() => {
    if (listQuery.data && !listQuery.isPlaceholderData && uiPage > Math.max(1, page.totalPages)) {
      setUiPage(Math.max(1, page.totalPages));
    }
  }, [listQuery.data, listQuery.isPlaceholderData, page.totalPages, uiPage]);

  const setFilter = (favorites) => {
    const next = new URLSearchParams(searchParams);
    if (favorites) next.set("favorites", "1");
    else next.delete("favorites");
    setSearchParams(next, { replace: true });
    setUiPage(1);
  };

  // Debounce search input so we don't hammer the API on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQ(searchTerm.trim());
      setUiPage(1); // new search → back to page 1
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const openCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEdit = (contact) => {
    setEditTarget(contact);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditTarget(null);
  };

  // The modal's mutation already refreshed the cache; a new contact most
  // likely sorts onto the first page.
  const handleSaved = () => {
    if (!editTarget) setUiPage(1);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteContact.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast("Contact deleted");
        setDeleteTarget(null);
      },
      onError: (err) => toast(err.response?.data?.message || "Could not delete contact", "error"),
    });
  };

  const onToggleFavorite = (contact) => {
    toggleFavorite.mutate(
      { id: contact.id, favorite: !contact.favorite },
      { onError: (err) => toast(err.response?.data?.message || "Could not update favourite", "error") },
    );
  };

  const shareContact = async (contact) => {
    const name = displayName(contact);
    const result = await shareVCard(buildVCard(contactToCard(contact)), name);
    if (result === "downloaded") toast(`Saved ${name}.vcf`);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const count = await exportAllContacts();
      if (count) toast(`Exported ${count} contact${count === 1 ? "" : "s"}`);
      else toast("No contacts to export yet", "error");
    } catch (err) {
      toast(err.response?.data?.message || "Could not export contacts", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleImported = ({ imported, skippedDuplicates, invalid = 0, partial }) => {
    const parts = [`Imported ${imported} contact${imported === 1 ? "" : "s"}`];
    if (skippedDuplicates) parts.push(`${skippedDuplicates} already existed`);
    if (invalid) parts.push(`${invalid} had no valid email`);
    if (!partial) toast(parts.join(" · "));
    setUiPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Your Contacts
              </h1>
              <div className="flex items-center space-x-2">
                <FaUserFriends className="w-5 h-5 text-gray-600" />
                <Badge color="purple" size="lg">
                  {page.totalElements} {favoritesOnly ? "favourite" : "total"}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button color="light" className="w-fit font-semibold" onClick={() => setImportOpen(true)}>
                <FaFileImport className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                color="light"
                className="w-fit font-semibold"
                onClick={handleExport}
                isProcessing={exporting}
                disabled={exporting}
              >
                <FaFileExport className="w-4 h-4 mr-2" />
                Export .vcf
              </Button>
              <Button
                gradientDuoTone="purpleToBlue"
                className="w-fit font-semibold"
                onClick={openCreate}
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
        </div>

        {/* Filter + search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Plain segmented control: flowbite 0.8's Button.Group leaks a prop onto icon children. */}
          <div role="group" aria-label="Filter contacts" className="inline-flex shrink-0 rounded-lg border border-gray-300 bg-white p-1">
            {[
              { label: "All", active: !favoritesOnly, onClick: () => setFilter(false) },
              { label: "Favourites", active: favoritesOnly, onClick: () => setFilter(true), icon: FaStar },
            ].map(({ label, active, onClick, icon: Icon }) => (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={onClick}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active ? "bg-purple-700 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
              </button>
            ))}
          </div>
          <TextInput
            id="search"
            type="text"
            icon={FaSearch}
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:flex-1"
          />
        </div>

        {/* Grid */}
        {listQuery.isPending ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="xl" className="mb-4" />
            <p className="text-gray-600 font-medium">Loading your contacts...</p>
          </div>
        ) : listQuery.isError && !listQuery.data ? (
          <div className="text-center py-20" role="alert">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Couldn’t load your contacts</h3>
            <p className="text-gray-500 mb-6">
              {listQuery.error?.response?.data?.message || "Check your connection and try again."}
            </p>
            <Button color="light" className="mx-auto" onClick={() => listQuery.refetch()}>
              Try again
            </Button>
          </div>
        ) : contacts.length > 0 ? (
          // Dimmed while the next page or search loads; the old results stay visible.
          <div
            aria-busy={listQuery.isPlaceholderData}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 transition-opacity ${
              listQuery.isPlaceholderData ? "opacity-60" : ""
            }`}
          >
            {contacts.map((c) => (
              <ContactCard
                key={c.id}
                name={displayName(c)}
                work={c.bio || ""}
                number={c.phone || "—"}
                email={c.email}
                image={c.imageUrl}
                isFavorite={c.favorite}
                onToggleFavorite={() => onToggleFavorite(c)}
                onShare={() => shareContact(c)}
                onEdit={() => openEdit(c)}
                onDelete={() => setDeleteTarget(c)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              {favoritesOnly
                ? <FaStar className="w-8 h-8 text-gray-400" />
                : <FaUserFriends className="w-8 h-8 text-gray-400" />}
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {favoritesOnly ? "No favourites yet" : "No contacts found"}
            </h3>
            <p className="text-gray-500 mb-6">
              {debouncedQ
                ? "Try a different search term."
                : favoritesOnly
                  ? "Tap the star on a contact to add it here."
                  : "Get started by adding your first contact."}
            </p>
            {!debouncedQ && !favoritesOnly && (
              <div className="flex flex-col items-center gap-3">
                <Button gradientDuoTone="purpleToBlue" className="font-semibold" onClick={openCreate}>
                  <FaPlus className="w-4 h-4 mr-2" />
                  Add your first contact
                </Button>
                <button type="button" onClick={() => setImportOpen(true)} className="text-purple-700 font-medium hover:underline">
                  or import from a .vcf / .csv file
                </button>
              </div>
            )}
          </div>
        )}

        {/* Server-side pagination */}
        {page.totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={uiPage}
              totalPages={page.totalPages}
              onPageChange={setUiPage}
              showIcons
              className="mb-8"
            />
          </div>
        )}
      </div>

      <ContactFormModal
        isOpen={formOpen}
        onClose={closeForm}
        onSaved={handleSaved}
        initialContact={editTarget}
      />

      <ImportContactsModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={handleImported}
      />

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete this contact?"
        message={deleteTarget ? `${displayName(deleteTarget)} will be removed permanently.` : ""}
        confirmLabel="Delete"
        busy={deleteContact.isPending}
      />
    </div>
  );
};

export default Contacts;
