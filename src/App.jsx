import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Contacts from "./pages/Contacts";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { Privacy, Terms } from "./pages/Legal";
import { AuthLoader } from "./pages/Auth";
import { rootLoader } from "./layouts/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: rootLoader,
    children: [
      {
        path: "auth",
        element: <AuthPage />,
        loader: AuthLoader,
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

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
export { router };
