import { MessageCircle, Search, Users } from "lucide-react";

const QuickActions = () => {
  return (
    <div className="mt-8 flex justify-center px-2">
      <div className="join flex flex-col sm:flex-row w-full sm:w-auto">
        <button className="btn join-item w-full sm:w-auto mb-2 sm:mb-0">
          <Search className="w-4 h-4 mr-2" />
          Advanced Search
        </button>
        <button className="btn join-item btn-primary w-full sm:w-auto mb-2 sm:mb-0">
          <Users className="w-4 h-4 mr-2" />
          View Matches
        </button>
        <button className="btn join-item w-full sm:w-auto">
          <MessageCircle className="w-4 h-4 mr-2" />
          Messages
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
