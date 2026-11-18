import React from "react";
import { FaPhone, FaEnvelope, FaStar, FaRegStar, FaShare, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import { Card, Button, Badge, Avatar } from "flowbite-react";

const ContactCard = ({ name, work, image, number, email, isFavorite = false, onToggleFavorite, onShare }) => {
  return (
    <Card className="max-w-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-xl overflow-hidden">
      
      {/* Clean Header Section */}
      <div className="bg-white p-0 pb-0">
        <div className="flex items-start space-x-3">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <Avatar
              img={image || "https://via.placeholder.com/60x60?text=Profile"}
              size="md"
              className="ring-2 ring-gray-100"
            />
            {/* Online status */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Name and Role */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
                  {name}
                </h3>
                <p className="text-gray-600 font-medium text-sm mb-2 leading-relaxed">
                  {work}
                </p>
              </div>
              
              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite?.();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {isFavorite ? (
                  <FaStar className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FaRegStar className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="px-4 pb-3">
        <div className="space-y-2">
          {/* Phone Section */}
          <div className="bg-gray-50 rounded p-2 hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                <FaPhone className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">Phone</p>
                <p className="font-semibold text-gray-900 text-sm">{number}</p>
              </div>
            </div>
            <Button size="xs" color="blue" className="w-full text-xs">
              <FaPhone className="w-2.5 h-2.5 mr-1" />
              Call
            </Button>
          </div>

          {/* Email Section */}
          <div className="bg-gray-50 rounded p-2 hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="font-semibold text-gray-900 text-sm break-all">{email || "Not provided"}</p>
              </div>
            </div>
            <Button size="xs" color="green" className="w-full text-xs">
              <FaEnvelope className="w-2.5 h-2.5 mr-1" />
              Email
            </Button>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex space-x-3">
          <Button
            gradientDuoTone="purpleToBlue"
            size="sm"
            className="flex-1 font-semibold"
          >
            Message
          </Button>
          <Button
            color="light"
            size="sm"
            className="px-4 font-semibold border-gray-300"
            onClick={(e) => {
              e.preventDefault();
              onShare?.();
            }}
          >
            <FaShare className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContactCard;
