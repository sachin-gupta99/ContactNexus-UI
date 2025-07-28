import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SignInForm from "../components/SignInForm";
import SimpleSignUpForm from "../components/SimpleSignUpForm";
import { router } from "../App";
import { getBackgroundRoute } from "../api/generalApi";

const Auth = () => {
  const [params] = useSearchParams();
  const mode = params.get("mode");
  const [background, setBackground] = useState("");

  useEffect(() => {
    document.title = "Authentication - Contact Nexus";
  }, []);

  useEffect(() => {
    const func = async () => {
      try {
        const background = await getBackgroundRoute();
        setBackground(background.data.urls.full);
      } catch (error) {
        console.error("Failed to load background");
      }
    };

    func();
  }, []);

  useEffect(() => {
    if (mode !== "signin" && mode !== "signup") {
      router.navigate("/auth?mode=signin");
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Content */}
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className={`w-full ${mode === "signup" ? "max-w-4xl" : "max-w-md"}`}>
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 font-heading tracking-wider">
              Contact Nexus
            </h1>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {mode === "signin" && <SignInForm />}
            {mode === "signup" && <SimpleSignUpForm />}
          </div>

          {/* Switch Mode */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => router.navigate(`/auth?mode=${mode === "signin" ? "signup" : "signin"}`)}
                className="ml-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors underline"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

export const AuthLoader = () => {
  return import("./Auth");
};
