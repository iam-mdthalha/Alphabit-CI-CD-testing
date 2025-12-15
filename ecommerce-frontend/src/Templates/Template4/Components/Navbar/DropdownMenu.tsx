import React from "react";
import { Category } from "Types/Navbar";
import CategoryDropdown from "Templates/Template4/Components/Navbar/CategoryDropdown";
import AuthorsDropdown from "Templates/Template4/Components/Navbar/AuthorsDropdown";
import SimpleListDropdown from "Templates/Template4/Components/Navbar/SimpleListDropdown";

interface DropdownMenuProps {
  activeDropdown: string | null;
  dropdownLeft: number | null;
  mappedCategories: Category[];
  hoveredCategory: string | null;
  authors: string[];
  languages: string[];
  academics: string[];
  merchandises: string[];
  isLoading: boolean;
  error: any;
  onHoverCategory: (category: string | null) => void;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  activeDropdown,
  dropdownLeft,
  mappedCategories,
  hoveredCategory,
  authors,
  languages,
  academics,
  merchandises,
  isLoading,
  error,
  onHoverCategory,
  onClose,
}) => {
  if (!activeDropdown) return null;

  const dropdownStyle = {
    left: dropdownLeft ?? 96,
  };

  const commonProps = {
    onMouseLeave: onClose,
  };

  const renderDropdown = () => {
    switch (activeDropdown) {
      case "category":
        return (
          <CategoryDropdown
            style={dropdownStyle}
            categories={mappedCategories}
            hoveredCategory={hoveredCategory}
            onHoverCategory={onHoverCategory}
            {...commonProps}
          />
        );

      case "author":
        return (
          <AuthorsDropdown
            style={dropdownStyle}
            authors={authors}
            isLoading={isLoading}
            error={error}
            {...commonProps}
          />
        );

      case "language":
        return (
          <SimpleListDropdown
            style={dropdownStyle}
            items={languages}
            type="language"
            {...commonProps}
          />
        );

      case "academic":
        return (
          <SimpleListDropdown
            style={dropdownStyle}
            items={academics}
            type="academic"
            {...commonProps}
          />
        );

      case "merchandise":
        return (
          <SimpleListDropdown
            style={dropdownStyle}
            items={merchandises}
            type="merchandise"
            {...commonProps}
          />
        );

      default:
        return null;
    }
  };

  return renderDropdown();
};

export default DropdownMenu;
