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
export interface IConnectionReq {
  fromUserId: Types.ObjectId | IUserSafe;
  toUserId: Types.ObjectId | IUserSafe;
  status: "interested" | "ignored" | "accepted" | "rejected";
}

// 2. Create a Schema corresponding to the document interface.
const connectionReqSchema = new Schema<IConnectionReq>(
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
      index: true,
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

// This is a Mongoose “pre-save hook” — also called middleware.
// It means: 🔁 Before saving a document to MongoDB, run this custom logic.
// Can be done in Api but doing here to learn new ways.
connectionReqSchema.pre("save", function (next) {
  const connectionRequest = this as IConnectionReq & mongoose.Document;
  if (
    connectionRequest.fromUserId.toString() ===
    connectionRequest.toUserId.toString()
  ) {
    return next(new Error("Cannot send connection request to yourself!"));
  }

  next();
});

// 3. Create a Model.
export const ConnectionReqModel = model<IConnectionReq>(
  "ConnectionRequest",
  connectionReqSchema
);
