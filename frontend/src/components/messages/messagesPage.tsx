import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRightToLine } from "lucide-react";
import SkeletonLoader from "./messagesSkeletonLoader";
import ChatList from "./chatList";
import { Outlet, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addNewChat, setChats } from "../../store/chatsSlice";
import axios from "axios";
import { Chat } from "../../utils/types";
import { RootState } from "../../store/store";
import getSocket from "../../utils/socket";

// Main Messages Page Component
const MessagesPage = () => {
  // const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const socketRef = useRef(getSocket());
  const prevTargetUserIdRef = useRef<string | null>(null);

  // To navigate programmatically between chats
  const navigate = useNavigate();
  // To update chats inside chatSlice in redux store
  const dispatch = useDispatch();

  // When we navigate programmatically to a different URL like: /messages/abc123 → /messages/user/xyz456
  // ✅ React Router re-renders the component, and useParams() gives you the new chatId or userId, which triggers our useEffect.
  const { chatId } = useParams();
  const { userId } = useParams();

  const loggedInUser = useSelector((store: RootState) => store.loggedInUser);
  const chats = useSelector((store: RootState) => store.chats);

  // Set active chat when chatId or userId param changes
  useEffect(() => {
    let selectedChat = null;
    if (chatId) {
      selectedChat = chats.find((chat) => chat.chatId === chatId);
    } else if (userId) {
      selectedChat = chats.find((chat) => chat.participantInfo._id == userId);
    }
    setActiveChat(selectedChat || null);
  }, [chatId, userId, chats]);

  const targetUserId = activeChat?.participantInfo?._id ?? null;

  // Fetch chats of the logged in user from backend
  useEffect(() => {
    // No need for this check as loggedInUser is not present initially it takes slightly more time to load from redux store so it ends unnecessarily the loading state earlier.
    // if (!loggedInUser._id) {
    //   setIsLoading(false);
    //   return;
    // }
    async function fetchChats() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/chats?userId=${
            loggedInUser._id
          }`,
          { withCredentials: true }
        );
        if (!res.data.chats) {
          throw new Error("No chats found");
        }
        console.log(res.data.chats);
        // setChats(dummyChats);
        dispatch(setChats(res.data.chats));
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChats();
  }, [loggedInUser._id, dispatch]);

  // Setup socket connection for real-time messaging
  useEffect(() => {
    const socket = socketRef.current;

    if (!loggedInUser._id || !targetUserId) return;

    const joinRoom = () => {
      // Join new room
      socket.emit("joinChat", {
        senderId: loggedInUser._id,
        receiverId: targetUserId,
      });
    }; // NOTE: Rooms are a server-only concept (i.e. the client does not have access to the list of rooms it has joined).

    if (socket.connected) {
      joinRoom();
    } else {
      // when socket connects, join it
      socket.once("connect", joinRoom); // Adds the listener only for the next occurrence of the event.
    }

    // cleanup only leaves room, does NOT disconnect global socket
    return () => {
      socket.emit("leaveChat", {
        senderId: loggedInUser._id,
        receiverId: targetUserId,
      }); // 🔹 This cleanup function runs in three situations
    }; // 1️⃣ When targetUserId or loggedInUser._id changes, 2️⃣ When the component unmounts, 3️⃣ Before re-running the effect if dependencies change.
  }, [loggedInUser._id, targetUserId]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowSidebar(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChatSelect = useCallback(
    (chat: Chat, isTemp?: boolean) => {
      // setActiveChat(chat);
      if (isMobile) {
        setShowSidebar(false);
      }

      if (isTemp) {
        // If temporary chat, add it to chats list in redux store
        dispatch(addNewChat(chat));
        navigate(`/messages/user/${chat.participantInfo._id}`);
        return;
      }

      // If the chat is already active, do nothing
      if (activeChat && activeChat.chatId === chat.chatId) return;

      navigate(`/messages/${chat.chatId}`);

      // Mark messages as read
      // if (chat.unreadCount > 0) {
      //   dispatch(markChatAsRead(chat.userId));
      // }
    },
    [isMobile, navigate, activeChat]
  );

  const handleBack = () => {
    setShowSidebar(true);
    setActiveChat(null);
    navigate("/messages");
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  // No need to show skeleton loader here as we are showing it in sidebar and in chatWindow
  // if (isLoading) {
  //   return <SkeletonLoader />;
  // }

  return (
    <div className="flex h-screen bg-base-100">
      {/* Sidebar Toggle Button (Desktop only) */}
      {!isMobile && !showSidebar && (
        <button
          onClick={toggleSidebar}
          className="btn btn-circle btn-primary shadow-lg m-4"
        >
          <ArrowRightToLine className="w-5 h-5" />
        </button>
      )}

      {/* Chat List Sidebar */}
      <div
        className={`${
          isMobile
            ? showSidebar
              ? "w-full"
              : "hidden"
            : showSidebar
            ? "w-96"
            : "w-0"
        } transition-all duration-300 border-r border-base-300 ${
          !isMobile && showSidebar ? "relative" : ""
        }`}
      >
        {showSidebar && (
          <ChatList
            activeChat={activeChat}
            onChatSelect={handleChatSelect}
            isMobile={isMobile}
            onToggleSidebar={toggleSidebar}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Chat Window */}
      <div className={`flex-1 ${isMobile && showSidebar ? "hidden" : "flex"}`}>
        {/* Using nested routing to render ChatWindow */}
        <Outlet
          context={{
            activeChat: activeChat,
            // onSendMessage: handleSendMessage,
            loggedInUser,
            onBack: handleBack,
            isMobile,
          }}
        />
        {/* <ChatWindow
          chat={activeChat}
          user={activeUser}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
          isMobile={isMobile}
        /> */}
      </div>
    </div>
  );
};

export default MessagesPage;
