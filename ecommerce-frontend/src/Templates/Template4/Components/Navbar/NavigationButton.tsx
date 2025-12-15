import React, { forwardRef } from "react";

interface NavigationButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

const NavigationButton = forwardRef<HTMLButtonElement, NavigationButtonProps>(
  ({ label, isActive, onClick, onMouseEnter }, ref) => (
    <div className="whitespace-nowrap">
      <button
        ref={ref}
        className={`flex items-center text-sm lg:text-base text-gray-800 hover:bg-vintageText hover:bg-opacity-80 hover:text-vintageBg transition-all rounded-full font-gilroyRegular font-semibold tracking-wider px-3 py-2 ${
          isActive ? "bg-vintageText bg-opacity-80 text-vintageBg" : ""
        }`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        {label}
        <ChevronIcon />
      </button>
    </div>
  )
);

NavigationButton.displayName = "NavigationButton";

const ChevronIcon: React.FC = () => (
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
    className="ml-1"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default NavigationButton;
