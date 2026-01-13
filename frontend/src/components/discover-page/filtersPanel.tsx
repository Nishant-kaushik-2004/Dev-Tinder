import { X } from "lucide-react";

// Filters Component
const FiltersPanel = ({ isOpen, onClose, filters, setFilters }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 z-60 flex justify-end">
      <div className="bg-base-100 w-80 h-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Experience Level
            </label>
            <select className="select select-bordered w-full">
              <option>All Levels</option>
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Technologies
            </label>
            <div className="space-y-2">
              {["React", "Node.js", "Python", "Java", "TypeScript"].map(
                (tech) => (
                  <label key={tech} className="cursor-pointer label">
                    <span className="label-text">{tech}</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                    />
                  </label>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              className="input input-bordered w-full"
            />
          </div>

          <button className="btn btn-primary w-full">Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;
