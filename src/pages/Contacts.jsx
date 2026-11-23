import React, { useEffect, useRef, useState } from "react";
import { Pagination, TextInput, Button, Badge, Spinner } from "flowbite-react";
import { FaSearch, FaPlus, FaUserFriends } from "react-icons/fa";
import ContactCard from "../components/ContactCard";
import ContactFormModal from "../components/ContactFormModal";
import ConfirmModal from "../components/ConfirmModal";
import { listContactsRoute, deleteContactRoute } from "../api/contactApi";
import { useDispatch } from "react-redux";
import { toastActions } from "../store/toast";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

const Contacts = () => {
  // UI holds 1-indexed page (flowbite's Pagination wants it); API is 0-indexed.
  const [uiPage, setUiPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState({ content: [], totalElements: 0, totalPages: 0 });

  // Bumped after create / update / delete to force a re-fetch of the current
  // page. Alternative would be to mutate `page.content` optimistically, but
  // that would get totalElements / totalPages wrong without extra math.
  const [refreshKey, setRefreshKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);         // null => create mode
  const [deleteTarget, setDeleteTarget] = useState(null);     // contact to delete, or null
  const [deleting, setDeleting] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Contacts - Contact Nexus";
  }, []);

  // Debounce search input so we don't hammer the API on every keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQ(searchTerm.trim());
      setUiPage(1); // new search → back to page 1
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Fetch whenever the committed query, page, or refreshKey changes.
  // reqIdRef prevents a slow earlier response from overwriting a newer one.
  const reqIdRef = useRef(0);
  useEffect(() => {
    const myReq = ++reqIdRef.current;
    setIsLoading(true);
    listContactsRoute({ q: debouncedQ, page: uiPage - 1, size: PAGE_SIZE })
      .then((res) => {
        if (reqIdRef.current === myReq) setPage(res.data);
      })
      .catch((err) => {
        if (reqIdRef.current !== myReq) return;
        dispatch(toastActions.setToast({
          message: err.response?.data?.message || "Could not load contacts",
          type: "error",
        }));
        setPage({ content: [], totalElements: 0, totalPages: 0 });
      })
      .finally(() => {
        if (reqIdRef.current === myReq) setIsLoading(false);
      });
  }, [debouncedQ, uiPage, refreshKey, dispatch]);

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

  const handleSaved = () => {
    // Create usually lands on the first page; edits keep current page. Either
    // way bump refreshKey and let the fetch effect do its thing.
    if (!editTarget) setUiPage(1);
    setRefreshKey((k) => k + 1);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteContactRoute(deleteTarget.id);
      dispatch(toastActions.setToast({ message: "Contact deleted", type: "success" }));
      // If we just emptied the current page (and there's a previous one), step back.
      if (page.content.length === 1 && uiPage > 1) {
        setUiPage(uiPage - 1);
      }
      setRefreshKey((k) => k + 1);
      setDeleteTarget(null);
    } catch (err) {
      dispatch(toastActions.setToast({
        message: err.response?.data?.message || "Could not delete contact",
        type: "error",
      }));
    } finally {
      setDeleting(false);
    }
  };

  const contacts = page.content || [];

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
                  {page.totalElements} total
                </Badge>
              </div>
            </div>

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

        {/* Search */}
        <div className="mb-8">
          <TextInput
            id="search"
            type="text"
            icon={FaSearch}
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="xl" className="mb-4" />
            <p className="text-gray-600 font-medium">Loading your contacts...</p>
          </div>
        ) : contacts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {contacts.map((c) => {
              const fullName = [c.firstName, c.lastName].filter(Boolean).join(" ");
              return (
                <ContactCard
                  key={c.id}
                  name={fullName || c.email}
                  work={c.bio || ""}
                  number={c.phone || "—"}
                  email={c.email}
                  image={c.imageUrl}
                  isFavorite={false}
                  onToggleFavorite={() => {}}
                  onShare={() => {}}
                  onEdit={() => openEdit(c)}
                  onDelete={() => setDeleteTarget(c)}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserFriends className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500 mb-6">
              {debouncedQ ? "Try a different search term." : "Get started by adding your first contact."}
            </p>
            {!debouncedQ && (
              <Button gradientDuoTone="purpleToBlue" className="font-semibold mx-auto" onClick={openCreate}>
                <FaPlus className="w-4 h-4 mr-2" />
                Add your first contact
              </Button>
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

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete this contact?"
        message={deleteTarget
          ? `${[deleteTarget.firstName, deleteTarget.lastName].filter(Boolean).join(" ") || deleteTarget.email} will be removed permanently.`
          : ""}
        confirmLabel="Delete"
        busy={deleting}
      />
    </div>
  );
};

export default Contacts;
