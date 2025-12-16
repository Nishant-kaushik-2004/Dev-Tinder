import { ArrowLeftToLineIcon, Divide, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ChatItem from "./chatItem";
import SearchBar from "./searchBar";
import DropDownMenu from "../navbar/mobileNavigation";
import { useSelector } from "react-redux";
import { Chat, FilteredUser } from "../../utils/types";
import { RootState } from "../../store/store";
import axios from "axios";

interface ChatListProps {
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  isMobile: boolean;
  onToggleSidebar: () => void;
  isLoading: boolean;
}

// Chat List Component
const ChatList: React.FC<ChatListProps> = ({
  activeChat,
  onChatSelect,
  isMobile,
  onToggleSidebar,
  isLoading,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<FilteredUser[]>([]);

  const chats = useSelector((store: RootState) => store.chats);

  useEffect(() => {
    if (!searchValue) {
      setFilteredUsers([]);
      return;
    }
    // Debounced search input
    const delay = setTimeout(async () => {
      const excludeIds = chats.map((c) => c.participantInfo._id).join(",");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/search`,
          {
            params: { query: searchValue, excludeIds },
            withCredentials: true,
          }
        );

        if (!res.data.users) throw new Error("No users found");

        setFilteredUsers(res.data.users);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delay);
  }, [searchValue, chats]);
  console.log(searchValue);
  // Filter users based on search input and exclude those who already have chats so that they don't appear in "Start new chat" list
  // const filteredUsers = useMemo(() => {
  //   if (!searchValue) return [];
  //   return dummyUsers.filter(
  //     (user) =>
  //       user.name.toLowerCase().includes(searchValue.toLowerCase()) &&
  //       !chats.find((chat) => chat.participantInfo._id === user.id)
  //     // Remove users who already have chats in sidebar chat list
  //   );
  // }, [searchValue, dummyUsers, chats]);

  // Why useMemo here instead of useEffect?
  //   useMemo:
  // 	•	Runs during render
  // 	•	Returns the value instantly
  // 	•	Avoids recomputation
  // 	•	Avoids second render

  // useEffect: (Requires here extra state to store value because it cannot return value)
  // 	•	Runs AFTER DOM is painted
  // 	•	Cannot return a value
  // 	•	Causes another render when state is set

  return (
    <div className="h-full flex flex-col bg-base-100">
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DropDownMenu
              isDeviceIndependentVis={true}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
          {!isMobile && (
            <button
              onClick={onToggleSidebar}
              className="btn btn-ghost btn-square btn-sm"
            >
              <ArrowLeftToLineIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <SearchBar value={searchValue} onChange={setSearchValue} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {searchValue && filteredUsers.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-base-content/60 mb-2">
              Start new chat
            </h3>
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() =>
                  //❌ A chat should NOT be permanently created unless there is at least one message.
                  onChatSelect(
                    {
                      chatId: user._id, // Temporary chatId until first message is sent and real chatId is received from backend
                      participantInfo: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        photoUrl: user.photoUrl,
                        about: user.about,
                      },
                      lastMessage: "",
                      timestamp: new Date().toISOString(),
                      unreadCount: 0,
                      isTemporary: true,
                    },
                  )
                }
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-base-200"
              >
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full">
                    <img
                      src={user.photoUrl}
                      alt={user.firstName + " " + user.lastName}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">
                    {user.firstName + " " + user.lastName}
                  </h3>
                  <p className="text-sm text-base-content/60">{user.about}</p>
                </div>
              </div>
            ))}
            <div className="divider"></div>
          </div>
        )}

        {isLoading ? (
          [1, 2, 3].map((_, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg">
              <div className="skeleton w-12 h-12 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-3 w-full"></div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 space-y-2">
            {chats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/60">No messages yet</p>
                <p className="text-sm text-base-content/40 mt-2">
                  Search for developers to start chatting
                </p>
              </div>
            ) : (
              chats.map((chat) => {
                return (
                  <ChatItem
                    key={chat.chatId}
                    chat={chat}
                    isActive={activeChat?.chatId === chat.chatId}
                    onClick={() => onChatSelect(chat)}
                    isLoading
                  />
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
