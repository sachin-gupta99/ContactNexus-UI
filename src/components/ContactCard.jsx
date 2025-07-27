import React from "react";
import { FaPhone, FaEnvelope, FaStar, FaRegStar, FaShare } from "react-icons/fa";

const ContactCard = ({ name, work, image, number, email, isFavorite = false, onToggleFavorite, onShare }) => {
  return (
    <div className="card-modern group overflow-hidden">
      {/* Header with image and favorite button */}
      <div className="relative">
        <div className="h-48 overflow-hidden">
          <img 
            alt={`${name}`} 
            src={image || "https://via.placeholder.com/300x200?text=No+Image"} 
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        </div>
        
        {/* Favorite and Share buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.();
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-200"
          >
            {isFavorite ? (
              <FaStar className="w-4 h-4 text-yellow-500" />
            ) : (
              <FaRegStar className="w-4 h-4 text-gray-600" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onShare?.();
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-200"
          >
            <FaShare className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
          Available
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-gray-600 font-medium">{work}</p>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FaPhone className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Phone</p>
              <p className="font-medium text-gray-900">{number}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-sm">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FaEnvelope className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-xs">Email</p>
              <p className="font-medium text-gray-900 truncate">{email || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-2">
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
            Message
          </button>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200">
            Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
