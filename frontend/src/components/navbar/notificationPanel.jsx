import { X } from "lucide-react";

// Notification Panel Component
const NotificationPanel = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  return (
    <div className="dropdown menu bg-base-100 border border-base-300 rounded-box shadow-xl w-64 sm:w-80 max-h-96 overflow-y-auto p-0 absolute right-0 top-full mt-2 z-[60] custom-scrollbar">
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
            onClick={onClose}
          >
            <X className="w-4 h-4 text-base-content" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2">
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
          <div className="hero py-8">
            <div className="hero-content text-center">
              <div>
                <p className="text-sm text-base-content/60">
                  No new notifications
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer (optional) */}
      {notifications.length > 0 && <div className="divider my-0"></div>}
      {notifications.length > 0 && (
        <div className="p-3">
          <button className="btn btn-ghost btn-sm w-full text-primary hover:bg-primary/10">
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;

// import { X } from "lucide-react";

// // Notification Panel Component
// const NotificationPanel = ({ isOpen, onClose, notifications }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="absolute right-0 mt-14 w-80 bg-base-100 shadow-xl rounded-lg z-50 max-h-96 overflow-y-auto p-2">
//       <div className="p-4 border-b">
//         <div className="flex justify-between items-center">
//           <h3 className="font-semibold">Notifications</h3>
//           <button className="btn btn-ghost btn-sm" onClick={onClose}>
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//       <div className="p-2">
//         {notifications.length > 0 ? (
//           notifications.map((n, index) => (
//             <div key={index} className="alert mb-2">
//               <div>
//                 <h4 className="font-medium text-sm">{n.title}</h4>
//                 <p className="text-xs opacity-70">{n.message}</p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-sm text-gray-500">
//             No new notifications
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default NotificationPanel;
