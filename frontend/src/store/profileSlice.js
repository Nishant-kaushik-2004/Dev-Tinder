import { createSlice } from "@reduxjs/toolkit";
// Mock profile data - replace with actual API call
const initialState = {
  id: "",
  firstName: "",
  lastName: "",
  profileImage: "",
  bio: "",
  location: "",
  skills: [],
  jobTitle: "",
  company: "",
  experience: "",
  joinedDate: "",
  lastActive: "",
  connectionStatus: "", // 'connected', 'pending_sent', 'pending_received', 'not_connected', 'own_profile'
  mutualConnections: 0,
};

export const profileDetailsSlice = createSlice({
  name: "profileDetails",
  initialState,
  reducers: {
    addProfileDetails: (state, action) => {
      //A built-in JavaScript method that copies the properties of one or more source objects into a target object. ->  Object.assign(target, ...sources)
      Object.assign(state, action.payload);
      // return action.payload;  -> This is a very bad practice because it will change the whole user object, which will not be good If action.payload is missing some fields, they’ll be lost.
    },
  },
});

// Action creators are generated for each case reducer function
export const { addProfileDetails } = profileDetailsSlice.actions;

export default profileDetailsSlice.reducer;

// Object.assign(state, action.payload) merges the payload into the existing state without removing fields that aren’t in the payload. This is the correct and safe approach in Redux Toolkit because Immer allows you to mutate state directly in reducers.
// Not returning action.payload avoids overwriting the entire state object (which could cause missing properties if the payload doesn’t include them).
// removeUser: () => initialState correctly resets the state to its initial values.
