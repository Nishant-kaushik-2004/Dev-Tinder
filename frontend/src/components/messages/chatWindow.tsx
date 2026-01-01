import { ChevronLeft, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./messageBubble";
import { useNavigate, useOutletContext, useParams } from "react-router";
import ChatWindowFallback from "./chatWindowFallback";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addNewChat, updateChat } from "../../store/chatsSlice";
import getSocket from "../../utils/socket";
import { Chat, MessageType, ReceivedMessage } from "../../utils/types";
import { IUser } from "../../store/userSlice";
import { RootState } from "../../store/store";

interface ChatWindowProps {
  activeChat: Chat;
  loggedInUser: IUser;
  onBack: () => void;
  isMobile: boolean;
}
// Chat Window Component
const ChatWindow = () => {
  const [tempChat, setTempChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<MessageType[]>([]);
  // Need to show skeleton loader while messages are being fetched using this loading state.
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { activeChat, loggedInUser, onBack, isMobile }: ChatWindowProps =
    useOutletContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const chats = useSelector((store: RootState) => store.chats);

  let chatId: string | null = params.chatId || null;

  const userId: string | null = params.userId || null;

  // If userId is present in params then probably(not always) we are in a temporary chat (before first message) so we need to create a temporary chat object locally to show chat window properly.
  useEffect(() => {
    if (!userId || activeChat) return; // If activeChat already exist means chat with this user already present then no need to create temp chat

    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/${userId}`,
          { withCredentials: true }
        );
        if (!res.data.user) {
          throw new Error("User not found");
        }
        const tempChat: Chat = {
          chatId: "", // Temporary chat has no chatId
          participantInfo: res.data.user,
          lastMessage: "",
          timestamp: new Date().toISOString(),
          unreadCount: 0,
        };
        setTempChat(tempChat);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error occured";
        console.error("Error fetching user:", errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();

    return () => {
      setTempChat(null); // Cleanup temp chat on unmount or when dependencies change
    };
  }, [userId, activeChat]);

  // Route structure:
  //  /messages
  //  /messages/chat/:chatId       ← existing chat
  //  /messages/user/:userId       ← temp chat (before first message)

  // Fetch messages for the chat using chatId from params
  useEffect(() => {
    if (!chatId) return;
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
        console.log(res.data);
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
    if (!activeChat && !tempChat) return;
    const socket = getSocket();

    function handleIncoming(newMessage: ReceivedMessage) {
      console.log(newMessage);
      const { messagePayload, senderInfo, chat } = newMessage;
      // Only update if message belongs to the currently open chat
      if (
        chat.chatId === chatId ||
        (tempChat && tempChat.participantInfo._id === senderInfo._id)
      ) {
        setChatMessages((prevMessages) => [...prevMessages, messagePayload]); // React passes the latest state value into the function (prev), even if multiple state updates are queued. So, no risk of losing any new messages which arrive in quick succession.
      }

      // Optionally update unread count in chatList here
      // dispatch(updateUnreadCount(newMessage));

      if (senderInfo._id === loggedInUser._id) {
        console.log("Goes inside if block");

        if (!tempChat) {
          // It means its not the first message(of temp chat) so just update existing chat in store
          const existingChatIdx = chats.findIndex(
            (c) => c.chatId === chat.chatId
          );
          if (existingChatIdx === -1) return; // Just a safety check
          dispatch(
            updateChat({
              existingChatIdx,
              newChat: {
                lastMessage: messagePayload.text,
                timestamp: new Date(messagePayload.timestamp).toISOString(),
                unreadCount: chats[existingChatIdx].unreadCount, // No change in unread count when logged in user himself/herself sends the message
              },
            })
          );
          return;
        }

        // If the message is sent by logged in user himself/herself and chatId is not current activeChat Id then it means its a 1st message of temp chat which needs to be converted to permanent chat
        const newChat = {
          chatId: chat.chatId,
          participantInfo: tempChat?.participantInfo, // As senderInfo is logged in user himself/herself so participantInfo will be of tempChat
          lastMessage: messagePayload.text,
          timestamp: new Date(messagePayload.timestamp).toISOString(),
          unreadCount: 1,
        };
        dispatch(addNewChat(newChat));
        // setTempChat(null); // Clear the temporary chat after converting to permanent chat
        setChatMessages(() => [messagePayload]);
        navigate(`/messages/${chat.chatId}`, { replace: true }); // Replace the current route to avoid going back to temp chat route
        return;
      }

      // Update chats list in redux store
      const existingChatIdx = chats.findIndex(
        (c) => c.participantInfo._id === senderInfo._id
      );
      const newChat = {
        chatId: chat.chatId,
        participantInfo: senderInfo,
        lastMessage: messagePayload.text,
        timestamp: new Date(messagePayload.timestamp).toISOString(),
        unreadCount: 1, // Will be handled later
      };

      if (existingChatIdx === -1) {
        // No existing chat exist locally so add new chat
        dispatch(addNewChat(newChat)); // Works when we receive first message from a new sender and we have not opened the chat window of that new user

        if (senderInfo._id === tempChat?.participantInfo._id) {
          // If the new message is from the user of whom temp chat exist(opened) locally then we need to clear the temp chat as permanent chat is created now.
          // setTempChat(null);
          navigate(`/messages/${chat.chatId}`, { replace: true });
        }
      } else {
        // Update existing chat
        dispatch(updateChat({ existingChatIdx, newChat }));
      }
    }

    socket.on("messageReceived", handleIncoming);

    return () => {
      // Removes the "handleIncoming" listener from the listener array for the event named messageReceived.
      socket.off("messageReceived", handleIncoming);
    };
  }, [chatId, dispatch, chats]);

  // When user searches for a new user to start chat with, we need to create a temporary chat object with isTemp = true; and add it to chats list in redux store and navigate user to the chat window of the new user but when he clicks back button then remove that temporary user from store chats.

  //💎 So never show temporary chats in sidebar chat list.

  // In this way only when user sends the first message to that new user then permanent chat will be created in backend and real chatId will be received in messageReceived socket event and we can update the temporary chat in store with real chatId and other details.

  // So at a time only one temporary chat can exist (in the new user chat window)

  const handleSendMessage = (text: string) => {
    if (!activeChat && !tempChat) return;
    // const newMessage = { // Used when optimistic local update is needed
    //   id: Date.now(),
    //   text,
    //   sender: loggedInUser._id,
    //   timestamp: new Date(),
    //   seenBy: [loggedInUser._id],
    // };

    // Make Api call to save message to backend  -> But this thing is already happening in sendMessage socket event in backend.

    const socket = getSocket(); // get initialized or check socket connection again

    socket.emit("sendMessage", {
      // Emit sendMessage socket event to send message
      senderId: loggedInUser._id,
      senderInfo: {
        _id: loggedInUser._id,
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        email: loggedInUser.email,
        photoUrl: loggedInUser.photoUrl,
        about: loggedInUser.about,
      },
      receiverId: tempChat ? tempChat.participantInfo._id : activeChat.participantInfo._id,
      text,
    });
    // optimistic local update: append message locally, rollback on error if needed
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

  if (!activeChat && !tempChat) {
    return <ChatWindowFallback />;
  }

  const chat = activeChat || tempChat;
  const user = {
    name: `${chat.participantInfo?.firstName} ${chat.participantInfo.lastName}`,
    avatar: chat.participantInfo?.photoUrl,
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
            // To show avatar only for the first message in a sequence of messages of the target user.
            showAvatar={
              idx === 0 || chatMessages[idx - 1].sender !== msg.sender
            } // Show avatar if it's the first message or sender is different from previous message (But this is used only when its not me sending the message)
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
