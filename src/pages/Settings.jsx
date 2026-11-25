import React, { useEffect, useState } from "react";
import { Button, Card, Label, Modal, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaSignOutAlt, FaTrash, FaUserEdit } from "react-icons/fa";
import ConfirmModal from "../components/ConfirmModal";
import { changePasswordRoute, logoutAllRoute } from "../api/authApi";
import { deleteAccountRoute } from "../api/userApi";
import { clearAccessToken, setAccessToken } from "../util/tokenStore";
import { userActions } from "../store/user";
import { toastActions } from "../store/toast";
import { router } from "../App";

const MIN_PASSWORD = 8;
const MAX_PASSWORD = 72; // bcrypt ignores everything past 72 bytes

// Validation errors come back as { fields: { name: msg } } with no top-level message.
const errorMessage = (err, fallback) => {
  const data = err.response?.data;
  if (data?.message) return data.message;
  const first = data?.fields && Object.values(data.fields)[0];
  return first || fallback;
};

const Section = ({ title, description, children, danger = false }) => (
  <Card className={`border-0 shadow-lg ${danger ? "ring-1 ring-red-200" : ""}`}>
    <div>
      <h2 className={`text-xl font-bold mb-1 ${danger ? "text-red-600" : "text-gray-900"}`}>{title}</h2>
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  </Card>
);

const Settings = () => {
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    document.title = "Settings - Contact Nexus";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>

        <Section title="Account" description="Your name, photo and details are edited from your profile.">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-sm text-gray-600 truncate">{user?.email}</p>
            </div>
            <Link to="/profile">
              <Button color="light">
                <FaUserEdit className="w-4 h-4 mr-2" />
                Edit profile
              </Button>
            </Link>
          </div>
        </Section>

        <ChangePassword />
        <SignOutEverywhere />
        <DeleteAccount />
      </div>
    </div>
  );
};

export default Settings;

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.next.length < MIN_PASSWORD) return setError(`New password must be at least ${MIN_PASSWORD} characters`);
    if (form.next !== form.confirm) return setError("New passwords don't match");
    if (form.next === form.current) return setError("New password must be different from the current one");

    setBusy(true);
    try {
      const { data } = await changePasswordRoute(form.current, form.next);
      // Every other session was revoked; this one gets fresh tokens.
      setAccessToken(data.accessToken, data.expiresInSeconds);
      dispatch(userActions.setUser(data.user));
      setForm({ current: "", next: "", confirm: "" });
      dispatch(toastActions.setToast({
        message: "Password changed. Other devices have been signed out.",
        type: "success",
      }));
    } catch (err) {
      setError(errorMessage(err, "Could not change password"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      title="Change password"
      description="Changing your password signs you out on every other device. You'll get a confirmation email."
    >
      <form onSubmit={submit}>
        <fieldset disabled={busy} className="space-y-4">
          <div>
            <Label htmlFor="current-password" value="Current password" className="mb-2 block" />
            <TextInput id="current-password" type="password" icon={RiLockPasswordFill} autoComplete="current-password"
              value={form.current} onChange={update("current")} required />
          </div>
          <div>
            <Label htmlFor="new-password" value="New password" className="mb-2 block" />
            <TextInput id="new-password" type="password" icon={RiLockPasswordFill} autoComplete="new-password"
              minLength={MIN_PASSWORD} maxLength={MAX_PASSWORD}
              helperText={`At least ${MIN_PASSWORD} characters`}
              value={form.next} onChange={update("next")} required />
          </div>
          <div>
            <Label htmlFor="confirm-password" value="Confirm new password" className="mb-2 block" />
            <TextInput id="confirm-password" type="password" icon={RiLockPasswordFill} autoComplete="new-password"
              maxLength={MAX_PASSWORD} value={form.confirm} onChange={update("confirm")} required />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <Button type="submit" gradientDuoTone="purpleToBlue" isProcessing={busy}>
            Update password
          </Button>
        </fieldset>
      </form>
    </Section>
  );
};

const signOutLocally = (dispatch) => {
  clearAccessToken();
  dispatch(userActions.clearUser());
};

const SignOutEverywhere = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      await logoutAllRoute();
      signOutLocally(dispatch);
      router.navigate("/auth?mode=signin");
      dispatch(toastActions.setToast({ message: "Signed out on all devices", type: "success" }));
    } catch (err) {
      dispatch(toastActions.setToast({ message: errorMessage(err, "Could not sign out everywhere"), type: "error" }));
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <Section
      title="Sessions"
      description="Lost a device or signed in on a shared computer? End every session, including this one."
    >
      <Button color="light" onClick={() => setOpen(true)}>
        <FaSignOutAlt className="w-4 h-4 mr-2" />
        Sign out of all devices
      </Button>
      <ConfirmModal
        isOpen={open}
        onClose={() => !busy && setOpen(false)}
        onConfirm={confirm}
        title="Sign out everywhere?"
        message="You'll need to sign in again on every device, including this one."
        confirmLabel="Sign out all"
        busy={busy}
      />
    </Section>
  );
};

const DeleteAccount = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    if (busy) return;
    setOpen(false);
    setPassword("");
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await deleteAccountRoute(password);
      // Straight to sign-in, the same place ProtectedRoute sends a signed-out
      // user. Going to /home instead would mount the dashboard with the stale
      // user, its requests would 401, and the interceptor would reload the page.
      signOutLocally(dispatch);
      router.navigate("/auth?mode=signin");
      dispatch(toastActions.setToast({ message: "Your account has been deleted", type: "success" }));
    } catch (err) {
      setError(errorMessage(err, "Could not delete account"));
      setBusy(false);
    }
  };

  return (
    <Section
      danger
      title="Delete account"
      description="Permanently deletes your account, every contact and your profile photo. This can't be undone."
    >
      <Button color="failure" onClick={() => setOpen(true)}>
        <FaTrash className="w-4 h-4 mr-2" />
        Delete my account
      </Button>

      <Modal show={open} onClose={close} size="md" popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={submit} className="text-center">
            <fieldset disabled={busy}>
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Delete your account?</h3>
              <p className="mb-5 text-sm text-gray-500">
                Enter your password to confirm. All of your contacts will be removed permanently.
              </p>
              <div className="text-left mb-4">
                <Label htmlFor="delete-password" value="Password" className="mb-2 block" />
                <TextInput id="delete-password" type="password" autoComplete="current-password" autoFocus
                  value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} required />
                {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
              </div>
              <div className="flex justify-center gap-4">
                <Button type="submit" color="failure" isProcessing={busy}>
                  Delete forever
                </Button>
                <Button type="button" color="gray" onClick={close}>
                  Cancel
                </Button>
              </div>
            </fieldset>
          </form>
        </Modal.Body>
      </Modal>
    </Section>
  );
};
