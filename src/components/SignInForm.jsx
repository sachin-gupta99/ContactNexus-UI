import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { HiMail, HiEye, HiEyeOff } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import logo_red from "../assets/logo_red.png";
import TextField from "./TextField";
import { loginRoute } from "../api/authApi";
import { setAuthToken } from "../util/helper";
import { router } from "../App";
import { useDispatch } from "react-redux";
import { toastActions } from "../store/toast";
import { userActions } from "../store/user";

const SignInForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      dispatch(
        toastActions.setToast({
          message: "Signing in...",
          type: "info",
        })
      );

      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const response = await loginRoute(formData);
    
      if (response?.data?.data?.token) {
        setAuthToken(response?.data?.data?.token);
        router.navigate("/home");
        dispatch(
          toastActions.setToast({
            message: "Successfully logged in",
            type: "success",
          })
        );
        dispatch(userActions.setUser(response?.data?.data));
      } else {
        dispatch(
          toastActions.setToast({
            message: "Something went wrong",
            type: "error",
          })
        );
        emailRef.current.value = "";
        passwordRef.current.value = "";
      }
    } catch (error) {
      dispatch(
        toastActions.setToast({ message: "Invalid credentials", type: "error" })
      );
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <img src={logo_red} alt="Contact Nexus" className="h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiLockPasswordFill className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={passwordRef}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Forgot your password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Sign in
        </button>

        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <Link 
            to="/auth?mode=signup" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
