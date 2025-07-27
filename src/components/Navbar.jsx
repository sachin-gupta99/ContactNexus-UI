import React, { useEffect, useRef } from "react";
import { useState } from "react";
import logo from "../assets/logo.png";
import Navlink from "./Navlink";
import { Link, NavLink } from "react-router-dom";
import { IoHome, IoMenu, IoClose } from "react-icons/io5";
import { IoMdContacts } from "react-icons/io";
import Dropdown from "./Dropdown";
import { Button } from "flowbite-react";
import { getAuthToken } from "../util/helper";

const Navbar = () => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const token = getAuthToken();
    if (token) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="glass sticky top-0 z-50 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/home" className="flex items-center space-x-2 group">
              <img 
                src={logo} 
                alt="Contact Nexus" 
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-110" 
              />
              <span className="gradient-text text-xl font-bold hidden sm:block">
                Contact Nexus
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink 
                to="/home" 
                className="nav-link flex items-center space-x-1"
              >
                <IoHome className="w-4 h-4" />
                <span>Home</span>
              </NavLink>
              <NavLink 
                to="/contacts" 
                className="nav-link flex items-center space-x-1"
              >
                <IoMdContacts className="w-4 h-4" />
                <span>Contacts</span>
              </NavLink>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated && (
              <Link to="/auth?mode=signin">
                <button className="btn-primary">
                  Sign In
                </button>
              </Link>
            )}
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <Dropdown isOpen={isOpen} toggleDropdown={toggleDropdown} />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white hover:text-blue-200 transition-colors duration-200 p-2"
            >
              {isMobileMenuOpen ? (
                <IoClose className="w-6 h-6" />
              ) : (
                <IoMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/10 rounded-lg mt-2 backdrop-blur-md">
              <NavLink 
                to="/home" 
                className="nav-link flex items-center space-x-2 w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IoHome className="w-4 h-4" />
                <span>Home</span>
              </NavLink>
              <NavLink 
                to="/contacts" 
                className="nav-link flex items-center space-x-2 w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <IoMdContacts className="w-4 h-4" />
                <span>Contacts</span>
              </NavLink>
              {!isAuthenticated && (
                <Link 
                  to="/auth?mode=signin"
                  className="block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <button className="btn-primary w-full mt-2">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
