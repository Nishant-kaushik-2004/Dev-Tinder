import { User } from "lucide-react";

// Live Profile Card Preview Component
const ProfileCardPreview = ({ user }) => {
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-base-300/50">
        {/* Profile Image */}
        <div className="relative h-[26rem] sm:h-[28rem] overflow-hidden">
          <img
            src={
              validateUrl(user.photoUrl)
                ? user.photoUrl
                : "https://via.placeholder.com/400x400?text=Photo"
            }
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x400?text=Error";
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Age badge */}
          {user.age && (
            <div className="absolute top-4 right-4">
              <div className="badge badge-primary badge-lg font-bold text-primary-content">
                {user.age}
              </div>
            </div>
          )}
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          {/* Name and basic info */}
          <div className="space-y-2 mb-3">
            <h2 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>

            {user.gender && (
              <div className="flex items-center gap-2 text-sm opacity-90">
                <User size={16} />
                <span className="capitalize">{user.gender}</span>
                {user.skills?.[0] && (
                  <>
                    <span>•</span>
                    <span>{user.skills[0]}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* About section */}
          {user.about && (
            <div className="mb-3">
              <p className="text-sm opacity-90 line-clamp-3">{user.about}</p>
            </div>
          )}

          {/* Skills */}
          {user.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, 4).map((skill, index) => (
                <div
                  key={index}
                  className="badge badge-sm bg-white/20 text-white border-white/30 backdrop-blur-sm"
                >
                  {skill}
                </div>
              ))}
              {user.skills.length > 4 && (
                <div className="badge badge-sm bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  +{user.skills.length - 4}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Card border effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-white/10 pointer-events-none"></div>
      </div>

      {/* Preview label */}
      <div className="text-center mt-3">
        <div className="text-xs text-base-content/60 font-medium">
          Live Preview
        </div>
      </div>
    </div>
  );
};

export default ProfileCardPreview;
