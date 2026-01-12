import { useState, useEffect } from "react";
import { MessageCircle, MapPin, Calendar, Briefcase, Star } from "lucide-react";
import ProfileImageModal from "./profileImageModal";
import SkeletonLoader from "./skeletonLoader";
import ConnectionSection from "./connectionSection";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { RootState } from "../../store/store";
import {
  ConnectionActionType,
  connectionStatusType,
  IFetchProfileResponse,
  IUserProfile,
  statusType,
} from "../../utils/types";
import axios, { AxiosError } from "axios";
import formatTimestamp from "../../helper/formatTimeStamp";

const UserProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<IUserProfile | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const navigate = useNavigate();
  const { userId } = useParams();
  const { pathname } = useLocation();

  const isOwnProfile = pathname === "/profile" || pathname === "/profile/";

  const loggedInUser = useSelector((state: RootState) => state.loggedInUser);

  const loggedInUserId = loggedInUser._id;

  // const mockProfileData = {
  //   id: "user-456",
  //   firstName: "Sarah",
  //   lastName: "Johnson",
  //   profileImage:
  //     "https://physicaleducationandwellness.mit.edu/wp-content/uploads/Untitled-1.png",
  //   bio: "Full-stack developer passionate about creating innovative solutions. I love working with React, Node.js, and exploring new technologies. Always eager to collaborate on exciting projects!",
  //   location: "San Francisco, CA",
  //   skills: [
  //     "React",
  //     "Node.js",
  //     "Python",
  //     "TypeScript",
  //     "MongoDB",
  //     "AWS",
  //     "Docker",
  //     "GraphQL",
  //   ],
  //   jobTitle: "Senior Software Engineer",
  //   company: "TechCorp Inc.",
  //   experience: "5+ years",
  //   joinedDate: "March 2023",
  //   lastActive: "2 hours ago",
  //   connectionStatus: "connected", // 'connected', 'pending_sent', 'pending_received', 'not_connected', 'own_profile'
  //   mutualConnections: 12,
  // };

  useEffect(() => {
    if (!userId && !isOwnProfile) return;

    // 🔁 If user is trying to view their own profile via /user/:id
    if (userId === loggedInUserId) {
      navigate("/profile", { replace: true });
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get<IFetchProfileResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/profile/view/${
            isOwnProfile ? loggedInUserId : userId
          }`,
          { withCredentials: true }
        );

        if (!res.data.user) {
          throw new Error("No User details found");
        }

        console.log(res.data.user);
        setProfileData(res.data.user);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError);
        const errorMessage = axiosError.response?.data || "No User found";
        console.log(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [loggedInUserId, userId, isOwnProfile, navigate]);

  const ACTION_CONFIG: Record<
    ConnectionActionType,
    {
      method: "post" | "patch" | "delete";
      endpoint: (userId: string) => string;
      status?: statusType;
    }
  > = {
    send: {
      method: "post",
      endpoint: (userId) => `/request/send/${userId}`,
      status: "interested",
    },
    accept: {
      method: "patch",
      endpoint: (userId) => `/requests/review/${userId}`,
      status: "accepted",
    },
    reject: {
      method: "patch",
      endpoint: (userId) => `/requests/review/${userId}`,
      status: "rejected",
    },
    cancel: {
      method: "delete",
      endpoint: (userId) => `/requests/cancel/${userId}`,
    },
  };

  const optimisticStatusMap: Record<
    ConnectionActionType,
    connectionStatusType
  > = {
    send: "pending_sent",
    accept: "connected",
    reject: "not_connected",
    cancel: "not_connected",
  };

  const handleConnectionAction = async (
    action: ConnectionActionType,
    userId: string
  ) => {
    if (!profileData) return;

    const previousStatus = profileData.connectionStatus;

    // 🔹 Optimistic UI update
    setProfileData((prev) =>
      prev
        ? {
            ...prev,
            connectionStatus: optimisticStatusMap[action],
          }
        : prev
    );

    const { method, endpoint } = ACTION_CONFIG[action];

    try {
      const res = await axios({
        method,
        url: `${import.meta.env.VITE_BACKEND_URL}${endpoint(userId)}`,
        data: { status: ACTION_CONFIG[action].status },
        withCredentials: true,
      });

      console.log(res.data);
    } catch (error) {
      // 🔻 Rollback on failure
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              connectionStatus: previousStatus,
            }
          : prev
      );

      const axiosError = error as AxiosError<{ message?: string }>;
      console.error(
        "Connection action failed:",
        axiosError.response?.data?.message || axiosError.message
      );

      // toast / alert
      // toast.error("Something went wrong. Please try again.");
    }
  };

  const handleEditProfile = () => {
    console.log("Redirect to edit profile page");
    navigate("/profile/edit");
  };

  const handleMessage = () => {
    console.log("Open chat with user");
    navigate(`/messages/user/${profileData?._id}`);
    // In real app: navigate to chat or open chat modal
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-2">
            Profile Not Found
          </h2>
          <p className="text-base-content/70">
            The profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Profile Image */}
            <div
              className="avatar cursor-pointer group"
              onClick={() => setShowImageModal(true)}
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full ring ring-base-100 ring-offset-base-100 ring-offset-4 group-hover:ring-accent transition-all duration-300 shadow-xl">
                <img
                  src={profileData.photoUrl}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="text-center md:text-left text-primary-content flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {profileData.firstName} {profileData.lastName}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                {profileData.jobTitle && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Briefcase size={16} />
                    <span className="font-medium">{profileData.jobTitle}</span>
                    {profileData.company && (
                      <span className="opacity-80">
                        at {profileData.company}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm opacity-90">
                {profileData.location && (
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <MapPin size={14} />
                    <span>{profileData.location}</span>
                  </div>
                )}

                {profileData.experience && (
                  <div className="flex items-center gap-1 justify-center sm:justify-start">
                    <Star size={14} />
                    <span>{profileData.experience} experience</span>
                  </div>
                )}

                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <Calendar size={14} />
                  <span>
                    Joined {formatTimestamp(new Date(profileData.createdAt))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">About</h2>
                <p className="text-base-content/80 leading-relaxed">
                  {profileData.about.length > 0
                    ? profileData.about
                    : "This user hasn’t added an about yet."}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            {profileData.skills && profileData.skills.length > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">
                    Skills & Technologies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills?.map((skill, index) => (
                      <div
                        key={index}
                        className="badge badge-primary badge-lg p-3 font-medium hover:badge-accent transition-colors cursor-default"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Activity Section */}
            {typeof profileData.mutualConnections === "number" && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Activity</h2>
                  {/* {profileData.lastActive &&  (<div className="flex items-center gap-2 text-base-content/70">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
                  <span>Last active: {"N/A"}</span>
                </div>)} */}

                  <div className="mt-3 flex items-center gap-2 text-base-content/70">
                    {profileData.mutualConnections === 0 ? (
                      <span>No mutual connections yet</span>
                    ) : (
                      <>
                        <span>Mutual connections:</span>
                        <span className="font-medium text-primary">
                          {profileData.mutualConnections}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            {/* Connection Status */}
            <ConnectionSection
              connectionStatus={profileData.connectionStatus!}
              onAction={handleConnectionAction}
              userId={profileData._id}
              onEditProfile={handleEditProfile}
            />

            {/* Actions */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    className="btn btn-outline w-full gap-2"
                    onClick={handleMessage}
                    disabled={profileData.connectionStatus !== "connected"}
                  >
                    <MessageCircle size={16} />
                    Message
                  </button>

                  {profileData.connectionStatus !== "connected" && (
                    <div className="text-xs text-base-content/60 text-center">
                      {profileData.connectionStatus !== "own_profile"
                        ? `Connect with ${profileData.firstName} to enable messaging`
                        : "Cannot message yourself"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Profile Stats</h3>

                <div className="space-y-3 text-sm">
                  {/* Skills */}
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Skills</span>
                    <span className="font-medium">
                      {Array.isArray(profileData.skills) &&
                      profileData.skills.length > 0
                        ? profileData.skills.length
                        : "—"}
                    </span>
                  </div>

                  {/* Experience */}
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Experience</span>
                    <span className="font-medium">
                      {typeof profileData.experience === "number"
                        ? `${profileData.experience} ${
                            profileData.experience === 1 ? "year" : "years"
                          }`
                        : "—"}
                    </span>
                  </div>

                  {/* Mutual Connections */}
                  {typeof profileData.mutualConnections === "number" && (
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">
                        Mutual Connections
                      </span>
                      <span className="font-medium text-primary">
                        {profileData.mutualConnections}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Image Modal */}
      <ProfileImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageSrc={profileData.photoUrl}
        userName={`${profileData.firstName} ${profileData.lastName}`}
      />
    </div>
  );
};

export default UserProfilePage;
