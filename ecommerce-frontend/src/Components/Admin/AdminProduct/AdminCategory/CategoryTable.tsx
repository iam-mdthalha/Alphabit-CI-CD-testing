import React, { useState } from "react";
import { CategoryAdminDTO } from "Types/Admin/AdminCategoryType";
import { getImage } from "Utilities/ImageConverter";

interface CategoryTableProps {
  categories: CategoryAdminDTO[];
  onSelectCategory: (id: number | null) => void;
  onDeleteCategory: (id: number) => void;
  onViewCategory: (id: number) => void;
  onEditCategory: (id: number) => void;
  selectedCategory: number | null;
  isLoading?: boolean;
  isError?: boolean;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onSelectCategory,
  onDeleteCategory,
  onViewCategory,
  onEditCategory,
  selectedCategory,
  isLoading = false,
  isError = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startItem =
    categories.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, categories.length);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const currentPageCategoryIds = categories
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map((category) => category.id);
      setSelectedCategories(currentPageCategoryIds);

      if (currentPageCategoryIds.length > 0) {
        onSelectCategory(currentPageCategoryIds[0]);
      }
    } else {
      setSelectedCategories([]);
      onSelectCategory(null);
    }
  };

  const handleSelectCategory = (id: number, checked: boolean) => {
    let newSelectedCategories: number[];

    if (checked) {
      newSelectedCategories = [...selectedCategories, id];
    } else {
      newSelectedCategories = selectedCategories.filter(
        (categoryId) => categoryId !== id
      );
    }

    setSelectedCategories(newSelectedCategories);

    if (newSelectedCategories.length > 0) {
      onSelectCategory(newSelectedCategories[0]);
    } else {
      onSelectCategory(null);
    }

    const currentPageCategoryIds = categories
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((category) => category.id);

    setSelectAll(
      currentPageCategoryIds.every((id) => newSelectedCategories.includes(id))
    );
  };

  return (
    <div className="font-gilroyRegular tracking-wider overflow-x-auto">
      {isLoading ? (
        <div className="py-10 text-center">Loading categories...</div>
      ) : isError ? (
        <div className="py-10 text-center text-red-500">
          Error loading categories
        </div>
      ) : (
        <>
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-3 px-4 text-left left-0 bg-white">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Category Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Category Code
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Image Preview
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((category) => (
                    <tr
                      key={category.id}
                      className={`border-t ${
                        selectedCategory === category.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() =>
                        onSelectCategory(
                          selectedCategory === category.id ? null : category.id
                        )
                      }
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedCategories.includes(category.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectCategory(category.id, e.target.checked);
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {category.categoryName || ""}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {category.categoryCode || ""}
                      </td>
                      <td className="py-3 px-4">
                        {category.image ? (
                          <img
                            src={getImage(category.image) ?? undefined}
                            alt="Category preview"
                            className="h-10 object-contain"
                            width="auto"
                            height="auto"
                          />
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewCategory(category.id);
                          }}
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
                            className="lucide lucide-eye-icon lucide-eye"
                          >
                            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>

                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCategory(category.id);
                          }}
                        >
                          {/* <Edit size={18} /> */}
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
                            className="lucide lucide-pencil-icon lucide-pencil"
                          >
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>

                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCategory(category.id);
                          }}
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
                            className="lucide lucide-trash2-icon lucide-trash-2"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="hidden md:flex">
              Showing {startItem} to {endItem} of {categories.length} entries
            </div>
            <div className="flex items-center gap-4">
              <select
                className="p-2 border rounded"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[10, 25, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  &lt;&lt;
                </button>
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  &lt;
                </button>
                <span className="px-2 py-1 bg-gray-100 border rounded">
                  {currentPage}
                </span>
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  &gt;
                </button>
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  &gt;&gt;
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
