import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Spinner } from "flowbite-react";
import { verifyEmailRoute } from "../api/authApi";
import { setAccessToken } from "../util/tokenStore";
import { userActions } from "../store/user";
import { toastActions } from "../store/toast";
import { router } from "../router";
import CheckEmail from "./CheckEmail";

/** Landing page for the link in the confirmation email: verifies, then signs in. */
const VerifyEmail = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const dispatch = useDispatch();
  const [failed, setFailed] = useState(false);
  // StrictMode runs effects twice in development; the token is single-use, so
  // a second call would turn a success into "link already used".
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!token) {
      setFailed(true);
      return;
    }
    verifyEmailRoute(token)
      .then(({ data }) => {
        setAccessToken(data.accessToken, data.expiresInSeconds);
        dispatch(userActions.setUser(data.user));
        dispatch(userActions.setAuthReady(true));
        router.navigate("/home", { replace: true });
        dispatch(toastActions.setToast({ message: "Email confirmed. Welcome to Contact Nexus!", type: "success" }));
      })
      .catch(() => setFailed(true));
  }, [token, dispatch]);

  if (failed) return <CheckEmail reason="invalid" />;

  return (
    <div className="w-full text-center py-6" role="status">
      <Spinner size="xl" className="mb-4" />
      <p className="text-gray-600">Confirming your email…</p>
    </div>
  );
};

export default VerifyEmail;
