import { Check, CheckCheck } from "lucide-react";
import formatTimestamp from "../../helper/formatTimeStamp";

// Message Bubble Component
const MessageBubble = ({ message, isMe, showAvatar, avatar }) => (
  <div className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"} mb-4`}>
    {!isMe && showAvatar && (
      <div className="avatar">
        <div className="w-8 h-8 rounded-full">
          <img src={avatar} alt="" />
        </div>
      </div>
    )}
    {!isMe && !showAvatar && <div className="w-8" />}

    <div className={`max-w-[70%] ${isMe ? "order-1" : "order-2"}`}>
      <div
        className={`px-4 py-2 rounded-2xl ${
          isMe
            ? "bg-primary text-primary-content rounded-br-sm"
            : "bg-base-200 text-base-content rounded-bl-sm"
        }`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
      <div
        className={`flex items-center gap-1 mt-1 ${
          isMe ? "justify-end" : "justify-start"
        }`}
      >
        <span className="text-xs text-base-content/50">
          {formatTimestamp(new Date(message.timestamp))}
        </span>
        {isMe && (
          <span className="text-base-content/50">
            {message.read ? (
              <CheckCheck className="w-3 h-3 text-blue-500" />
            ) : (
              <Check className="w-3 h-3" />
            )}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default MessageBubble;
