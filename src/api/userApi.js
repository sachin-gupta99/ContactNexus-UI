import axiosInstance from "./axiosInstance";

// Replaces name + all profile text fields; returns the updated user.
export const updateProfileRoute = (payload) => {
  return axiosInstance.put("/api/v1/users/me", payload);
};

// Content-Type is intentionally left unset so axios adds the multipart boundary.
export const uploadAvatarRoute = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.put("/api/v1/users/me/avatar", formData);
};

// Needs the password again; 400 if it is wrong. The server clears the refresh cookie.
export const deleteAccountRoute = (password) => {
  return axiosInstance.delete("/api/v1/users/me", { data: { password } });
};

// { birthdayReminders } -> updated user
export const updatePreferencesRoute = (prefs) => {
  return axiosInstance.put("/api/v1/users/me/preferences", prefs);
};

// { enabled, token, fields, available }
export const getCardShareRoute = () => {
  return axiosInstance.get("/api/v1/users/me/card-share");
};

// Turns the public card on (or updates its fields).
export const saveCardShareRoute = (fields) => {
  return axiosInstance.put("/api/v1/users/me/card-share", { fields });
};

// New link; the old one stops working.
export const rotateCardShareRoute = () => {
  return axiosInstance.post("/api/v1/users/me/card-share/rotate");
};

export const disableCardShareRoute = () => {
  return axiosInstance.delete("/api/v1/users/me/card-share");
};

// No auth needed: the token in the link is the permission.
export const publicCardRoute = (token) => {
  return axiosInstance.get(`/api/v1/public/cards/${encodeURIComponent(token)}`);
};
