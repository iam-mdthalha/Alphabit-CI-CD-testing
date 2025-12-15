import React from "react";
import { Actions } from "Components/Admin/StyleComponent/Actions";
import { Table } from "Components/Admin/StyleComponent/Table";
import { useGetAllLocTypesQuery } from "Services/Admin/LocTypeApiSlice";

interface ProductPromotionTableProps {
  promotions: {
    id: number;
    outlet: string;
    promotion: string;
    promotion_description: string;
    start_date_or_time: string;
    end_date_or_time: string;
    isActive: string;
    originalData: any;
  }[];
  onEdit: (Product: any) => void;
  onView: (Product: any) => void;
  onDelete: (Product: any) => void;
  selectAll: boolean;
  onSelectAll: () => void;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export const ProductPromotionTable = ({
  promotions,
  onEdit,
  onView,
  onDelete,
  selectAll,
  onSelectAll,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: ProductPromotionTableProps) => {
  
  const { data: locTypes = [], isLoading } = useGetAllLocTypesQuery({
    plant: process.env.REACT_APP_PLANT,
  });

  const locationMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    locTypes.forEach((locType) => {
      map[locType.locTypeId] = locType.locTypeDesc;
    });
    return map;
  }, [locTypes]);

  return (
    <>
      <Actions hideEdit={false} />
      <Table
        headers={[
          "Outlet/Location",
          "Promotion",
          "Description",
          "Start Date - Time",
          "End Date - Time",
          "Active",
        ]}
        selectAll={selectAll}
        onSelectAll={onSelectAll}
        totalItems={promotions.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      >
        {promotions
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((Product) => (
            <tr key={Product.id} className="border-t">
              <td className="py-3 px-4">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectAll}
                  onChange={() => {}}
                />
              </td>
              <td className="py-3 px-4 text-sm">
                {locationMap[Product.outlet] || Product.outlet}
              </td>
              <td className="py-3 px-4 text-sm">{Product.promotion}</td>
              <td className="py-3 px-4 text-sm">
                {Product.promotion_description}
              </td>
              <td className="py-3 px-4 text-sm">
                {Product.start_date_or_time}
              </td>
              <td className="py-3 px-4 text-sm">{Product.end_date_or_time}</td>
              <td className="py-3 px-4 text-sm">
                {Product.isActive === "Y" ? "Yes" : "No"}
              </td>
              <td className="py-3 px-4 flex gap-2">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => onView(Product)}
                  title="View"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => onEdit(Product)}
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(Product)}
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
      </Table>
    </>
  );
};
