import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SignInForm from "../components/SignInForm";
import SimpleSignUpForm from "../components/SimpleSignUpForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";
import CheckEmail from "../components/CheckEmail";
import VerifyEmail from "../components/VerifyEmail";
import { router } from "../router";

const VALID_MODES = ["signin", "signup", "forgot", "reset", "verify", "check-email"];

const Auth = () => {
  const [params] = useSearchParams();
  const mode = params.get("mode");

  useEffect(() => {
    document.title = "Authentication - Contact Nexus";
  }, []);

  useEffect(() => {
    if (!VALID_MODES.includes(mode)) {
      router.navigate("/auth?mode=signin");
    }
  }, [mode]);

  const switchFooter = (() => {
    if (mode === "signin") {
      return (
        <>
          Don&apos;t have an account?
          <button
            onClick={() => router.navigate("/auth?mode=signup")}
            className="ml-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors underline"
          >
            Sign up
          </button>
        </>
      );
    }
    if (mode === "signup") {
      return (
        <>
          Already have an account?
          <button
            onClick={() => router.navigate("/auth?mode=signin")}
            className="ml-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors underline"
          >
            Sign in
          </button>
        </>
      );
    }
    if (mode === "forgot" || mode === "reset" || mode === "verify" || mode === "check-email") {
      return (
        <>
          Remembered it?
          <button
            onClick={() => router.navigate("/auth?mode=signin")}
            className="ml-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors underline"
          >
            Back to sign in
          </button>
        </>
      );
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className={`w-full ${mode === "signup" ? "max-w-4xl" : "max-w-md"}`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 font-heading tracking-wider">
              Contact Nexus
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {mode === "signin" && <SignInForm />}
            {mode === "signup" && <SimpleSignUpForm />}
            {mode === "forgot" && <ForgotPasswordForm />}
            {mode === "reset" && <ResetPasswordForm />}
            {mode === "verify" && <VerifyEmail />}
            {mode === "check-email" && <CheckEmail reason={params.get("reason") || "signup"} />}
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">{switchFooter}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
