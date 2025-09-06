import { Server } from "socket.io";

interface ServerToClientEvents {
  messageRecieved: () => void;
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

const getSecretRoomId = (userId, targetUserId) => {
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

    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " " + text);
      io.to(roomId).emit("messageRecieved", { firstName, text });
    });

    socket.on("disconnect", () => {});
  });
};
export default InitializeSocket;
