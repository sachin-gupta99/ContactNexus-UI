import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomePageLogo from "../assets/HomePagePic.jpg";
import MeetingDifferentPeople from "../assets/MeetingDifferentPeople.jpg";
import SaveContacts from "../assets/SaveContacts.jpg";
import ShareContact from "../assets/ShareContact.jpg";
import {
  FaArrowRight, FaShieldAlt, FaShareAlt, FaStar, FaUsers, FaHeart,
  FaUserPlus, FaFileExport, FaBirthdayCake,
} from "react-icons/fa";
import { Button, Card, Badge, Spinner, Avatar } from "flowbite-react";
import { useContactList, useContactStats, useUpcomingBirthdays } from "../hooks/useContacts";
import { describeInDays } from "../util/birthday";
import { exportAllContacts } from "../util/exportContacts";
import { timeAgo } from "../util/time";
import { toastActions } from "../store/toast";

const RECENT_COUNT = 5;
const FAILED_STATS = { total: "—", favorites: "—", addedThisWeek: "—", tags: "—" };

const scrollToFeatures = () =>
  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });

const Home = () => {
  const user = useSelector((state) => state.user?.user);
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const { hash } = useLocation();

  useEffect(() => {
    document.title = "Contact Nexus - Home";
  }, []);

  // The footer links to /home#features; the router doesn't scroll to hashes itself.
  useEffect(() => {
    if (hash === "#features") scrollToFeatures();
  }, [hash]);

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
                          {user?.name?.split(" ")[0] || "User"}
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
                        Save, search, star and share your contacts from any device.
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
                        onClick={() => navigate("/contacts")}
                      >
                        <span className="flex items-center gap-2">
                          View My Contacts <FaUsers />
                        </span>
                      </Button>
                      <Button
                        color="light"
                        size="xl"
                        className="font-semibold"
                        onClick={() => navigate("/contacts?new=1")}
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
                        onClick={() => navigate("/auth?mode=signup")}
                      >
                        <span className="flex items-center gap-2">
                          Get Started Free <FaArrowRight />
                        </span>
                      </Button>
                      <Button
                        color="light"
                        size="xl"
                        className="font-semibold"
                        onClick={scrollToFeatures}
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

      {isLoggedIn ? <Dashboard /> : <StandardProcedure />}

      {/* Features Section */}
      <div id="features" className="py-20 scroll-mt-20">
        <PortalReachSpecifics />
      </div>

      {/* CTA Section - Only show for non-logged-in users */}
      {!isLoggedIn && (
        <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to organise your contacts?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Create a free account in under a minute. No credit card, no ads.
            </p>
            <Button
              gradientDuoTone="purpleToBlue"
              size="xl"
              className="font-semibold mx-auto"
              onClick={() => navigate("/auth?mode=signup")}
            >
              <span className="flex items-center gap-2">
                Get Started - It’s Free <FaArrowRight />
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

/** Signed-in overview: live stats, quick actions and the newest contacts. */
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Same cache entries as the Contacts and Profile pages, so a star or delete
  // there is already reflected here without a refetch.
  const statsQuery = useContactStats();
  const recentQuery = useContactList({ page: 0, size: RECENT_COUNT, sort: "createdAt,desc" });
  const birthdaysQuery = useUpcomingBirthdays(30);
  const stats = statsQuery.isError ? FAILED_STATS : statsQuery.data;
  const recent = recentQuery.isError ? [] : (recentQuery.data?.content ?? null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const count = await exportAllContacts();
      dispatch(toastActions.setToast(count
        ? { message: `Exported ${count} contact${count === 1 ? "" : "s"}`, type: "success" }
        : { message: "No contacts to export yet", type: "error" }));
    } catch (err) {
      dispatch(toastActions.setToast({
        message: err.response?.data?.message || "Could not export contacts",
        type: "error",
      }));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quick Stats for User */}
        <div className="mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
            Your Contact Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard value={stats?.total} label="Total Contacts" gradient="from-blue-600 to-purple-600" bar="from-blue-500 to-purple-600" />
            <StatCard value={stats?.favorites} label="Favourites" gradient="from-green-600 to-blue-600" bar="from-green-500 to-blue-600" />
            <StatCard value={stats?.addedThisWeek} label="Added This Week" gradient="from-purple-600 to-pink-600" bar="from-purple-500 to-pink-600" />
            <StatCard value={stats?.tags} label="Groups (tags)" gradient="from-orange-600 to-red-600" bar="from-orange-500 to-red-600" />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard
              icon={<FaUserPlus className="w-8 h-8 text-white" />}
              gradient="from-blue-500 to-purple-500"
              title="Add New Contact"
              text="Quickly add a new contact to your network"
              onClick={() => navigate("/contacts?new=1")}
            />
            <ActionCard
              icon={<FaStar className="w-8 h-8 text-white" />}
              gradient="from-green-500 to-emerald-500"
              title="View Favourites"
              text="Jump straight to the contacts you've starred"
              onClick={() => navigate("/contacts?favorites=1")}
            />
            <ActionCard
              icon={exporting ? <Spinner size="lg" /> : <FaFileExport className="w-8 h-8 text-white" />}
              gradient="from-purple-500 to-pink-500"
              title="Export Contacts"
              text="Download every contact as a .vcf file for your phone or email app"
              onClick={handleExport}
            />
          </div>
        </div>

        {/* Upcoming birthdays (only when there are some) */}
        {birthdaysQuery.data?.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Upcoming Birthdays</h3>
            <Card className="border-0 shadow-lg">
              <ul className="divide-y divide-gray-100">
                {birthdaysQuery.data.slice(0, 6).map((b) => {
                  const c = b.contact;
                  const name = [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email;
                  return (
                    <li key={c.id} className="flex items-center gap-4 py-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        b.inDays <= 1 ? "bg-pink-500 text-white" : "bg-pink-50 text-pink-500"}`}>
                        <FaBirthdayCake className="h-4 w-4" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-gray-800">{name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(b.date + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "long" })}
                          {b.turning ? ` · turns ${b.turning}` : ""}
                        </p>
                      </div>
                      <span className={`whitespace-nowrap text-sm font-medium ${b.inDays <= 1 ? "text-pink-600" : "text-gray-500"}`}>
                        {describeInDays(b.inDays)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="pt-2 text-center text-xs text-gray-500">
                You’ll get an email the day before. Turn this off in Settings.
              </p>
            </Card>
          </div>
        )}

        {/* Recently added */}
        <div className="mb-4">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Recently Added
          </h3>
          <Card className="border-0 shadow-lg">
            <div className="p-2 sm:p-6">
              {recent === null ? (
                <div className="flex justify-center py-8"><Spinner size="lg" /></div>
              ) : recent.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You haven’t added any contacts yet.</p>
                  <Button gradientDuoTone="purpleToBlue" className="mx-auto" onClick={() => navigate("/contacts?new=1")}>
                    Add your first contact
                  </Button>
                </div>
              ) : (
                <>
                  <ul className="space-y-3">
                    {recent.map((c) => {
                      const name = [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email;
                      return (
                        <li key={c.id} className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                          <Avatar img={c.imageUrl || undefined} placeholderInitials={name.charAt(0).toUpperCase()} rounded />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {name}
                              {c.favorite && <FaStar className="inline w-3.5 h-3.5 ml-2 text-yellow-500 align-baseline" />}
                            </p>
                            <p className="text-sm text-gray-600 truncate">{c.email}</p>
                          </div>
                          <span className="text-sm text-gray-500 whitespace-nowrap">{timeAgo(c.createdAt)}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-6 text-center">
                    <Button gradientDuoTone="purpleToBlue" className="font-semibold mx-auto" onClick={() => navigate("/contacts")}>
                      View all contacts
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ value, label, gradient, bar }) => (
  <Card className="text-center group hover:scale-105 transition-transform duration-300 border-0 shadow-lg">
    <div className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}>
      {value ?? <Spinner size="md" />}
    </div>
    <div className="text-lg font-semibold text-gray-600">{label}</div>
    <div className={`w-16 h-1 bg-gradient-to-r ${bar} mx-auto mt-3 rounded-full`}></div>
  </Card>
);

const ActionCard = ({ icon, gradient, title, text, onClick }) => (
  <button type="button" onClick={onClick} className="text-left focus:outline-none focus:ring-4 focus:ring-purple-200 rounded-lg">
    <Card className="h-full group hover:scale-105 transition-transform duration-300 border-0 shadow-lg cursor-pointer">
      <div className="text-center p-6">
        <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600">{text}</p>
      </div>
    </Card>
  </button>
);

const StandardProcedure = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with Contact Nexus in three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <StandardProcedureCards
            step="1"
            feature="Meet New People"
            description="Connect with people at events, meetings and gatherings."
            featureImage={MeetingDifferentPeople}
            icon={<FaUsers className="w-8 h-8" />}
          />
          <StandardProcedureCards
            step="2"
            feature="Save Contacts Instantly"
            description="Add their details in seconds, then search and star them whenever you need them."
            featureImage={SaveContacts}
            icon={<FaShieldAlt className="w-8 h-8" />}
          />
          <StandardProcedureCards
            step="3"
            feature="Share Anywhere"
            description="Send any contact as a vCard that every phone can import, or export your whole list."
            featureImage={ShareContact}
            icon={<FaShareAlt className="w-8 h-8" />}
          />
        </div>

        <div className="text-center mt-12">
          <Link to="/auth?mode=signup" className="text-purple-700 font-semibold hover:underline">
            Create your free account <FaArrowRight className="inline ml-1" />
          </Link>
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
          The essentials of a contact book, done properly.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <PortalReachSpecificsCard
          title="Secure by Design"
          description="Hashed passwords, short-lived sessions that rotate automatically, and private photo storage."
          icon={<FaShieldAlt className="w-12 h-12 text-blue-500 mb-4" />}
          gradientColor="blue"
        />
        <PortalReachSpecificsCard
          title="Share as vCard"
          description="Send a contact card in one tap. iPhone, Android, Gmail and Outlook all import it."
          icon={<FaShareAlt className="w-12 h-12 text-purple-500 mb-4" />}
          gradientColor="purple"
        />
        <PortalReachSpecificsCard
          title="Favourite Contacts"
          description="Star the people you reach for most and filter to them instantly."
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
    yellow: "hover:from-yellow-50 hover:to-orange-50",
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
