import { model, Mongoose, Schema } from "mongoose";

interface IChat {
  participants: (typeof Schema.Types.ObjectId)[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface IMessage {
  chatId: typeof Schema.Types.ObjectId;
  sender: typeof Schema.Types.ObjectId;
  text: string;
  seenBy: (typeof Schema.Types.ObjectId)[];
  createdAt?: Date;
  updatedAt?: Date;
}

const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: String,
    seenBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Chat = model<IChat>("Chat", chatSchema);
export const Message = model<IMessage>("Message", messageSchema);