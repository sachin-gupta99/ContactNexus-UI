import { useEffect, useState } from "react";

/**
 * True once `active` has stayed true for `delayMs`. Used to explain a slow
 * request: Render's free tier cold-starts the API after idle, and the first
 * call can take 30s+.
 */
export const useSlowHint = (active, delayMs = 3000) => {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!active) {
      setSlow(false);
      return undefined;
    }
    const id = setTimeout(() => setSlow(true), delayMs);
    return () => clearTimeout(id);
  }, [active, delayMs]);

  return slow;
};
