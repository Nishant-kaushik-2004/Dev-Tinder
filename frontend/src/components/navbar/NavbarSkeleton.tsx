import { Code } from "lucide-react";

const NavbarSkeleton = () => {
  return (
    <div className="navbar bg-base-100 shadow-xl border-b border-base-300 px-4 fixed top-0 z-50">
      {/* LEFT */}
      <div className="navbar-start gap-3">
        {/* Mobile menu icon */}
        <div className="w-8 h-8 rounded bg-base-300 animate-pulse" />

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Code className="w-6 h-6 text-primary opacity-50" />
          <div className="hidden sm:block h-5 w-24 rounded bg-base-300 animate-pulse" />
        </div>
      </div>

      {/* CENTER (menu) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <div className="h-9 w-28 rounded bg-base-300 animate-pulse" />
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT */}
      <div className="navbar-end gap-5">
        {/* Theme switch */}
        <div className="w-9 h-9 rounded bg-base-300 animate-pulse" />

        {/* Notification */}
        <div className="w-9 h-9 rounded-full bg-base-300 animate-pulse" />

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-base-300 animate-pulse" />
          <div className="hidden sm:block w-3 h-3 rounded bg-base-300 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default NavbarSkeleton;