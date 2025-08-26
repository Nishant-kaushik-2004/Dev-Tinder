import { useState } from "react";
import { Check, X, Heart } from "lucide-react";

// Request Card Component
const RequestCard = ({ request, onAccept, onReject, isProcessing }) => {
  const { fromUserId: user } = request;
  const [isHovered, setIsHovered] = useState(false);

  const handleAccept = async () => {
    await onAccept(request._id);
  };

  const handleReject = async () => {
    await onReject(request._id);
  };

  return (
    <div
      className={`card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl ${
        isHovered ? "transform scale-105" : ""
      } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-body p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Picture */}
          <div className="relative">
            <div className="avatar">
              <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user.photoUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=fff&size=80`;
                  }}
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-base-100 flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Name */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-base-content">
              {user.firstName} {user.lastName}
            </h3>
          </div>

          {/* Bio */}
          <p className="text-sm text-base-content/70 text-center leading-relaxed line-clamp-3">
            {user.about}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 justify-center max-w-full">
            {user.skills.slice(0, 4).map((skill, index) => (
              <div key={index} className="badge badge-primary badge-outline">
                {skill}
              </div>
            ))}
            {user.skills.length > 4 && (
              <div className="badge badge-neutral">
                +{user.skills.length - 4}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 w-full pt-2">
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="btn btn-outline flex-1 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Reject ${user.firstName}'s request`}
            >
              <X className="w-4 h-4" />
              Reject
            </button>

            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className="btn btn-primary flex-1 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Accept ${user.firstName}'s request`}
            >
              <Check className="w-4 h-4" />
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
