export interface userInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  about: string;
}

export interface IUser extends userInfo {
  gender?: "male" | "female" | "other" | "";
  skills?: string[];
  location?: string;
  jobTitle?: string;
  company?: string;
  experience?: number;
  isFresher?: boolean;
}

export interface Chat {
  chatId: string;
  participantInfo: userInfo;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isTemporary?: boolean;
  //  // Not needed as we only require it during chat creation before first message is sent, for which we can use 2nd argument of handleChatSelect function in messagesPage.tsx
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

export interface IConnection {
  _id: string;
  connectedAt: string;
  connectedUser: IUser;
}

export interface IRequest {
  _id: string;
  fromUser: IUser;
  toUserId: string;
  status: "interested" | "ignored" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}
export interface IMatchRequestResponse {
  message: string;
  requests: IRequest[];
}

export interface IConnectionResponse {
  message: string;
  connections: IConnection[];
}

export interface IReviewRequestResponse {
  message: string;
  connRequest: IRequest;
}

export interface IFetchProfileResponse {
  message: string;
  user: IUser;
}