import React, { useEffect, useRef, useState } from "react";
import { Pagination, TextInput, Button, Badge, Spinner } from "flowbite-react";
import { FaSearch, FaPlus, FaUserFriends } from "react-icons/fa";
import ContactCard from "../components/ContactCard";
import { listContactsRoute } from "../api/contactApi";
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

  // Fetch whenever the committed query or page changes. A request-id guard
  // (reqIdRef) prevents a slow earlier response from overwriting a newer one
  // if the user types fast.
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
  }, [debouncedQ, uiPage, dispatch]);

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

            <Button gradientDuoTone="purpleToBlue" className="w-fit font-semibold" disabled title="Coming soon">
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
              {debouncedQ
                ? "Try a different search term."
                : "Get started by adding your first contact."}
            </p>
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
    </div>
  );
};

export default Contacts;
