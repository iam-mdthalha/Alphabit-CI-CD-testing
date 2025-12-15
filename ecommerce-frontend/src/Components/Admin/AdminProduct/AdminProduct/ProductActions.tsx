import { useState } from "react";

interface ActionsProps {
  onFilterChange?: (filter: string) => void;
  onSearchChange?: (searchTerm: string) => void;
  onDelete?: () => void;
  isDeleteDisabled?: boolean;
}

export const ProductActions = ({
  onFilterChange,
  onSearchChange,
  onDelete,
  isDeleteDisabled = true,
}: ActionsProps) => {
  const [filter, setFilter] = useState("All");
  const [showOptions, setShowOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
  const options = ["All", "Active", "Inactive"];

  const handleFilterChange = (option: string) => {
    setFilter(option);
    setShowOptions(false);
    onFilterChange?.(option);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  return (
    <div className="font-gilroyRegular tracking-wider flex flex-col md:flex-row justify-between items-center gap-4 w-full mb-4">
      <div className="flex items-center gap-2">
        {/* <div className="relative">
          <button
            className="border px-3 py-1 flex justify-between items-center gap-1 min-w-40 text-gray-500"
            onClick={() => setShowOptions(!showOptions)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          {showOptions && (
            <div className="absolute mt-1 border bg-white shadow w-full z-10">
              {options.map((option) => (
                <div
                  key={option}
                  className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleFilterChange(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div> */}
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 px-3 py-1 outline-none"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex items-center gap-2">
        <div
          className="relative"
          onMouseEnter={() => isDeleteDisabled && setShowDeleteTooltip(true)}
          onMouseLeave={() => setShowDeleteTooltip(false)}
        >
          <button
            className={`border p-2 rounded-sm ${
              isDeleteDisabled ? "opacity-50" : ""
            }`}
            onClick={isDeleteDisabled ? undefined : onDelete}
            style={{ cursor: isDeleteDisabled ? "not-allowed" : "pointer" }}
          >
            {/* <Trash size={18} className="text-[#1E5EFF]" /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash-icon lucide-trash text-[#1E5EFF]"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
          {showDeleteTooltip && (
            <div className="absolute bottom-full right-0 transform -translate-x-0 mb-1 px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-xs whitespace-nowrap z-10">
              Select product(s) to delete
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
