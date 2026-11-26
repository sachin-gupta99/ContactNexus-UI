import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  contactStatsRoute,
  createContactRoute,
  deleteContactRoute,
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
};

const useUserId = () => useSelector((state) => state.user?.user?.id);

const DEFAULT_LIST = { q: "", page: 0, size: 12, sort: "firstName,asc", favorite: false };

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

/** Lists and stats are all derived from the same rows, so any write refreshes them all. */
const useInvalidateContacts = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();
  return () => queryClient.invalidateQueries({ queryKey: contactKeys.all(userId) });
};

export const useSaveContact = () => {
  const invalidate = useInvalidateContacts();
  return useMutation({
    mutationFn: ({ id, payload }) =>
      (id ? updateContactRoute(id, payload) : createContactRoute(payload)).then((res) => res.data),
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
