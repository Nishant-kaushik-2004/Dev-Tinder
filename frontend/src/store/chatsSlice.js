import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
// const initialState = {
//   userId: "",
//   lastMessage: "",
//   timestamp: new Date(Date.now() - 1000 * 60 * 5),
//   unreadCount: 0,
// };

export const chatsSlice = createSlice({
  name: "chatsSlice",
  initialState,
  reducers: {
    setChats: (state, action) => {
      return action.payload; // Replace whole chats array safely
    },
    // Each chat entry belongs to a unique userId
    // Data updates frequently (new message, read status, unread count…) so we merge updates
    updateChat: (state, action) => {
      const chatIndex = state.findIndex((c) => c.userId === action.payload.userId);

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
      const userId = action.payload;

      const chat = state.find((c) => c.userId === userId);
      if (!chat) return;

      chat.unreadCount = 0;
      chat.messages = chat.messages.map((m) => ({ ...m, read: true }));
    },
    removeChats: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setChats, updateChat, markChatAsRead, removeChats } = chatsSlice.actions;

export default chatsSlice.reducer;
