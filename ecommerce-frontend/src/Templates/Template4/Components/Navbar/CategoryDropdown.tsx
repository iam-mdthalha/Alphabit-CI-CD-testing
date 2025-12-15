import React from "react";
import { useNavigate } from "react-router-dom";
import { Category } from "Types/Navbar";

interface CategoryDropdownProps {
  style: React.CSSProperties;
  categories: Category[];
  hoveredCategory: string | null;
  onHoverCategory: (category: string | null) => void;
  onMouseLeave: () => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  style,
  categories,
  hoveredCategory,
  onHoverCategory,
  onMouseLeave,
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/books-listing?category=${encodeURIComponent(categoryName)}`);
  };

  const handleSubcategoryClick = (
    categoryName: string,
    subCategoryCode: string
  ) => {
    navigate(
      `/books-listing?category=${encodeURIComponent(
        categoryName
      )}&subCategory=${encodeURIComponent(subCategoryCode)}`
    );
  };

  return (
    <div
      className="absolute top-full mt-0 w-[50vw] xl:w-[25vw] bg-vintageBg bg-opacity-90 rounded-2xl z-50 grid grid-cols-2 shadow-lg"
      style={style}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full p-4">
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <CategoryItem
              key={index}
              category={category}
              onHover={onHoverCategory}
              onClick={handleCategoryClick}
            />
          ))}
        </ul>
      </div>

      <div className="w-full p-4">
        <SubcategoryList
          categories={categories}
          hoveredCategory={hoveredCategory}
          onSubcategoryClick={handleSubcategoryClick}
        />
      </div>
    </div>
  );
};

const CategoryItem: React.FC<{
  category: Category;
  onHover: (category: string | null) => void;
  onClick: (categoryName: string) => void;
}> = ({ category, onHover, onClick }) => (
  <li
    className="py-2 px-2 cursor-pointer text-sm lg:text-base text-gray-800 font-gilroyRegular font-semibold tracking-wider flex justify-between items-center hover:text-vintageText"
    onMouseEnter={() => onHover(category.name)}
    onClick={() => onClick(category.name)}
  >
    <span className="flex-1">{category.name}</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  </li>
);

const SubcategoryList: React.FC<{
  categories: Category[];
  hoveredCategory: string | null;
  onSubcategoryClick: (categoryName: string, subCategoryCode: string) => void;
}> = ({ categories, hoveredCategory, onSubcategoryClick }) => {
  if (!hoveredCategory) {
    return (
      <p className="text-sm text-gray-500">
        Hover over a category to see subcategories
      </p>
    );
  }

  const currentCategory = categories.find(
    (cat) => cat.name === hoveredCategory
  );

  if (!currentCategory?.subs.length) {
    return <p className="text-sm text-gray-500">No subcategories found</p>;
  }

  return (
    <ul className="space-y-2">
      {currentCategory.subs.map((sub, index) => (
        <li
          key={index}
          className="py-1 px-2 cursor-pointer text-sm lg:text-base text-gray-800 font-gilroyRegular font-semibold tracking-wider hover:text-vintageText"
          onClick={() => onSubcategoryClick(currentCategory.name, sub.code)}
        >
          {sub.name}
        </li>
      ))}
    </ul>
  );
};

export default CategoryDropdown;
