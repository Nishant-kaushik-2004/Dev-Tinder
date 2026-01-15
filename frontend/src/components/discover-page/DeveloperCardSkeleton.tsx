const DeveloperCardSkeleton = () => {
  return (
    <div className="relative min-w-[380px] w-full sm:w-[400px] md:w-[420px] 2xl:w-[440px] h-[500px] 2xl:h-[550px]">
      <div className="card w-full h-full bg-base-100 shadow-2xl overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-base-300 animate-pulse" />

        {/* Gradient overlay (same as real card) */}
        <div className="absolute inset-0 bg-gradient-to-t from-base-content/80 via-base-content/20 to-transparent" />

        {/* Content skeleton */}
        <div className="card-body absolute inset-0 flex flex-col justify-end p-6 text-base-100">
          {/* Age badge */}
          <div className="absolute top-6 right-6 h-8 w-12 rounded-full bg-base-300 animate-pulse" />

          <div className="space-y-4">
            {/* Name */}
            <div className="h-8 w-3/4 rounded bg-base-300 animate-pulse" />

            {/* Meta row */}
            <div className="flex gap-2">
              <div className="h-4 w-20 rounded bg-base-300 animate-pulse" />
              <div className="h-4 w-24 rounded bg-base-300 animate-pulse" />
            </div>

            {/* About */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-base-300 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-base-300 animate-pulse" />
            </div>

            {/* Skills */}
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-6 w-16 rounded-full bg-base-300 animate-pulse"
                />
              ))}
            </div>

            {/* Hint */}
            <div className="h-3 w-32 mx-auto rounded bg-base-300 animate-pulse mt-2" />
          </div>
        </div>

        {/* Border */}
        <div className="absolute inset-0 rounded-2xl border border-base-100/10 pointer-events-none" />
      </div>
    </div>
  );
};

export default DeveloperCardSkeleton;