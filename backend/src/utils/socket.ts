import { Server } from "socket.io";

interface ServerToClientEvents {
  messageRecieved: (data: { firstName: string; text: string }) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  // hello: () => void;
  joinChat: () => void;
  sendMessage: () => void;
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

  io.on("connection", (socket) => {
    console.log("A user Connected");
    // Handle Events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log("Joining Room: " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        const roomId = getSecretRoomId(userId, targetUserId);
        console.log(
          firstName + " has sent message to " + targetUserId + " -> " + text
        );
        io.to(roomId).emit("messageRecieved", { firstName, text });

        let existingChat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!existingChat) {
          console.log(`No existing chat found between ${userId} and ${targetUserId}. Creating new chat.`);
          const newChat = new Chat({
            participants: [userId, targetUserId],
          });
          await newChat.save();
          existingChat = newChat;
        }

        const message = new Message({
          chatId: existingChat._id,
          sender: userId,
          text: text,
        });
        await message.save();
      }
    );

    socket.on("disconnect", () => {});
  });
};
export default InitializeSocket;
