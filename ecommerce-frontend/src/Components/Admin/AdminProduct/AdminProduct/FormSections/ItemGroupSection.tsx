import { ProductAdminRequestDTO } from "Interface/Admin/Products/admin-product.interface";
import React from "react";
import { useGetAllItemGroupsQuery } from "Services/Admin/ItemGroupApi";

interface ItemGroupSectionProps {
    formData: ProductAdminRequestDTO;
    setFormData: React.Dispatch<React.SetStateAction<ProductAdminRequestDTO>>;
    mode: "add" | "edit" | "view";
    open: boolean;
    toggleSection: () => void;
}

export const ItemGroupSection: React.FC<ItemGroupSectionProps> = ({
    formData,
    setFormData,
    mode,
    open,
    toggleSection,
}) => {
    const { data: itemGroups, isLoading, isError } = useGetAllItemGroupsQuery();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value ? Number(value) : undefined
        }));
    };

    return (
        <div className="font-gilroyRegular tracking-wider border rounded-md">
            <button
                type="button"
                onClick={toggleSection}
                className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
            >
                <h3 className="text-lg font-medium">Product Group</h3>
                {open ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up h-5 w-5"><path d="m18 15-6-6-6 6" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-5 w-5"><path d="m6 9 6 6 6-6" /></svg>
                )}
            </button>
            {open && (
                <div className="px-4 pb-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                Select Related Product
                            </label>
                            <select
                                name="itemGroupId"
                                value={formData.itemGroupId || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                                disabled={mode === "view" || isLoading}
                            >
                                <option value="">-- Select a Product --</option>
                                {isLoading ? (
                                    <option value="" disabled>Loading Product Groups...</option>
                                ) : isError ? (
                                    <option value="" disabled>Error Loading Product Groups</option>
                                ) : (
                                    itemGroups?.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.itemGroupName}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};