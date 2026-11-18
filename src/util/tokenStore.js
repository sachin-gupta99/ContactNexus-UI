// In-memory access token. Deliberately NOT in localStorage: short-lived JWTs are
// the only thing JS holds, and keeping them out of persistent storage means an
// XSS can't scrape them on load. The long-lived refresh token lives in an
// HttpOnly cookie set by the server and JS can't see it.

let accessToken = null;
let expiresAtMs = 0;

export const setAccessToken = (token, expiresInSeconds) => {
  accessToken = token || null;
  expiresAtMs = token ? Date.now() + Number(expiresInSeconds || 0) * 1000 : 0;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
  expiresAtMs = 0;
};

// Treated as expired a few seconds early so a request doesn't fly out with a
// token that dies in transit.
const EXPIRY_LEEWAY_MS = 5_000;
export const isAccessTokenExpired = () => !accessToken || Date.now() + EXPIRY_LEEWAY_MS >= expiresAtMs;
