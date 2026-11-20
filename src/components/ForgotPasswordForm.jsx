import { useRef, useState } from "react";
import { HiMail } from "react-icons/hi";
import { Button, Label, TextInput } from "flowbite-react";
import { forgotPasswordRoute } from "../api/authApi";
import { router } from "../App";

const ForgotPasswordForm = () => {
  const emailRef = useRef();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current?.value?.trim();
    if (!email) return;

    setLoading(true);
    try {
      await forgotPasswordRoute(email);
    } catch {
      // Enumeration-safe: the server returns 200 for unknown emails too, so a
      // real error here is network-level. Still show the same confirmation so
      // we don't leak "the backend is down vs this email isn't registered".
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="w-full text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Check your email
        </h2>
        <p className="text-gray-600 mb-6">
          If an account exists for that address, we&apos;ve sent a link to reset the password.
          The link expires in 30 minutes.
        </p>
        <Button
          onClick={() => router.navigate("/auth?mode=signin")}
          gradientDuoTone="purpleToBlue"
          className="w-full font-semibold"
          size="lg"
        >
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Forgot your password?
        </h2>
        <p className="text-gray-600">Enter your email and we&apos;ll send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email address" className="text-gray-700 font-medium" />
          </div>
          <TextInput
            ref={emailRef}
            id="email"
            type="email"
            icon={HiMail}
            placeholder="you@example.com"
            required
          />
        </div>

        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          className="w-full font-semibold"
          size="lg"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
