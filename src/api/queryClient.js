import { QueryClient } from "@tanstack/react-query";

// 4xx means the request itself is wrong (or the session is gone, which the axios
// interceptor already handles), so retrying can't help. Network errors and 5xx
// get one retry: Render's free tier sometimes drops the first request while it
// wakes up.
const shouldRetry = (failureCount, error) => {
  const status = error?.response?.status;
  if (status && status >= 400 && status < 500) return false;
  return failureCount < 1;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Contacts rarely change behind the user's back; every write invalidates
      // explicitly, so 30s avoids refetching on every page switch.
      staleTime: 30_000,
      retry: shouldRetry,
    },
    mutations: {
      retry: false,
    },
  },
});
