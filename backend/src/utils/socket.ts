import { Server } from "socket.io";

interface ServerToClientEvents {
  messageReceived: (data: {
    _id: mongoose.Types.ObjectId;
    chatId: mongoose.Types.ObjectId;
    sender: string;
    text: string;
    seenBy: string[];
    timestamp: Date | undefined;
  }) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface SendMessage {
  firstName: string;
  userId: string;
  targetUserId: string;
  text: string;
}

interface ClientToServerEvents {
  // hello: () => void;
  joinChat: (payload: { userId: string; targetUserId: string }) => void;
  sendMessage: (payload: SendMessage) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

import { Server as HttpServer } from "http";
import crypto from "crypto";
import { Chat, Message } from "../models/chatModel.js";
import mongoose, { mongo } from "mongoose";

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
      origin: "http://localhost:5173",
    },
  });
  // NOTE: Socket is a server side name for a client.
  io.on("connection", (socket) => {
    console.log("A user Connected");
    // Handle Events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log("Joining Room: " + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async (payload: SendMessage) => {
      const { firstName, userId, targetUserId, text } = payload;
      const roomId = getSecretRoomId(userId, targetUserId);

      // 1) Ensure both users join this chat room  ->  Already joined in "joinChat" event
      // socket.join(roomId);

      console.log(`${firstName} sent message to ${targetUserId}: ${text}`);

      // 2) Find or create chat
      let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] },
      });

      if (!chat) {
        console.log(
          `No existing chat found between ${userId} and ${targetUserId}. Creating new chat.`
        );
        chat = await Chat.create({
          participants: [userId, targetUserId],
        });
        console.log("Created new chat:", chat._id);
      }

      // 3) Create message
      const message = await Message.create({
        chatId: chat._id,
        sender: userId,
        text,
        seenBy: [userId],
      });

      const messagePayload = {
        _id: message._id, // WebSocket JSON serialization converts this: ObjectId("67a3c99ee60cb081af95d111") to this: "67a3c99ee60cb081af95d111"
        chatId: chat._id,
        sender: userId,
        text,
        seenBy: message.seenBy.map((id) => id.toString()),
        timestamp: message.createdAt,
      };
      console.log(messagePayload);
      // 4) Emit to BOTH sender & receiver (to the room where they both joined)]
      io.to(roomId).emit("messageReceived", messagePayload);
      // If want to emit to all clients in the room except sender, we can use: socket.broadcast.to(roomId).emit(...)
    });

    socket.on("disconnect", (reason) => {
      console.log("User disconnected: " + reason);
    });
  });
};
export default InitializeSocket;
