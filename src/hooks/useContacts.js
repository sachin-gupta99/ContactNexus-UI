import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  getContactRoute,
  addInteractionRoute,
  bulkContactsRoute,
  deleteInteractionRoute,
  listInteractionsRoute,
  mergeContactsRoute,
  upcomingBirthdaysRoute,
  contactStatsRoute,
  createContactRoute,
  deleteContactPhotoRoute,
  deleteContactRoute,
  deleteTagRoute,
  duplicatesRoute,
  listTagsRoute,
  uploadContactPhotoRoute,
  importContactsRoute,
  listContactsRoute,
  setFavoriteRoute,
  updateContactRoute,
} from "../api/contactApi";

// Every key starts with the user id, so one account's cache can never be
// served to another, even if a sign-out somehow skipped queryClient.clear().
export const contactKeys = {
  all: (userId) => ["contacts", userId],
  lists: (userId) => ["contacts", userId, "list"],
  list: (userId, params) => ["contacts", userId, "list", params],
  stats: (userId) => ["contacts", userId, "stats"],
  tags: (userId) => ["contacts", userId, "tags"],
  duplicates: (userId) => ["contacts", userId, "duplicates"],
  interactions: (userId, contactId) => ["contacts", userId, "interactions", contactId],
  detail: (userId, contactId) => ["contacts", userId, "detail", contactId],
  birthdays: (userId, days) => ["contacts", userId, "birthdays", days],
};

const useUserId = () => useSelector((state) => state.user?.user?.id);

const DEFAULT_LIST = { q: "", page: 0, size: 12, sort: "firstName,asc", favorite: false, tag: "" };

/** Paged list. Keeps the previous page on screen while the next one loads. */
export const useContactList = (params) => {
  const userId = useUserId();
  const full = { ...DEFAULT_LIST, ...params };
  return useQuery({
    queryKey: contactKeys.list(userId, full),
    queryFn: () => listContactsRoute(full).then((res) => res.data),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  });
};

export const useContactStats = () => {
  const userId = useUserId();
  return useQuery({
    queryKey: contactKeys.stats(userId),
    queryFn: () => contactStatsRoute().then((res) => res.data),
    enabled: Boolean(userId),
  });
};

/** [{ name, count }] for the filter chips and the tag picker. */
export const useContactTags = () => {
  const userId = useUserId();
  return useQuery({
    queryKey: contactKeys.tags(userId),
    queryFn: () => listTagsRoute().then((res) => res.data),
    enabled: Boolean(userId),
  });
};

export const useDuplicates = () => {
  const userId = useUserId();
  return useQuery({
    queryKey: contactKeys.duplicates(userId),
    queryFn: () => duplicatesRoute().then((res) => res.data),
    enabled: Boolean(userId),
  });
};

/** Lists, stats, tags and duplicates all derive from the same rows, so any write refreshes them all. */
const useInvalidateContacts = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();
  return () => queryClient.invalidateQueries({ queryKey: contactKeys.all(userId) });
};

/**
 * Saves the contact, then uploads or removes its photo (a new contact needs its
 * id first). A failed photo step doesn't undo the save: the result says
 * `photoFailed` so the form can tell the user.
 */
export const useSaveContact = () => {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: async ({ id, payload, photo, removePhoto }) => {
      let contact = (await (id ? updateContactRoute(id, payload) : createContactRoute(payload))).data;
      try {
        if (photo) contact = (await uploadContactPhotoRoute(contact.id, photo)).data;
        else if (removePhoto && contact.hasPhoto) {
          await deleteContactPhotoRoute(contact.id);
          contact = { ...contact, hasPhoto: false, imageUrl: null };
        }
        return { contact, photoFailed: false };
      } catch {
        return { contact, photoFailed: true };
      }
    },
    onSettled: invalidate,
  });
};

export const useDeleteTag = () => {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: (name) => deleteTagRoute(name),
    onSuccess: invalidate,
  });
};

export const useDeleteContact = () => {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: (id) => deleteContactRoute(id),
    onSuccess: invalidate,
  });
};

/** One call per batch of up to 500; the modal runs them in sequence. */
export const useImportContacts = () => {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: (contacts) => importContactsRoute(contacts).then((res) => res.data),
    onSettled: invalidate, // also after a failed batch: earlier batches were saved
  });
};

/**
 * Writes a star change into every cached list and the stats, and returns the
 * previous values so they can be restored. Kept outside the hook so it can be
 * unit-tested against a plain QueryClient.
 */
export const applyFavoriteOptimistically = (queryClient, userId, id, favorite) => {
  const previousLists = queryClient.getQueriesData({ queryKey: contactKeys.lists(userId) });
  const previousStats = queryClient.getQueryData(contactKeys.stats(userId));

  let changed = false;
  for (const [key, page] of previousLists) {
    const target = page?.content?.find((c) => c.id === id);
    if (!target || target.favorite === favorite) continue;
    changed = true;
    const favoritesOnly = key[3]?.favorite;
    const content = favoritesOnly && !favorite
      ? page.content.filter((c) => c.id !== id)
      : page.content.map((c) => (c.id === id ? { ...c, favorite } : c));
    queryClient.setQueryData(key, {
      ...page,
      content,
      totalElements: page.totalElements - (page.content.length - content.length),
    });
  }
  if (changed && typeof previousStats?.favorites === "number") {
    queryClient.setQueryData(contactKeys.stats(userId), {
      ...previousStats,
      favorites: Math.max(0, previousStats.favorites + (favorite ? 1 : -1)),
    });
  }
  return { previousLists, previousStats };
};

export const restoreSnapshot = (queryClient, userId, snapshot) => {
  snapshot?.previousLists?.forEach(([key, data]) => queryClient.setQueryData(key, data));
  if (snapshot?.previousStats) {
    queryClient.setQueryData(contactKeys.stats(userId), snapshot.previousStats);
  }
};

/**
 * Optimistic star toggle across every cached list and the stats: the star flips
 * immediately on every page, an unstarred contact drops out of favourites-only
 * lists, and everything rolls back if the request fails.
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();
  const invalidate = useInvalidateContacts();

  return useMutation({
    mutationFn: ({ id, favorite }) => setFavoriteRoute(id, favorite).then((res) => res.data),

    onMutate: async ({ id, favorite }) => {
      await queryClient.cancelQueries({ queryKey: contactKeys.all(userId) });
      return applyFavoriteOptimistically(queryClient, userId, id, favorite);
    },

    onError: (_err, _vars, snapshot) => restoreSnapshot(queryClient, userId, snapshot),

    // Re-sync with the server either way: favourites lists may need a contact
    // added, and page counts may have shifted.
    onSettled: invalidate,
  });
};

// ---- timeline -------------------------------------------------------------

/** One contact, starting from the copy a list already has and refreshing with the cache. */
export const useContact = (contactId, placeholder) => {
  const userId = useUserId();
  return useQuery({
    queryKey: contactKeys.detail(userId, contactId),
    queryFn: () => getContactRoute(contactId).then((res) => res.data),
    enabled: Boolean(userId && contactId),
    placeholderData: placeholder,
  });
};

export const useInteractions = (contactId) => {
  const userId = useUserId();
  return useQuery({
    queryKey: contactKeys.interactions(userId, contactId),
    queryFn: () => listInteractionsRoute(contactId).then((res) => res.data),
    enabled: Boolean(userId && contactId),
  });
};

/** Logging or removing an entry moves the contact's "last contacted", so lists refresh too. */
export const useAddInteraction = (contactId) => {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: (payload) => addInteractionRoute(contactId, payload).then((res) => res.data),
    onSuccess: invalidate,
  });
};

export const useDeleteInteraction = (contactId) => {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: (interactionId) => deleteInteractionRoute(contactId, interactionId),
    onSuccess: invalidate,
  });
};

export const useUpcomingBirthdays = (days = 30) => {
  const userId = useUserId();
  return useQuery({
    queryKey: contactKeys.birthdays(userId, days),
    queryFn: () => upcomingBirthdaysRoute(days).then((res) => res.data),
    enabled: Boolean(userId),
  });
};

// ---- bulk + merge ---------------------------------------------------------

export const useBulkAction = () => {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: ({ ids, action, tags }) => bulkContactsRoute(ids, action, tags).then((res) => res.data),
    onSettled: invalidate,
  });
};

export const useMergeContacts = () => {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: (payload) => mergeContactsRoute(payload).then((res) => res.data),
    onSettled: invalidate,
  });
};
