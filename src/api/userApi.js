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
