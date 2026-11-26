// Just enough User-Agent parsing to label a device ("Chrome on Windows").
// Order matters: Edge and Opera include "Chrome", and Chrome includes "Safari".

const BROWSERS = [
  [/Edg(e|A|iOS)?\//, "Edge"],
  [/OPR\/|Opera/, "Opera"],
  [/SamsungBrowser\//, "Samsung Internet"],
  [/Firefox\/|FxiOS\//, "Firefox"],
  [/Chrome\/|CriOS\//, "Chrome"],
  [/Safari\//, "Safari"],
];

const SYSTEMS = [
  [/Windows/, "Windows"],
  [/iPhone|iPad|iPod/, "iOS"],
  [/Android/, "Android"],
  [/Mac OS X|Macintosh/, "macOS"],
  [/CrOS/, "ChromeOS"],
  [/Linux/, "Linux"],
];

const match = (ua, table) => table.find(([re]) => re.test(ua))?.[1];

/**
 * @returns {{ label: string, browser?: string, os?: string, mobile: boolean }}
 */
export const describeUserAgent = (ua) => {
  if (!ua) return { label: "Unknown device", mobile: false };
  const browser = match(ua, BROWSERS);
  const os = match(ua, SYSTEMS);
  const mobile = /Mobi|iPhone|Android/.test(ua);
  let label;
  if (browser && os) label = `${browser} on ${os}`;
  else if (browser || os) label = browser || os;
  else label = ua.split(/[\s/]/)[0] || "Unknown device"; // e.g. "curl", "okhttp"
  return { label, browser, os, mobile };
};
