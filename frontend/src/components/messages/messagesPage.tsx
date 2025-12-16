import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRightToLine } from "lucide-react";
import SkeletonLoader from "./messagesSkeletonLoader";
import ChatList from "./chatList";
import { Outlet, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setChats } from "../../store/chatsSlice";
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
  const prevChatIdRef = useRef<string | null>(null);

  // To navigate programmatically between chats
  const navigate = useNavigate();
  // To update chats inside chatSlice in redux store
  const dispatch = useDispatch();

  const { chatId } = useParams();

  const loggedInUser = useSelector((store: RootState) => store.loggedInUser);
  const chats = useSelector((store: RootState) => store.chats);

  // Set active chat when chatId param changes
  useEffect(() => {
    if (chatId) {
      const selectedChat = chats.find((chat) => chat.chatId === chatId);
      setActiveChat(selectedChat || null);
    }
  }, [chatId, chats]);

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

    // ensure connected before join
    const ensureJoin = () => {
      if (!chatId || !loggedInUser._id || !targetUserId) return;
      // Leave previous room if exists
      if (prevChatIdRef.current && prevChatIdRef.current !== chatId) {
        socket.emit("leaveChat", {
          userId: loggedInUser._id,
          targetUserId,
        });
      }
      // Join new room
      // NOTE: Rooms are a server-only concept (i.e. the client does not have access to the list of rooms it has joined).
      socket.emit("joinChat", { userId: loggedInUser._id, targetUserId });
      prevChatIdRef.current = chatId;
    };

    if (socket.connected) {
      ensureJoin();
    } else {
      // when socket connects, join
      const onConnect = () => ensureJoin();
      socket.on("connect", onConnect);
      return () => {
        socket.off("connect", onConnect);
      };
    }

    // cleanup only leaves room, does NOT disconnect global socket
    return () => {
      if (socket && prevChatIdRef.current === chatId) {
        socket.emit("leaveChat", { chatId, userId: loggedInUser._id });
      }
    };
  }, [chatId, loggedInUser._id, targetUserId]);

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
    (chat: Chat) => {
      // setActiveChat(chat);
      if (isMobile) {
        setShowSidebar(false);
      }

      // If the chat is already active, do nothing
      if (activeChat && activeChat.chatId === chat.chatId) return;

      if (chat.isTemporary) {
        // If temporary chat, add it to chats list in redux store
        dispatch(setChats([...chats, chat]));
      }

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
            chat: activeChat,
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
