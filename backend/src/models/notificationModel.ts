// Typescript is not supported while using require.
import mongoose, { Schema, Types, model } from "mongoose";

interface IUserSafe {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: string;
  photoUrl: string;
  about?: string;
  skills?: string[];
  location: string;
  isFresher: boolean;
  jobTitle?: string;
  company?: string;
  experience?: number;
}

// 1. Create an interface representing a document in MongoDB.
export interface INotification {
  fromUserId: Types.ObjectId | IUserSafe; // who receives the notification
  toUserId: Types.ObjectId | IUserSafe; // who triggered it
  type: "match_request" | "request_accept" | "message" | "profile_view";
  message: String;
  isRead: Boolean;
  createdAt: Date;
}

// 2. Create a Schema corresponding to the document interface.
const notificationSchema = new Schema<INotification>(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: ["match_request", "request_accept", "message", "profile_view"],
        message: "{VALUE} is not a valid notification type",
      },
    },
    message: {
      type: String,
      required: true,
      maxlength: [100, "Job title should be under 100 letters"],
    },
  },
  { timestamps: true }
);

// 3. Create a Model.
export const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);
