import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { mockRequestsData } from "../../data/mockConnections";
import { useNavigate } from "react-router";
import RequestCardSkeleton from "./skeletonLoader";
import EmptyState from "./EmptyState";
import RequestCard from "./RequestCard";

const MatchRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());

  const navigate = useNavigate();

  // Simulate API call to fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real app:
      // const response = await axios.get('/user/requests/received');
      // setRequests(response.data.requests);

      setRequests(mockRequestsData.requests);
      setIsLoading(false);
    };

    fetchRequests();
  }, []);

  // Handle accept request
  const handleAcceptRequest = async (requestId) => {
    setProcessingIds((prev) => new Set([...prev, requestId]));

    try {
      // Optimistic update
      setRequests((prev) => prev.filter((req) => req._id !== requestId));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In real app:
      // await axios.post(`/user/requests/${requestId}/accept`);

      console.log("Request accepted:", requestId);
    } catch (error) {
      console.error("Error accepting request:", error);
      // Revert optimistic update on error
      // You might want to refetch data or show error message
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  // Handle reject request
  const handleRejectRequest = async (requestId) => {
    setProcessingIds((prev) => new Set([...prev, requestId]));

    try {
      // Optimistic update
      setRequests((prev) => prev.filter((req) => req._id !== requestId));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In real app:
      // await axios.post(`/user/requests/${requestId}/reject`);

      console.log("Request rejected:", requestId);
    } catch (error) {
      console.error("Error rejecting request:", error);
      // Revert optimistic update on error
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  // Handle discover click
  const handleDiscoverClick = () => {
    console.log("Navigate to discover page");
    // In real app: navigate('/discover');
    navigate("/");
  };

  // Handle back navigation (only for mobile)
  const handleBackClick = () => {
    console.log("Navigate back");
    navigate(-1);
    // In real app: navigate(-1) or navigate('/matches');
  };

  return (
    <div className="container min-h-screen bg-base-200">
      <div className="mx-auto px-4 py-8">
        {/* Navigation - Only show on mobile */}
        {/* <div className="flex items-center space-x-4 mb-8 md:hidden">
          <button
            onClick={handleBackClick}
            className="btn btn-ghost btn-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div> */}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-primary-content" />
            </div>
            <h1 className="text-3xl font-bold text-base-content">
              Match Requests
            </h1>
          </div>

          {!isLoading && (
            <p className="text-lg text-base-content/70">
              {requests.length === 0
                ? "No pending requests at the moment"
                : `You have ${requests.length} pending request${
                    requests.length !== 1 ? "s" : ""
                  }`}
            </p>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          // Skeleton Loading State
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <RequestCardSkeleton key={i} />
            ))}
          </div>
        ) : requests.length === 0 ? (
          // Empty State
          <EmptyState onDiscoverClick={handleDiscoverClick} />
        ) : (
          // Requests Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-6">
            {requests.map((request, index) => (
              <div
                key={request._id}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "both",
                }}
                className="animate-fade-in-up"
              >
                <RequestCard
                  request={request}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                  isProcessing={processingIds.has(request._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MatchRequests;
