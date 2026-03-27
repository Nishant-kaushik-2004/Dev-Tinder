import { io, Socket } from "socket.io-client";
// ⭐ Important Notes

// 1. NEVER create a socket in:
// 	•	useEffect on every render
// 	•	handleSendMessage/ receiveMessage functions/ or any event handlers
// 	•	components that re-render often
// 	•	components that mount/unmount often

// 2. 🚀 ALWAYS use a global singleton socket instance

// Just like React Query or Redux store.

let socket: Socket | null = null;

export default function getSocket(createNew = false): Socket {
  if (!socket || createNew) {
    // In production we proxy Socket.IO through Vercel:
    // /api/socket.io -> backend /socket.io
    // This keeps the browser on same-origin and avoids third-party cookie behavior.
    const isProduction = import.meta.env.PROD;
    socket = io(isProduction ? "/" : import.meta.env.VITE_BACKEND_URL, {
      path: isProduction ? "/api/socket.io" : "/socket.io",
      withCredentials: true, // 🔴 REQUIRED for cookies
      transports: ["websocket", "polling"],
    });
    // Earlier configuration
    // socket = io(import.meta.env.VITE_BACKEND_URL!, {
    //   path: "/socket.io",
    //   withCredentials: true, // 🔴 REQUIRED for cookies
    // });
  }
  return socket;
}
// A user should have only ONE socket connection per session.
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Standard socket lifecycle (industry pattern)
// ✔ Correct flow:

// App loads
//   ↓
// Create ONE socket connection
//   ↓
// User joins chat room (joinChat)
//   ↓
// Send / receive messages
//   ↓
// User switches chat → leaveChat current → joinChat new
//   ↓
// Send / receive messages
//   ↓
// App closes → socket disconnect
