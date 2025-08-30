// Typescript is not supported while using require.
import mongoose, { Schema, Types, model } from "mongoose";

export interface IUserSafe {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: string;
  photoUrl: string;
  about?: string;
  skills?: string[];
  location: string;
  jobTitle?: string;
  company?: string;
  experience?: number;
  isFresher: boolean;
}

// 1. Create an interface representing a document in MongoDB.
export interface INotification {
  fromUserId: Types.ObjectId | IUserSafe; // who receives the notification
  toUserId: Types.ObjectId | IUserSafe; // who triggered it
  type: "match_request" | "message" | "profile_view";
  message: String;
  isRead: Boolean;
  createdAt: Date;
}

// 2. Create a Schema corresponding to the document interface.
const connectionReqSchema = new Schema<INotification>(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  { timestamps: true }
);

// 3. Create a Model.
export const ConnectionReqModel = model<IConnectionReq>(
  "ConnectionRequest",
  connectionReqSchema
);
