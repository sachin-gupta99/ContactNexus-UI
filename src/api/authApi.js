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

// Signs out every other device and returns a fresh { accessToken, user } for
// this one. 400 if the current password is wrong.
export const changePasswordRoute = (currentPassword, newPassword) => {
  return axiosInstance.post("/api/v1/auth/change-password", { currentPassword, newPassword });
};

// Revokes every refresh token, this device included.
export const logoutAllRoute = () => {
  return axiosInstance.post("/api/v1/auth/logout-all");
};

// Spends the emailed token; on success returns { accessToken, user } and sets
// the refresh cookie, i.e. it signs the user in. 400 if invalid / expired / used.
export const verifyEmailRoute = (token) => {
  return axiosInstance.post("/api/v1/auth/verify-email", { token });
};

// Always 200 (enumeration-safe); only sends if the address has an unverified account.
export const resendVerificationRoute = (email) => {
  return axiosInstance.post("/api/v1/auth/resend-verification", { email });
};

// [{ id, userAgent, ipAddress, signedInAt, lastActiveAt, expiresAt, current }]
export const listSessionsRoute = () => {
  return axiosInstance.get("/api/v1/auth/sessions");
};

export const revokeSessionRoute = (id) => {
  return axiosInstance.delete(`/api/v1/auth/sessions/${id}`);
};
