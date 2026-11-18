import axios from "axios";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../util/tokenStore";

// Relative baseURL goes through Vite's dev proxy (see vite.config.js) so the
// browser treats /api requests as same-origin. In prod the UI and API live on
// the same domain, so relative URLs work there too.
const axiosInstance = axios.create({
  baseURL: "",
  // Needed for the HttpOnly refresh cookie to be sent on /api/v1/auth/refresh.
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config.headers.Accept) {
      config.headers.Accept = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Single-flight refresh promise: if ten requests race in with 401s we must only
// fire one POST /refresh - rotation invalidates the old cookie after the first
// success, so parallel refreshes would bounce each other.
let refreshing = null;

const refreshAccessToken = () => {
  if (!refreshing) {
    refreshing = axios
      .post(
        "/api/v1/auth/refresh",
        {},
        { withCredentials: true }
      )
      .then((res) => {
        setAccessToken(res.data.accessToken, res.data.expiresInSeconds);
        return res.data;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Do not try to refresh if the failing call IS the refresh/logout call, and
    // do not loop: a request is retried at most once per 401.
    const isAuthEndpoint =
      original?.url?.includes("/api/v1/auth/refresh") ||
      original?.url?.includes("/api/v1/auth/login") ||
      original?.url?.includes("/api/v1/auth/signup");

    if (status !== 401 || !original || original._retried || isAuthEndpoint) {
      return Promise.reject(error);
    }

    original._retried = true;
    try {
      const { accessToken } = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(original);
    } catch (refreshError) {
      clearAccessToken();
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.assign("/auth?mode=signin");
      }
      return Promise.reject(refreshError);
    }
  }
);

export { refreshAccessToken };
export default axiosInstance;
