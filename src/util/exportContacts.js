import { listContactsRoute } from "../api/contactApi";
import { buildVCard, contactToCard, downloadVCard } from "./vcard";

const BATCH = 100;

/**
 * Pages through every contact (or only those with `tag`), downloads one
 * multi-card .vcf, and returns the count.
 */
export const exportAllContacts = async ({ tag = "" } = {}) => {
  const all = [];
  for (let page = 0; ; page++) {
    const { data } = await listContactsRoute({ page, size: BATCH, sort: "firstName,asc", tag });
    all.push(...data.content);
    if (!data.hasNext) break;
  }
  if (all.length) {
    const name = tag ? `ContactNexus_${tag}` : "ContactNexus_contacts";
    downloadVCard(all.map((c) => buildVCard(contactToCard(c))).join("\r\n"), name);
  }
  return all.length;
};
