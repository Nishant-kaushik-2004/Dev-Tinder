// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="flex h-screen">
    <div className="w-full lg:w-96 border-r border-base-300">
      <div className="p-4 space-y-4">
        <div className="skeleton h-12 w-full rounded-lg"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="skeleton w-12 h-12 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-24"></div>
              <div className="skeleton h-3 w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 hidden lg:flex items-center justify-center">
      <div className="skeleton h-32 w-64 rounded-lg"></div>
    </div>
  </div>
);

export default SkeletonLoader;
