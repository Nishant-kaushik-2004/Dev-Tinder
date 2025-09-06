import { useState, useEffect, useMemo } from "react";
import { Search, Heart, User, ArrowUpDown, Sparkles } from "lucide-react";
import { mockConnections } from "../../data/mockConnections";
import { useNavigate } from "react-router";
import ConnectionCard from "./connectionCard";
import {
  ConnectionsGridSkeleton,
  SearchAndSortBarSkeleton,
} from "./MatchesLoadingState";
import SearchAndSortBar from "./searchAndSortbar";

// Main MatchesPage Component
const MatchesPage = () => {
  const [connections, setConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Simulate API call to fetch connections
  useEffect(() => {
    const fetchConnections = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // In real app, this would be:
      // const response = await axios.get('/api/connections/accepted');
      // setConnections(response.data);

      setConnections(mockConnections);
      setIsLoading(false);
    };

    fetchConnections();
  }, []);

  // Filter and sort connections
  const filteredAndSortedConnections = useMemo(() => {
    let filtered = connections;

    // Apply search filter
    if (searchTerm.trim()) {
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
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === "newest") {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

    return sorted;
  }, [connections, searchTerm, sortOrder]);

  // Handle connection card click
  const handleConnectionClick = (userId) => {
    console.log("Navigate to profile:", userId);
    // In real app: navigate(`/profile/${userId}`);
    navigate(`/user?user=${userId}`);
  };

  // if (isLoading) {
  //   return (
  //     <MatchesLoadingState
  //       variant="default" // or "compact"
  //       showSearchBar={true}
  //       cardCount={8}
  //     />
  //   );
  // }

  return (
    <div className="container min-h-screen mx-auto px-4 py-8">
      <div className="xl:text-center mb-8">
        <div className="inline-flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-primary-content" />
          </div>
          <h1 className="text-3xl font-bold text-base-content">Your Matches</h1>
        </div>
        {!isLoading && (
          <p className="text-lg text-base-content/70">
            {connections.length === 0
              ? "You haven't found a match yet"
              : `${connections.length} developer${
                  connections.length !== 1 ? "s" : ""
                } 
          you've connected with`}
          </p>
        )}
      </div>
      {/* Page Header */}
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">
          Your Matches
        </h1>
        <p className="text-base-content/70">
          {connections.length} developer{connections.length !== 1 ? "s" : ""}{" "}
          you've connected with
        </p>
      </div> */}

      {/* Show content only if there are connections */}
      {isLoading ? (
        <div className="mt-12">
          {/* Search and Sort Bar Skeleton */}
          <SearchAndSortBarSkeleton />

          {/* Connections Grid Skeleton */}
          <ConnectionsGridSkeleton />
        </div>
      ) : connections.length > 0 ? (
        <>
          {/* Search and Sort Controls */}
          <SearchAndSortBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />

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
