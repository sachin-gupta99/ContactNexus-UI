// Parses .vcf and .csv exports into ContactRequest payloads, entirely in the
// browser so the user sees a preview before anything is sent.
//
// Handles the formats people actually export:
//   - vCard 2.1 (Android), with QUOTED-PRINTABLE values and CHARSET params
//   - vCard 3.0 / 4.0 (iOS, Google, Outlook, this app's own export)
//   - Google Contacts CSV, Outlook CSV, and simple CSVs with name/email/phone columns

export const MAX_BATCH = 500; // mirrors ContactImportRequest.MAX_BATCH on the server

const LIMITS = { bio: 1000, default: 255 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clip = (value, field) => {
  if (value == null) return undefined;
  const v = String(value).trim();
  if (!v) return undefined;
  return v.slice(0, LIMITS[field] ?? LIMITS.default);
};

// ---------------------------------------------------------------- vCard

/** Joins folded lines: 3.0+ folds with CRLF + space/tab, 2.1 QP soft-breaks with a trailing "=". */
const unfold = (text) => {
  const raw = text.replace(/\r\n?/g, "\n").split("\n");
  const lines = [];
  for (const line of raw) {
    const prev = lines.length ? lines[lines.length - 1] : null;
    // QP soft break first: its continuation is literal, so a leading space is content.
    if (prev !== null && /ENCODING=QUOTED-PRINTABLE/i.test(prev.split(":")[0]) && prev.endsWith("=")) {
      lines[lines.length - 1] = prev.slice(0, -1) + line;
    } else if (prev !== null && /^[ \t]/.test(line)) {
      lines[lines.length - 1] = prev + line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
};

const decodeQuotedPrintable = (value, charset = "utf-8") => {
  const bytes = [];
  for (let i = 0; i < value.length; i++) {
    if (value[i] === "=" && /^[0-9A-F]{2}$/i.test(value.slice(i + 1, i + 3))) {
      bytes.push(parseInt(value.slice(i + 1, i + 3), 16));
      i += 2;
    } else {
      bytes.push(value.charCodeAt(i) & 0xff);
    }
  }
  try {
    return new TextDecoder(charset).decode(new Uint8Array(bytes));
  } catch {
    return new TextDecoder("utf-8").decode(new Uint8Array(bytes));
  }
};

const unescapeValue = (v) =>
  v.replace(/\\n/gi, "\n").replace(/\\([,;\\])/g, "$1");

/** Splits on separators that aren't backslash-escaped, then unescapes each part. */
const splitStructured = (v, sep = ";") => {
  const parts = [];
  let current = "";
  for (let i = 0; i < v.length; i++) {
    if (v[i] === "\\" && i + 1 < v.length) {
      current += v[i] + v[i + 1];
      i++;
    } else if (v[i] === sep) {
      parts.push(current);
      current = "";
    } else {
      current += v[i];
    }
  }
  parts.push(current);
  return parts.map(unescapeValue);
};

/** "item1.EMAIL;TYPE=INTERNET;PREF" -> { name: "EMAIL", params: { TYPE: ["INTERNET"], PREF: [] } } */
const parseProperty = (line) => {
  const colon = line.indexOf(":");
  if (colon < 0) return null;
  const [rawName, ...rawParams] = line.slice(0, colon).split(";");
  const name = rawName.replace(/^[^.]*\./, "").toUpperCase(); // drop "item1." group prefix
  const params = {};
  for (const p of rawParams) {
    const [k, v] = p.includes("=") ? p.split("=") : ["TYPE", p]; // 2.1 bare params are types
    params[k.toUpperCase()] = (v || "").split(",").map((x) => x.toUpperCase());
  }
  let value = line.slice(colon + 1);
  if (params.ENCODING?.includes("QUOTED-PRINTABLE")) {
    value = decodeQuotedPrintable(value, params.CHARSET?.[0]?.toLowerCase());
  }
  return { name, params, value };
};

const classifyUrl = (url, target) => {
  const u = url.toLowerCase();
  if (u.includes("github.com")) target.githubUrl ??= url;
  else if (u.includes("linkedin.com")) target.linkedinUrl ??= url;
  else if (u.includes("instagram.com")) target.instagramUrl ??= url;
};

const isPreferred = (params) =>
  params.PREF !== undefined || params.TYPE?.includes("PREF");

const cardToContact = (props) => {
  const c = {};
  let fullName;
  let email;
  let emailPreferred = false;
  let phone;
  let phonePreferred = false;
  let title;
  let note;

  for (const { name, params, value } of props) {
    switch (name) {
      case "N": {
        const [last, first] = splitStructured(value);
        c.lastName ??= last;
        c.firstName ??= first;
        break;
      }
      case "FN":
        fullName ??= unescapeValue(value);
        break;
      case "EMAIL":
        if (!email || (isPreferred(params) && !emailPreferred)) {
          email = unescapeValue(value);
          emailPreferred = isPreferred(params);
        }
        break;
      case "TEL":
        if (!phone || (isPreferred(params) && !phonePreferred)) {
          phone = unescapeValue(value).replace(/^tel:/i, "");
          phonePreferred = isPreferred(params);
        }
        break;
      case "ADR":
        if (!c.city && !c.street) {
          const [, , street, city, state, zip, country] = splitStructured(value);
          Object.assign(c, { street, city, state, zipCode: zip, country });
        }
        break;
      case "NOTE":
        note ??= unescapeValue(value);
        break;
      case "TITLE":
        title ??= unescapeValue(value);
        break;
      case "URL":
      case "X-SOCIALPROFILE":
        classifyUrl(unescapeValue(value), c);
        break;
      default:
        break;
    }
  }

  // Many exports only fill FN; split it so the required first name is present.
  if (!c.firstName && fullName) {
    const [first, ...rest] = fullName.trim().split(/\s+/);
    c.firstName = first;
    c.lastName ||= rest.join(" ");
  }
  c.email = email;
  c.phone = phone;
  c.bio = note || title;
  return c;
};

export const parseVCard = (text) => {
  const contacts = [];
  let props = null;
  for (const line of unfold(text)) {
    if (/^BEGIN:VCARD$/i.test(line.trim())) {
      props = [];
    } else if (/^END:VCARD$/i.test(line.trim())) {
      if (props) contacts.push(cardToContact(props));
      props = null;
    } else if (props) {
      const prop = parseProperty(line);
      if (prop) props.push(prop);
    }
  }
  return contacts;
};

// ---------------------------------------------------------------- CSV

/** RFC 4180: quoted fields, doubled quotes, embedded commas and newlines. */
export const parseCsvRows = (text) => {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, ""); // Excel adds a UTF-8 BOM
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim()));
};

const norm = (h) => h.toLowerCase().replace(/[^a-z0-9]/g, "");

// Header aliases in priority order. Google uses "E-mail 1 - Value", Outlook
// "E-mail Address", hand-made sheets usually "email".
const COLUMNS = {
  firstName: ["firstname", "givenname", "first"],
  lastName: ["lastname", "familyname", "surname", "last"],
  fullName: ["name", "fullname", "displayname"],
  email: ["email", "emailaddress", "email1value", "email1", "primaryemail", "emailaddress1"],
  phone: ["phone", "mobile", "mobilephone", "phone1value", "phonenumber", "primaryphone", "businessphone", "homephone"],
  bio: ["notes", "note", "bio", "description"],
  street: ["street", "address1street", "homestreet", "businessstreet"],
  city: ["city", "address1city", "homecity", "businesscity"],
  state: ["state", "region", "address1region", "homestate", "businessstate"],
  zipCode: ["zip", "zipcode", "postalcode", "pincode", "address1postalcode", "homepostalcode", "businesspostalcode"],
  country: ["country", "address1country", "homecountry", "countryregion", "homecountryregion"],
};

export const parseCsv = (text) => {
  const [header, ...rows] = parseCsvRows(text);
  if (!header) return [];
  const keys = header.map(norm);
  const index = {};
  for (const [field, aliases] of Object.entries(COLUMNS)) {
    const i = aliases.map((a) => keys.indexOf(a)).find((x) => x >= 0);
    if (i !== undefined) index[field] = i;
  }
  const urlCols = keys.map((k, i) => (/(website|webpage|url|linkedin|github|instagram)/.test(k) ? i : -1)).filter((i) => i >= 0);

  return rows.map((r) => {
    const get = (f) => (index[f] !== undefined ? r[index[f]] : undefined);
    const c = {};
    for (const f of Object.keys(COLUMNS)) {
      if (f !== "fullName") c[f] = get(f);
    }
    // Google packs multiple values as "a@x.com ::: b@x.com"; keep the first.
    if (c.email) c.email = c.email.split(":::")[0];
    if (c.phone) c.phone = c.phone.split(":::")[0];
    if (!c.firstName && get("fullName")) {
      const [first, ...rest] = get("fullName").trim().split(/\s+/);
      c.firstName = first;
      c.lastName ||= rest.join(" ");
    }
    urlCols.forEach((i) => r[i] && classifyUrl(r[i].trim(), c));
    return c;
  });
};

// ---------------------------------------------------------------- shared

const FIELDS = [
  "firstName", "lastName", "email", "phone", "bio", "street", "city",
  "state", "country", "zipCode", "githubUrl", "linkedinUrl", "instagramUrl",
];

/**
 * Cleans parsed rows into server-ready payloads and separates out the ones
 * that would fail validation, with a reason the UI can show.
 * @returns {{ valid: object[], invalid: { row: number, reason: string, label: string }[] }}
 */
export const prepareContacts = (parsed) => {
  const valid = [];
  const invalid = [];
  parsed.forEach((raw, i) => {
    const c = {};
    for (const f of FIELDS) {
      const v = clip(raw[f], f);
      if (v !== undefined) c[f] = v;
    }
    if (c.email) c.email = c.email.replace(/^mailto:/i, "");
    // The server requires a first name; fall back to the email's local part.
    if (!c.firstName && c.email) c.firstName = clip(c.email.split("@")[0], "firstName");

    const label = [c.firstName, c.lastName].filter(Boolean).join(" ") || c.email || `Row ${i + 1}`;
    if (!c.email) invalid.push({ row: i + 1, label, reason: "No email address" });
    else if (!EMAIL_RE.test(c.email)) invalid.push({ row: i + 1, label, reason: `Invalid email "${c.email}"` });
    else valid.push(c);
  });
  return { valid, invalid };
};

/** Picks the parser from the file name, falling back to sniffing the content. */
export const parseContactsFile = (name, text) => {
  const isVcf = /\.(vcf|vcard)$/i.test(name) || /^\s*BEGIN:VCARD/i.test(text);
  return prepareContacts(isVcf ? parseVCard(text) : parseCsv(text));
};

export const chunk = (list, size = MAX_BATCH) => {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
};
