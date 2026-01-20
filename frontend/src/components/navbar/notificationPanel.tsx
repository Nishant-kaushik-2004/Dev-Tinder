import { Bell, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

interface Notification {
  title: string;
  message: string;
  time?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

// Notification Panel Component
const NotificationPanel = ({
  isOpen,
  onClose,
  notifications,
}: NotificationPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("click", handleOutsideClick); // ✅ click
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef} // Very important for outside click detection
      className="menu bg-base-100 border border-base-300 rounded-box shadow-xl w-64 sm:w-80 p-0 absolute right-0 top-full mt-2 z-[60]"
      aria-expanded={isOpen}
      aria-label="Notification Panel"
    >
      {/* Header */}
      <div className="navbar bg-base-200 rounded-t-box px-4 py-2 border-b border-base-300">
        <div className="navbar-start">
          <h3 className="text-base font-semibold text-base-content">
            Notifications
          </h3>
        </div>
        <div className="navbar-end">
          <button
            className="btn btn-ghost btn-circle btn-xs hover:bg-base-300"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="w-4 h-4 text-base-content" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="p-2 overflow-y-auto custom-scrollbar max-h-72"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(var(--bc) / 0.2) transparent",
        }}
      >
        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((n, index) => (
              <div
                key={index}
                className="card card-compact bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
              >
                <div className="card-body p-3">
                  <h4 className="card-title text-sm text-base-content">
                    {n.title}
                  </h4>
                  <p className="text-xs text-base-content/70">{n.message}</p>
                  {n.time && (
                    <div className="card-actions justify-end">
                      <div className="badge badge-ghost badge-sm text-base-content/50">
                        {n.time}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 px-4 text-center space-y-4">
            {/* Icon / visual anchor */}
            <div className="flex justify-center">
              <div className="rounded-full bg-base-200 p-3">
                <Bell className="w-5 h-5 text-base-content/60" />
              </div>
            </div>

            {/* Primary message */}
            <p className="text-sm font-medium text-base-content">
              No notifications yet
            </p>

            {/* Explanation */}
            <p className="text-xs text-base-content/60 leading-relaxed">
              When someone sends you a match request or a message, you’ll see it
              here.
            </p>

            {/* Example (non-interactive, clearly a preview) */}
            <div className="mt-3 mx-auto max-w-xs rounded-lg bg-base-200/70 p-3 text-left">
              <p className="text-[11px] text-base-content/50 mb-1">
                Example notification
              </p>
              <p className="text-sm font-medium text-base-content">
                Aman sent you a connection request
              </p>
              <p className="text-xs text-base-content/60">
                Start a conversation when you’re ready
              </p>
            </div>

            {/* CTA */}
            <button
              className="btn btn-primary btn-sm mt-4"
              onClick={() => {
                onClose();
                navigate("/"); // or /feed /explore
              }}
            >
              Explore Developers
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && <div className="divider my-0"></div>}
      {notifications.length > 0 && (
        <div className="p-2">
          <button className="btn btn-ghost btn-sm w-full text-primary hover:bg-primary/10">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
