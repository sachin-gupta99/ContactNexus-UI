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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-bg"></div>
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className={`w-full ${mode === "signup" ? "max-w-4xl" : "max-w-md"}`}>
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-100 mb-2 font-heading tracking-wider">
              Contact Nexus
            </h1>
            {/* <p className="text-white/80">
              {mode === "signin" ? "Welcome back!" : "Join our community"}
            </p> */}
          </div>

          {/* Form Container */}
          <div className="glass rounded-2xl p-8">
            {mode === "signin" && <SignInForm />}
            {mode === "signup" && <SimpleSignUpForm />}
          </div>

          {/* Switch Mode */}
          <div className="text-center mt-6">
            <p className="text-white/80">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => router.navigate(`/auth?mode=${mode === "signin" ? "signup" : "signin"}`)}
                className="ml-2 text-white font-semibold hover:text-blue-200 transition-colors underline"
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
