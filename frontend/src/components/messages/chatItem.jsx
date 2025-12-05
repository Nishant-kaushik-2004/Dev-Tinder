import formatTimestamp from "../../helper/formatTimeStamp";

// Chat Item Component
const ChatItem = ({ chat, user, isActive, onClick, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg">
        <div className="skeleton w-12 h-12 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-24"></div>
          <div className="skeleton h-3 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-base-200 ${
        isActive ? "bg-base-200" : ""
      }`}
    >
      <div className="avatar">
        <div className="w-12 h-12 rounded-full">
          <img src={user.avatar} alt={user.name} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base-content truncate">
            {user.name}
          </h3>
          <span className="text-xs text-base-content/60 ml-2 flex-shrink-0">
            {formatTimestamp(chat.timestamp)}
          </span>
        </div>
        <p className="text-sm text-base-content/70 truncate">
          {chat.lastMessage}
        </p>
      </div>

      {chat.unreadCount > 0 && (
        <div className="badge badge-primary badge-sm">{chat.unreadCount}</div>
      )}
    </div>
  );
};

export default ChatItem;
