import { ArrowUpDown, Search } from "lucide-react";

// SearchAndSortBar Component
const SearchAndSortBar = ({
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
}) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    {/* Search Input */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
      <input
        type="text"
        placeholder="Search connections by name..."
        className="input input-bordered w-full pl-10 focus:outline-none"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    {/* Sort Dropdown */}
    <div className="dropdown min-w-32 ">
      <label tabIndex={0} className="btn flex items-center gap-2">
        Sort <ArrowUpDown className="w-4 h-4" />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box min-w-32 absolute right-0"
      >
        <li>
          <button onClick={() => onSortChange("newest")}>Newest</button>
        </li>
        <li>
          <button onClick={() => onSortChange("oldest")}>Oldest</button>
        </li>
      </ul>
    </div>
    {/* <div className="relative">
      <select
        className="select select-bordered w-full min-w-[130px] sm:w-auto focus:outline-none appearance-none pr-8"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
      <ArrowUpDown className="absolute right-8 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4 pointer-events-none z-10" />
    </div> */}
  </div>
);

export default SearchAndSortBar;
