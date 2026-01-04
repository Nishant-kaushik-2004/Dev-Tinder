const ChatWindowSkeleton = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <div className="flex-1 flex flex-col h-screen bg-base-100">
      {/* Header Skeleton */}
      <div className="navbar bg-base-200 border-b border-base-300 px-4">
        {isMobile && (
          <div className="btn btn-ghost btn-circle mr-2 skeleton w-10 h-10" />
        )}

        <div className="flex-1 flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full skeleton" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-3 w-16" />
          </div>
        </div>

        <div className="btn btn-ghost btn-circle skeleton w-10 h-10" />
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Incoming message */}
        <div className="flex gap-2">
          <div className="avatar">
            <div className="w-8 h-8 rounded-full skeleton" />
          </div>
          <div className="max-w-[70%]">
            <div className="skeleton h-10 w-56 rounded-2xl" />
            <div className="skeleton h-3 w-14 mt-2" />
          </div>
        </div>

        {/* Outgoing message */}
        <div className="flex justify-end gap-2">
          <div className="max-w-[70%]">
            <div className="skeleton h-10 w-40 rounded-2xl" />
            <div className="skeleton h-3 w-12 mt-2 ml-auto" />
          </div>
        </div>

        {/* Incoming message (longer) */}
        <div className="flex gap-2">
          <div className="avatar">
            <div className="w-8 h-8 rounded-full skeleton" />
          </div>
          <div className="max-w-[70%]">
            <div className="skeleton h-12 w-72 rounded-2xl" />
            <div className="skeleton h-3 w-20 mt-2" />
          </div>
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="p-4 bg-base-200 border-t border-base-300">
        <div className="flex gap-2">
          <div className="skeleton h-12 flex-1 rounded-lg" />
          <div className="skeleton h-12 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ChatWindowSkeleton;