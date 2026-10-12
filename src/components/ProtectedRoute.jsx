import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAuthToken, removeAuthToken } from "../util/helper";
import { router } from "../App";
import { getMeRoute } from "../api/authApi";
import { userActions } from "../store/user";

const ProtectedRoute = ({ children }) => {
  const token = getAuthToken();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        return router.navigate("/auth?mode=signin");
      }

      try {
        // Doubles as session verification and rehydration: redux is not
        // persisted, so without this a refresh leaves pages with no user.
        const response = await getMeRoute();
        dispatch(userActions.setUser(response.data));
      } catch (error) {
        removeAuthToken();
        router.navigate("/auth?mode=signin");
      }
    };

    verifyToken();
  }, [token, dispatch]);

  return children;
};

export default ProtectedRoute;
