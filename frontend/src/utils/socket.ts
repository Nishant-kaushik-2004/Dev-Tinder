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
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// // ES modules
// import { io } from "socket.io-client";

// const createSocketConnection = () => {
//   return io(import.meta.env.VITE_BACKEND_URL);
// };

// export default createSocketConnection;
