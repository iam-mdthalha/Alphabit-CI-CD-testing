import React from "react";

export const Table: React.FC<{
  headers: string[];
  children: React.ReactNode;
  selectAll?: boolean;
  onSelectAll?: () => void;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}> = ({
  headers,
  children,
  selectAll = false,
  onSelectAll,
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="font-gilroyRegular tracking-wider overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="py-3 px-4 text-left left-0 bg-white">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selectAll}
                onChange={onSelectAll}
              />
            </th>
            {headers.map((header, index) => (
              <th
                key={index}
                className="py-3 px-4 text-left text-sm font-semibold text-gray-500 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="hidden md:flex">
          Showing {startItem} to {endItem} of {totalItems} entries
        </div>
        <div className="flex items-center gap-4">
          <select
            className="p-2 border rounded"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
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
              onClick={() => onPageChange(1)}
            >
              &lt;&lt;
            </button>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              &lt;
            </button>
            <span className="px-2 py-1 bg-gray-100 border rounded">
              {currentPage}
            </span>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              &gt;
            </button>
            <button
              className="px-2 py-1 border rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
