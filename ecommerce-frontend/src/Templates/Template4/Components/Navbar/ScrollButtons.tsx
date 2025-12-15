import React from "react";

interface ScrollButtonsProps {
  showLeft: boolean;
  showRight: boolean;
  onScroll: (direction: "left" | "right") => void;
}

const ScrollButtons: React.FC<ScrollButtonsProps> = ({
  showLeft,
  showRight,
  onScroll,
}) => (
  <>
    
    {showLeft && (
      <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-vintageBg to-transparent z-10" />
    )}
    {showRight && (
      <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-vintageBg to-transparent z-10" />
    )}

    {showLeft && (
      <ScrollButton
        direction="left"
        onClick={() => onScroll("left")}
        position="left-2"
      />
    )}
    {showRight && (
      <ScrollButton
        direction="right"
        onClick={() => onScroll("right")}
        position="right-2"
      />
    )}
  </>
);

const ScrollButton: React.FC<{
  direction: "left" | "right";
  onClick: () => void;
  position: string;
}> = ({ direction, onClick, position }) => (
  <button
    onClick={onClick}
    className={`absolute ${position} top-1/2 -translate-y-1/2 bg-vintageText text-vintageBg p-2 rounded-full shadow-md hover:bg-opacity-90 z-20`}
    aria-label={`scroll ${direction}`}
  >
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
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  </button>
);

export default ScrollButtons;
