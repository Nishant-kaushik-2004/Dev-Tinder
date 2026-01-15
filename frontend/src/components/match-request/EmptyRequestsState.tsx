import { Users, Target } from "lucide-react";

// Empty State Component
const EmptyState = ({ onDiscoverClick }: { onDiscoverClick: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-32 h-32 bg-base-200 rounded-full flex items-center justify-center mb-8">
      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
        <Users className="w-10 h-10 text-primary-content" />
      </div>
    </div>

    <div className="text-center max-w-md">
      <h3 className="text-2xl font-bold text-base-content mb-3">
        No match requests
      </h3>
      <p className="text-base-content/70 mb-8 leading-relaxed">
        You're all caught up! Start exploring to connect with amazing developers
        who share your interests.
      </p>

      <button
        onClick={onDiscoverClick}
        className="btn btn-primary transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Target className="w-5 h-5 mr-2" />
        Discover People
      </button>
    </div>
  </div>
);

export default EmptyState;
