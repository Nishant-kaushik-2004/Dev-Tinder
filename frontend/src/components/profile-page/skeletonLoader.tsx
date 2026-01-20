const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Profile Image Skeleton */}
            <div className="skeleton w-32 h-32 md:w-40 md:h-40 rounded-full shrink-0"></div>
            
            {/* Basic Info Skeleton */}
            <div className="text-center md:text-left flex-1 space-y-3">
              <div className="skeleton h-10 w-64 mx-auto md:mx-0"></div>
              <div className="skeleton h-6 w-48 mx-auto md:mx-0"></div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center md:justify-start">
                <div className="skeleton h-4 w-32"></div>
                <div className="skeleton h-4 w-24"></div>
                <div className="skeleton h-4 w-28"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section Skeleton */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="skeleton h-8 w-32 mb-4"></div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-3/4"></div>
                  <div className="skeleton h-4 w-5/6"></div>
                </div>
              </div>
            </div>

            {/* Skills Section Skeleton */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="skeleton h-8 w-48 mb-4"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="skeleton h-8 w-20"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Section Skeleton */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="skeleton h-8 w-24 mb-4"></div>
                <div className="flex items-center gap-2">
                  <div className="skeleton w-3 h-3 rounded-full"></div>
                  <div className="skeleton h-4 w-32"></div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div className="skeleton h-4 w-4"></div>
                  <div className="skeleton h-4 w-40"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-4">
            {/* Connection Status Skeleton */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="skeleton h-6 w-36 mb-4"></div>
                <div className="skeleton h-12 w-full mb-2"></div>
                <div className="skeleton h-4 w-3/4 mx-auto"></div>
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="skeleton h-6 w-20 mb-4"></div>
                <div className="skeleton h-10 w-full mb-2"></div>
                <div className="skeleton h-4 w-2/3 mx-auto"></div>
              </div>
            </div>

            {/* Quick Stats Skeleton */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="skeleton h-6 w-28 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="skeleton h-4 w-20"></div>
                      <div className="skeleton h-4 w-12"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;