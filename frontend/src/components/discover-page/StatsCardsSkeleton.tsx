const StatCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          {/* Left content */}
          <div className="space-y-3 w-full">
            {/* Title */}
            <div className="h-4 w-28 rounded bg-base-300 animate-pulse" />

            {/* Main number */}
            <div className="h-5 w-20 rounded bg-base-300 animate-pulse" />

            {/* Sub text */}
            <div className="h-4 w-36 rounded bg-base-300 animate-pulse" />
          </div>

          {/* Icon placeholder */}
          <div className="h-8 w-8 rounded-full bg-base-300 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const StatsCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
};

export default StatsCardsSkeleton;
