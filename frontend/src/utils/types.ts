export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  about: string;
  createdAt: string;
  updatedAt: string;
}

export type genderType = "male" | "female" | "other" | "";

export interface IUserInfo extends IUser {
  age?: number;
  gender?: genderType;
  skills?: string[];
  location?: string;
  jobTitle?: string;
  company?: string;
  experience?: number;
  isFresher?: boolean;
}

export type connectionStatusType =
  | "connected"
  | "not_connected"
  | "pending_sent"
  | "pending_received"
  | "own_profile";

// For user profile page
export interface IUserProfile extends IUserInfo {
  mutualConnections: number;
  connectionStatus: connectionStatusType;
}

export interface Chat {
  chatId: string;
  participantInfo: IUser[];
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
  senderInfo: IUser;
  chat: { chatId: string; participants: string[] };
};

export interface IConnection {
  _id: string;
  connectedAt: string;
  connectedUser: IUserInfo;
}

export type statusType = "interested" | "ignored" | "accepted" | "rejected";

export interface IRequest {
  _id: string;
  fromUser: IUserInfo;
  toUserId: string;
  status: statusType;
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

export type ConnectionActionType = "send" | "accept" | "cancel" | "reject";

export interface IFetchProfileResponse {
  message: string;
  user: IUserProfile;
}

export interface FeedStats {
  views: {
    totalViews: number;
    newViewsToday: number;
  };
  matches: {
    totalMatches: number;
    newMatchesThisWeek: number;
  };
  messages: {
    totalMessages: number;
    newMessagesThisWeek: number;
  };
}

export interface IFetchFeedStatsResponse {
  message: string;
  stats: FeedStats;
}

export interface IFetchDevelopersResponse {
  message: string;
  developers: IUserInfo[];
}

export interface IFilter {
  experienceLevel?: string;
  technologies?: string[];
  location?: string;
}
