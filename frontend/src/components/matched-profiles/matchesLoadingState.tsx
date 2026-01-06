import { Search, ArrowUpDown } from "lucide-react";

// Individual Connection Card Skeleton
const ConnectionCardSkeleton = () => (
  <div className="card bg-base-100 shadow-lg">
    <div className="card-body p-4">
      <div className="flex items-center space-x-4">
        {/* Profile Avatar Skeleton */}
        <div className="avatar">
          <div className="w-16 h-16 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2">
            <div className="w-full h-full bg-base-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* User Info Skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Name skeleton */}
          <div className="h-5 bg-base-300 rounded animate-pulse w-3/4"></div>
          
          {/* About skeleton */}
          <div className="h-4 bg-base-300 rounded animate-pulse w-full"></div>
          
          {/* Time since connection skeleton */}
          <div className="flex items-center mt-2">
            <div className="w-4 h-4 bg-base-300 rounded animate-pulse mr-1"></div>
            <div className="h-3 bg-base-300 rounded animate-pulse w-24"></div>
          </div>
        </div>
      </div>

      {/* Skills Preview Skeleton */}
      <div className="flex flex-wrap gap-1 mt-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 w-16 bg-base-300 rounded-full animate-pulse"
          ></div>
        ))}
        <div className="h-6 w-8 bg-base-300 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Search and Sort Bar Skeleton
const SearchAndSortBarSkeleton = () => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    {/* Search Input Skeleton */}
    <div className="relative flex-1">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-base-300 rounded animate-pulse"></div>
      <div className="input input-bordered w-full pl-10 h-12 bg-base-300 animate-pulse border-base-300"></div>
    </div>

    {/* Sort Dropdown Skeleton */}
    <div className="relative">
      <div className="select select-bordered w-full sm:w-32 h-12 bg-base-300 animate-pulse border-base-300"></div>
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-base-200 rounded animate-pulse"></div>
    </div>
  </div>
);

// // Page Header Skeleton
// const PageHeaderSkeleton = () => (
//   <div className="mb-8">
//     <div className="h-9 bg-base-300 rounded animate-pulse w-48 mb-2"></div>
//     <div className="h-5 bg-base-300 rounded animate-pulse w-64"></div>
//   </div>
// );

// Grid Skeleton with responsive columns
const ConnectionsGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        style={{
          animationDelay: `${index * 100}ms`,
          animationDuration: '1.5s'
        }}
        className="animate-pulse"
      >
        <ConnectionCardSkeleton />
      </div>
    ))}
  </div>
);

// Main Skeleton Loader Component
const MatchesPageSkeleton = ({ showSearchBar = true, cardCount = 8 }) => (
  <div className="container min-h-screen mx-auto px-4 py-8">
    {/* Search and Sort Bar Skeleton */}
    {showSearchBar && <SearchAndSortBarSkeleton />}

    {/* Connections Grid Skeleton */}
    <ConnectionsGridSkeleton count={cardCount} />
  </div>
);

// Alternative: Compact Skeleton for quicker loads
const CompactMatchesSkeleton = () => (
  <div className="container min-h-screen mx-auto px-4 py-8">
    {/* Header */}
    <div className="mb-8">
      <div className="skeleton h-8 w-48 mb-3"></div>
      <div className="skeleton h-4 w-64"></div>
    </div>

    {/* Search Bar */}
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="skeleton h-12 flex-1"></div>
      <div className="skeleton h-12 w-full sm:w-32"></div>
    </div>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card bg-base-100 shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-center space-x-4">
              <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-3 w-full"></div>
                <div className="skeleton h-3 w-1/2"></div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <div className="skeleton h-6 w-16"></div>
              <div className="skeleton h-6 w-12"></div>
              <div className="skeleton h-6 w-14"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Loading State Component with variants
const MatchesLoadingState = ({ 
  variant = "variant", 
  showSearchBar = true, 
  cardCount = 8 
}) => {
  if (variant === "compact") {
    return <CompactMatchesSkeleton />;
  }
  
  return (
    <MatchesPageSkeleton 
      showSearchBar={showSearchBar} 
      cardCount={cardCount} 
    />
  );
};

// Export all components
export {
  MatchesPageSkeleton,
  CompactMatchesSkeleton,
  MatchesLoadingState,
  ConnectionCardSkeleton,
  SearchAndSortBarSkeleton,
  ConnectionsGridSkeleton
};

// Default export
export default MatchesLoadingState;