import { X } from "lucide-react";
import { IFilter } from "./feed";

// Filters Component
interface FiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  draftFilters: IFilter;
  setDraftFilters: (filters: IFilter | ((prev: IFilter) => IFilter)) => void;
  appliedFilters?: IFilter;
  handleApplyFilters?: () => void;
  handleClearFilters?: () => void;
}

const FiltersPanel = ({
  isOpen,
  onClose,
  draftFilters,
  setDraftFilters,
  appliedFilters,
  handleApplyFilters,
  handleClearFilters,
}: FiltersPanelProps) => {
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
          <div className="relative opacity-60 cursor-not-allowed">
            <label className="block text-sm font-medium mb-2">
              Experience Level
            </label>

            <select
              className="select select-bordered w-full pointer-events-none"
              value={draftFilters.experienceLevel || ""}
              disabled
            >
              <option>All Levels</option>
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
            </select>

            {/* Coming soon badge */}
            <span className="absolute top-0 right-0 text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-md">
              Coming soon
            </span>

            <p className="mt-2 text-xs text-base-content/50">
              This filter will be enabled once experience data is available.
            </p>
          </div>
          {/* Will be enabled in future */}
          {/* <div>
            <label className="block text-sm font-medium mb-2">
              Experience Level
            </label>
            <select
              className="select select-bordered w-full"
              value={draftFilters.experienceLevel || ""}
              // If a filter is inactive → remove the key entirely
              onChange={(e) => {
                const value = e.target.value;
                setDraftFilters((prev) => {
                  if (value === "All Levels") {
                    const { experienceLevel, ...rest } = prev;
                    return rest;
                  } else {
                    return { ...prev, experienceLevel: value };
                  }
                });
              }}
            >
              <option>All Levels</option>
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
            </select>
            <div className="text-xs text-gray-400 font-light">currently working on this feature</div>
          </div> */}

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
                      onChange={(e) => {
                        setDraftFilters((prev) => {
                          const prevTechs = prev.technologies ?? [];

                          const updatedTechs = e.target.checked
                            ? [...prevTechs, tech]
                            : prevTechs.filter((t) => t !== tech);

                          if (updatedTechs.length === 0) {
                            const { technologies, ...rest } = prev;
                            return rest;
                          }

                          return { ...prev, technologies: updatedTechs };
                        });
                      }}
                      checked={
                        draftFilters.technologies?.includes(tech) ?? false
                      }
                    />
                  </label>
                )
              )}
            </div>
          </div>

          <div className="relative opacity-60 cursor-not-allowed">
            <label className="block text-sm font-medium mb-2">Location</label>

            <input
              type="text"
              placeholder="Enter location"
              className="input input-bordered w-full pointer-events-none"
              value={draftFilters.location ?? ""}
              disabled
            />

            {/* Coming soon badge */}
            <span className="absolute top-0 right-0 text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-md">
              Coming soon
            </span>

            <p className="mt-2 text-xs text-base-content/50">
              Location-based filtering will be available soon.
            </p>
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
          {/* Only show Clear Filters button if there are applied filters */}
          {draftFilters && Object.keys(draftFilters).length > 0 && (
            <button
              className="btn btn-secondary w-full"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          )}
        </div>
          {/* Will be enabled in future */}
        {/* <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              className="input input-bordered w-full"
              value={draftFilters.location ?? ""}
              disabled={true}
              onChange={(e) => {
                const value = e.target.value.trim();

                setDraftFilters((prev) => {
                  if (!value) {
                    // remove location key
                    const { location, ...rest } = prev;
                    return rest;
                  }

                  return {
                    ...prev,
                    location: value,
                  };
                });
              }}
            />
          </div> */}
      </div>
    </div>
  );
};

export default FiltersPanel;
