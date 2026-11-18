import axiosInstance from "./axiosInstance";

// Content-Type is intentionally left unset so axios adds the multipart boundary.
export const uploadAvatarRoute = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.put("/api/v1/users/me/avatar", formData);
};
