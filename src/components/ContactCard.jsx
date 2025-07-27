import React from "react";
import { FaPhone, FaEnvelope, FaStar, FaRegStar, FaShare } from "react-icons/fa";
import { Card, Button, Badge } from "flowbite-react";

const ContactCard = ({ name, work, image, number, email, isFavorite = false, onToggleFavorite, onShare }) => {
  return (
    <Card className="max-w-sm group hover:scale-105 transition-transform duration-300">
      {/* Header with image and favorite button */}
      <div className="relative">
        <div className="h-48 overflow-hidden rounded-t-lg">
          <img 
            alt={`${name}`} 
            src={image || "https://via.placeholder.com/300x200?text=No+Image"} 
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        </div>
        
        {/* Favorite and Share buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            size="xs"
            color="light"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.();
            }}
            className="!p-2 rounded-full"
          >
            {isFavorite ? (
              <FaStar className="w-4 h-4 text-yellow-500" />
            ) : (
              <FaRegStar className="w-4 h-4 text-gray-600" />
            )}
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={(e) => {
              e.preventDefault();
              onShare?.();
            }}
            className="!p-2 rounded-full"
          >
            <FaShare className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-4 left-4">
          <Badge color="success" size="sm">
            Available
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <p className="text-gray-600 font-medium">{work}</p>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 mb-6">
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
        <div className="flex space-x-2">
          <Button
            gradientDuoTone="cyanToBlue"
            size="sm"
            className="flex-1 font-medium"
          >
            Message
          </Button>
          <Button
            color="gray"
            size="sm"
            className="flex-1 font-medium"
          >
            Call
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContactCard;
