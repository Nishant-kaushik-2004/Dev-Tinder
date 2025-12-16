import { createSlice } from "@reduxjs/toolkit";
import { Chat } from "../utils/types";

const initialState: Chat[] = [];
// const initialState = [
//   {
//     chatId: "64fdf8cc9b20acfe9c4f8e9d",
//     participantInfo: {
//       _id: "6897bdf41e4f24ad7cf2c642",
//       firstName: "Nishant",
//       lastName: "Kaushik",
//       email: "nishant@example.com",
//       photoUrl: "https://…",
//       about: "MERN developer",
//     },
//     lastMessage: "Hey! Would love to collaborate on that React project",
//     timestamp: "2025-02-10T23:11:45.000Z",
//     unreadCount: 2,
//   },
// ];

export const chatsSlice = createSlice({
  name: "chatsSlice",
  initialState,
  reducers: {
    setChats: (_, action) => {
      return action.payload; // Replace whole chats array safely
    },
    // Data updates frequently (new message(it requires updating last message, timestamp, unread count…) so we merge updates
    updateChat: (state, action) => {
      const chatIndex = state.findIndex(
        (c) => c.chatId === action.payload.chatId
      );
      console.log("foundIdx -> ", chatIndex);
      if (chatIndex !== -1) {
        // Update existing chat
        state[chatIndex] = { ...state[chatIndex], ...action.payload };
      } else {
        // Add new chat
        state.push(action.payload);
      }
    },
    // Mark all messages in a chat as read
    markChatAsRead: (state, action) => {
      // Accept chatId as payload
      const chatId = action.payload;

      const chat = state.find((c) => c.chatId === chatId);
      if (!chat) return;

      chat.unreadCount = 0;
    },
    removeChats: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setChats, updateChat, markChatAsRead, removeChats } =
  chatsSlice.actions;

export default chatsSlice.reducer;
