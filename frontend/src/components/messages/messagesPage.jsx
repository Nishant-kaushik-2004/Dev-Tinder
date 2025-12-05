import { useState, useEffect, useCallback, use } from "react";
import { ArrowRightToLine } from "lucide-react";
import { dummyUsers } from "../../data/mockMessages";
import SkeletonLoader from "./messagesSkeletonLoader";
import ChatList from "./chatList";
import createSocketConnection from "../../utils/socket";
import { Outlet, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { markChatAsRead, setChats, updateChat } from "../../store/chatsSlice";
import axios from "axios";

// Main Messages Page Component
const MessagesPage = () => {
  // const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // To navigate programmatically between chats
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { chatId } = useParams();

  const loggedInUser = useSelector((store) => store.user);

  const chats = useSelector((store) => store.chats);

  useEffect(() => {
    if (chatId) {
      const selectedChat = chats.find((chat) => chat.chatId === chatId);
      setActiveChat(selectedChat || null);
    }
  }, [chatId, chats]);

  const targetUserId = activeChat ? activeChat.userId : null;

  // Fetch chats from backend
  useEffect(() => {
    async function fetchChats() {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/chats?userId=${
            loggedInUser.userId
          }`,
          { withCredentials: true }
        );
        if (!res.data.chats) {
          throw new Error("No chats found");
        }
        // setChats(dummyChats);
        dispatch(setChats(res.data.chats));
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchChats();
  }, [loggedInUser.userId, dispatch]);

  // Set Active Chat from params targetUserId to select the chat
  // useEffect(() => {
  //
  // }, [params]);

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

  useEffect(() => {
    if (!targetUserId) return;

    // Initialize socket connection
    const socket = createSocketConnection();

    socket.emit("joinChat", {
      userId: loggedInUser.userId,
      targetUserId: targetUserId,
    });

    // return () => socket.disconnect();
    return () => {
      socket.disconnect();
    };
  }, [targetUserId, loggedInUser.userId]);

  const handleChatSelect = useCallback(
    (chat) => {
      if (activeChat && activeChat.userId === chat.userId) return;
      else {
        navigate(`/messages/${chat.chatId}`);
      } // This userId is actually the userId of the person to whom we want to chat not.
      // If the chat is already active, do nothing

      // setActiveChat(chat);
      if (isMobile) {
        setShowSidebar(false);
      }

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

  if (isLoading) {
    return <SkeletonLoader />;
  }

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
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            isMobile={isMobile}
            onToggleSidebar={toggleSidebar}
          />
        )}
      </div>

      {/* Chat Window */}
      <div className={`flex-1 ${isMobile && showSidebar ? "hidden" : "flex"}`}>
        {/* Using nested routing to render ChatWindow */}
        <Outlet
          context={{
            chat: activeChat,
            // user: activeUser,
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
