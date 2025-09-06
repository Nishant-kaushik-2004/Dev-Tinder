import React, { useEffect } from "react";
import createSocketConnection from "../../utils/socket";

const Chat = () => {
  useEffect(() => {
    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });

    return ()=>{
      socket.disconnect();
    }
  }, []);

  return <div className="text-xl text-pink-500">Chat Page</div>;
};

export default Chat;
