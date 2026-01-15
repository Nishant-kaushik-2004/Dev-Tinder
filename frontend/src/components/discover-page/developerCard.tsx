import { useRef, useState } from "react";
import { IUserInfo } from "../../utils/types";
import { useNavigate } from "react-router";

interface DeveloperCardProps {
  developer: IUserInfo;
  onSwipe: (direction: "left" | "right") => void;
}

const DRAG_THRESHOLD = 8; // ✅ NEW: distinguish click vs drag
const SWIPE_THRESHOLD = 120;

const DeveloperCard = ({ developer, onSwipe }: DeveloperCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null); // ✅ CHANGED: useRef instead of state
  const isDraggingRef = useRef(false); // ✅ NEW: tracks real dragging
  const hasMovedRef = useRef(false); // ✅ NEW: blocks tap after drag

  /* -------------------- Mouse Events -------------------- */

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = true;
    hasMovedRef.current = false; // ✅ reset
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !isDraggingRef.current) return;

    const offset = e.clientX - dragStartRef.current.x;

    // ✅ NEW: detect real drag
    if (Math.abs(offset) > DRAG_THRESHOLD) {
      hasMovedRef.current = true;
    }

    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;

    // If dragged enough (120px) → swipe
    if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      handleSwipe(dragOffset > 0 ? "right" : "left");
    } else {
      setDragOffset(0);
    }

    dragStartRef.current = null;
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    isDraggingRef.current = true;
    hasMovedRef.current = false; // reset
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dragStartRef.current || !isDraggingRef.current) return;

    const touch = e.touches[0];
    const offset = touch.clientX - dragStartRef.current.x;

    if (Math.abs(offset) > DRAG_THRESHOLD) {
      hasMovedRef.current = true;
    }

    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;

    if (Math.abs(dragOffset) > SWIPE_THRESHOLD) {
      handleSwipe(dragOffset > 0 ? "right" : "left");
    } else {
      setDragOffset(0);
    }

    dragStartRef.current = null;
    isDraggingRef.current = false;
  };

  const handleSwipe = (direction: "left" | "right") => {
    setIsAnimating(true);

    setTimeout(() => {
      onSwipe(direction);
      setIsAnimating(false);
      setDragOffset(0);
    }, 400);
  };

  const navigate = useNavigate();
  
  // Tap / Click Handler
  const handleClick = () => {
    // block click after drag
    if (hasMovedRef.current) return;

    navigate(`/user/${developer._id}`);
  };


  const rotation = dragOffset * 0.1;
  const opacity = 1 - Math.abs(dragOffset) / 300;

  return (
    <div className="relative min-w-[380px] w-[100%] sm:w-[400px] md:w-[420px] 2xl:w-[440px] h-[500px] 2xl:h-[550px] select-none">
      <div
        className={`card w-full h-full shadow-2xl cursor-grab active:cursor-grabbing transition-all duration-300 transform-gpu bg-base-100 overflow-hidden ${
          isAnimating
            ? dragOffset > 0
              ? "translate-x-full rotate-12 scale-95"
              : "-translate-x-full -rotate-12 scale-95"
            : ""
        }`}
        style={{
          transform: `translateX(${dragOffset}px) rotate(${rotation}deg) scale(${
            1 - Math.abs(dragOffset) / 1000
          })`,
          opacity: isAnimating ? 0 : opacity,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick} // ✅ NEW: controlled click
      >
        {/* Background Image */}
        <figure className="absolute inset-0">
          <img
            src={developer.photoUrl}
            alt={`${developer.firstName} ${developer.lastName}`}
            className="w-full h-full object-cover pointer-events-none"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-base-content/80 via-base-content/20 to-transparent"></div>
        </figure>

        {/* Swipe Indicators */}
        {dragOffset > 50 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-success text-6xl font-bold rotate-12 opacity-80">
            LIKE
          </div>
        )}
        {dragOffset < -50 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-error text-6xl font-bold -rotate-12 opacity-80">
            NOPE
          </div>
        )}

        {/* Content Overlay */}
        <div className="card-body absolute inset-0 flex flex-col justify-end p-6 text-base-100">
          {/* Top Info */}
          <div className="absolute top-6 right-6">
            <div className="badge badge-primary badge-lg font-bold">
              {developer.age}
            </div>
          </div>

          {/* Main Info */}
          <div className="space-y-4">
            <div>
              <h2 className="card-title text-3xl font-bold mb-2 text-base-100">
                {developer.firstName} {developer.lastName}
              </h2>
              <div className="flex items-center gap-2 text-lg text-base-100/90">
                <span>{developer.gender}</span>
                <div className="divider divider-horizontal mx-0"></div>
                <span className="capitalize">
                  {developer.skills?.[0] || "Developer"}
                </span>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-2">
              <p className="text-sm text-base-100/90 line-clamp-2">
                {developer.about}
              </p>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2">
              {developer.skills?.slice(0, 4).map((skill, index) => (
                <div
                  key={index}
                  className="badge badge-outline badge-sm text-base-100 border-base-100/50 hover:bg-base-100/10"
                >
                  {skill}
                </div>
              ))}
              {developer.skills && developer.skills.length > 4 && (
                <div className="badge badge-outline badge-sm text-base-100 border-base-100/50">
                  +{developer.skills.length - 4}
                </div>
              )}
            </div>

            {/* Action Hint */}
            <div className="text-center pt-2">
              <div className="text-xs text-base-100/60">
                Drag to swipe • Tap for more info
              </div>
            </div>
          </div>
        </div>

        {/* Card Border Effect */}
        <div className="absolute inset-0 rounded-2xl border border-base-100/10 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default DeveloperCard;
