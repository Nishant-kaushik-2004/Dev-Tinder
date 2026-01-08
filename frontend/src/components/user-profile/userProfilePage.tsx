import { useState, useEffect } from "react";
import {
  Edit,
  MessageCircle,
  MapPin,
  Calendar,
  Briefcase,
  Star,
} from "lucide-react";
import ProfileImageModal from "./profileImageModal";
import SkeletonLoader from "./skeletonLoader";
import ConnectionSection from "./connectionSection";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState } from "../../store/store";
import { IFetchProfileResponse, IUser } from "../../utils/types";
import axios from "axios";

const UserProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<IUser | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const { userId } = useParams();
  console.log(userId);

  const loggedInUser = useSelector((state: RootState) => state.loggedInUser);

  const loggedInUserId = loggedInUser._id;

  // Mock profile data - replace with actual API call
  const mockProfileData = {
    id: "user-456",
    firstName: "Sarah",
    lastName: "Johnson",
    profileImage:
      "https://physicaleducationandwellness.mit.edu/wp-content/uploads/Untitled-1.png",
    bio: "Full-stack developer passionate about creating innovative solutions. I love working with React, Node.js, and exploring new technologies. Always eager to collaborate on exciting projects!",
    location: "San Francisco, CA",
    skills: [
      "React",
      "Node.js",
      "Python",
      "TypeScript",
      "MongoDB",
      "AWS",
      "Docker",
      "GraphQL",
    ],
    jobTitle: "Senior Software Engineer",
    company: "TechCorp Inc.",
    experience: "5+ years",
    joinedDate: "March 2023",
    lastActive: "2 hours ago",
    connectionStatus: "connected", // 'connected', 'pending_sent', 'pending_received', 'not_connected', 'own_profile'
    mutualConnections: 12,
  };

  useEffect(() => {
    if (!userId) {
      setProfileData(loggedInUser);
      return;
    }
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get<IFetchProfileResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/user/${userId}`,
          { withCredentials: true }
        );

        if (!res.data.user) {
          throw new Error("No User details found");
        }

        console.log(res.data.user);
        setProfileData(res.data.user);

        // Check if viewing own profile
        // if (profileData?._id === loggedInUserId) {
        //   profileData.connectionStatus = "own_profile";
        // }
      } catch (error) {
        console.log(error.response?.data);
        const errorMessage = error.response?.data || "No User found";
        console.log(errorMessage);
      } finally {
        setProfileData(mockProfileData);
        // setProfileData(profileDetails);
        setIsLoading(false);
      }
    };

    fetchProfile();
    console.log("useEffect runs");
  }, [loggedInUserId, userId]);

  const handleConnectionAction = async (action, userId) => {
    console.log(`${action} for user ${userId}`);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update connection status based on action
    setProfileData((prev) => ({
      ...prev,
      connectionStatus:
        action === "send"
          ? "pending_sent"
          : action === "accept"
          ? "connected"
          : action === "cancel"
          ? "not_connected"
          : action === "reject"
          ? "not_connected"
          : prev.connectionStatus,
    }));
  };

  const handleEditProfile = () => {
    console.log("Redirect to edit profile page");
    // In real app: navigate('/edit-profile')
  };

  const handleMessage = () => {
    console.log("Open chat with user");
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
                  src={profileData.profileImage}
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
                  <span>Joined {profileData.joinedDate}</span>
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
                  {profileData.bio}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">
                  Skills & Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
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

            {/* Activity Section */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Activity</h2>
                <div className="flex items-center gap-2 text-base-content/70">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
                  <span>Last active {profileData.lastActive}</span>
                </div>

                {profileData.mutualConnections > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-base-content/70">
                    <span className="font-medium text-primary">
                      {profileData.mutualConnections}
                    </span>
                    <span>mutual connections</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-4">
            {/* Connection Status */}
            <ConnectionSection
              connectionStatus={profileData.connectionStatus}
              onAction={handleConnectionAction}
              userId={profileData.id}
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
                      Connect to send messages
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Profile Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Skills</span>
                    <span className="font-semibold">
                      {profileData.skills.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Experience</span>
                    <span className="font-semibold">
                      {profileData.experience}
                    </span>
                  </div>
                  {profileData.mutualConnections > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-base-content/70">
                        Mutual Connections
                      </span>
                      <span className="font-semibold">
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
        imageSrc={profileData.profileImage}
        userName={`${profileData.firstName} ${profileData.lastName}`}
      />
    </div>
  );
};

export default UserProfilePage;
