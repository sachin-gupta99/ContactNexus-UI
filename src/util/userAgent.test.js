import { describe, expect, it } from "vitest";
import { describeUserAgent } from "./userAgent";
import { timeAgo } from "./time";

describe("describeUserAgent", () => {
  it.each([
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", "Chrome on Windows", false],
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0", "Edge on Windows", false],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15", "Safari on macOS", false],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1", "Safari on iOS", true],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0 Mobile/15E148 Safari/604.1", "Chrome on iOS", true],
    ["Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36", "Chrome on Android", true],
    ["Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0 Mobile Safari/537.36", "Samsung Internet on Android", true],
    ["Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0", "Firefox on Linux", false],
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36 OPR/115.0", "Opera on Windows", false],
    ["curl/8.12.1", "curl", false],
  ])("%s", (ua, label, mobile) => {
    expect(describeUserAgent(ua)).toMatchObject({ label, mobile });
  });

  it("handles a missing user agent", () => {
    expect(describeUserAgent(null).label).toBe("Unknown device");
  });
});

describe("timeAgo", () => {
  const now = Date.parse("2026-01-10T12:00:00Z");
  it("formats past times relative to now", () => {
    expect(timeAgo("2026-01-10T11:59:30Z", now)).toBe("just now");
    expect(timeAgo("2026-01-10T10:00:00Z", now)).toMatch(/2 hours ago/);
    expect(timeAgo("2026-01-09T12:00:00Z", now)).toMatch(/yesterday|1 day ago/);
  });
});
