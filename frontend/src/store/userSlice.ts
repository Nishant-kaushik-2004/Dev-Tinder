import { createSlice } from "@reduxjs/toolkit";
import { IUserInfo } from "../utils/types";

const initialState: IUserInfo = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  photoUrl: "",
  about: "",
  createdAt: "",
  updatedAt: "",
};

export const userSlice = createSlice({
  name: "loggedInUser",
  initialState,
  reducers: {
    setUser: (state, action) => {
      //A built-in JavaScript method that copies the properties of one or more source objects into a target object. ->  Object.assign(target, ...sources)
      Object.assign(state, action.payload);
      // return action.payload;  -> This is a very bad practice because it will change the whole user object, which will not be good If action.payload is missing some fields, they’ll be lost.
    },
    clearUser: () => initialState,
  },
});

// Action creators are generated for each case reducer function
export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

// Object.assign(state, action.payload) merges the payload into the existing state without removing fields that aren’t in the payload. This is the correct and safe approach in Redux Toolkit because Immer allows you to mutate state directly in reducers.
// Not returning action.payload avoids overwriting the entire state object (which could cause missing properties if the payload doesn’t include them).
// removeUser: () => initialState correctly resets the state to its initial values.
