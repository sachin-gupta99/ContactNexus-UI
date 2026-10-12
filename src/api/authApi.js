import axiosInstance from "./axiosInstance";

export const signUpRoute = (payload) => {
  return axiosInstance.post("/api/v1/auth/signup", payload);
};

export const loginRoute = (credentials) => {
  return axiosInstance.post("/api/v1/auth/login", credentials);
};

// Reaching this at all proves the token is valid, and it returns the current
// user so the app can rehydrate redux after a page refresh.
export const getMeRoute = () => {
  return axiosInstance.get("/api/v1/auth/me");
};

// Logout is client-side: the token is stateless, so discarding it is enough.
