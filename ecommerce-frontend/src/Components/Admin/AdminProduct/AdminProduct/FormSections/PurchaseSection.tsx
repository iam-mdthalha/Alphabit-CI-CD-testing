import { ProductAdminRequestDTO } from "Interface/Admin/Products/admin-product.interface";
import React from "react";

interface PurchaseSectionProps {
    formData: ProductAdminRequestDTO;
    setFormData: React.Dispatch<React.SetStateAction<ProductAdminRequestDTO>>;
    mode: "add" | "edit" | "view";
    open: boolean;
    toggleSection: () => void;
}

export const PurchaseSection: React.FC<PurchaseSectionProps> = ({
    formData,
    setFormData,
    mode,
    open,
    toggleSection,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="font-gilroyRegular tracking-wider border rounded-md">
            <button
                type="button"
                onClick={toggleSection}
                className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
            >
                <h3 className="text-lg font-medium">Purchase</h3>
                {open ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up h-5 w-5"><path d="m18 15-6-6-6 6" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-5 w-5"><path d="m6 9 6 6 6-6" /></svg>
                )}
            </button>
            {open && (
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Purchase UOM</label>
                        <select
                            name="purchaseUom"
                            value={formData.purchaseUom || "pcs"}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            disabled={mode === "view"}
                        >
                            <option value="pcs">PCS</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Cost Price</label>
                        <input
                            type="number"
                            step="0.01"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            readOnly={mode === "view"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};