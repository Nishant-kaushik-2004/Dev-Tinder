import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number;
  deltaText: string;
  accentClass: string; // text-primary | text-secondary | text-accent
  icon: ReactNode;
}

const StatsCard = ({
  title,
  value,
  deltaText,
  accentClass,
  icon,
}: StatsCardProps) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title text-base-content/60 text-sm font-medium">
              {title}
            </h2>

            {/* value */}
            <p className={`text-3xl font-bold ${accentClass}`}>
              {value}
            </p>

            {/* delta */}
            <p className="text-sm text-success">
              ↗︎ {deltaText}
            </p>
          </div>

          <div className={accentClass}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;