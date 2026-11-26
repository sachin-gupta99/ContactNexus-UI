import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Contacts from "./pages/Contacts";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { Privacy, Terms } from "./pages/Legal";
import ProtectedRoute from "./components/ProtectedRoute";

// Its own module (not App.jsx) so files that call router.navigate() don't import
// a component file, which keeps React fast refresh working.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    children: [
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "contacts",
        element: (
          <ProtectedRoute>
            <Contacts />
          </ProtectedRoute>
        ),
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      // Inside the layout so unknown URLs still get the navbar and footer.
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
