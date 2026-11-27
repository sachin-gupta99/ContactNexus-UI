import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Card, Spinner } from "flowbite-react";
import {
  FaBriefcase, FaDownload, FaEnvelope, FaGithub, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone,
} from "react-icons/fa";
import { publicCardRoute } from "../api/userApi";
import { buildVCard, downloadVCard, shareVCard } from "../util/vcard";

const href = (v, base) => (!v ? null : /^https?:\/\//i.test(v) ? v : `${base}${v.replace(/^@/, "")}`);

/** What someone sees when they open a shared card link or scan its QR code. */
const PublicCard = () => {
  const { token } = useParams();
  const card = useQuery({
    queryKey: ["publicCard", token],
    queryFn: () => publicCardRoute(token).then((res) => res.data),
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    document.title = card.data ? `${card.data.name} - Contact Nexus` : "Contact card - Contact Nexus";
  }, [card.data]);

  if (card.isPending) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Spinner size="xl" /></div>;
  }
  if (card.isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">This card isn’t available</h1>
          <p className="mb-6 text-gray-600">The link may be mistyped, or its owner turned it off or replaced it.</p>
          <Link to="/home"><Button gradientDuoTone="purpleToBlue" className="mx-auto">Go to Contact Nexus</Button></Link>
        </div>
      </div>
    );
  }

  const c = card.data;
  const [firstName, ...rest] = c.name.trim().split(/\s+/);
  const address = [c.street, c.area, c.city, c.state, c.pincode].filter(Boolean).join(", ");
  const vcard = () => buildVCard({
    fullName: c.name, firstName, lastName: rest.join(" "), email: c.email, phone: c.phone, title: c.work,
    note: c.bioDescription,
    address: { street: [c.street, c.area].filter(Boolean).join(", "), city: c.city, state: c.state, zip: c.pincode },
    urls: [href(c.github, "https://github.com/"), href(c.linkedin, "https://www.linkedin.com/in/"), href(c.instagram, "https://instagram.com/")],
  });
  const save = async () => {
    const result = await shareVCard(vcard(), c.name);
    if (result === "cancelled") downloadVCard(vcard(), c.name);
  };

  const rows = [
    c.work && { icon: FaBriefcase, text: c.work },
    c.email && { icon: FaEnvelope, text: c.email, href: `mailto:${c.email}` },
    c.phone && { icon: FaPhone, text: c.phone, href: `tel:${c.phone}` },
    address && { icon: FaMapMarkerAlt, text: address },
  ].filter(Boolean);
  const socials = [
    c.github && { icon: FaGithub, label: "GitHub", url: href(c.github, "https://github.com/") },
    c.linkedin && { icon: FaLinkedin, label: "LinkedIn", url: href(c.linkedin, "https://www.linkedin.com/in/") },
    c.instagram && { icon: FaInstagram, label: "Instagram", url: href(c.instagram, "https://instagram.com/") },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      <Card className="mx-auto max-w-md border-0 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* `bordered` rings the circle itself; a ring class would land on Avatar's square wrapper. */}
          <Avatar img={c.photoUrl || undefined} placeholderInitials={c.name.charAt(0).toUpperCase()} rounded bordered
            color="purple" size="xl" className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">{c.name}</h1>
          {c.bioHeading && <p className="mt-1 font-medium text-purple-700">{c.bioHeading}</p>}
          {c.bioDescription && <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{c.bioDescription}</p>}
        </div>

        {rows.length > 0 && (
          <ul className="mt-6 space-y-3">
            {rows.map(({ icon: Icon, text, href: link }) => (
              <li key={text} className="flex items-center gap-3 text-gray-800">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <Icon className="h-4 w-4" />
                </span>
                {link ? <a href={link} className="break-all hover:underline">{text}</a> : <span className="break-words">{text}</span>}
              </li>
            ))}
          </ul>
        )}

        {socials.length > 0 && (
          <div className="mt-4 flex justify-center gap-3">
            {socials.map(({ icon: Icon, label, url }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        )}

        <Button gradientDuoTone="purpleToBlue" className="mt-6 w-full" onClick={save}>
          <FaDownload className="mr-2 h-4 w-4" /> Save contact
        </Button>
        <p className="mt-4 text-center text-xs text-gray-500">
          Shared with <Link to="/home" className="font-medium text-purple-700 hover:underline">Contact Nexus</Link>.{" "}
          <Link to="/auth?mode=signup" className="hover:underline">Make your own card</Link>
        </p>
      </Card>
    </div>
  );
};

export default PublicCard;
