import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

const NotFound = () => {
  useEffect(() => {
    document.title = "Page not found - Contact Nexus";
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <p className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          404
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-600 mb-8">The page you’re looking for doesn’t exist or has moved.</p>
        <Link to="/home" className="inline-block">
          <Button gradientDuoTone="purpleToBlue">Back to home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
