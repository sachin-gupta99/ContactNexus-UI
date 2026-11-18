import axiosInstance from "./axiosInstance";

export const signUpRoute = (payload) => {
  return axiosInstance.post("/api/v1/auth/signup", payload);
};

export const loginRoute = (credentials) => {
  return axiosInstance.post("/api/v1/auth/login", credentials);
};

// Reaching this at all proves the access token is valid, and it returns the
// current user so the app can rehydrate redux after a page refresh.
export const getMeRoute = () => {
  return axiosInstance.get("/api/v1/auth/me");
};

// Logout revokes the refresh token server-side and clears the HttpOnly cookie.
export const logoutRoute = () => {
  return axiosInstance.post("/api/v1/auth/logout");
};
