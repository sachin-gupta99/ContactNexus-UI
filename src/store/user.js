import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  // authReady flips to true once the boot-time /refresh call settles (success
  // or failure). ProtectedRoute uses it to avoid redirecting on first render
  // while the refresh is still in flight.
  authReady: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setAuthReady: (state, action) => {
      state.authReady = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
