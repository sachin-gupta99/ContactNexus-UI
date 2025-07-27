import React, { useEffect } from "react";
import { IoPerson } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { FaAddressCard } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Avatar } from "flowbite-react";
import { getAuthToken, removeAuthToken } from "../util/helper";
import { router } from "../App";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { getUserByEmailRoute } from "../api/userApi";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user";

const Dropdown = ({ isOpen, toggleDropdown }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);

  const onLogout = () => {
    removeAuthToken();
    router.navigate("/auth");
  };

  useEffect(() => {
    const getUser = async () => {
      const token = getAuthToken();
      const decodedToken = jwtDecode(token);

      const response = await getUserByEmailRoute({ email: decodedToken.sub });

      if (response.data)
        dispatch(userActions.setUser(response.data?.data));
    };

    getUser();
  }, []);

  return (
    <div className="relative z-50">
      {/* Avatar with modern styling */}
      <div className="relative">
        <div 
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-white/20 hover:ring-white/40 transition-all duration-300 transform hover:scale-105"
          onClick={toggleDropdown}
        >
          {user?.image ? (
            <img 
              src={user.image} 
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
                {user?.image ? (
                  <img 
                    src={user.image} 
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
            <Link to="/profile" className="dropdown-item flex items-center space-x-3">
              <IoPerson className="w-4 h-4 text-blue-500" />
              <span>Profile</span>
            </Link>
            
            <div className="dropdown-item flex items-center space-x-3">
              <FaAddressCard className="w-4 h-4 text-green-500" />
              <span>Contact Card</span>
            </div>
            
            <Link to="/settings" className="dropdown-item flex items-center space-x-3">
              <IoMdSettings className="w-4 h-4 text-gray-500" />
              <span>Settings</span>
            </Link>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <div 
              className="dropdown-item flex items-center space-x-3 text-red-600 hover:bg-red-50 hover:border-red-500"
              onClick={onLogout}
            >
              <IoLogOut className="w-4 h-4" />
              <span>Sign out</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
