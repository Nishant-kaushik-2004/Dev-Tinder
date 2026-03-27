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
    // This is because i have added a proxy in the frontend (vercel.json) for socket.io also to forward /api/socket.io/:path* to backend_url/socket.io/:path*.

    // Default path is always /socket.io, but since we have added a proxy for /api/socket.io, we need to change the path to /api/socket.io in the client as well but later vercel redirects it and remove /api.

    // If we want to use custom path then we had to also change the path in the backend.

    // It is not necessary to provide the base URL in io() if our frontend and backend appear to be on the same origin. ✔ If they are on different origins, we must provide it. But here we are using a proxy in the frontend (vercel.json) to forward /api/socket.io/:path* to backend_url/socket.io/:path*, so we can just use "/" as the base URL and it will work.

    // const isProduction = import.meta.env.PROD; // -> Base url is needed in development

    socket = io(import.meta.env.VITE_BACKEND_URL, {
      // path: "/socket.io", -> It's by default
      withCredentials: false, // 🔴 REQUIRED for cookies but we are not using auth so cookie not required so we keep false
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
