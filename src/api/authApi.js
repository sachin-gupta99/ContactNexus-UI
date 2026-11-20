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

// Always returns 200 whether or not the email is registered, so a failure
// here is a transport error, not "email not found".
export const forgotPasswordRoute = (email) => {
  return axiosInstance.post("/api/v1/auth/forgot-password", { email });
};

// 200 on success, 400 if the token is invalid/expired/used.
export const resetPasswordRoute = (token, newPassword) => {
  return axiosInstance.post("/api/v1/auth/reset-password", { token, newPassword });
};
