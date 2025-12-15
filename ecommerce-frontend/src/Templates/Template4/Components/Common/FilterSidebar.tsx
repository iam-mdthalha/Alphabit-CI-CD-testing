import React, { useState } from "react";
import { IndianRupee } from "lucide-react";
import { useGetAllCategoriesQuery } from "Services/Admin/CategoryAdminApiSlice";
import { useGetAdminSubClassesQuery } from "Services/Admin/SubClassApiSlice";
import { useGetAllAuthorsQuery } from "Services/Admin/AuthorApiSlice";
import { useGetAllLanguagesQuery } from "Services/Admin/LanguageApiSlice";
import { useGetAllAcademicsQuery } from "Services/Admin/AcademicApiSlice";
import { useGetAllMerchandisesQuery } from "Services/Admin/MerchandiseApiSlice";

interface FilterSidebarProps {
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filter: string, category: string, checked: boolean) => void;
  pageType: string;
}

const priceRanges = [
  "Rs. 0 - Rs. 100",
  "Rs. 101 - Rs. 200",
  "Rs. 201 - Rs. 400",
  "Rs. 401 - Rs. 1000",
  "Rs. 1001 - Rs. 3000",
  "Rs. 3000 above",
];

const pageFilterMap: Record<string, string[]> = {
  Category: ["price", "subCategory", "language"],
  subCategory: ["price", "language"],
  Author: ["price", "category", "subCategory", "academic", "language"],
  Language: ["price", "category", "subCategory", "author", "academic"],
  Academic: ["price", "author", "language"],
  Merchandise: ["price"],
  NewCollection: [
    "price",
    "category",
    "subCategory",
    "author",
    "language",
    "academic",
    "merchandise",
  ],
  TopSellers: [
    "price",
    "category",
    "subCategory",
    "author",
    "language",
    "academic",
    "merchandise",
  ],
  BooksListing: [
    "price",
    "category",
    "subCategory",
    "author",
    "language",
    "academic",
    "merchandise",
  ],
};

const SHOW_LIMIT = 6;

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 transition-transform duration-300 ${
      open ? "rotate-180" : ""
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const PriceIcon = () => (
  <IndianRupee className=" sm:w-5 sm:h-5 text-gray-600" />
);

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedFilters,
  onFilterChange,
  pageType,
}) => {
  // Set all sections to be open by default
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(pageFilterMap[pageType] || [])
  );
  const [showMoreState, setShowMoreState] = useState<Record<string, boolean>>(
    {}
  );

  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: subClassesData } = useGetAdminSubClassesQuery();
  const { data: authorsData } = useGetAllAuthorsQuery({
    plant: process.env.REACT_APP_PLANT || "",
  });
  const { data: languagesData } = useGetAllLanguagesQuery({
    plant: process.env.REACT_APP_PLANT || "",
  });
  const { data: academicsData } = useGetAllAcademicsQuery({
    plant: process.env.REACT_APP_PLANT || "",
  });
  const { data: merchandisesData } = useGetAllMerchandisesQuery({
    plant: process.env.REACT_APP_PLANT || "",
  });

  const categories = categoriesData?.map((c: any) => c.categoryName) || [];
  const subCategories =
    subClassesData?.results?.map((s: any) => s.subClassName) || [];
  const authors = authorsData?.map((a: any) => a.author) || [];
  const languages = languagesData?.map((l: any) => l.language) || [];
  const academics = academicsData?.map((a: any) => a.academic) || [];
  const merchandises = merchandisesData?.map((m: any) => m.merchandise) || [];

  const filterDataMap: Record<string, string[]> = {
    price: priceRanges,
    category: categories,
    subCategory: subCategories,
    author: authors,
    language: languages,
    academic: academics,
    merchandise: merchandises,
  };

  const filtersToShow = pageFilterMap[pageType] || [];

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const toggleShowMore = (key: string) => {
    setShowMoreState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isSelected = (category: string, value: string) =>
    selectedFilters[category]?.includes(value) ?? false;

  const renderFilterGroup = (key: string) => {
    const allItems = filterDataMap[key] || [];
    const showMore = showMoreState[key] || false;
    const visibleItems = showMore ? allItems : allItems.slice(0, SHOW_LIMIT);
    const hasMore = allItems.length > SHOW_LIMIT;

    return (
      <>
        {visibleItems.length === 0 && (
          <p className="text-gray-700 py-2">No options available.</p>
        )}
        {visibleItems.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 px-1 py-1 cursor-pointer rounded hover:bg-vintageText hover:text-vintageBg"
          >
            <input
              type="checkbox"
              checked={isSelected(key, item)}
              onChange={(e) => onFilterChange(item, key, e.target.checked)}
              className="cursor-pointer"
            />
            <span>{item}</span>
          </label>
        ))}
        {hasMore && (
          <button
            className="text-xs text-vintageText underline mt-1"
            onClick={() => toggleShowMore(key)}
            aria-label={showMore ? `Show less ${key}` : `Show more ${key}`}
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        )}
      </>
    );
  };

  return (
    <div
      className="border-vintageBorder p-4 rounded-2xl shadow-md overflow-y-auto max-h-[150vh] sticky top-20 scrollbar-hide"
      aria-label="Product Filters Sidebar"
      role="region"
    >
      <header className="flex justify-between items-center mb-5 border-b border-yellow-400 pb-2">
        <h2 className="text-lg font-semibold text-gray-800">Filter Products</h2>
      </header>

      {filtersToShow.map((key) => (
        <section key={key} className="mb-4">
          <button
            className="flex items-center justify-between w-full p-2 font-semibold text-gray-700 hover:bg-yellow-50 rounded"
            onClick={() => toggleSection(key)}
            aria-expanded={openSections.has(key)}
            aria-controls={`filter-${key}`}
          >
            <span>
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}
            </span>
            <ChevronIcon open={openSections.has(key)} />
          </button>
          {openSections.has(key) && (
            <div id={`filter-${key}`} className="mt-2">
              {renderFilterGroup(key)}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default FilterSidebar;