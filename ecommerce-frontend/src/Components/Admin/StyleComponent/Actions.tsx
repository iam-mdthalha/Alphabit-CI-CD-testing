import { useState } from "react";

interface ActionsProps {
  hideEdit?: boolean;
  onFilterChange?: (filter: string) => void;
  onSearchChange?: (searchTerm: string) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  isEditDisabled?: boolean;
  isDeleteDisabled?: boolean;
}

export const Actions = ({
  hideEdit,
  onFilterChange,
  onSearchChange,
  onDelete,
  onEdit,
  isEditDisabled = true,
  isDeleteDisabled = true,
}: ActionsProps) => {
  const [filter, setFilter] = useState("All");
  const [showOptions, setShowOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditTooltip, setShowEditTooltip] = useState(false);
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
  const options = ["All", "Active", "Inactive"];

  const handleFilterChange = (option: string) => {
    setFilter(option);
    setShowOptions(false);
    if (onFilterChange) {
      onFilterChange(option);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
    <div className="font-gilroyRegular tracking-wider flex flex-col md:flex-row justify-between items-center gap-4 w-full mb-4">
      <div className="flex items-center gap-2 w-full">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 px-3 py-1 outline-none flex-grow max-w-md"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex items-center gap-2">
        {!hideEdit && (
          <div
            className="relative"
            onMouseEnter={() => isEditDisabled && setShowEditTooltip(true)}
            onMouseLeave={() => setShowEditTooltip(false)}
          >
            <button
              className={`border p-2 rounded-sm ${
                isEditDisabled ? "opacity-50" : ""
              }`}
              onClick={isEditDisabled ? undefined : onEdit}
              style={{ cursor: isEditDisabled ? "not-allowed" : "pointer" }}
            >
              {/* <Edit size={18} className="text-[#1E5EFF]" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil text-[#1E5EFF]"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
            </button>
            {showEditTooltip && (
              <div className="absolute bottom-full right-0 transform translate-x-11 mb-1 px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-xs whitespace-nowrap z-10">
                Select a product to edit
              </div>
            )}
          </div>
        )}
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
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-icon lucide-trash text-[#1E5EFF]"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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
