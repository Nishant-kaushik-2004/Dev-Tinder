import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import crypto from "crypto";
import { Chat, Message } from "../models/chatModel.js";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";

interface ServerToClientEvents {
  messageReceived: (data: {
    messagePayload: {
      id: mongoose.Types.ObjectId;
      chatId: mongoose.Types.ObjectId; 
      sender: string;
      text: string;
      seenBy: string[];
      timestamp: Date | undefined;
    };
    senderInfo: senderInfo;
    chat: {
      chatId: mongoose.Types.ObjectId;
      participants: string[];
    };
  }) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface senderInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  about: string;
}

interface SendMessage {
  senderInfo: senderInfo;
  senderId: string;
  receiverId: string;
  text: string;
}

interface ClientToServerEvents {
  // hello: () => void;
  joinChat: (payload: { senderId: string; receiverId: string }) => void;
  leaveChat: (payload: { senderId: string; receiverId: string }) => void;
  sendMessage: (payload: SendMessage) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

const getSecretRoomId = (userId: String, targetUserId: String) => {
  const roomId = [userId, targetUserId].sort().join("_");
  return crypto.createHash("sha256").update(roomId).digest("hex");
};

const InitializeSocket = (server: HttpServer) => {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
    },
  });
  // NOTE: Socket is a server side name for a client connection.
  io.on("connection", (socket) => {
    console.log("A user Connected: " + socket.id);
    // Handle Events
    socket.on("joinChat", ({ senderId, receiverId }) => {
      // objectId validation
      const isUserIdValid = mongoose.Types.ObjectId.isValid(senderId);
      const isTargetUserIdValid = mongoose.Types.ObjectId.isValid(receiverId);
      if (!isUserIdValid || !isTargetUserIdValid) {
        console.log("Invalid userId or targetUserId");
        return;
      }
      // Validate both users exist
      const isSenderExists = User.exists({ _id: senderId });
      const isTargetUserExists = User.exists({ _id: receiverId });
      if (!isSenderExists || !isTargetUserExists) {
        console.log("User or Target User does not exist");
        return;
      }

      // TODO: Check if both users are friends/connected before allowing to join chat

      // Create a unique room (roomId) for the two users and join the current user socket to that room.
      const roomId = getSecretRoomId(senderId, receiverId);
      console.log("Joining Room: " + roomId);
      socket.join(roomId);
      // If the other user (targetUser) socket also joins the same roomId then they will be in the same room.
      // Then if any user amongst them emits a message to the server then server emits to that roomId, both will receive the message.
    });

    socket.on("leaveChat", ({ senderId, receiverId }) => {
      const roomId = getSecretRoomId(senderId, receiverId);
      socket.leave(roomId);
      console.log(`User left room: ${roomId}`);
    });

    socket.on("sendMessage", async (payload: SendMessage) => {
      console.log(payload);
      const { senderInfo, senderId, receiverId, text } = payload;
      const roomId = getSecretRoomId(senderId, receiverId);

      // 1) Ensure both users join this chat room  ->  Already joined in "joinChat" event
      // socket.join(roomId);

      console.log(
        `${senderInfo.firstName} sent message to ${receiverId}: ${text}`,
      );

      // 2) Find or create chat
      let chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!chat) {
        console.log(
          `No existing chat found between ${senderId} and ${receiverId}. Creating new chat.`,
        );
        chat = await Chat.create({
          participants: [senderId, receiverId],
        });
        console.log("Created new chat:", chat._id);
      }

      // 3) Create message
      const message = await Message.create({
        chatId: chat._id,
        sender: senderId,
        text,
        seenBy: [senderId],
      });

      const messagePayload = {
        id: message._id, // WebSocket JSON serialization converts this: ObjectId("67a3c99ee60cb081af95d111") to this: "67a3c99ee60cb081af95d111"
        chatId: chat._id,
        sender: senderId,
        text,
        seenBy: message.seenBy.map((id) => id.toString()),
        timestamp: message.createdAt,
      };
      console.log(messagePayload);
      // 4) Emit to BOTH sender & receiver (to a room where they both joined)
      io.to(roomId).emit("messageReceived", {
        messagePayload,
        senderInfo,
        chat: {
          chatId: chat._id,
          participants: chat.participants.map((id) => id.toString()),
        },
      });
      // If want to emit to all clients in the room except sender, we can use: socket.broadcast.to(roomId).emit(...)
    });

    socket.on("disconnect", (reason) => {
      console.log("User disconnected: " + reason);
    });
  });
};
export default InitializeSocket;
