export interface ParticipantInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  about: string;
}

export interface Chat {
  chatId: string;
  participantInfo: ParticipantInfo;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isTemporary?: boolean;
}

export type MessageType = {
  chatId: string;
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  seenBy: string[];
};

export interface FilteredUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  about: string;
}
