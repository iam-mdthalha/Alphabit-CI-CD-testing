import React, { useState } from "react";
import { SubCategoryAdminDTO } from "Types/Admin/AdminSubCategoryType";

interface SubCategoryTableProps {
  subCategories: SubCategoryAdminDTO[];
  onSelectSubCategory: (id: string | null) => void;
  onDeleteSubCategory: (id: string) => void;
  onViewSubCategory: (id: string) => void;
  onEditSubCategory: (id: string) => void;
  selectedSubCategory: string | null;
  isLoading?: boolean;
  isError?: boolean;
}

export const SubCategoryTable: React.FC<SubCategoryTableProps> = ({
  subCategories,
  onSelectSubCategory,
  onDeleteSubCategory,
  onViewSubCategory,
  onEditSubCategory,
  selectedSubCategory,
  isLoading = false,
  isError = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );

  const totalPages = Math.ceil(subCategories.length / itemsPerPage);
  const startItem =
    subCategories.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, subCategories.length);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const currentPageSubCategoryIds = subCategories
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map((subCategory) => subCategory.subCategoryCode);
      setSelectedSubCategories(currentPageSubCategoryIds);

      if (currentPageSubCategoryIds.length > 0) {
        onSelectSubCategory(currentPageSubCategoryIds[0]);
      }
    } else {
      setSelectedSubCategories([]);
      onSelectSubCategory(null);
    }
  };

  const handleSelectSubCategory = (id: string, checked: boolean) => {
    let newSelectedSubCategories: string[];

    if (checked) {
      newSelectedSubCategories = [...selectedSubCategories, id];
    } else {
      newSelectedSubCategories = selectedSubCategories.filter(
        (subCategoryId) => subCategoryId !== id
      );
    }

    setSelectedSubCategories(newSelectedSubCategories);

    if (newSelectedSubCategories.length > 0) {
      onSelectSubCategory(newSelectedSubCategories[0]);
    } else {
      onSelectSubCategory(null);
    }

    const currentPageSubCategoryIds = subCategories
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((subCategory) => subCategory.subCategoryCode);

    setSelectAll(
      currentPageSubCategoryIds.every((id) =>
        newSelectedSubCategories.includes(id)
      )
    );
  };

  return (
    <div className="font-gilroyRegular tracking-wider overflow-x-auto">
      {isLoading ? (
        <div className="py-10 text-center">Loading subCategories...</div>
      ) : isError ? (
        <div className="py-10 text-center text-red-500">
          Error loading subCategories
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
                  Description
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  ID
                </th>
                {/* <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Active
                </th> */}
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No Sub Category types found
                  </td>
                </tr>
              ) : (
                subCategories
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((subCategory) => (
                    <tr
                      key={subCategory.subCategoryCode}
                      className={`border-t ${
                        selectedSubCategory === subCategory.subCategoryCode
                          ? "bg-blue-50"
                          : ""
                      }`}
                      onClick={() =>
                        onSelectSubCategory(
                          selectedSubCategory === subCategory.subCategoryCode
                            ? null
                            : subCategory.subCategoryCode
                        )
                      }
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedSubCategories.includes(
                            subCategory.subCategoryCode
                          )}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectSubCategory(
                              subCategory.subCategoryCode,
                              e.target.checked
                            );
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {subCategory.subCategoryName}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {subCategory.subCategoryCode}
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewSubCategory(subCategory.subCategoryCode);
                          }}
                        >
                          {/* <Eye size={18} /> */}
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
                            onEditSubCategory(subCategory.subCategoryCode);
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
                            onDeleteSubCategory(subCategory.subCategoryCode);
                          }}
                        >
                          {/* <Trash2 size={18} /> */}
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
              Showing {startItem} to {endItem} of {subCategories.length} entries
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
                {[100, 500, 1000, 5000].map((value) => (
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
