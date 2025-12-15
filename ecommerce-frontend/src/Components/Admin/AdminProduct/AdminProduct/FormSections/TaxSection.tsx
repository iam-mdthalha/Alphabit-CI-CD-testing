import { ProductAdminRequestDTO } from "Interface/Admin/Products/admin-product.interface";
import React from "react";

interface TaxSectionProps {
    formData: ProductAdminRequestDTO;
    setFormData: React.Dispatch<React.SetStateAction<ProductAdminRequestDTO>>;
    mode: "add" | "edit" | "view";
    open: boolean;
    toggleSection: () => void;
}

export const TaxSection: React.FC<TaxSectionProps> = ({
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
                <h3 className="text-lg font-medium">Tax Information</h3>
                {open ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up h-5 w-5"><path d="m18 15-6-6-6 6" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-5 w-5"><path d="m6 9 6 6 6-6" /></svg>
                )}
            </button>
            {open && (
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">GST</label>
                        <input
                            type="number"
                            step="0.01"
                            name="gst"
                            value={formData.gst ?? 0}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            readOnly={mode === "view"}
                            min="0"
                            max="28"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">CGST</label>
                        <input
                            type="number"
                            step="0.01"
                            name="cgst"
                            value={formData.cgst ?? 0}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            readOnly={mode === "view"}
                            min="0"
                            max="14"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">SGST</label>
                        <input
                            type="number"
                            step="0.01"
                            name="sgst"
                            value={formData.sgst ?? 0}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            readOnly={mode === "view"}
                            min="0"
                            max="14"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">CESS</label>
                        <input
                            type="number"
                            step="0.01"
                            name="cess"
                            value={formData.cess ?? 0}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            readOnly={mode === "view"}
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">HS Code</label>
                        <input
                            type="text"
                            name="hsCode"
                            value={formData.hsCode ?? 0}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            readOnly={mode === "view"}
                            placeholder="Enter Harmonized System Code"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};