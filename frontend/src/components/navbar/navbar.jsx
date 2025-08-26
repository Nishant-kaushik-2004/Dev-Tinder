import { useState } from "react";
import {
  MessageCircle,
  Bell,
  Settings,
  Code,
  Users,
  LucideGitPullRequestDraft,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import NotificationPanel from "./notificationPanel";
import { notificationsList } from "../../data/mockDevelopers";
import DropDownMenu from "./dropDownMenu";
import ThemeDropdown from "./themeDropdown";

// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(notificationsList);

  const user = useSelector((state) => state.user);

  const location = useLocation();

  const isEditingProfile = location.pathname === "/profile";

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    // setNotifications([]);
  };

  return (
    <div className="navbar bg-base-100 shadow-xl border-b border-base-300 px-4 fixed top-0 z-50">
      <div className="navbar-start">
        <DropDownMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold text-base-content"
        >
          <Code className="w-6 h-6 text-primary" />
          <span className="hidden sm:inline">devTinder</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link
              to="/"
              className="btn btn-ghost gap-2 text-base-content hover:text-primary hover:bg-primary/10"
            >
              <Code className="w-4 h-4" />
              Discover
            </Link>
          </li>
          <li>
            <Link
              to="/connections"
              className="btn btn-ghost gap-2 text-base-content hover:text-primary hover:bg-primary/10"
            >
              <Users className="w-4 h-4" />
              Matches
            </Link>
          </li>
          <li>
            <Link
              to="/requests"
              className="btn btn-ghost gap-2 text-base-content hover:text-primary hover:bg-primary/10"
            >
              <LucideGitPullRequestDraft className="w-4 h-4" />
              Requests
            </Link>
          </li>
          <li>
            <Link
              to="/messages"
              className="btn btn-ghost gap-2 text-base-content hover:text-primary hover:bg-primary/10"
            >
              <MessageCircle className="w-4 h-4" />
              Messages
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-3">
        <ThemeDropdown />
        {/* Notification Button with Proper Badge */}
        <div className="indicator mt-2 mr-2">
          <button
            className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-base-200"
            onClick={handleNotificationClick}
          >
            <Bell className="w-5 h-5 text-base-content" />
          </button>
          {notifications.length > 0 && (
            <span className="indicator-item badge badge-primary badge-sm text-xs font-bold min-w-[1.25rem] h-5">
              {notifications.length > 99 ? "99+" : notifications.length}
            </span>
          )}
          {/* Notification Panel */}
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
          />
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar hover:bg-base-200"
          >
            <div className="w-8 sm:w-10 rounded-full ring-2 ring-base-300 hover:ring-primary transition-all">
              <img
                alt="Profile"
                src={
                  user.photoUrl ||
                  "https://geographyandyou.com/images/user-profile.png"
                }
                className="rounded-full object-cover"
              />
            </div>
          </div>
          <ul className="dropdown-content menu menu-sm bg-base-100 border border-base-300 rounded-box w-52 p-2 shadow-xl mt-3 z-[1]">
            <li>
              {isEditingProfile ? (
                <Link
                  to="/"
                  className="flex items-center gap-3 p-3 text-base-content hover:bg-primary/10 hover:text-primary rounded-lg"
                >
                  <Code className="w-4 h-4" />
                  <span>Feed</span>
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 text-base-content hover:bg-primary/10 hover:text-primary rounded-lg"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Link>
              )}
            </li>
            <li>
              <button className="flex items-center gap-3 p-3 text-base-content hover:bg-error/10 hover:text-error rounded-lg">
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
