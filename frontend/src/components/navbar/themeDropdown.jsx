import { useEffect, useState } from "react";
import { themeChange } from "theme-change";
import { themes } from "../../data/themeOptions";

export default function ThemeDropdown() {
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    themeChange(false); // Initialize theme-change for React

    // Get current theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    setCurrentTheme(savedTheme);
  }, []);

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  const currentThemeLabel =
    themes.find((theme) => theme.value === currentTheme)?.label || "Theme";

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-lg btn-ghost gap-1 normal-case text-sm px-2 sm:px-3 md:px-3 max-h-10"
      >
        {/* Palette icon */}
        <svg
          className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        <span className="hidden xs:hidden sm:inline truncate max-w-20 md:max-w-none">
          {currentThemeLabel}
        </span>
        <span className="inline xs:inline sm:hidden">Theme</span>
        {/* Chevron down icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content z-[1] p-1 sm:p-2 shadow-2xl bg-base-300 rounded-box w-48 md:w-64 max-h-60 sm:max-h-80 md:max-h-96 overflow-y-auto custom-scrollbar"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(var(--bc) / 0.2) transparent",
        }}
      >
        {themes.map((theme) => (
          <li key={theme.label} className="mb-0.5 sm:mb-1">
            <div
              data-theme={theme.value}
              className={`outline-base-content overflow-hidden rounded-md sm:rounded-lg outline-offset-1 sm:outline-offset-2 ${
                currentTheme === theme.value ? "outline sm:outline-2" : ""
              }`}
            >
              <button
                data-set-theme={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                className="bg-base-100 text-base-content w-full cursor-pointer font-sans hover:bg-base-200 transition-colors duration-200"
              >
                <div className="grid grid-cols-5 grid-rows-3">
                  <div className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 sm:gap-3 px-2 sm:px-3 md:px-4 py-2 sm:py-3">
                    {/* Color swatches */}
                    <div className="flex-shrink-0">
                      <div className="flex flex-wrap gap-0.5 sm:gap-1">
                        <div className="bg-primary w-1.5 h-3 sm:w-2 sm:h-4 rounded-sm"></div>
                        <div className="bg-secondary w-1.5 h-3 sm:w-2 sm:h-4 rounded-sm"></div>
                        <div className="bg-accent w-1.5 h-3 sm:w-2 sm:h-4 rounded-sm"></div>
                        <div className="bg-neutral w-1.5 h-3 sm:w-2 sm:h-4 rounded-sm"></div>
                      </div>
                    </div>
                    {/* Theme name */}
                    <div className="flex-grow text-left text-xs sm:text-sm font-medium truncate">
                      {theme.label}
                    </div>
                    {/* Check icon for current theme */}
                    {currentTheme === theme.value && (
                      <div className="flex-shrink-0">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-success"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// import { useEffect } from "react";
// import { themeChange } from "theme-change";
// import { themes } from "../data/themeOptions";

// export default function ThemeDropdown() {

//   useEffect(() => {
//     themeChange(false); // Initialize theme-change for React
//   }, []);

//   return (
//     <div className="dropdown dropdown-end p-0">
//       <div tabIndex={0} role="button" className="btn">
//         Theme
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-4 w-4 ml-1"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </div>

//       <ul
//         tabIndex={0}
//         className="dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 max-h-60 overflow-y-auto"
//       >
//         {themes.map((theme) => (
//           <li key={theme}>
//             <button
//               data-set-theme={theme}
//               className="btn btn-sm btn-block justify-start capitalize"
//             >
//               {theme}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
