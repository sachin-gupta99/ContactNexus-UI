import axios from "axios";
import { getAuthToken, removeAuthToken } from "../util/helper";

export const host = "http://localhost:8080";

const axiosInstance = axios.create({
  baseURL: host,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only treat a 401 as an expired session if we actually sent a token -
    // otherwise a failed sign-in would bounce the user off the auth page.
    // A hard redirect is used rather than importing the router, which would
    // create a circular import (App -> pages -> api -> App).
    const isExpiredSession = error.response?.status === 401 && getAuthToken();
    if (isExpiredSession) {
      removeAuthToken();
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.assign("/auth?mode=signin");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
