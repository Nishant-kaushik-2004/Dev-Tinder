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
  name: "chats",
  initialState,
  reducers: {
    setChats: (_, action) => {
      return action.payload; // Replace whole chats array safely
    },

    // Data updates frequently (new message(it requires updating last message, timestamp, unread count…) so we merge updates
    updateChat: (state, action) => {
      const { existingChatIdx, newChat } = action.payload;
      // Update existing chat
      state[existingChatIdx] = { ...state[existingChatIdx], ...newChat };
    }, // Convert temporary chat to permanent chat when first message is sent and real chatId is received from backend or first message is received from a new participant

    // For messages from a new sender where no temporary chat exist locally
    addNewChat: (state, action) => {
      state.push(action.payload);
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
export const {
  setChats,
  updateChat,
  addNewChat,
  markChatAsRead,
  removeChats,
} = chatsSlice.actions;

export default chatsSlice.reducer;
