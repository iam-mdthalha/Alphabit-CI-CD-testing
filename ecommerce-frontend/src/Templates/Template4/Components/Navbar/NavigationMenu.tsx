import React, { useRef } from "react";
import { NavigationMenuProps } from "Types/Navbar";
import NavigationButton from "Templates/Template4/Components/Navbar/NavigationButton";
import DropdownMenu from "Templates/Template4/Components/Navbar/DropdownMenu";
import ScrollButtons from "Templates/Template4/Components/Navbar/ScrollButtons";

const NavigationMenu: React.FC<NavigationMenuProps> = (props) => {
  const categoryBtnRef = useRef<HTMLButtonElement>(null);
  const authorBtnRef = useRef<HTMLButtonElement>(null);
  const languageBtnRef = useRef<HTMLButtonElement>(null);
  const academicBtnRef = useRef<HTMLButtonElement>(null);
  const merchandiseBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      ref={props.dropdownRef}
      className="relative hidden md:flex md:sticky md:top-0 z-50 bg-vintageBg shadow-md"

    >
      <div
        ref={props.scrollRef}
        className="flex gap-6 px-6 lg:px-16 xl:px-24 items-center py-3 overflow-x-auto no-scrollbar"
      >
        {/* <ShopByLabel /> */}

        <NavigationButton
          ref={categoryBtnRef}
          label="Category"
          isActive={props.activeDropdown === "category"}
          onClick={() => props.handleNavigation("/collections")}
          onMouseEnter={() => {
            props.handleDropdownToggle("category", categoryBtnRef);
            requestAnimationFrame(() =>
              props.updateDropdownPosition(categoryBtnRef.current)
            );
          }}
        />

        <NavigationButton
          ref={authorBtnRef}
          label="Author"
          isActive={props.activeDropdown === "author"}
          onClick={() => props.handleNavigation("/authors")}
          onMouseEnter={() => {
            props.handleDropdownToggle("author", authorBtnRef);
            requestAnimationFrame(() =>
              props.updateDropdownPosition(authorBtnRef.current)
            );
          }}
        />

        <NavigationButton
          ref={languageBtnRef}
          label="Language"
          isActive={props.activeDropdown === "language"}
          onClick={() => props.handleNavigation("/language")}
          onMouseEnter={() => {
            props.handleDropdownToggle("language", languageBtnRef);
            requestAnimationFrame(() =>
              props.updateDropdownPosition(languageBtnRef.current)
            );
          }}
        />

        <NavigationButton
          ref={academicBtnRef}
          label="Academic"
          isActive={props.activeDropdown === "academic"}
          onClick={() => props.handleNavigation("/academic")}
          onMouseEnter={() => {
            props.handleDropdownToggle("academic", academicBtnRef);
            requestAnimationFrame(() =>
              props.updateDropdownPosition(academicBtnRef.current)
            );
          }}
        />

        <NavigationLink
          to="/new-collections"
          label="New Arrival"
          onNavigation={props.handleNavigation}
        />

        <NavigationLink
          to="/top-sellers?page=1"
          label="Bestsellers"
          onNavigation={props.handleNavigation}
        />

        <NavigationButton
          ref={merchandiseBtnRef}
          label="Merchandise"
          isActive={props.activeDropdown === "merchandise"}
          onClick={() => props.handleNavigation("/merchandise")}
          onMouseEnter={() => {
            props.handleDropdownToggle("merchandise", merchandiseBtnRef);
            requestAnimationFrame(() =>
              props.updateDropdownPosition(merchandiseBtnRef.current)
            );
          }}
        />

        <NavigationLink
          to="/offers"
          label="Offers"
          onNavigation={props.handleNavigation}
        />

        <NavigationLink
          to="/events"
          label="Events"
          onNavigation={props.handleNavigation}
        />

        <NavigationLink
          to="/glossary"
          label="Glossary"
          onNavigation={props.handleNavigation}
        />

        <NavigationLink
          to="/history"
          label="History"
          onNavigation={props.handleNavigation}
        />
      </div>

      <DropdownMenu
        activeDropdown={props.activeDropdown}
        dropdownLeft={props.dropdownLeft}
        mappedCategories={props.mappedCategories}
        hoveredCategory={props.hoveredCategory}
        authors={props.authors}
        languages={props.languages}
        academics={props.academics}
        merchandises={props.merchandises}
        isLoading={props.isLoading}
        error={props.error}
        onHoverCategory={props.setHoveredCategory}
        onClose={() => props.handleDropdownToggle("", { current: null })}
      />

      <ScrollButtons
        showLeft={props.showLeft}
        showRight={props.showRight}
        onScroll={props.scroll}
      />
    </div>
  );
};

const ShopByLabel: React.FC = () => (
  <p className="whitespace-nowrap capitalize text-sm lg:text-base text-gray-800 font-gilroyRegular font-semibold tracking-wider mr-4 flex gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-layout-grid text-yellow-600"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
    shop by:
  </p>
);

const NavigationLink: React.FC<{
  to: string;
  label: string;
  onNavigation: (path: string) => void;
}> = ({ to, label, onNavigation }) => (
  <div className="whitespace-nowrap">
    <button
      onClick={() => onNavigation(to)}
      className="text-sm lg:text-base text-gray-800 font-gilroyRegular font-semibold tracking-wider px-3 py-2 hover:bg-vintageText hover:bg-opacity-80 hover:text-vintageBg transition-all rounded-full"
    >
      {label}
    </button>
  </div>
);

export default NavigationMenu;
