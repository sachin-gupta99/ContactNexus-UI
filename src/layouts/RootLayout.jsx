import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import FooterLayout from "../components/FooterLayout";
import { router } from "../App";

const RootLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    if (path === "/") {
      router.navigate("/home");
    }
  }, [path]);

  // Auth pages don't need navbar/footer
  if (
    path === "/auth?mode=signin" ||
    path === "/auth?mode=signup" ||
    path === "/auth"
  ) {
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

export const rootLoader = () => {
  return import("./RootLayout");
};
