import { ArrowLeftToLineIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import ChatItem from "./chatItem";
import SearchBar from "./searchBar";
import DropDownMenu from "../navbar/mobileNavigation";
import { dummyUsers } from "../../data/mockMessages";
import { useSelector } from "react-redux";

// Chat List Component
const ChatList = ({
  activeChat,
  onChatSelect,
  searchValue,
  onSearchChange,
  isMobile,
  onToggleSidebar,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const chats = useSelector((store) => store.chats);

  const filteredUsers = useMemo(() => {
    if (!searchValue) return [];
    return dummyUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase()) &&
        !chats.find((chat) => chat.userId === user.id)
      // Remove users who already have chats in sidebar chat list
    );
  }, [searchValue, dummyUsers, chats]);

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
        <SearchBar value={searchValue} onChange={onSearchChange} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {searchValue && filteredUsers.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-base-content/60 mb-2">
              Start new chat
            </h3>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() =>
                  onChatSelect({
                    userId: user.id,
                    messages: [],
                    unreadCount: 0,
                  })
                }
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-base-200"
              >
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full">
                    <img src={user.avatar} alt={user.name} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-base-content/60">{user.bio}</p>
                </div>
              </div>
            ))}
            <div className="divider"></div>
          </div>
        )}

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
              const user = dummyUsers.find((u) => u.id === chat.userId);
              return (
                <ChatItem
                  key={chat.userId}
                  chat={chat}
                  user={user}
                  isActive={activeChat?.userId === chat.userId}
                  onClick={() => onChatSelect(chat)}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
