import React, { useEffect } from "react";
import { getAuthToken, removeAuthToken } from "../util/helper";
import { router } from "../App";
import { verifyTokenRoute } from "../api/authApi";

const ProtectedRoute = ({ children }) => {
  const token = getAuthToken();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          return router.navigate("/auth");
        } else {
          const response = await verifyTokenRoute();
          if (!response.data) {
            removeAuthToken();
            return router.navigate("/auth");
          }
        }
      } catch (error) {
        removeAuthToken();
        router.navigate("/auth");
      }
    };
    verifyToken();
  }, [token]);

  return children;
};

export default ProtectedRoute;
