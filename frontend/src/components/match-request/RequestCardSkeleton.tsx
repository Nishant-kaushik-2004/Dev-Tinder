const RequestCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-4 animate-pulse">
        {/* Avatar + Name */}
        <div className="flex items-center space-x-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full bg-base-300" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-base-300 rounded"></div>
            <div className="h-3 w-1/2 bg-base-300 rounded"></div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full bg-base-300 rounded"></div>
          <div className="h-3 w-5/6 bg-base-300 rounded"></div>
          <div className="h-3 w-2/3 bg-base-300 rounded"></div>
        </div>

        {/* Skills */}
        <div className="flex gap-2 mt-4">
          <div className="h-5 w-14 bg-base-300 rounded-full"></div>
          <div className="h-5 w-12 bg-base-300 rounded-full"></div>
          <div className="h-5 w-10 bg-base-300 rounded-full"></div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <div className="h-9 flex-1 bg-base-300 rounded-lg"></div>
          <div className="h-9 flex-1 bg-base-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default RequestCardSkeleton;