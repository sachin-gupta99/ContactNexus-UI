import React, { useEffect, useRef } from "react";
import { useState } from "react";
import logo from "../assets/logo.png";
import Navlink from "./Navlink";
import { Link, NavLink } from "react-router-dom";
import { IoHome, IoMenu, IoClose } from "react-icons/io5";
import { IoMdContacts } from "react-icons/io";
import Dropdown from "./Dropdown";
import { Button, Navbar as FlowbiteNavbar } from "flowbite-react";
import { getAuthToken } from "../util/helper";

const Navbar = () => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
    <FlowbiteNavbar fluid rounded className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 shadow-2xl sticky top-0 z-50 border-0 rounded-none backdrop-blur-md">
      {/* Left side - Brand */}
      <FlowbiteNavbar.Brand as={NavLink} to="/home" className="group">
        <span className="self-center whitespace-nowrap text-2xl font-bold text-gray-100 tracking-wider font-heading hover:text-gray-200 transition-all duration-300">
          Contact Nexus
        </span>
      </FlowbiteNavbar.Brand>
      
      {/* Center - Navigation Links (hidden on mobile, shown on desktop) */}
      <div className="hidden md:flex md:items-center md:space-x-8 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <NavLink 
          to="/home"
          className={({ isActive }) => 
            `text-slate-200 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2 text-lg font-medium px-3 py-2 rounded-lg hover:bg-white/10 ${
              isActive ? 'text-cyan-300 bg-white/10' : ''
            }`
          }
        >
          <IoHome className="w-5 h-5" />
          Home
        </NavLink>
        <NavLink 
          to="/contacts"
          className={({ isActive }) => 
            `text-slate-200 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2 text-lg font-medium px-3 py-2 rounded-lg hover:bg-white/10 ${
              isActive ? 'text-cyan-300 bg-white/10' : ''
            }`
          }
        >
          <IoMdContacts className="w-5 h-5" />
          Contacts
        </NavLink>
      </div>
      
      {/* Right side - Auth buttons */}
      <div className="flex md:order-2 gap-3">
        {!isAuthenticated && (
          <Link to="/auth?mode=signin">
            <Button 
              gradientDuoTone="cyanToBlue" 
              size="sm"
              className="font-semibold"
            >
              Sign In
            </Button>
          </Link>
        )}
        {isAuthenticated && (
          <div className="relative" ref={dropdownRef}>
            <Dropdown isOpen={isOpen} toggleDropdown={toggleDropdown} />
          </div>
        )}
        <FlowbiteNavbar.Toggle className="text-white hover:bg-white/10" />
      </div>
      
      {/* Mobile menu - Collapse */}
      <FlowbiteNavbar.Collapse>
        <div className="md:hidden flex flex-col space-y-2 pt-4">
          <NavLink 
            to="/home"
            className={({ isActive }) => 
              `text-slate-200 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2 text-lg font-medium px-3 py-2 rounded-lg hover:bg-white/10 ${
                isActive ? 'text-cyan-300 bg-white/10' : ''
              }`
            }
          >
            <IoHome className="w-5 h-5" />
            Home
          </NavLink>
          <NavLink 
            to="/contacts"
            className={({ isActive }) => 
              `text-slate-200 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2 text-lg font-medium px-3 py-2 rounded-lg hover:bg-white/10 ${
                isActive ? 'text-cyan-300 bg-white/10' : ''
              }`
            }
          >
            <IoMdContacts className="w-5 h-5" />
            Contacts
          </NavLink>
        </div>
      </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>
  );
};

export default Navbar;
