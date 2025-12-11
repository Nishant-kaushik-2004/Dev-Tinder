import { ChevronLeft, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./messageBubble";
import { useOutletContext, useParams } from "react-router";
import ChatWindowFallback from "./chatWindowFallback";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateChat } from "../../store/chatsSlice";
import createSocketConnection from "../../utils/socket";
import { Chat, MessageType } from "../../utils/types";
import { IUser } from "../../store/userSlice";

interface ChatWindowProps {
  chat: Chat;
  loggedInUser: IUser;
  onBack: () => void;
  isMobile: boolean;
}
// Chat Window Component
const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<MessageType[]>([]);
  // Need to show skeleton loader while messages are being fetched using this loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { chat, loggedInUser, onBack, isMobile }: ChatWindowProps =
    useOutletContext();

  const dispatch = useDispatch();
  const params = useParams();

  const { chatId } = params;

  // Fetch messages for the chat using chatId from params
  useEffect(() => {
    async function fetchMessages() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/messages/${chatId}`,
          { withCredentials: true }
        );
        if (!res.data.messages) {
          throw new Error("No chat messages found");
        }
        setChatMessages(res.data.messages);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    function handleIncoming(newMessage: MessageType) {
      console.log(newMessage);
      // Only update if message belongs to the currently open chat
      if (newMessage.chatId === chatId) {
        // React passes the latest state value into the function (prev), even if multiple state updates are queued. So, no risk of losing any new messages which arrive in quick succession.
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      }

      // Optionally update unread count in chatList here
      // dispatch(updateUnreadCount(newMessage));

      // Update last message in chat list
      dispatch(
        updateChat({
          chatId: newMessage.chatId,
          lastMessage: newMessage.text,
          timestamp: newMessage.timestamp,
        })
      );
    }

    const socket = createSocketConnection();

    socket.on("messageReceived", handleIncoming);

    return () => {
      socket.off("messageReceived", handleIncoming);
    };
  }, [chatId]);

  const handleSendMessage = (text: string) => {
    // const newMessage = {
    //   id: Date.now(),
    //   text,
    //   sender: loggedInUser._id,
    //   timestamp: new Date(),
    //   seenBy: [loggedInUser._id],
    // };

    // Make Api call to save message to backend  -> But this thing is already happening in sendMessage socket event in backend.

    // Initialize socket connection
    const socket = createSocketConnection();

    // Emit sendMessage socket event to send message
    socket.emit("sendMessage", {
      firstName: loggedInUser.firstName,
      userId: loggedInUser._id,
      targetUserId: chat.participantInfo._id,
      text,
    });
  };

  const handleSend = () => {
    if (message.trim()) {
      handleSendMessage(message);
      setMessage("");
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  // Simulate typing indicator
  useEffect(() => {
    if (message) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!chatId || !chat) {
    return <ChatWindowFallback />;
  }

  const user = {
    name: `${chat.participantInfo.firstName} ${chat.participantInfo.lastName}`,
    avatar: chat.participantInfo.photoUrl,
    status: "online", // This can be dynamic based on real user status
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-base-100">
      {/* Header */}
      <div className="navbar bg-base-200 border-b border-base-300 px-4">
        {isMobile && (
          <button onClick={onBack} className="btn btn-ghost btn-circle mr-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex-1 flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full">
              <img src={user.avatar} alt={user.name} />
            </div>
          </div>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-xs text-base-content/60">
              {user.status === "online" ? (
                <span className="text-success">● Online</span>
              ) : user.status === "away" ? (
                <span className="text-warning">● Away</span>
              ) : (
                <span>● Offline</span>
              )}
            </p>
          </div>
        </div>

        <button className="btn btn-ghost btn-circle">
          <User className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chatMessages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={msg.sender === loggedInUser._id}
            showAvatar={
              // idx === 0 || chatMessages[idx - 1].sender !== msg.sender
              msg.sender !== loggedInUser._id
            }
            avatar={user.avatar}
          />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-base-content/50 text-sm">
            <span>{user.name} is typing</span>
            <span className="loading loading-dots loading-xs"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-base-200 border-t border-base-300">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            className="input input-bordered flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSend}
            className="btn btn-primary btn-circle"
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
