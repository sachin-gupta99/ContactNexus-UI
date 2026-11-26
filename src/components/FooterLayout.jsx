import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaGithub, FaHeart } from "react-icons/fa";

const GITHUB_URL = "https://github.com/sachin-gupta99";

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-gray-300 hover:text-white transition-colors duration-200">
      {children}
    </Link>
  </li>
);

const FooterLayout = () => {
  const isAuthenticated = useSelector((state) => Boolean(state.user?.user));

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xl font-bold text-gray-100 font-heading tracking-wider">Contact Nexus</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              A simple, private place to keep your contacts. Save them, star the
              important ones, and share them as vCards.
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-10 h-10 bg-gray-800 rounded-full inline-flex items-center justify-center hover:bg-gray-600 transition-colors duration-300"
            >
              <FaGithub className="w-4 h-4" />
            </a>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <FooterLink to="/home#features">Features</FooterLink>
              {isAuthenticated ? (
                <>
                  <FooterLink to="/contacts">Contacts</FooterLink>
                  <FooterLink to="/settings">Settings</FooterLink>
                </>
              ) : (
                <>
                  <FooterLink to="/auth?mode=signup">Create account</FooterLink>
                  <FooterLink to="/auth?mode=signin">Sign in</FooterLink>
                </>
              )}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Contact Nexus. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-4 md:mt-0">
            Made with <FaHeart className="w-4 h-4 text-red-500 mx-1" /> for better connections
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterLayout;
