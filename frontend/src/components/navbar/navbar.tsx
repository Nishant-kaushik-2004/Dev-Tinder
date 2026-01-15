import { useEffect, useState } from "react";
import { Bell, Code } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import NotificationPanel from "./notificationPanel";
import { notificationsList } from "../../data/mockDevelopers";
import DropDownMenu from "./mobileNavigation";
import ThemeDropdown from "./themeDropdown";
import ProfileDropdown from "./profileDropdown";
import axios from "axios";
import { clearUser } from "../../store/userSlice";
import { RootState } from "../../store/store";
import { menuRoutes } from "../../data/NavbarData";

// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(notificationsList);
  // const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close dropdown whenever route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  const loggedInUser = useSelector((state: RootState) => state.loggedInUser);

  const handleLogout = async () => {
    try {
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
      //On logout failure, always clear local auth state.
      dispatch(clearUser());
      navigate("/login");
      console.log("ERROR: " + (error as Error).message);
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
          {menuRoutes.map((route) => (
            <li key={route.path}>
              {/*⭐️ Automatically applies active styles when route matches unlike in Link */}
              <NavLink
                to={route.path}
                className={({ isActive }) =>
                  `btn btn-ghost hover:text-primary hover:bg-primary/10 gap-2 ${
                    isActive ? "text-primary bg-primary/10" : ""
                  }`
                }
              >
                <route.icon className="w-5 h-5" />
                {route.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-5">
        <ThemeDropdown />
        {/* Notification Button with Proper Badge */}
        <div className="indicator indicator-end">
          <button
            className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-base-200"
            onClick={(e) => {
              // Close on outside click except when clicking the button itself
              e.stopPropagation(); // ✅ STOP bubbling
              setShowNotifications((prev) => !prev);
            }}
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
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default Navbar;
