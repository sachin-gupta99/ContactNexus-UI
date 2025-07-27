import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import HomePageLogo from "../assets/HomePagePic.jpg";
import MeetingDifferentPeople from "../assets/MeetingDifferentPeople.jpg";
import SaveContacts from "../assets/SaveContacts.jpg";
import ShareContact from "../assets/ShareContact.jpg";
import { FaArrowRight, FaShieldAlt, FaShareAlt, FaStar, FaUsers, FaHeart, FaGlobe } from "react-icons/fa";
import { Button, Card, Badge } from "flowbite-react";

const Home = () => {
  const user = useSelector((state) => state.user?.user);
  const isLoggedIn = !!user;

  useEffect(() => {
    document.title = "Contact Nexus - Home";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  {isLoggedIn ? (
                    <>
                      <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                        Welcome back,
                        <span className="ml-5 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                          {user?.name?.split(' ')[0] || 'User'}
                        </span>
                      </h1>
                      <p className="text-xl text-slate-200 leading-relaxed max-w-lg">
                        Continue managing your contacts and building meaningful connections with ease.
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                        One place for all your 
                        <span className="ml-5 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                           contacts
                        </span>
                      </h1>
                      <p className="text-xl text-slate-200 leading-relaxed max-w-lg">
                        Manage, organize, and share all your contacts seamlessly with our modern contact management platform.
                      </p>
                    </>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {isLoggedIn ? (
                    <>
                      <Button 
                        gradientDuoTone="cyanToBlue" 
                        size="xl"
                        className="font-semibold"
                      >
                        <span className="flex items-center gap-2">
                          View My Contacts <FaUsers />
                        </span>
                      </Button>
                      <Button 
                        color="light" 
                        size="xl"
                        className="font-semibold"
                      >
                        Add New Contact
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        gradientDuoTone="cyanToBlue" 
                        size="xl"
                        className="font-semibold"
                      >
                        <span className="flex items-center gap-2">
                          Get Started Free <FaArrowRight />
                        </span>
                      </Button>
                      <Button 
                        color="light" 
                        size="xl"
                        className="font-semibold"
                      >
                        Learn More
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="relative">
                <Card className="transform rotate-3 hover:rotate-0 transition-transform duration-500 border-0 shadow-2xl">
                  <img
                    src={HomePageLogo}
                    alt="Contact Management"
                    className="w-full rounded-lg"
                  />
                </Card>
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-sm rounded-full p-4 animate-pulse">
                  <FaUsers className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-full p-4 animate-pulse">
                  <FaHeart className="w-8 h-8 text-pink-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - Only show for non-logged-in users */}
      {!isLoggedIn && (
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center group hover:scale-105 transition-transform duration-300 border-0 shadow-lg">
                <div className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  1M+
                </div>
                <div className="text-xl font-semibold text-gray-600">
                  Contacts Shared
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
              </Card>
              
              <Card className="text-center group hover:scale-105 transition-transform duration-300 border-0 shadow-lg">
                <div className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  95%
                </div>
                <div className="text-xl font-semibold text-gray-600">
                  User Satisfaction
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-600 mx-auto mt-4 rounded-full"></div>
              </Card>
              
              <Card className="text-center group hover:scale-105 transition-transform duration-300 border-0 shadow-lg">
                <div className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  50K+
                </div>
                <div className="text-xl font-semibold text-gray-600">
                  Active Users
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-600 mx-auto mt-4 rounded-full"></div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Process Section - Only show for non-logged-in users */}
      {!isLoggedIn && <StandardProcedure />}

      {/* Personalized Dashboard Section - Only for logged-in users */}
      {isLoggedIn && (
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Quick Stats for User */}
            <div className="mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
                Your Contact Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center group hover:scale-105 transition-transform duration-300 border-0 shadow-lg">
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    12
                  </div>
                  <div className="text-lg font-semibold text-gray-600">
                    Total Contacts
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-3 rounded-full"></div>
                </Card>
                
                <Card className="text-center group hover:scale-105 transition-transform duration-300 border-0 shadow-lg">
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    5
                  </div>
                  <div className="text-lg font-semibold text-gray-600">
                    Favorites
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-600 mx-auto mt-3 rounded-full"></div>
                </Card>
                
                <Card className="text-center group hover:scale-105 transition-transform duration-300 border-0 shadow-lg">
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    3
                  </div>
                  <div className="text-lg font-semibold text-gray-600">
                    Added This Week
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-600 mx-auto mt-3 rounded-full"></div>
                </Card>

                <Card className="text-center group hover:scale-105 transition-transform duration-300 border-0 shadow-lg">
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                    8
                  </div>
                  <div className="text-lg font-semibold text-gray-600">
                    Groups
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-3 rounded-full"></div>
                </Card>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="group hover:scale-105 transition-transform duration-300 border-0 shadow-lg cursor-pointer">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FaUsers className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Add New Contact</h4>
                    <p className="text-gray-600">Quickly add a new contact to your network</p>
                  </div>
                </Card>

                <Card className="group hover:scale-105 transition-transform duration-300 border-0 shadow-lg cursor-pointer">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FaHeart className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">View Favorites</h4>
                    <p className="text-gray-600">Access your most important contacts</p>
                  </div>
                </Card>

                <Card className="group hover:scale-105 transition-transform duration-300 border-0 shadow-lg cursor-pointer">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FaShareAlt className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Share Contacts</h4>
                    <p className="text-gray-600">Share your contacts with team members</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mb-4">
              <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Recent Activity
              </h3>
              <Card className="border-0 shadow-lg">
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <FaUsers className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">Added John Doe to contacts</p>
                        <p className="text-sm text-gray-600">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <FaHeart className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">Marked Jane Smith as favorite</p>
                        <p className="text-sm text-gray-600">1 day ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <FaShareAlt className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">Shared contact with team</p>
                        <p className="text-sm text-gray-600">3 days ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button gradientDuoTone="purpleToBlue" className="font-semibold">
                      View All Activity
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="pb-8">
        <PortalReachSpecifics />
      </div>

      {/* CTA Section - Only show for non-logged-in users */}
      {!isLoggedIn && (
        <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to revolutionize your contact management?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Contact Nexus for their networking needs.
            </p>
            <Button 
              gradientDuoTone="purpleToBlue" 
              size="xl"
              className="font-semibold mx-auto"
            >
              <span className="flex items-center gap-2">
                Get Started - It's Free <FaArrowRight />
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

const StandardProcedure = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
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
      <Card className="overflow-hidden h-full hover:scale-105 transition-transform duration-300 border-0 shadow-lg">
        <div className="relative">
          <img 
            src={featureImage} 
            alt={feature}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <Badge 
            color="purple" 
            size="lg"
            className="absolute top-4 left-4 font-bold text-lg"
          >
            {step}
          </Badge>
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white">
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
      </Card>
    </div>
  );
};

const PortalReachSpecifics = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
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
          gradientColor="blue"
        />
        <PortalReachSpecificsCard
          title="Smart Sharing"
          description="Share digital business cards instantly via QR codes, links, or direct contact transfer."
          icon={<FaShareAlt className="w-12 h-12 text-purple-500 mb-4" />}
          gradientColor="purple"
        />
        <PortalReachSpecificsCard
          title="Favorite Contacts"
          description="Mark important contacts as favorites and access them quickly with our smart organization system."
          icon={<FaStar className="w-12 h-12 text-yellow-500 mb-4" />}
          gradientColor="yellow"
        />
      </div>
    </div>
  );
};

const PortalReachSpecificsCard = ({ title, description, icon, gradientColor }) => {
  const gradientClasses = {
    blue: "hover:from-blue-50 hover:to-cyan-50",
    purple: "hover:from-purple-50 hover:to-pink-50", 
    yellow: "hover:from-yellow-50 hover:to-orange-50"
  };

  return (
    <div className="group">
      <Card className={`h-full text-center relative overflow-hidden hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:bg-gradient-to-br ${gradientClasses[gradientColor]}`}>
        <div className="p-8">
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
      </Card>
    </div>
  );
};
