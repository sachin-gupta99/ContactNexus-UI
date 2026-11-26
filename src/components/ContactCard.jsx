import {
  FaPhone, FaEnvelope, FaStar, FaRegStar, FaShare,
  FaPencilAlt, FaTrash,
} from "react-icons/fa";
import { Card, Button, Avatar } from "flowbite-react";

const ContactCard = ({
  name,
  work,
  image,
  number,
  email,
  isFavorite = false,
  onToggleFavorite,
  onShare,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="max-w-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-xl overflow-hidden">

      {/* Header */}
      <div className="bg-white p-0 pb-0">
        <div className="flex items-start space-x-3">
          <div className="relative flex-shrink-0">
            <Avatar
              img={image || "https://via.placeholder.com/60x60?text=Profile"}
              size="md"
              className="ring-2 ring-gray-100"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight truncate">
                  {name}
                </h3>
                <p className="text-gray-600 font-medium text-sm mb-2 leading-relaxed line-clamp-2">
                  {work}
                </p>
              </div>

              {/* Action buttons: edit, delete, favorite */}
              <div className="flex items-center gap-1 shrink-0">
                {onEdit && (
                  <button
                    type="button"
                    aria-label="Edit contact"
                    onClick={(e) => { e.preventDefault(); onEdit(); }}
                    className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <FaPencilAlt className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    aria-label="Delete contact"
                    onClick={(e) => { e.preventDefault(); onDelete(); }}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  aria-label={isFavorite ? "Unfavorite" : "Favorite"}
                  onClick={(e) => { e.preventDefault(); onToggleFavorite?.(); }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
      </div>

      {/* Contact Details */}
      <div className="px-4 pb-3">
        <div className="space-y-2">
          <div className="bg-gray-50 rounded p-2 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                <FaPhone className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Phone</p>
                <p className="font-semibold text-gray-900 text-sm truncate">{number}</p>
              </div>
            </div>
            {number && number !== "—" ? (
              <a href={`tel:${number}`} className="block">
                <Button size="xs" color="blue" className="w-full text-xs">
                  <FaPhone className="w-2.5 h-2.5 mr-1" />
                  Call
                </Button>
              </a>
            ) : (
              <Button size="xs" color="blue" className="w-full text-xs" disabled>
                <FaPhone className="w-2.5 h-2.5 mr-1" />
                Call
              </Button>
            )}
          </div>

          <div className="bg-gray-50 rounded p-2 hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="font-semibold text-gray-900 text-sm break-all">{email || "Not provided"}</p>
              </div>
            </div>
            {email ? (
              <a href={`mailto:${email}`} className="block">
                <Button size="xs" color="green" className="w-full text-xs">
                  <FaEnvelope className="w-2.5 h-2.5 mr-1" />
                  Email
                </Button>
              </a>
            ) : (
              <Button size="xs" color="green" className="w-full text-xs" disabled>
                <FaEnvelope className="w-2.5 h-2.5 mr-1" />
                Email
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Share footer (kept) */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <Button
          color="light"
          size="sm"
          className="w-full px-4 font-semibold border-gray-300"
          onClick={(e) => { e.preventDefault(); onShare?.(); }}
        >
          <FaShare className="w-3.5 h-3.5 mr-2" />
          Share
        </Button>
      </div>
    </Card>
  );
};

export default ContactCard;
