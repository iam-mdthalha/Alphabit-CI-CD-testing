import React, { useState } from "react";
import { SubClassMstDTO } from "Types/Admin/AdminSubClassType";

interface SubClassTableProps {
  subClasses: SubClassMstDTO[];
  onSelectSubClass: (id: string | null) => void;
  onDeleteSubClass: (id: string) => void;
  onViewSubClass: (id: string) => void;
  onEditSubClass: (id: string) => void;
  selectedSubClass: string | null;
  isLoading?: boolean;
  isError?: boolean;
}

export const SubClassTable: React.FC<SubClassTableProps> = ({
  subClasses,
  onSelectSubClass,
  onDeleteSubClass,
  onViewSubClass,
  onEditSubClass,
  selectedSubClass,
  isLoading = false,
  isError = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSubClasses, setSelectedSubClasses] = useState<string[]>([]);

  const totalPages = Math.ceil(subClasses.length / itemsPerPage);
  const startItem =
    subClasses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, subClasses.length);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const currentPageSubClassIds = subClasses
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map((subClass) => subClass.subClassCode);
      setSelectedSubClasses(currentPageSubClassIds);

      if (currentPageSubClassIds.length > 0) {
        onSelectSubClass(currentPageSubClassIds[0]);
      }
    } else {
      setSelectedSubClasses([]);
      onSelectSubClass(null);
    }
  };

  const handleSelectSubClass = (id: string, checked: boolean) => {
    let newSelectedSubClasses: string[];

    if (checked) {
      newSelectedSubClasses = [...selectedSubClasses, id];
    } else {
      newSelectedSubClasses = selectedSubClasses.filter(
        (subClassId) => subClassId !== id
      );
    }

    setSelectedSubClasses(newSelectedSubClasses);

    if (newSelectedSubClasses.length > 0) {
      onSelectSubClass(newSelectedSubClasses[0]);
    } else {
      onSelectSubClass(null);
    }

    const currentPageSubClassIds = subClasses
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((subClass) => subClass.subClassCode);

    setSelectAll(
      currentPageSubClassIds.every((id) => newSelectedSubClasses.includes(id))
    );
  };

  return (
    <div className="font-gilroyRegular tracking-wider overflow-x-auto">
      {isLoading ? (
        <div className="py-10 text-center">Loading Sub Categories...</div>
      ) : isError ? (
        <div className="py-10 text-center text-red-500">
          Error loading sub categories
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
                  Sub Category Code
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Sub Category Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Category Code
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subClasses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    No Sub Category Found
                  </td>
                </tr>
              ) : (
                subClasses
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((subClass) => (
                    <tr
                      key={subClass.subClassCode}
                      className={`border-t ${
                        selectedSubClass === subClass.subClassCode
                          ? "bg-blue-50"
                          : ""
                      }`}
                      onClick={() =>
                        onSelectSubClass(
                          selectedSubClass === subClass.subClassCode
                            ? null
                            : subClass.subClassCode
                        )
                      }
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedSubClasses.includes(
                            subClass.subClassCode
                          )}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectSubClass(
                              subClass.subClassCode,
                              e.target.checked
                            );
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {subClass.subClassCode}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {subClass.subClassName}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {subClass.categoryCode}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subClass.isActive === true || "Y"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {subClass.isActive === true || "Y" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewSubClass(subClass.subClassCode);
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
                            onEditSubClass(subClass.subClassCode);
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
                            onDeleteSubClass(subClass.subClassCode);
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
              Showing {startItem} to {endItem} of {subClasses.length} entries
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
