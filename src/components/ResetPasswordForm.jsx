import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { Button, Label, TextInput } from "flowbite-react";
import { useDispatch } from "react-redux";
import { resetPasswordRoute } from "../api/authApi";
import { toastActions } from "../store/toast";
import { router } from "../router";

const ResetPasswordForm = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const passwordRef = useRef();
  const confirmRef = useRef();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const dispatch = useDispatch();

  if (!token) {
    return (
      <div className="w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-3">Missing reset token</h2>
        <p className="text-gray-600 mb-6">
          This page needs a valid reset link. Request a new one if yours expired.
        </p>
        <Button
          onClick={() => router.navigate("/auth?mode=forgot")}
          gradientDuoTone="purpleToBlue"
          className="w-full font-semibold"
          size="lg"
        >
          Request a new link
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = passwordRef.current?.value;
    const confirm = confirmRef.current?.value;

    if (!password || password.length < 8) {
      dispatch(toastActions.setToast({ message: "Password must be at least 8 characters", type: "error" }));
      return;
    }
    if (password !== confirm) {
      dispatch(toastActions.setToast({ message: "Passwords do not match", type: "error" }));
      return;
    }

    setLoading(true);
    try {
      await resetPasswordRoute(token, password);
      setDone(true);
      dispatch(toastActions.setToast({ message: "Password updated. Please sign in.", type: "success" }));
    } catch (err) {
      const msg = err.response?.data?.message || "This reset link is invalid or has expired.";
      dispatch(toastActions.setToast({ message: msg, type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="w-full text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Password updated
        </h2>
        <p className="text-gray-600 mb-6">
          Every active session for this account has been signed out. Sign in again with your new password.
        </p>
        <Button
          onClick={() => router.navigate("/auth?mode=signin")}
          gradientDuoTone="purpleToBlue"
          className="w-full font-semibold"
          size="lg"
        >
          Go to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Set a new password
        </h2>
        <p className="text-gray-600">Choose something you don&apos;t use anywhere else.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="New password" className="text-gray-700 font-medium" />
          </div>
          <TextInput
            ref={passwordRef}
            id="password"
            type="password"
            icon={RiLockPasswordFill}
            placeholder="At least 8 characters"
            required
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="confirm" value="Confirm new password" className="text-gray-700 font-medium" />
          </div>
          <TextInput
            ref={confirmRef}
            id="confirm"
            type="password"
            icon={RiLockPasswordFill}
            placeholder="Repeat it"
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
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
