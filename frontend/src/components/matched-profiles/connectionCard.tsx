import { Calendar } from "lucide-react";
import { IConnection } from "../../utils/types";

interface ConnectionCardProps {
  connection: IConnection;
  onClick: (userId: string) => void;
}

// ConnectionCard Component
const ConnectionCard = ({ connection, onClick }: ConnectionCardProps) => {
  const { connectedUser, connectedAt } = connection;
  const timeSince = getTimeSinceConnection(connectedAt);

  return (
    <div
      className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={() => onClick(connectedUser._id)}
    >
      <div className="card-body p-4">
        <div className="flex items-center space-x-4">
          {/* Profile Avatar */}
          <div className="avatar">
            <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={connectedUser.photoUrl}
                alt={`${connectedUser.firstName} ${connectedUser.lastName}`}
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://ui-avatars.com/api/?name=${connectedUser.firstName}+${connectedUser.lastName}&background=random`;
                }}
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-base-content truncate">
              {connectedUser.firstName} {connectedUser.lastName}
            </h3>
            <p className="text-sm text-base-content/70 line-clamp-2">
              {connectedUser.about || "No bio available."}
            </p>
            <div className="flex items-center mt-2">
              <Calendar className="w-4 h-4 text-base-content/50 mr-1" />
              <span className="text-xs text-base-content/60">{timeSince}</span>
            </div>
          </div>
        </div>

        {/* Skills Preview */}
        {connectedUser.skills && connectedUser.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {connectedUser.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="badge badge-primary badge-sm">
                {skill}
              </span>
            ))}
            {connectedUser.skills.length > 3 && (
              <span className="badge badge-ghost badge-sm">
                +{connectedUser.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Utility function to format time since connection
const getTimeSinceConnection = (dateString: string) => {
  const connectionDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - connectionDate.getTime();

  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor(diffInMs / (1000 * 60));

  if (days > 0) {
    return `Connected ${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `Connected ${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `Connected ${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Connected just now";
  }
};

export default ConnectionCard;
