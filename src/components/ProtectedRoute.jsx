import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { router } from "../App";

const ProtectedRoute = ({ children }) => {
  const { user, authReady } = useSelector((state) => state.user);

  useEffect(() => {
    if (authReady && !user) {
      router.navigate("/auth?mode=signin");
    }
  }, [authReady, user]);

  if (!authReady) return null;
  if (!user) return null;
  return children;
};

export default ProtectedRoute;
