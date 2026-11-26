const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

const STEPS = [
  ["year", 31_536_000], ["month", 2_592_000], ["week", 604_800],
  ["day", 86_400], ["hour", 3_600], ["minute", 60],
];

/** "3 hours ago", "yesterday", "just now". Accepts an ISO string or Date. */
export const timeAgo = (value, now = Date.now()) => {
  const seconds = (new Date(value).getTime() - now) / 1000;
  for (const [unit, size] of STEPS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return "just now";
};
