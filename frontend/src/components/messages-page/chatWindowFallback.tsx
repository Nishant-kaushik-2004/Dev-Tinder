import { MessageCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

interface ChatWindowFallbackProps {
  isChatInvalid?: boolean;
}

const ChatWindowFallback = ({ isChatInvalid }: ChatWindowFallbackProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center bg-base-100 px-6">
      <div className="text-center space-y-4">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="text-7xl rounded-full flex items-center justify-center">
            {isChatInvalid ? "👻" : "💬"}
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold">
          {isChatInvalid
            ? "The chat you are looking for does not exist."
            : "No conversation selected"}
        </h2>

        {/* Description */}
        <p className="text-base-content/60 text-sm">
          {isChatInvalid
            ? "This chat may have been deleted or you don’t have access to it."
            : "          Choose from your existing conversations or search for new developers"}
        </p>

        {/* Action */}
        <div className="pt-2 flex justify-center">
          {isChatInvalid && (
            <button
              onClick={() => navigate("/messages")}
              className="btn btn-outline btn-sm gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to messages
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindowFallback;
