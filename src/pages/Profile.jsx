import React, { useEffect } from "react";
import ProfilePicture from "../assets/contact.jpg";
import { Card, Button, Badge, Avatar } from "flowbite-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaInstagram, FaHeart, FaFilm, FaGamepad, FaUserFriends, FaStar, FaCommentDots, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Profile = () => {
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    document.title = "Profile - Contact Nexus";
  }, []);

  const likesInterests = [
    { label: "Likes", value: user?.likes, icon: FaHeart },
    { label: "Movie", value: user?.movie, icon: FaFilm },
    { label: "Interests", value: user?.interests, icon: FaGamepad },
  ];

  const contactInformation = [
    { label: "Email", value: user?.email, icon: FaEnvelope },
    { label: "Phone", value: "+91-" + user?.phone, icon: FaPhone },
    { label: "Address", value: user?.street + ", " + user?.area + ", " + user?.city + ", " + user?.state, icon: FaMapMarkerAlt },
  ];

  const socialMedia = [
    { label: "Github", value: user?.github, icon: FaGithub },
    { label: "LinkedIn", value: user?.linkedin, icon: FaLinkedin },
    { label: "Instagram", value: user?.instagram, icon: FaInstagram },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section with Profile */}
        <div className="relative mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-2xl"></div>
          <div className="absolute inset-0 opacity-5 rounded-2xl" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <Card className="relative border-gray-200 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                
                {/* Profile Image & Status */}
                <div className="flex-shrink-0 text-center lg:text-left">
                  <div className="relative inline-block">
                    <Avatar
                      img={user?.image || ProfilePicture}
                      size="xl"
                      className="ring-4 ring-blue-200 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:hidden">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 font-heading">
                      {user?.name || "User Name"}
                    </h1>
                    <p className="text-blue-600 font-semibold text-lg">
                      {user?.work || "Your Profession"}
                    </p>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="hidden lg:block mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 mb-3 font-heading">
                      {user?.name || "User Name"}
                    </h1>
                    <p className="text-blue-600 font-semibold text-xl mb-4">
                      {user?.work || "Your Profession"}
                    </p>
                    
                    {/* Bio Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-100">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        {user?.bioHeading || "Bio Heading"}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {user?.bioDescription || "Tell us about yourself and what makes you unique. Share your passion, goals, and what you love to do."}
                      </p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-white/80 rounded-lg border border-gray-200 shadow-sm">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">12</div>
                      <div className="text-sm text-gray-600">Contacts</div>
                    </div>
                    <div className="text-center p-4 bg-white/80 rounded-lg border border-gray-200 shadow-sm">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">5</div>
                      <div className="text-sm text-gray-600">Favorites</div>
                    </div>
                    <div className="text-center p-4 bg-white/80 rounded-lg border border-gray-200 shadow-sm">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">8</div>
                      <div className="text-sm text-gray-600">Groups</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      gradientDuoTone="cyanToBlue"
                      className="flex-1 font-semibold py-3"
                    >
                      <FaEdit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      gradientDuoTone="purpleToBlue"
                      className="flex-1 font-semibold py-3"
                    >
                      <FaUserFriends className="w-4 h-4 mr-2" />
                      View Contacts
                    </Button>
                    <Button
                      gradientDuoTone="pinkToOrange"
                      className="sm:w-auto font-semibold py-3"
                    >
                      <FaTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <DetailsCard
              heading="Contact Information"
              details={contactInformation}
              gradientClass="from-blue-500 to-cyan-500"
            />

            <DetailsCard
              heading="Likes and Interests"
              details={likesInterests}
              gradientClass="from-green-500 to-emerald-500"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DetailsCard
              heading="Social Media"
              details={socialMedia}
              gradientClass="from-purple-500 to-pink-500"
            />

            {/* Favourite Contacts */}
            <Card className="border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <div className="mb-1.5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Favourite Contacts
                  </h3>
                  <div className="flex items-center gap-2">
                    {/* Navigation Buttons in Header */}
                    <button 
                      className="w-8 h-8 bg-gray-100 hover:bg-blue-100 border border-gray-200 hover:border-blue-300 rounded-full flex items-center justify-center transition-all duration-200"
                      onClick={() => {
                        const carousel = document.getElementById('contacts-carousel');
                        carousel.scrollBy({ left: -280, behavior: 'smooth' });
                      }}
                    >
                      <FaChevronLeft className="w-3 h-3 text-gray-600" />
                    </button>
                    
                    <button 
                      className="w-8 h-8 bg-gray-100 hover:bg-blue-100 border border-gray-200 hover:border-blue-300 rounded-full flex items-center justify-center transition-all duration-200"
                      onClick={() => {
                        const carousel = document.getElementById('contacts-carousel');
                        carousel.scrollBy({ left: 280, behavior: 'smooth' });
                      }}
                    >
                      <FaChevronRight className="w-3 h-3 text-gray-600" />
                    </button>
                    
                    <Link to="/contacts">
                      <Button gradientDuoTone="cyanToBlue" size="sm" className="font-semibold">
                        View All
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
              </div>

              {/* Carousel Container - Clean without overlapping buttons */}
              <div className="space-y-4">
                <div 
                  id="contacts-carousel" 
                  className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                >
                  <div className="flex-shrink-0 w-64">
                    <FavouriteContact name="Sachin Gupta" image={ProfilePicture} work="Software Engineer" />
                  </div>
                  <div className="flex-shrink-0 w-64">
                    <FavouriteContact name="John Doe" image={ProfilePicture} work="Product Manager" />
                  </div>
                  <div className="flex-shrink-0 w-64">
                    <FavouriteContact name="Jane Smith" image={ProfilePicture} work="UX Designer" />
                  </div>
                  <div className="flex-shrink-0 w-64">
                    <FavouriteContact name="Mike Johnson" image={ProfilePicture} work="Data Scientist" />
                  </div>
                  <div className="flex-shrink-0 w-64">
                    <FavouriteContact name="Sarah Wilson" image={ProfilePicture} work="Marketing Manager" />
                  </div>
                  <div className="flex-shrink-0 w-64">
                    <FavouriteContact name="Alex Chen" image={ProfilePicture} work="DevOps Engineer" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

const DetailsCard = ({ heading, details, gradientClass }) => {
  return (
    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg">
      <div className="mb-4">
        <h3 className={`text-xl font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent mb-2`}>
          {heading}
        </h3>
        <div className={`h-1 w-16 bg-gradient-to-r ${gradientClass} rounded-full`}></div>
      </div>
      
      <div className="space-y-4">
        {details.map((detail, index) => (
          <DetailsCardValue 
            key={index}
            label={detail.label} 
            value={detail.value} 
            icon={detail.icon}
          />
        ))}
      </div>
    </Card>
  );
};

const DetailsCardValue = ({ label, value, icon: Icon }) => {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors duration-200 border border-blue-100">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">{label}</p>
        <p className="text-gray-700 font-medium truncate">{value || "Not provided"}</p>
      </div>
    </div>
  );
};

const FavouriteContact = ({ name, image, work }) => {
  return (
    <div className="group relative overflow-hidden">
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl p-4 border border-gray-200/60 hover:border-blue-300/60 transition-all duration-300 hover:shadow-lg backdrop-blur-sm">
        
        {/* Header Row with Avatar and Favorite Star */}
        <div className="flex items-start justify-between mb-3">
          <div className="relative">
            <Avatar 
              img={image} 
              size="md"
              className="ring-2 ring-white shadow-md group-hover:ring-blue-200 transition-all duration-300"
            />
            {/* Online Status */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          
          {/* Favorite Star Icon - Only activates on direct hover */}
          <button className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-yellow-100 hover:to-orange-100 rounded-full border border-gray-200 hover:border-yellow-300 transition-all duration-300 cursor-pointer">
            <FaStar className="w-3.5 h-3.5 text-gray-400 hover:text-yellow-500 transition-colors duration-300" />
          </button>
        </div>

        {/* Contact Information */}
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-blue-700 transition-colors duration-300">
            {name}
          </h4>
          <p className="text-xs text-gray-600 font-medium">
            {work}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <button className="flex items-center justify-center w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors duration-200 group">
            <FaPhone className="w-3.5 h-3.5 text-blue-600" />
          </button>
          
          <button className="flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 rounded-lg transition-colors duration-200 group">
            <FaCommentDots className="w-3.5 h-3.5 text-green-600" />
          </button>
          
          <button className="flex items-center justify-center w-8 h-8 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors duration-200 group">
            <FaEnvelope className="w-3.5 h-3.5 text-purple-600" />
          </button>
        </div>

        {/* Hover Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out pointer-events-none"></div>
      </div>
    </div>
  );
};
