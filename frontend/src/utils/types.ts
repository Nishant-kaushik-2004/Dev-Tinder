export interface userInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  about: string;
}

export interface Chat {
  chatId: string;
  participantInfo: userInfo;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  // isTemporary?: boolean; // Not needed as we only require it during chat creation before first message is sent, for which we can use 2nd argument of handleChatSelect function in messagesPage.tsx
}

export type MessageType = {
  chatId: string;
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  seenBy: string[];
};

export type ReceivedMessage = {
  messagePayload: MessageType;
  senderInfo: userInfo;
  chat: { chatId: string; participants: string[] };
};
