import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatsReducer from "./chatsSlice";

const store = configureStore({
  reducer: {
    loggedInUser: userReducer,
    chats: chatsReducer,
  },
  //By defining a field inside the reducer parameter, we tell the store to use this slice reducer function to handle all updates to that state(here user is state and userReducer is userSlice's reducer function).
});

export default store;

// ---------- TYPES ----------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;