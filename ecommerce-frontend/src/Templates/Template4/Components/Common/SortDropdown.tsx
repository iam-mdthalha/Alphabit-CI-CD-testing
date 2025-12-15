import React from "react";

interface SortDropdownProps {
  selectedSort: string;
  onSortChange: (sort: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  selectedSort,
  onSortChange,
}) => {
  const isLowToHigh = !selectedSort || selectedSort === "price-asc";

  const toggleSort = () => {
    onSortChange(isLowToHigh ? "price-desc" : "price-asc");
  };

  return (
    <div className="flex items-center gap-3">
      <p className="hidden md:block text-xs md:text-sm">Sort by Price:</p>
      <span
        className={`text-sm font-gilroyRegular transition-colors duration-300 font-bold ${
          isLowToHigh ? "text-vintageText" : "text-gray-500"
        }`}
      >
        Low
      </span>
      <button
        onClick={toggleSort}
        className="relative w-14 h-7 rounded-full bg-vintageText"
        aria-label={
          isLowToHigh
            ? "Sort by price low to high"
            : "Sort by price high to low"
        }
      >
        <span
          className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
            isLowToHigh ? "translate-x-0" : "translate-x-7"
          }`}
        />
      </button>
      <span
        className={`text-sm font-gilroyRegular transition-colors duration-300 font-bold ${
          !isLowToHigh ? "text-vintageText" : "text-gray-500"
        }`}
      >
        High
      </span>
    </div>
  );
};

export default SortDropdown;
