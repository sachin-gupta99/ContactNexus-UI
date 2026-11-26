import { describe, expect, it } from "vitest";
import {
  chunk, cleanTags, parseContactsFile, parseCsv, parseCsvRows, parseVCard, prepareContacts,
} from "./importContacts";
import { buildVCard, contactToCard } from "./vcard";

const crlf = (lines) => lines.join("\r\n");

describe("parseVCard", () => {
  it("reads an Android vCard 2.1 export with quoted-printable UTF-8", () => {
    const text = crlf([
      "BEGIN:VCARD",
      "VERSION:2.1",
      "N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:M=C3=BCller;J=C3=BCrgen;;;",
      "FN;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:J=C3=BCrgen M=C3=BCller",
      "TEL;CELL:+49 151 2345678",
      "EMAIL;HOME:jurgen@example.de",
      "NOTE;ENCODING=QUOTED-PRINTABLE:Met at the=0Aconference, Berlin=",
      " 2024",
      "END:VCARD",
    ]);
    const [c] = parseVCard(text);
    expect(c.firstName).toBe("Jürgen");
    expect(c.lastName).toBe("Müller");
    expect(c.phone).toBe("+49 151 2345678");
    expect(c.email).toBe("jurgen@example.de");
    expect(c.bio).toBe("Met at the\nconference, Berlin 2024");
  });

  it("reads an iOS vCard 3.0 with groups, folding, PREF and social URLs", () => {
    const text = crlf([
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Patel;Priya;;;",
      "FN:Priya Patel",
      "item1.EMAIL;type=INTERNET;type=WORK:priya.work@example.com",
      "item2.EMAIL;type=INTERNET;type=HOME;type=pref:priya@example.com",
      "TEL;type=CELL;type=VOICE;type=pref:+91 98765 43210",
      "TEL;type=WORK:+91 22 1234 5678",
      "item3.ADR;type=HOME:;;12 MG Road\\, Flat 4;Pune;MH;411001;India",
      "NOTE:A very long note that is folded ",
      " across two lines",
      "URL:https://github.com/priya",
      "X-SOCIALPROFILE;type=linkedin:https://www.linkedin.com/in/priya",
      "END:VCARD",
    ]);
    const [c] = parseVCard(text);
    expect(c).toMatchObject({
      firstName: "Priya",
      lastName: "Patel",
      email: "priya@example.com",
      phone: "+91 98765 43210",
      street: "12 MG Road, Flat 4",
      city: "Pune",
      state: "MH",
      zipCode: "411001",
      country: "India",
      bio: "A very long note that is folded across two lines",
      githubUrl: "https://github.com/priya",
      linkedinUrl: "https://www.linkedin.com/in/priya",
    });
  });

  it("splits FN when N is missing and reads multiple cards", () => {
    const text = crlf([
      "BEGIN:VCARD", "VERSION:4.0", "FN:Ada King Lovelace", "EMAIL:ada@example.com", "END:VCARD",
      "BEGIN:VCARD", "VERSION:4.0", "FN:Alan", "TEL:tel:+44-20-1234", "EMAIL:alan@example.com", "END:VCARD",
    ]);
    const cards = parseVCard(text);
    expect(cards).toHaveLength(2);
    expect(cards[0]).toMatchObject({ firstName: "Ada", lastName: "King Lovelace" });
    expect(cards[1]).toMatchObject({ firstName: "Alan", phone: "+44-20-1234" });
  });

  it("round-trips this app's own export", () => {
    const original = {
      firstName: "Zoe", lastName: "Lee", email: "zoe@example.com", phone: "555 123",
      bio: "Likes; commas, and\nnewlines", city: "Pune", country: "India",
      githubUrl: "https://github.com/zoe",
    };
    const [c] = parseVCard(buildVCard(contactToCard(original)));
    expect(c).toMatchObject(original);
  });
});

describe("parseCsvRows", () => {
  it("handles quotes, doubled quotes, embedded commas/newlines, CRLF and a BOM", () => {
    const rows = parseCsvRows('\uFEFFname,note\r\n"Lee, Zoe","She said ""hi""\nthen left"\r\n\r\nBob,plain\r\n');
    expect(rows).toEqual([
      ["name", "note"],
      ["Lee, Zoe", 'She said "hi"\nthen left'],
      ["Bob", "plain"],
    ]);
  });
});

describe("parseCsv", () => {
  it("maps a Google Contacts export", () => {
    const text = [
      "First Name,Middle Name,Last Name,E-mail 1 - Label,E-mail 1 - Value,Phone 1 - Label,Phone 1 - Value,Address 1 - City,Notes",
      'Ravi,,Kumar,* Home,ravi@example.com ::: ravi.k@example.com,Mobile,+91 90000 00000,Mumbai,"Old friend"',
    ].join("\n");
    const [c] = parseCsv(text);
    expect(c).toMatchObject({
      firstName: "Ravi", lastName: "Kumar", email: "ravi@example.com ",
      phone: "+91 90000 00000", city: "Mumbai", bio: "Old friend",
    });
  });

  it("maps an Outlook export", () => {
    const text = [
      "First Name,Last Name,E-mail Address,Mobile Phone,Business City,Web Page",
      "Sam,Ng,sam@example.com,555-0100,Seattle,https://linkedin.com/in/samng",
    ].join("\n");
    const [c] = parseCsv(text);
    expect(c).toMatchObject({
      firstName: "Sam", lastName: "Ng", email: "sam@example.com",
      phone: "555-0100", city: "Seattle", linkedinUrl: "https://linkedin.com/in/samng",
    });
  });

  it("splits a single Name column", () => {
    const [c] = parseCsv("Name,Email\nMary Jane Watson,mj@example.com");
    expect(c).toMatchObject({ firstName: "Mary", lastName: "Jane Watson", email: "mj@example.com" });
  });
});

describe("prepareContacts", () => {
  it("separates rows the server would reject and explains why", () => {
    const { valid, invalid } = prepareContacts([
      { firstName: "Ok", email: " ok@example.com " },
      { firstName: "NoEmail" },
      { firstName: "Bad", email: "not-an-email" },
      { email: "mailto:noname@example.com" },
    ]);
    expect(valid).toEqual([
      { firstName: "Ok", email: "ok@example.com" },
      { firstName: "noname", email: "noname@example.com" },
    ]);
    expect(invalid).toEqual([
      { row: 2, label: "NoEmail", reason: "No email address" },
      { row: 3, label: "Bad", reason: 'Invalid email "not-an-email"' },
    ]);
  });

  it("clips values to the server's column limits and drops blanks", () => {
    const { valid: [c] } = prepareContacts([
      { firstName: "x".repeat(300), email: "a@example.com", bio: "y".repeat(1200), city: "   " },
    ]);
    expect(c.firstName).toHaveLength(255);
    expect(c.bio).toHaveLength(1000);
    expect(c).not.toHaveProperty("city");
  });
});

describe("parseContactsFile", () => {
  it("sniffs vCard content even without a .vcf extension", () => {
    const { valid } = parseContactsFile("contacts.txt", "BEGIN:VCARD\nFN:A B\nEMAIL:a@example.com\nEND:VCARD");
    expect(valid).toEqual([{ firstName: "A", lastName: "B", email: "a@example.com" }]);
  });
});

describe("chunk", () => {
  it("splits into server-sized batches", () => {
    expect(chunk(Array.from({ length: 1201 }, (_, i) => i)).map((c) => c.length)).toEqual([500, 500, 201]);
  });
});

const NL = String.fromCharCode(10);

describe("tags", () => {
  it("round-trips tags through vCard CATEGORIES, including commas in names", () => {
    const original = { firstName: "Tia", email: "tia@example.com", tags: ["Work", "Friends, close"] };
    const [c] = parseVCard(buildVCard(contactToCard(original)));
    expect(c.tags).toEqual(["Work", "Friends, close"]);
  });

  it("reads Google Labels and skips system labels like * myContacts", () => {
    const text = "First Name,E-mail 1 - Value,Labels" + NL + "Ravi,ravi@example.com,* myContacts ::: Family ::: Work" + NL;
    const { valid: [c] } = prepareContacts(parseCsv(text));
    expect(c.tags).toEqual(["Family", "Work"]);
  });

  it("reads the older Group Membership column", () => {
    const [c] = parseCsv("Name,E-mail Address,Group Membership" + NL + "Sam Ng,sam@example.com,* Starred ::: Clients" + NL);
    expect(c.tags).toEqual(["Clients"]);
  });

  it("cleanTags applies the server's rules", () => {
    expect(cleanTags(["  Work ", "work", "Close   friends", "", "x".repeat(40)]))
      .toEqual(["Work", "Close friends", "x".repeat(30)]);
    expect(cleanTags(Array.from({ length: 12 }, (_, i) => `t${i}`))).toHaveLength(10);
  });

  it("omits the tags field when there are none", () => {
    const { valid: [c] } = prepareContacts([{ firstName: "A", email: "a@example.com", tags: [] }]);
    expect(c).not.toHaveProperty("tags");
  });
});
