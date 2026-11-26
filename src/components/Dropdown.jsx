import { IoPerson } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { FaAddressCard } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutRoute } from "../api/authApi";
import { endSession } from "../util/session";
import { router } from "../router";
import { toastActions } from "../store/toast";
import { buildVCard, shareVCard, userToCard } from "../util/vcard";

const Dropdown = ({ isOpen, toggleDropdown, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  // Presigned S3 URL from the API (or an external URL); null falls back to initials.
  const avatarUrl = user?.profile?.imageUrl;

  const onContactCard = async () => {
    onClose?.();
    const result = await shareVCard(buildVCard(userToCard(user)), user?.name || "My card");
    if (result === "downloaded") {
      dispatch(toastActions.setToast({ message: "Your contact card was downloaded", type: "success" }));
    }
  };

  const onLogout = async () => {
    onClose?.();
    try {
      await logoutRoute();
    } catch {
      // Best-effort: even if the server call fails we still clear local state.
    }
    endSession(dispatch);
    router.navigate("/auth?mode=signin");
  };

  return (
    <div className="relative z-50">
      {/* Avatar with modern styling */}
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-white/20 hover:ring-white/40 transition-all duration-300 transform hover:scale-105"
          onClick={toggleDropdown}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>

        {/* Online status indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-modern absolute right-0 mt-3 w-64 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || "User Name"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link to="/profile" onClick={onClose} className="dropdown-item flex items-center space-x-3">
              <IoPerson className="w-4 h-4 text-blue-500" />
              <span>Profile</span>
            </Link>

            <button
              type="button"
              onClick={onContactCard}
              className="dropdown-item w-full text-left flex items-center space-x-3"
              title="Share or download your details as a vCard"
            >
              <FaAddressCard className="w-4 h-4 text-green-500" />
              <span>My Contact Card</span>
            </button>

            <Link to="/settings" onClick={onClose} className="dropdown-item flex items-center space-x-3">
              <IoMdSettings className="w-4 h-4 text-gray-500" />
              <span>Settings</span>
            </Link>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              type="button"
              className="dropdown-item w-full text-left flex items-center space-x-3 text-red-600 hover:bg-red-50 hover:border-red-500"
              onClick={onLogout}
            >
              <IoLogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
