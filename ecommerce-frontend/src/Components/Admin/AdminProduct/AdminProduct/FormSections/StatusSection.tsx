import { ProductAdminRequestDTO } from "Interface/Admin/Products/admin-product.interface";
import React from "react";

interface StatusSectionProps {
    formData: ProductAdminRequestDTO;
    setFormData: React.Dispatch<React.SetStateAction<ProductAdminRequestDTO>>;
    mode: "add" | "edit" | "view";
    open: boolean;
    toggleSection: () => void;
}

export const StatusSection: React.FC<StatusSectionProps> = ({
    formData,
    setFormData,
    mode,
    open,
    toggleSection,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: keyof ProductAdminRequestDTO, value: number) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="font-gilroyRegular tracking-wider border rounded-md">
            <button
                type="button"
                onClick={toggleSection}
                className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
            >
                <h3 className="text-lg font-medium">Status</h3>
                {open ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up h-5 w-5"><path d="m18 15-6-6-6 6" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-5 w-5"><path d="m6 9 6 6 6-6" /></svg>
                )}
            </button>
            {open && (
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Active Status</label>
                        <select
                            name="isActive"
                            value={formData.isActive}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            disabled={mode === "view"}
                        >
                            <option value="Y">Active</option>
                            <option value="N">Inactive</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-5">
                        <input
                            type="checkbox"
                            checked={formData.isNewArrival === 1}
                            onChange={(e) => handleCheckboxChange("isNewArrival", e.target.checked ? 1 : 0)}
                            disabled={mode === "view"}
                            className="h-4 w-4"
                        />
                        <label className="text-sm text-gray-700">New Arrival</label>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-5">
                        <input
                            type="checkbox"
                            checked={formData.isTopSelling === 1}
                            onChange={(e) => handleCheckboxChange("isTopSelling", e.target.checked ? 1 : 0)}
                            disabled={mode === "view"}
                            className="h-4 w-4"
                        />
                        <label className="text-sm text-gray-700">Top Selling</label>
                    </div>
                </div>
            )}
        </div>
    );
};