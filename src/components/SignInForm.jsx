import { useRef, useState } from "react";
import { HiMail } from "react-icons/hi";
import { RiLockPasswordFill } from "react-icons/ri";
import { Button, Label, TextInput } from "flowbite-react";
import { loginRoute } from "../api/authApi";
import { setAccessToken } from "../util/tokenStore";
import { router } from "../App";
import { useDispatch } from "react-redux";
import { toastActions } from "../store/toast";
import { userActions } from "../store/user";
import { useSlowHint } from "../util/useSlowHint";

const SignInForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const slow = useSlowHint(submitting);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (submitting) return;
      setSubmitting(true);

      const email = emailRef.current.value;
      const password = passwordRef.current.value;

      const response = await loginRoute({ email, password });

      if (response?.data?.accessToken) {
        setAccessToken(response.data.accessToken, response.data.expiresInSeconds);
        dispatch(userActions.setUser(response.data.user));
        dispatch(userActions.setAuthReady(true));
        router.navigate("/home");
        dispatch(
          toastActions.setToast({
            message: "Successfully logged in",
            type: "success",
          })
        );
      } else {
        dispatch(
          toastActions.setToast({
            message: "Something went wrong",
            type: "error",
          })
        );
      }
    } catch (error) {
      // Prefer the server's own message so 429 ("Too many requests. Try again
      // in N seconds.") and other explicit errors reach the user. Falls back
      // to the generic one only when the server didn't send a body.
      const message = error.response?.data?.message || "Invalid credentials";
      dispatch(toastActions.setToast({ message, type: "error" }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome back
        </h2>
        <p className="text-gray-600">Sign in to your account to continue</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <fieldset disabled={submitting} className="space-y-6">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email address" className="text-gray-700 font-medium" />
          </div>
          <TextInput
            ref={emailRef}
            id="email"
            type="email"
            icon={HiMail}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password" className="text-gray-700 font-medium" />
          </div>
          <TextInput
            ref={passwordRef}
            id="password"
            type="password"
            icon={RiLockPasswordFill}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => router.navigate("/auth?mode=forgot")}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Forgot your password?
          </button>
        </div>

        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          className="w-full font-semibold"
          size="lg"
          isProcessing={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
        {slow && (
          <p className="text-center text-sm text-gray-500" role="status">
            Still working. The server may be waking up, which can take up to 30 seconds.
          </p>
        )}
        </fieldset>
      </form>
    </div>
  );
};

export default SignInForm;
