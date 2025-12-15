import { ProductAdminRequestDTO } from "Interface/Admin/Products/admin-product.interface";
import React from "react";

interface CustomAttributesSectionProps {
    formData: ProductAdminRequestDTO;
    setFormData: React.Dispatch<React.SetStateAction<ProductAdminRequestDTO>>;
    mode: "add" | "edit" | "view";
    open: boolean;
    toggleSection: () => void;
}

export const CustomAttributesSection: React.FC<CustomAttributesSectionProps> = ({
    formData,
    setFormData,
    mode,
    open,
    toggleSection,
}) => {
    const handleCustomAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="font-gilroyRegular tracking-wider border rounded-md">
            <button
                type="button"
                onClick={toggleSection}
                className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
            >
                <h3 className="text-lg font-medium">Custom Attributes</h3>
                {open ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up h-5 w-5"><path d="m18 15-6-6-6 6" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-5 w-5"><path d="m6 9 6 6 6-6" /></svg>
                )}
            </button>
            {open && (
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail Label 1</label>
                        <input
                            type="text"
                            name="labelPara1"
                            value={formData.labelPara1 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter label"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail 1</label>
                        <input
                            type="text"
                            name="parameter1"
                            value={formData.parameter1 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter parameter"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail Label 2</label>
                        <input
                            type="text"
                            name="labelPara2"
                            value={formData.labelPara2 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter label"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail 2</label>
                        <input
                            type="text"
                            name="parameter2"
                            value={formData.parameter2 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter parameter"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail Label 3</label>
                        <input
                            type="text"
                            name="labelPara3"
                            value={formData.labelPara3 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter label"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail 3</label>
                        <input
                            type="text"
                            name="parameter3"
                            value={formData.parameter3 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter parameter"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail Label 4</label>
                        <input
                            type="text"
                            name="labelPara4"
                            value={formData.labelPara4 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter label"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail 4</label>
                        <input
                            type="text"
                            name="parameter4"
                            value={formData.parameter4 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter parameter"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail Label 5</label>
                        <input
                            type="text"
                            name="labelPara5"
                            value={formData.labelPara5 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter label"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail 5</label>
                        <input
                            type="text"
                            name="parameter5"
                            value={formData.parameter5 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter parameter"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail Label 6</label>
                        <input
                            type="text"
                            name="labelPara6"
                            value={formData.labelPara6 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter label"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail 6</label>
                        <input
                            type="text"
                            name="parameter6"
                            value={formData.parameter6 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter parameter"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail Label 7</label>
                        <input
                            type="text"
                            name="labelPara7"
                            value={formData.labelPara7 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter label"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail 7</label>
                        <input
                            type="text"
                            name="parameter7"
                            value={formData.parameter7 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter parameter"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail Label 8</label>
                        <input
                            type="text"
                            name="labelPara8"
                            value={formData.labelPara8 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter label"
                            readOnly={mode === "view"}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Detail 8</label>
                        <input
                            type="text"
                            name="parameter8"
                            value={formData.parameter8 || ""}
                            onChange={handleCustomAttributeChange}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            placeholder="Enter parameter"
                            readOnly={mode === "view"}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};