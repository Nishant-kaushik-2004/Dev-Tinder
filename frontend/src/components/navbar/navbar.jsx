import { useState } from "react";
import {
  MessageCircle,
  Bell,
  Settings,
  Code,
  Users,
  LucideGitPullRequestDraft,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import NotificationPanel from "./notificationPanel";
import { notificationsList } from "../../data/mockDevelopers";
import DropDownMenu from "./mobileNavigation";
import ThemeDropdown from "./themeDropdown";
import ProfileDropdown from "./profileDropdown";
import axios from "axios";
import { clearUser } from "../../store/userSlice";

// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(notificationsList);
  // const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // // Close dropdown whenever route changes
  // useEffect(() => {
  //   setOpen(false);
  //   console.log(location);
  // }, [location]);

  // // Close on outside click
  // useEffect(() => {
  //   const onDocClick = (e) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(e.target))
  //       setOpen(false);
  //   };
  //   document.addEventListener("mousedown", onDocClick);
  //   return () => document.removeEventListener("mousedown", onDocClick);
  // }, []);

  const loggedInUser = useSelector((state) => state.loggedInUser);

  const isEditingProfile = location.pathname === "/profile";

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    // setNotifications([]);
  };

  const handleLogout = async () => {
    try {
      // In real app, this would be:
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.log("ERROR: " + error.message);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-xl border-b border-base-300 px-4 fixed top-0 z-50">
      <div className="navbar-start">
        <DropDownMenu
          isDeviceIndependentVis={false}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
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

      <div className="navbar-end gap-5">
        <ThemeDropdown />
        {/* Notification Button with Proper Badge */}
        <div className="indicator mt-2 mr-2">
          <button
            className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-base-200"
            onClick={handleNotificationClick}
          >
            <Bell className="w-5 h-5 text-base-content" />
          </button>
          {/* Notification Panel */}
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
            notifications={notifications}
          />
          {notifications.length > 0 && (
            <span className="indicator-item badge badge-primary badge-sm text-xs font-bold min-w-[1.25rem] h-5">
              {notifications.length > 99 ? "99+" : notifications.length}
            </span>
          )}
        </div>

        <ProfileDropdown
          user={loggedInUser}
          isEditingProfile={isEditingProfile}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default Navbar;
