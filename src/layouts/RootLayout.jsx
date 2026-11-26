import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import FooterLayout from "../components/FooterLayout";
import { router } from "../router";
import { refreshAccessToken } from "../api/axiosInstance";
import { userActions } from "../store/user";

const RootLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  const dispatch = useDispatch();
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    if (path === "/") {
      router.navigate("/home");
    }
  }, [path]);

  // Boot-time session rehydration: the access token lives only in memory, so
  // on page load we try to exchange the refresh cookie for a fresh one. If it
  // succeeds, the response carries the current user and we hydrate redux; if
  // it fails (no cookie / revoked / expired), we stay logged out.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await refreshAccessToken();
        if (!cancelled) dispatch(userActions.setUser(data.user));
      } catch {
        // stay signed out
      } finally {
        if (!cancelled) {
          dispatch(userActions.setAuthReady(true));
          setBootstrapped(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (!bootstrapped) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-pulse text-gray-500">Loading…</div>
      </div>
    );
  }

  // Auth pages don't need navbar/footer
  if (path.startsWith("/auth")) {
    return (
      <div className="min-h-screen">
        <Outlet />
      </div>
    );
  }

  // Main app layout
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterLayout />
    </div>
  );
};

export default RootLayout;
