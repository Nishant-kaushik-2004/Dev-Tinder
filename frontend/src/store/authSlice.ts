import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserInfo } from "../utils/types";

type AuthState = {
  user: IUserInfo | null;
  authChecked: boolean;
};

const initialState: AuthState = {
  user: null,
  authChecked: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUserInfo>) {
      state.user = action.payload;
      // retrun Object.assign(state, action.payload); // Would have good if we wanted to merge payload with existing state (when updating partial user info) but now we want to replace entire user info on login as it is null previously.
      state.authChecked = true;
    },
    updateUser(state, action: PayloadAction<Partial<IUserInfo>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearUser(state) {
      state.user = null;
      state.authChecked = true;
    },
  },
});

export const { setUser, updateUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

// Object.assign(state, action.payload) merges the payload into the existing state without removing fields that aren’t in the payload. This is the correct and safe approach in Redux Toolkit because Immer allows you to mutate state directly in reducers.
// Not returning action.payload avoids overwriting the entire state object (which could cause missing properties if the payload doesn’t include them).
// clearUser: () => null correctly resets the state to its initial values.
