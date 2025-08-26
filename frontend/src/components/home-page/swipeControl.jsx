import {
  Heart,
  X,
  Trophy,
} from "lucide-react";

// Swipe Controls Component
const SwipeControls = ({ onSwipe }) => {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button
        className="btn btn-circle btn-lg btn-error hover:btn-outline"
        onClick={() => onSwipe("left")}
      >
        <X className="w-6 h-6" />
      </button>
      <button className="btn btn-circle btn-lg btn-warning hover:btn-outline">
        <Trophy className="w-6 h-6" />
      </button>
      <button
        className="btn btn-circle btn-lg btn-success hover:btn-outline"
        onClick={() => onSwipe("right")}
      >
        <Heart className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SwipeControls;
