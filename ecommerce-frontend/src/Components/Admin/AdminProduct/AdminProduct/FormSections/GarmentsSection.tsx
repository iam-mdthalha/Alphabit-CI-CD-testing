import { ProductAdminRequestDTO } from "Interface/Admin/Products/admin-product.interface";
import React from "react";
import { useGetAllCollarsQuery } from "Services/Admin/CollarApiSlice";
import { useGetAllColorsQuery } from "Services/Admin/ColorApiSlice";
import { useGetAllFabricsQuery } from "Services/Admin/FabricApiSlice";
import { useGetAllOccasionsQuery } from "Services/Admin/OccasionApiSlice";
import { useGetAllPatternsQuery } from "Services/Admin/PatternApiSlice";
import { useGetAllSizesQuery } from "Services/Admin/SizeApiSlice";
import { useGetAllSleevesQuery } from "Services/Admin/SleeveApiSlice";
import { Collar } from "Types/Admin/AdminCollarType";
import { Color } from "Types/Admin/AdminColorType";
import { Fabric } from "Types/Admin/AdminFabricType";
import { Occasion } from "Types/Admin/AdminOccasionType";
import { Pattern } from "Types/Admin/AdminPatternType";
import { Size } from "Types/Admin/AdminSizeType";
import { Sleeve } from "Types/Admin/AdminSleeveType";

interface GarmentsSectionProps {
    formData: ProductAdminRequestDTO;
    setFormData: React.Dispatch<React.SetStateAction<ProductAdminRequestDTO>>;
    mode: "add" | "edit" | "view";
    open: boolean;
    toggleSection: () => void;
}

export const GarmentsSection: React.FC<GarmentsSectionProps> = ({
    formData,
    setFormData,
    mode,
    open,
    toggleSection,
}) => {
    const { data: apiCollars = [], isLoading: isLoadingCollars } = useGetAllCollarsQuery({ plant: process.env.REACT_APP_PLANT });
    const { data: apiColors = [], isLoading: isLoadingColors } = useGetAllColorsQuery({ plant: process.env.REACT_APP_PLANT });
    const { data: apiFabrics = [], isLoading: isLoadingFabrics } = useGetAllFabricsQuery({ plant: process.env.REACT_APP_PLANT });
    const { data: apiOccasions = [], isLoading: isLoadingOccasions } = useGetAllOccasionsQuery({ plant: process.env.REACT_APP_PLANT });
    const { data: apiSizes = [], isLoading: isLoadingSizes } = useGetAllSizesQuery({ plant: process.env.REACT_APP_PLANT });
    const { data: apiSleeves = [], isLoading: isLoadingSleeves } = useGetAllSleevesQuery({ plant: process.env.REACT_APP_PLANT });
    const { data: apiPatterns = [], isLoading: isLoadingPatterns } = useGetAllPatternsQuery({ plant: process.env.REACT_APP_PLANT });

    const collars: Collar[] = apiCollars.map((c) => ({
        id: c.id,
        collar_description: c.collar,
        isactive: c.isactive,
        plant: c.plant,
    }));
    const colors: Color[] = apiColors || [];
    const fabrics: Fabric[] = apiFabrics || [];
    const occasions: Occasion[] = apiOccasions || [];
    const sizes: Size[] = apiSizes || [];
    const sleeves: Sleeve[] = apiSleeves || [];
    const patterns: Pattern[] = apiPatterns.map((p) => ({
        id: p.id,
        prd_pattern_desc: p.prd_pattern_desc,
        isactive: p.isactive,
    })) || [];

    const handleGarmentChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            productGarmentType: {
                ...prev.productGarmentType,
                [field]: value,
            },
        }));
    };

    return (
        <div className="font-gilroyRegular tracking-wider border rounded-md">
            <button
                type="button"
                onClick={toggleSection}
                className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
            >
                <h3 className="text-lg font-medium">Garments</h3>
                {open ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up h-5 w-5"><path d="m18 15-6-6-6 6" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down h-5 w-5"><path d="m6 9 6 6 6-6" /></svg>
                )}
            </button>
            {open && (
                <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Size</label>
                        <select
                            name="size"
                            value={formData.productGarmentType?.size || ""}
                            onChange={(e) => handleGarmentChange("size", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            disabled={mode === "view" || isLoadingSizes}
                        >
                            <option value="">Select size</option>
                            {sizes.map((size) => (
                                <option key={size.id} value={size.prd_Size_Desc}>
                                    {size.prd_Size_Desc}
                                </option>
                            ))}
                        </select>
                        {isLoadingSizes && <p className="text-sm text-gray-500 mt-1">Loading sizes...</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Sleeve</label>
                        <select
                            name="sleeve"
                            value={formData.productGarmentType?.sleeve || ""}
                            onChange={(e) => handleGarmentChange("sleeve", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            disabled={mode === "view" || isLoadingSleeves}
                        >
                            <option value="">Select sleeve</option>
                            {sleeves.map((sleeve) => (
                                <option key={sleeve.id} value={sleeve.prd_sleeve}>
                                    {sleeve.prd_sleeve}
                                </option>
                            ))}
                        </select>
                        {isLoadingSleeves && <p className="text-sm text-gray-500 mt-1">Loading sleeves...</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Color</label>
                        <select
                            name="color"
                            value={formData.productGarmentType?.color || ""}
                            onChange={(e) => handleGarmentChange("color", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            disabled={mode === "view" || isLoadingColors}
                        >
                            <option value="">Select color</option>
                            {colors.map((color) => (
                                <option key={color.id} value={color.prd_color_desc}>
                                    {color.prd_color_desc}
                                </option>
                            ))}
                        </select>
                        {isLoadingColors && <p className="text-sm text-gray-500 mt-1">Loading colors...</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Fabric</label>
                        <select
                            name="fabric"
                            value={formData.productGarmentType?.fabric || ""}
                            onChange={(e) => handleGarmentChange("fabric", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            disabled={mode === "view" || isLoadingFabrics}
                        >
                            <option value="">Select fabric</option>
                            {fabrics.map((fabric) => (
                                <option key={fabric.id} value={fabric.prd_fabric}>
                                    {fabric.prd_fabric}
                                </option>
                            ))}
                        </select>
                        {isLoadingFabrics && <p className="text-sm text-gray-500 mt-1">Loading fabrics...</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Occasion</label>
                        <select
                            name="occasion"
                            value={formData.productGarmentType?.occasion || ""}
                            onChange={(e) => handleGarmentChange("occasion", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            disabled={mode === "view" || isLoadingOccasions}
                        >
                            <option value="">Select occasion</option>
                            {occasions.map((occasion) => (
                                <option key={occasion.id} value={occasion.prd_occasion_desc}>
                                    {occasion.prd_occasion_desc}
                                </option>
                            ))}
                        </select>
                        {isLoadingOccasions && <p className="text-sm text-gray-500 mt-1">Loading occasions...</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Collar</label>
                        <select
                            name="collar"
                            value={formData.productGarmentType?.collar || ""}
                            onChange={(e) => handleGarmentChange("collar", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            disabled={mode === "view" || isLoadingCollars}
                        >
                            <option value="">Select collar</option>
                            {collars.map((collar) => (
                                <option key={collar.id} value={collar.collar_description}>
                                    {collar.collar_description}
                                </option>
                            ))}
                        </select>
                        {isLoadingCollars && <p className="text-sm text-gray-500 mt-1">Loading collars...</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Pattern</label>
                        <select
                            name="pattern"
                            value={formData.productGarmentType?.pattern || ""}
                            onChange={(e) => handleGarmentChange("pattern", e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            disabled={mode === "view" || isLoadingPatterns}
                        >
                            <option value="">Select pattern</option>
                            {patterns.map((pattern) => (
                                <option key={pattern.id} value={pattern.prd_pattern_desc}>
                                    {pattern.prd_pattern_desc}
                                </option>
                            ))}
                        </select>
                        {isLoadingPatterns && <p className="text-sm text-gray-500 mt-1">Loading patterns...</p>}
                    </div>
                </div>
            )}
        </div>
    );
};