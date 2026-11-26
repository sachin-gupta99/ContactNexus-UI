import { listContactsRoute } from "../api/contactApi";
import { buildVCard, contactToCard, downloadVCard } from "./vcard";

const BATCH = 100;

/** Pages through every contact, downloads one multi-card .vcf, returns the count. */
export const exportAllContacts = async () => {
  const all = [];
  for (let page = 0; ; page++) {
    const { data } = await listContactsRoute({ page, size: BATCH, sort: "firstName,asc" });
    all.push(...data.content);
    if (!data.hasNext) break;
  }
  if (all.length) {
    downloadVCard(all.map((c) => buildVCard(contactToCard(c))).join("\r\n"), "ContactNexus_contacts");
  }
  return all.length;
};
