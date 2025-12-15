import React, { useState } from "react";
import { SectionAdminDTO } from "Types/Admin/AdminSectionType";
import { getImage } from "Utilities/ImageConverter";

interface SectionTableProps {
  sections: SectionAdminDTO[];
  onSelectSection: (id: number | null) => void;
  onDeleteSection: (id: number) => void;
  onViewSection: (id: number) => void;
  onEditSection: (id: number) => void;
  selectedSection: number | null;
  isLoading?: boolean;
  isError?: boolean;
}

export const SectionTable: React.FC<SectionTableProps> = ({
  sections,
  onSelectSection,
  onDeleteSection,
  onViewSection,
  onEditSection,
  selectedSection,
  isLoading = false,
  isError = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSections, setSelectedSections] = useState<number[]>([]);

  const totalPages = Math.ceil(sections.length / itemsPerPage);
  const startItem =
    sections.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sections.length);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const currentPageSectionIds = sections
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map((section) => section.id); // Use section.id
      setSelectedSections(currentPageSectionIds);

      if (currentPageSectionIds.length > 0) {
        onSelectSection(currentPageSectionIds[0]);
      }
    } else {
      setSelectedSections([]);
      onSelectSection(null);
    }
  };

  const handleSelectSection = (id: number, checked: boolean) => {
    let newSelectedSections: number[];

    if (checked) {
      newSelectedSections = [...selectedSections, id];
    } else {
      newSelectedSections = selectedSections.filter(
        (sectionId) => sectionId !== id
      );
    }

    setSelectedSections(newSelectedSections);

    if (newSelectedSections.length > 0) {
      onSelectSection(newSelectedSections[0]);
    } else {
      onSelectSection(null);
    }

    const currentPageSectionIds = sections
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((section) => section.id); // Use section.id

    setSelectAll(
      currentPageSectionIds.every((id) => newSelectedSections.includes(id))
    );
  };

  return (
    <div className="font-gilroyRegular tracking-wider overflow-x-auto w-full">
      {isLoading ? (
        <div className="py-10 text-center">Loading sections...</div>
      ) : isError ? (
        <div className="py-10 text-center text-red-500">
          Error loading sections
        </div>
      ) : (
        <>
          <table className="min-w-full text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left left-0 bg-white">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm md:text-base font-semibold text-gray-500 whitespace-nowrap">
                  Section Name
                </th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm md:text-base font-semibold text-gray-500 whitespace-nowrap">
                  Description
                </th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm md:text-base font-semibold text-gray-500 whitespace-nowrap">
                  Image
                </th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm md:text-base font-semibold text-gray-500 whitespace-nowrap">
                  Products
                </th>
                <th className="py-2 px-2 sm:py-3 sm:px-4 text-left text-xs sm:text-sm md:text-base font-semibold text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No sections found
                  </td>
                </tr>
              ) : (
                sections
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((section) => (
                    <tr
                      key={section.id}
                      className={`border-t ${
                        selectedSection === section.id
                          ? "bg-blue-50"
                          : ""
                      }`}
                      onClick={() =>
                        onSelectSection(
                          selectedSection === section.id
                            ? null
                            : section.id
                        )
                      }
                    >
                      <td className="py-2 px-2 sm:py-3 sm:px-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedSections.includes(section.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectSection(
                              section.id,
                              e.target.checked
                            );
                          }}
                        />
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm md:text-base font-medium">
                        {section.name}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm md:text-base text-gray-600">
                        {section.description.length > 50
                          ? `${section.description.substring(0, 50)}...`
                          : section.description}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4">
                        {section.image1 ? (
                          <img
                            src={getImage(section.image1) ?? undefined}
                            alt="Category preview"
                            className="h-10 object-contain"
                            width="auto"
                            height="auto"
                          />
                        ) : (
                          <span className="text-gray-400">No image</span>
                        )}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm md:text-base">
                        {section.productsList.length}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 flex gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewSection(section.id);
                          }}
                        >
                          {/* <Eye size={18} /> */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditSection(section.id);
                          }}
                        >
                          {/* <Edit size={18} /> */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSection(section.id);
                          }}
                        >
                          {/* <Trash2 size={18} /> */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-xs sm:text-sm md:text-base gap-2 sm:gap-0">
            <div className="hidden md:flex">
              Showing {startItem} to {endItem} of {sections.length} entries
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
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

              <div className="flex items-center gap-1 sm:gap-2">
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