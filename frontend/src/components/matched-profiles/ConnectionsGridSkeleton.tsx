const ConnectionCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-4">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-16 h-16 rounded-full skeleton"></div>
          </div>

          {/* Text */}
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-3/4 rounded"></div>
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-3 w-24 rounded"></div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex gap-2 mt-3">
          <div className="skeleton h-5 w-16 rounded-full"></div>
          <div className="skeleton h-5 w-14 rounded-full"></div>
          <div className="skeleton h-5 w-10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const ConnectionsGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, idx) => (
        <ConnectionCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default ConnectionsGridSkeleton;
