// vCard 3.0 builder plus share/download helpers. 3.0 rather than 4.0 because
// it is what iOS Contacts, Google Contacts and Outlook all import reliably.

const esc = (value) =>
  String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

/**
 * @param {object} c normalised card: { firstName, lastName, fullName, email, phone,
 *   title, note, address: { street, city, state, zip, country }, urls: string[] }
 */
export const buildVCard = (c) => {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];
  const fullName = c.fullName || [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email || "Contact";
  lines.push(`N:${esc(c.lastName)};${esc(c.firstName || fullName)};;;`);
  lines.push(`FN:${esc(fullName)}`);
  if (c.title) lines.push(`TITLE:${esc(c.title)}`);
  if (c.email) lines.push(`EMAIL;TYPE=INTERNET:${esc(c.email)}`);
  if (c.phone) lines.push(`TEL;TYPE=CELL:${esc(c.phone)}`);
  const a = c.address || {};
  if (a.street || a.city || a.state || a.zip || a.country) {
    lines.push(`ADR;TYPE=HOME:;;${esc(a.street)};${esc(a.city)};${esc(a.state)};${esc(a.zip)};${esc(a.country)}`);
  }
  (c.urls || []).filter(Boolean).forEach((u) => lines.push(`URL:${esc(u)}`));
  if (c.note) lines.push(`NOTE:${esc(c.note)}`);
  // Tags become vCard categories: Apple and Google Contacts show them as groups/labels.
  if (c.categories?.length) lines.push(`CATEGORIES:${c.categories.map(esc).join(",")}`);
  lines.push("END:VCARD");
  // RFC 2426 wants CRLF line endings.
  return lines.join("\r\n");
};

/** Maps a ContactResponse from the API. */
export const contactToCard = (c) => ({
  firstName: c.firstName,
  lastName: c.lastName,
  email: c.email,
  phone: c.phone,
  note: c.bio,
  address: { street: c.street, city: c.city, state: c.state, zip: c.zipCode, country: c.country },
  urls: [c.githubUrl, c.linkedinUrl, c.instagramUrl],
  categories: c.tags,
});

/** Maps the signed-in user (UserResponse) to a card. */
export const userToCard = (u) => {
  const p = u?.profile || {};
  const [firstName, ...rest] = (u?.name || "").trim().split(/\s+/);
  return {
    fullName: u?.name,
    firstName,
    lastName: rest.join(" "),
    email: u?.email,
    phone: p.phone,
    title: p.work,
    note: p.bioDescription,
    address: {
      street: [p.street, p.area].filter(Boolean).join(", "),
      city: p.city,
      state: p.state,
      zip: p.pincode,
    },
    urls: [p.github, p.linkedin, p.instagram],
  };
};

const safeFileName = (name) =>
  (name || "contact").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "_") || "contact";

export const downloadVCard = (text, name) => {
  const blob = new Blob([text], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeFileName(name)}.vcf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/**
 * Uses the native share sheet where files can be shared (mostly mobile),
 * otherwise downloads the .vcf.
 * @returns {"shared" | "downloaded" | "cancelled"}
 */
export const shareVCard = async (text, name) => {
  const file = new File([text], `${safeFileName(name)}.vcf`, { type: "text/vcard" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      return "shared";
    } catch (err) {
      if (err?.name === "AbortError") return "cancelled";
      // Fall through to a download if the share sheet fails for another reason.
    }
  }
  downloadVCard(text, name);
  return "downloaded";
};
