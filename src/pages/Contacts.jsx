import React, { useEffect, useState } from "react";
import ContactCard from "../components/ContactCard";
import contact from "../assets/contact.jpg";
import { Pagination } from "flowbite-react";
import { FaSearch, FaPlus, FaFilter, FaUserFriends } from "react-icons/fa";

const Contacts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, favorites, recent
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "Sachin Gupta",
      work: "Software Engineer",
      number: "1234567890",
      email: "sachin.gupta@example.com",
      image: contact,
      isFavorite: true
    },
    {
      id: 2,
      name: "John Doe",
      work: "Product Manager",
      number: "0987654321",
      email: "john.doe@example.com",
      image: contact,
      isFavorite: false
    },
    {
      id: 3,
      name: "Jane Smith",
      work: "UI/UX Designer",
      number: "5555555555",
      email: "jane.smith@example.com",
      image: contact,
      isFavorite: true
    },
    {
      id: 4,
      name: "Mike Johnson",
      work: "DevOps Engineer",
      number: "4444444444",
      email: "mike.johnson@example.com",
      image: contact,
      isFavorite: false
    },
    {
      id: 5,
      name: "Sarah Wilson",
      work: "Data Scientist",
      number: "3333333333",
      email: "sarah.wilson@example.com",
      image: contact,
      isFavorite: false
    }
  ]);

  const onPageChange = (page) => setCurrentPage(page);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const toggleFavorite = (contactId) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, isFavorite: !contact.isFavorite }
          : contact
      )
    );
  };

  const shareContact = (contactId) => {
    // Implement share functionality
    console.log('Sharing contact:', contactId);
  };

  // Filter contacts based on search term and filter type
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.work.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || 
                         (filterType === "favorites" && contact.isFavorite);
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    document.title = "Contacts - Contact Nexus";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                Your Contacts
              </h1>
              <p className="text-gray-600 flex items-center space-x-2">
                <FaUserFriends className="w-4 h-4" />
                <span>{filteredContacts.length} contacts found</span>
              </p>
            </div>

            <button className="btn-primary inline-flex items-center space-x-2 w-fit">
              <FaPlus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  filterType === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("favorites")}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  filterType === "favorites"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                Favorites
              </button>
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        {filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                name={contact.name}
                work={contact.work}
                number={contact.number}
                email={contact.email}
                image={contact.image}
                isFavorite={contact.isFavorite}
                onToggleFavorite={() => toggleFavorite(contact.id)}
                onShare={() => shareContact(contact.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserFriends className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterType !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first contact."
              }
            </p>
            <button className="btn-primary inline-flex items-center space-x-2">
              <FaPlus className="w-4 h-4" />
              <span>Add Your First Contact</span>
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredContacts.length > 0 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredContacts.length / 8)}
              onPageChange={onPageChange}
              showIcons
              className="pagination-modern"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
