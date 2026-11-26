import axiosInstance from "./axiosInstance";

// Server returns { content, page, size, totalElements, totalPages, hasNext, hasPrevious }
// Page is zero-indexed on the server; callers that use 1-indexed UI pages
// must translate at the boundary.
export const listContactsRoute = ({
  q = "",
  page = 0,
  size = 12,
  sort = "firstName,asc",
  favorite = false,
} = {}) => {
  return axiosInstance.get("/api/v1/contacts", {
    params: { q: q || undefined, page, size, sort, favorite: favorite || undefined },
  });
};

// { total, favorites, addedThisWeek }
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
