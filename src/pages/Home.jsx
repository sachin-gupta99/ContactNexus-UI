import React, { useEffect } from "react";
import HomePageLogo from "../assets/HomePagePic.jpg";
import MeetingDifferentPeople from "../assets/MeetingDifferentPeople.jpg";
import SaveContacts from "../assets/SaveContacts.jpg";
import ShareContact from "../assets/ShareContact.jpg";
import { FaArrowRight, FaShieldAlt, FaShareAlt, FaStar, FaUsers, FaHeart, FaGlobe } from "react-icons/fa";
import { Button } from "flowbite-react";
import { Card } from "flowbite-react";

const Home = () => {
  useEffect(() => {
    document.title = "Contact Nexus - Home";
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="animated-bg min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                    One place for all your
                    <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                      contacts
                    </span>
                  </h1>
                  <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                    Manage, organize, and share all your contacts seamlessly with our modern contact management platform.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="btn-primary inline-flex items-center space-x-2">
                    <span>Get Started Free</span>
                    <FaArrowRight className="w-4 h-4" />
                  </button>
                  <button className="btn-secondary">
                    Learn More
                  </button>
                </div>
              </div>

              <div className="relative">
                <div className="glass rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img
                    src={HomePageLogo}
                    alt="Contact Management"
                    className="w-full rounded-2xl shadow-2xl"
                  />
                </div>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 glass rounded-full p-4 pulse-slow">
                  <FaUsers className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 glass rounded-full p-4 pulse-slow">
                  <FaHeart className="w-8 h-8 text-pink-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="card-modern p-8 h-full">
                <div className="text-4xl lg:text-6xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                  1M+
                </div>
                <div className="text-xl font-semibold text-gray-600">
                  Contacts Shared
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
              </div>
            </div>
            <div className="text-center group">
              <div className="card-modern p-8 h-full">
                <div className="text-4xl lg:text-6xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                  95%
                </div>
                <div className="text-xl font-semibold text-gray-600">
                  User Satisfaction
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
              </div>
            </div>
            <div className="text-center group">
              <div className="card-modern p-8 h-full">
                <div className="text-4xl lg:text-6xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">
                  50K+
                </div>
                <div className="text-xl font-semibold text-gray-600">
                  Active Users
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <StandardProcedure />

      {/* Features Section */}
      <div className="py-20">
        <PortalReachSpecifics />
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to revolutionize your contact management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Contact Nexus for their networking needs.
          </p>
          <button className="btn-primary inline-flex items-center space-x-2 text-lg px-10 py-4">
            <span>Get Started - It's Free</span>
            <FaArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

const StandardProcedure = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with Contact Nexus in three simple steps and transform the way you manage your professional network.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <StandardProcedureCards
            step="1"
            feature="Meet New People"
            description="Connect with professionals at events, meetings, and social gatherings to expand your network."
            featureImage={MeetingDifferentPeople}
            icon={<FaUsers className="w-8 h-8" />}
          />
          <StandardProcedureCards
            step="2"
            feature="Save Contacts Instantly"
            description="Quickly save and organize contact information with our intuitive contact management system."
            featureImage={SaveContacts}
            icon={<FaShieldAlt className="w-8 h-8" />}
          />
          <StandardProcedureCards
            step="3"
            feature="Share & Collaborate"
            description="Effortlessly share contacts with team members and build stronger professional relationships."
            featureImage={ShareContact}
            icon={<FaShareAlt className="w-8 h-8" />}
          />
        </div>
      </div>
    </div>
  );
};

const StandardProcedureCards = ({ step, feature, description, featureImage, icon }) => {
  return (
    <div className="group">
      <div className="card-modern overflow-hidden h-full">
        <div className="relative">
          <img 
            src={featureImage} 
            alt={feature}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
            {step}
          </div>
          <div className="absolute top-4 right-4 glass rounded-full p-3 text-white">
            {icon}
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
            {feature}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const PortalReachSpecifics = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-6">
          Why Choose Contact Nexus?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the powerful features that make Contact Nexus the perfect solution for modern professionals.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <PortalReachSpecificsCard
          title="Enterprise Security"
          description="Bank-level encryption and secure cloud storage ensure your contacts are always protected and accessible."
          icon={<FaShieldAlt className="w-12 h-12 text-blue-500 mb-4" />}
          gradient="from-blue-500 to-cyan-500"
        />
        <PortalReachSpecificsCard
          title="Smart Sharing"
          description="Share digital business cards instantly via QR codes, links, or direct contact transfer."
          icon={<FaShareAlt className="w-12 h-12 text-purple-500 mb-4" />}
          gradient="from-purple-500 to-pink-500"
        />
        <PortalReachSpecificsCard
          title="Favorite Contacts"
          description="Mark important contacts as favorites and access them quickly with our smart organization system."
          icon={<FaStar className="w-12 h-12 text-yellow-500 mb-4" />}
          gradient="from-yellow-500 to-orange-500"
        />
      </div>
    </div>
  );
};

const PortalReachSpecificsCard = ({ title, description, icon, gradient }) => {
  return (
    <div className="group">
      <div className="card-modern p-8 h-full text-center relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
