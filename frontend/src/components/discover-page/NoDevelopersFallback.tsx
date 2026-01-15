import { RefreshCcw, Filter, Users } from "lucide-react";

const NoDevelopersFallback = ({ onRefresh }: { onRefresh: () => void }) => {
  return (
    <div className="relative min-w-[380px] w-full sm:w-[400px] md:w-[420px] 2xl:w-[440px] h-[500px] 2xl:h-[550px] flex items-center justify-center">
      <div className="card w-full h-full bg-base-100 shadow-xl border border-base-200 flex flex-col items-center justify-center p-8 text-center space-y-4">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center">
          <Users className="w-8 h-8 text-base-content/50" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold">You're all caught up 🎉</h2>

        {/* Description */}
        <p className="text-sm text-base-content/60 max-w-xs">
          No more developers match your preferences right now. Try adjusting
          filters or check back later.
        </p>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button onClick={onRefresh} className="btn btn-primary btn-sm gap-2">
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>

          <button
            onClick={() => document.getElementById("filterBtn")?.click()}
            className="btn btn-outline btn-sm gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Hint */}
        <p className="text-xs text-base-content/40 pt-4">
          New developers join daily
        </p>
      </div>
    </div>
  );
};

export default NoDevelopersFallback;
