// ES modules
import { io } from "socket.io-client";

const createSocketConnection = () => {
  return io(import.meta.env.VITE_BACKEND_URL);
};

export default createSocketConnection;
