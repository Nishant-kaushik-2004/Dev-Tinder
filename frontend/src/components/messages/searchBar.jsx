import { Search } from "lucide-react";

// Search Bar Component
const SearchBar = ({ onSearch, value, onChange }) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search users or start new chat..."
      className="input input-bordered w-full pl-10 pr-4"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
  </div>
);

export default SearchBar;
