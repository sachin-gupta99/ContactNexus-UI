import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button, Spinner } from "flowbite-react";
import { FaDesktop, FaMobileAlt, FaSignOutAlt } from "react-icons/fa";
import ConfirmModal from "./ConfirmModal";
import { listSessionsRoute, logoutAllRoute, revokeSessionRoute } from "../api/authApi";
import { describeUserAgent } from "../util/userAgent";
import { timeAgo } from "../util/time";
import { endSession } from "../util/session";
import { toastActions } from "../store/toast";
import { router } from "../router";

const sessionKeys = (userId) => ["sessions", userId];

/**
 * Every device currently signed in (one refresh-token family each), with a
 * per-device sign-out and a sign-out-everywhere fallback. No location is shown:
 * that would mean sending visitors' IPs to a third-party geolocation service.
 */
const ActiveSessions = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userId = useSelector((state) => state.user?.user?.id);
  const [confirmAll, setConfirmAll] = useState(false);
  const [target, setTarget] = useState(null); // session to sign out

  const toast = (message, type = "success") => dispatch(toastActions.setToast({ message, type }));

  const sessions = useQuery({
    queryKey: sessionKeys(userId),
    queryFn: () => listSessionsRoute().then((res) => res.data),
    enabled: Boolean(userId),
    staleTime: 0, // "last active" should be fresh whenever Settings opens
  });

  const signOutHere = (message) => {
    endSession(dispatch);
    router.navigate("/auth?mode=signin");
    toast(message);
  };

  const revoke = useMutation({
    mutationFn: (session) => revokeSessionRoute(session.id),
    onSuccess: (_res, session) => {
      setTarget(null);
      if (session.current) {
        signOutHere("Signed out of this device");
        return;
      }
      toast(`Signed out ${describeUserAgent(session.userAgent).label}`);
      queryClient.invalidateQueries({ queryKey: sessionKeys(userId) });
    },
    onError: (err) => {
      setTarget(null);
      toast(err.response?.data?.message || "Could not sign that device out", "error");
      queryClient.invalidateQueries({ queryKey: sessionKeys(userId) });
    },
  });

  const revokeAll = useMutation({
    mutationFn: () => logoutAllRoute(),
    onSuccess: () => signOutHere("Signed out on all devices"),
    onError: (err) => {
      setConfirmAll(false);
      toast(err.response?.data?.message || "Could not sign out everywhere", "error");
    },
  });

  const list = sessions.data ?? [];

  return (
    <div className="space-y-4">
      {sessions.isPending ? (
        <div className="flex justify-center py-4"><Spinner /></div>
      ) : sessions.isError ? (
        <p className="text-sm text-red-600" role="alert">
          Couldn’t load your devices.{" "}
          <button type="button" className="underline" onClick={() => sessions.refetch()}>Try again</button>
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
          {list.map((s) => {
            const device = describeUserAgent(s.userAgent);
            const Icon = device.mobile ? FaMobileAlt : FaDesktop;
            return (
              <li key={s.id} className="flex items-center gap-4 p-4">
                <Icon className="w-5 h-5 text-gray-500 shrink-0" aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 flex items-center gap-2 flex-wrap">
                    {device.label}
                    {s.current && <Badge color="success">This device</Badge>}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {s.ipAddress || "Unknown IP"} · Signed in {timeAgo(s.signedInAt)} · Active {timeAgo(s.lastActiveAt)}
                  </p>
                </div>
                <Button
                  size="xs"
                  color="light"
                  onClick={() => setTarget(s)}
                  disabled={revoke.isPending}
                >
                  Sign out
                </Button>
              </li>
            );
          })}
          {list.length === 0 && <li className="p-4 text-sm text-gray-500">No active sessions.</li>}
        </ul>
      )}

      <Button color="light" onClick={() => setConfirmAll(true)}>
        <FaSignOutAlt className="w-4 h-4 mr-2" />
        Sign out of all devices
      </Button>

      <ConfirmModal
        isOpen={Boolean(target)}
        onClose={() => !revoke.isPending && setTarget(null)}
        onConfirm={() => revoke.mutate(target)}
        title={target?.current ? "Sign out of this device?" : "Sign out this device?"}
        message={target
          ? `${describeUserAgent(target.userAgent).label} will need to sign in again.`
          : ""}
        confirmLabel="Sign out"
        busy={revoke.isPending}
      />
      <ConfirmModal
        isOpen={confirmAll}
        onClose={() => !revokeAll.isPending && setConfirmAll(false)}
        onConfirm={() => revokeAll.mutate()}
        title="Sign out everywhere?"
        message="You'll need to sign in again on every device, including this one."
        confirmLabel="Sign out all"
        busy={revokeAll.isPending}
      />
    </div>
  );
};

export default ActiveSessions;
