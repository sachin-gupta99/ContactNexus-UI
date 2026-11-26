import { queryClient } from "../api/queryClient";
import { clearAccessToken } from "./tokenStore";
import { userActions } from "../store/user";

/**
 * Forget everything about the signed-in user on this device: the in-memory
 * access token, the redux user, and every cached server response. Clearing the
 * query cache matters on shared machines; otherwise the next person to sign in
 * could briefly see the previous user's contacts.
 */
export const endSession = (dispatch) => {
  clearAccessToken();
  queryClient.clear();
  dispatch(userActions.clearUser());
};
