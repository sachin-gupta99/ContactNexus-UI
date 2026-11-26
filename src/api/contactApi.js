import axiosInstance from "./axiosInstance";

// Server returns { content, page, size, totalElements, totalPages, hasNext, hasPrevious }
// Page is zero-indexed on the server; callers that use 1-indexed UI pages
// must translate at the boundary.
// `sort` may be one "field,dir" or an array of them ("favourites first" is
// ["favorite,desc", "firstName,asc"]). Spring wants repeated `sort=` params, not
// axios' default `sort[]=`, hence `indexes: null`.
export const listContactsRoute = ({
  q = "",
  page = 0,
  size = 12,
  sort = "firstName,asc",
  favorite = false,
  tag = "",
} = {}) => {
  return axiosInstance.get("/api/v1/contacts", {
    params: { q: q || undefined, page, size, sort, favorite: favorite || undefined, tag: tag || undefined },
    paramsSerializer: { indexes: null },
  });
};

// [{ name, count }], alphabetical
export const listTagsRoute = () => {
  return axiosInstance.get("/api/v1/contacts/tags");
};

// Removes the tag from every contact.
export const deleteTagRoute = (name) => {
  return axiosInstance.delete(`/api/v1/contacts/tags/${encodeURIComponent(name)}`);
};

// [{ reason: "email" | "phone", value, contacts: [ContactResponse] }]
export const duplicatesRoute = () => {
  return axiosInstance.get("/api/v1/contacts/duplicates");
};

// Content-Type left unset so axios adds the multipart boundary. Returns the contact.
export const uploadContactPhotoRoute = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosInstance.put(`/api/v1/contacts/${id}/photo`, formData);
};

export const deleteContactPhotoRoute = (id) => {
  return axiosInstance.delete(`/api/v1/contacts/${id}/photo`);
};

// { total, favorites, addedThisWeek, tags }
export const contactStatsRoute = () => {
  return axiosInstance.get("/api/v1/contacts/stats");
};

export const setFavoriteRoute = (id, favorite) => {
  return axiosInstance.put(`/api/v1/contacts/${id}/favorite`, { favorite });
};

export const getContactRoute = (id) => {
  return axiosInstance.get(`/api/v1/contacts/${id}`);
};

export const createContactRoute = (payload) => {
  return axiosInstance.post("/api/v1/contacts", payload);
};

export const updateContactRoute = (id, payload) => {
  return axiosInstance.put(`/api/v1/contacts/${id}`, payload);
};

export const deleteContactRoute = (id) => {
  return axiosInstance.delete(`/api/v1/contacts/${id}`);
};

// Up to 500 contacts per call; returns { imported, skippedDuplicates }.
export const importContactsRoute = (contacts) => {
  return axiosInstance.post("/api/v1/contacts/import", { contacts });
};
