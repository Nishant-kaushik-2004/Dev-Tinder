import { useState } from "react";

// Developer Card Component
const DeveloperCard = ({ developer, onSwipe }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!dragStart || !isDragging) return;
    e.preventDefault(); // stop page from scrolling
    const offset = e.clientX - dragStart.x;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return; // ✅ Prevent multiple triggers (🚨 V.V.V.Imp oyherwise is gets swiped two or may be three times)
    if (Math.abs(dragOffset) > 120) {
      handleSwipe(dragOffset > 0 ? "right" : "left");
    } else {
      setDragOffset(0);
    }
    setDragStart(null);
    setIsDragging(false);
  };

  const handleSwipe = (direction) => {
    setIsAnimating(true);
    setTimeout(() => {
      onSwipe(direction);
      setIsAnimating(false);
      setDragOffset(0);
    }, 400);
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!dragStart || !isDragging) return;
    e.preventDefault(); // stop swipe from scrolling the page
    const touch = e.touches[0];
    const offset = touch.clientX - dragStart.x;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return; // ✅ Prevent multiple triggers (🚨 V.V.V.Imp oyherwise is gets swiped two or may be three times)
    if (Math.abs(dragOffset) > 120) {
      handleSwipe(dragOffset > 0 ? "right" : "left");
    } else {
      setDragOffset(0);
    }
    setDragStart(null);
    setIsDragging(false);
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
              {developer.skills?.length > 4 && (
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
