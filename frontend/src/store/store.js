import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import profileDetailsReducer from "./profileSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    profileDetails: profileDetailsReducer,
  },
  //By defining a field inside the reducer parameter, we tell the store to use this slice reducer function to handle all updates to that state(here user is state and userReducer is userSlice's reducer function).
});

export default store;
