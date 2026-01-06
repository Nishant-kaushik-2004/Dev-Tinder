// Skeleton Loader Component
const RequestCardSkeleton = () => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body p-6">
      <div className="flex flex-col items-center space-y-4">
        {/* Profile Picture Skeleton */}
        <div className="w-20 h-20 bg-base-300 rounded-full animate-pulse"></div>

        {/* Name Skeleton */}
        <div className="w-32 h-6 bg-base-300 rounded animate-pulse"></div>

        {/* Bio Skeleton */}
        <div className="w-full space-y-2">
          <div className="h-4 bg-base-300 rounded animate-pulse"></div>
          <div className="h-4 bg-base-300 rounded animate-pulse w-3/4 mx-auto"></div>
        </div>

        {/* Skills Skeleton */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 w-16 bg-base-300 rounded-full animate-pulse"
            ></div>
          ))}
        </div>

        {/* Buttons Skeleton */}
        <div className="flex space-x-3 w-full">
          <div className="flex-1 h-10 bg-base-300 rounded-lg animate-pulse"></div>
          <div className="flex-1 h-10 bg-base-300 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

export default RequestCardSkeleton;
