import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}
// Search Bar Component
const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search users to start new chat..."
      className="input input-bordered focus:outline-none w-full pl-10 pr-4"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <Search className="absolute z-10 left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
  </div>
);

export default SearchBar;
