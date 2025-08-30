import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { Code, Settings, LogOut } from 'lucide-react';

{/* Profile Dropdown Component */}
const ProfileDropdown = ({ user, isEditingProfile, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Close on Escape key
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        className="btn btn-ghost btn-circle avatar hover:bg-base-200 transition-colors"
        onClick={toggleMenu}
        aria-label="Profile menu"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        <div className="w-8 sm:w-10 rounded-full ring-2 ring-base-300 hover:ring-primary transition-all duration-200">
          <img
            alt="Profile"
            src={
              user.photoUrl ||
              "https://geographyandyou.com/images/user-profile.png"
            }
            className="rounded-full object-cover w-full h-full"
            onError={(e) => {
              e.target.src = "https://geographyandyou.com/images/user-profile.png";
            }}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-3 z-[60]">
          <ul
            className="menu menu-sm bg-base-100 border border-base-300 rounded-box w-52 p-2 shadow-xl"
            role="menu"
          >
            <li role="none">
              {isEditingProfile ? (
                <Link
                  to="/"
                  className="flex items-center gap-3 p-3 text-base-content hover:bg-primary/10 hover:text-primary rounded-lg transition-colors active:scale-95 focus:bg-primary/10 focus:text-primary focus:outline-none"
                  onClick={closeMenu}
                  role="menuitem"
                >
                  <Code className="w-4 h-4 flex-shrink-0" />
                  <span>Feed</span>
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 text-base-content hover:bg-primary/10 hover:text-primary rounded-lg transition-colors active:scale-95 focus:bg-primary/10 focus:text-primary focus:outline-none"
                  onClick={closeMenu}
                  role="menuitem"
                >
                  <Settings className="w-4 h-4 flex-shrink-0" />
                  <span>Edit Profile</span>
                </Link>
              )}
            </li>
            
            <div className="divider my-1"></div>
            
            <li role="none">
              <button
                className="flex items-center gap-3 p-3 text-base-content hover:bg-error/10 hover:text-error rounded-lg transition-colors active:scale-95 w-full text-left focus:bg-error/10 focus:text-error focus:outline-none"
                onClick={() => {
                  closeMenu();
                  handleLogout?.();
                }}
                role="menuitem"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;