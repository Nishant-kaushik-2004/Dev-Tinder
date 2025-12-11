import { useState, useEffect, useCallback } from "react";
import { ArrowRightToLine } from "lucide-react";
import SkeletonLoader from "./messagesSkeletonLoader";
import ChatList from "./chatList";
import createSocketConnection from "../../utils/socket";
import { Outlet, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setChats } from "../../store/chatsSlice";
import axios from "axios";
import { Chat } from "../../utils/types";
import { RootState } from "../../store/store";

// Main Messages Page Component
const MessagesPage = () => {
  // const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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

  const targetUserId = activeChat ? activeChat.participantInfo._id : null;

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

  // Setup socket connection for real-time messaging
  useEffect(() => {
    if (!targetUserId) return;

    // Initialize socket connection
    const socket = createSocketConnection();

    socket.emit("joinChat", {
      userId: loggedInUser._id,
      targetUserId: targetUserId,
    });

    return () => {
      socket.disconnect();
    };
  }, [targetUserId, loggedInUser._id]);

  const handleChatSelect = useCallback(
    (chat: Chat) => {
      // setActiveChat(chat);
      if (isMobile) {
        setShowSidebar(false);
      }

      if (activeChat && activeChat.chatId === chat.chatId) return;

      // If the chat is already active, do nothing
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
