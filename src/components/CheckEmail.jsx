import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import { HiMail } from "react-icons/hi";
import { resendVerificationRoute } from "../api/authApi";
import { router } from "../router";

const RESEND_COOLDOWN_S = 60;

/**
 * Shown after signup, after a sign-in with an unconfirmed address, and when a
 * confirmation link is invalid. `reason` tweaks the heading only.
 */
const CheckEmail = ({ reason = "signup", initialEmail }) => {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(initialEmail ?? params.get("email") ?? "");
  const [sending, setSending] = useState(false);
  const [sentAt, setSentAt] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!sentAt) return undefined;
    const tick = () => setCooldown(Math.max(0, RESEND_COOLDOWN_S - Math.floor((Date.now() - sentAt) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sentAt]);

  const resend = async (e) => {
    e.preventDefault();
    if (!email.trim() || cooldown > 0) return;
    setSending(true);
    try {
      await resendVerificationRoute(email.trim());
    } catch {
      // Enumeration-safe on the server; show the same confirmation regardless.
    } finally {
      setSending(false);
      setSentAt(Date.now());
    }
  };

  const heading = {
    signup: "Check your email",
    unverified: "Confirm your email first",
    invalid: "That link didn’t work",
  }[reason];

  const intro = {
    signup: "We sent a confirmation link to",
    unverified: "Your account exists but the address hasn’t been confirmed yet. Use the link we emailed to",
    invalid: "Confirmation links expire after 24 hours and work once. Get a new one sent to",
  }[reason];

  return (
    <div className="w-full text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
        <HiMail className="w-7 h-7 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
        {heading}
      </h2>
      <p className="text-gray-600 mb-6">
        {intro}{" "}
        {email ? <span className="font-semibold text-gray-800">{email}</span> : "your address"}.
        {reason !== "invalid" && " Open it on this device to finish signing in."}
      </p>

      <form onSubmit={resend} className="text-left space-y-3 mb-4">
        {!initialEmail && !params.get("email") && (
          <div>
            <Label htmlFor="resend-email" value="Email address" className="mb-2 block" />
            <TextInput id="resend-email" type="email" icon={HiMail} required
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        )}
        <Button type="submit" color="light" className="w-full" isProcessing={sending} disabled={sending || cooldown > 0}>
          {cooldown > 0 ? `Sent. Resend in ${cooldown}s` : reason === "invalid" ? "Send a new link" : "Resend the link"}
        </Button>
        {sentAt && (
          <p className="text-sm text-gray-500 text-center" role="status">
            If that address has an unconfirmed account, a new link is on its way. Check spam too.
          </p>
        )}
      </form>

      <Button
        onClick={() => router.navigate("/auth?mode=signin")}
        gradientDuoTone="purpleToBlue"
        className="w-full font-semibold"
      >
        Back to sign in
      </Button>
    </div>
  );
};

export default CheckEmail;
