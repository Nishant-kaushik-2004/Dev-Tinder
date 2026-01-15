import { useState, useEffect, useMemo } from "react";
import { Heart, User, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import ConnectionCard from "./connectionCard";
import ConnectionsGridSkeleton from "./ConnectionsGridSkeleton";
("./ConnectionsGridSkeleton");
import SearchAndSortBar from "./searchAndSortbar";
import { IConnection, IConnectionResponse } from "../../utils/types";
import axios from "axios";

// Main MatchesPage Component
const MatchesPage = () => {
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get<IConnectionResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/user/connections`,
          { withCredentials: true }
        );

        if (!res.data.connections) throw new Error("No connections data found");

        setConnections(res.data.connections);
        // setConnections(mockConnections);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, []);

  // Filter and sort connections
  const filteredAndSortedConnections = useMemo(() => {
    let filtered = connections;

    if (!searchTerm.trim()) {
      // Apply search filter
      const searchLower = searchTerm.toLowerCase();
      filtered = connections.filter(
        (connection) =>
          connection.connectedUser.firstName
            .toLowerCase()
            .includes(searchLower) ||
          connection.connectedUser.lastName.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.connectedAt);
      const dateB = new Date(b.connectedAt);

      if (sortOrder === "newest") {
        return dateB.getTime() - dateA.getTime(); // Newest first
      } else {
        return dateA.getTime() - dateB.getTime(); // Oldest first
      }
    });

    return sorted;
  }, [connections, searchTerm, sortOrder]);

  // Handle connection card click
  const handleConnectionClick = (userId: string) => {
    console.log("Navigate to profile:", userId);
    // In real app: navigate(`/profile/${userId}`);
    navigate(`/user/${userId}`);
  };

  return (
    <div className="container min-h-screen mx-auto px-4 py-8">
      <div className="xl:text-center mb-8">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-primary-content" />
          </div>
          <h1 className="text-3xl font-bold text-base-content">Your Matches</h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center mt-2">
            <div className="skeleton h-5 w-64 rounded-md"></div>
          </div>
        ) : (
          <p className="text-lg text-base-content/70">
            {connections.length === 0
              ? "You haven't found a match yet"
              : `${connections.length} developer${
                  connections.length !== 1 ? "s" : ""
                } you've connected with`}
          </p>
        )}
      </div>

      {/* Search and Sort Controls */}
      <SearchAndSortBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {/* Show content only if there are connections */}
      {isLoading ? (
        <div className="mt-12">
          {/* Connections Grid Skeleton */}
          <ConnectionsGridSkeleton />
        </div>
      ) : connections.length > 0 ? (
        <>
          {/* Results Count */}
          {searchTerm && (
            <div className="mb-4">
              <p className="text-sm text-base-content/70">
                {filteredAndSortedConnections.length} result
                {filteredAndSortedConnections.length !== 1 ? "s" : ""}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
          )}

          {/* Connections Grid */}
          {filteredAndSortedConnections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedConnections.map((connection) => (
                <ConnectionCard
                  key={connection._id}
                  connection={connection}
                  onClick={handleConnectionClick}
                />
              ))}
            </div>
          ) : (
            // No search results
            <div className="text-center py-12">
              <User className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-base-content mb-2">
                No matches found
              </h3>
              <p className="text-base-content/70">
                Try adjusting your search terms
              </p>
              <button
                className="btn btn-ghost btn-sm mt-3"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            </div>
          )}
        </>
      ) : (
        // Empty state when no connections exist
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
          <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-base-content/50" />
          </div>
          <h3 className="text-2xl font-bold text-base-content mb-3">
            No Matches Yet
          </h3>
          <p className="text-base-content/70 max-w-md mb-6">
            Start exploring profiles and make connections! Your matches will
            appear here once you've connected with other developers.
          </p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Start Exploring
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
