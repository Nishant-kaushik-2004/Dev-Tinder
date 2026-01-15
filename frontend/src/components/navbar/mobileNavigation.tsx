import { NavLink } from "react-router";
import { menuRoutes } from "../../data/NavbarData";

interface DropDownMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  isDeviceIndependentVis: boolean;
}

const DropDownMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  isDeviceIndependentVis,
}: DropDownMenuProps) => {
  return (
    <div className={`${isDeviceIndependentVis ? "" : "lg:hidden"} relative`}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-10 h-10 rounded-lg hover:bg-base-200 focus:outline-none"
        aria-label="Menu"
      >
        {/* Animated Hamburger Lines */}
        <div className="w-5 h-4 flex flex-col justify-between mx-auto">
          <span
            className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-current rounded-full transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </div>
      </button>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm bg-black/20"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      <div
        className={`absolute left-0 top-full mt-2 z-50 w-64 bg-base-100 border border-base-300 rounded-xl shadow-xl transition-all duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Menu Header */}
        <div className="px-4 py-3 border-b border-base-300 bg-base-200">
          <h3 className="font-semibold text-sm text-base-content/70 uppercase">
            Navigation
          </h3>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuRoutes.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={setIsMenuOpen.bind(null, false)}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 px-4 py-3 transition-all duration-200",
                  "hover:bg-primary/10 hover:text-primary active:bg-primary/20",
                  isActive ? "text-primary bg-primary/10 font-medium" : "",
                ].join(" ")
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropDownMenu;
