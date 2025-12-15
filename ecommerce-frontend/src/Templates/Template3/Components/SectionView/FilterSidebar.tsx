// FilterSidebarWithExpandable.js
import { useState } from "react";

const FilterSidebar = () => {
    const [expanded, setExpanded] = useState<string | null>("Size");
    const toggleSection = (section: string) => {
        setExpanded(expanded === section ? null : section);
    };

    const sizes = [
        ["5", "5.5", "6"],
        ["6.5", "7", "7.5"],
        ["8", "8.5", "9"],
        ["9.5", "10", "10.5"],
        ["11", "11.5", "12"],
        ["13", "14", "15"],
    ];

    return (
        <aside className="w-full md:w-1/5 px-6">
            {["Size", "Style Name", "Category"].map((section, idx) => (
                <div key={idx} className="border-b py-4">
                    <button
                        className="w-full flex justify-between text-sm font-medium"
                        onClick={() => toggleSection(section)}
                    >
                        {section}
                        <span className="text-lg">{expanded === section ? "-" : "+"}</span>
                    </button>

                    {expanded === section && section === "Size" && (
                        <div className="mt-4">
                            <div className="text-xs font-medium mb-1">Availability</div>
                            <div className="flex items-center gap-2 mb-4">
                                <button className="px-2 py-1 rounded-full bg-black text-white text-xs">
                                    In-Stock
                                </button>
                                <button className="px-2 py-1 rounded-full bg-gray-200 text-xs">
                                    Pre-Order
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {sizes.flat().map((size, index) => (
                                    <button
                                        key={index}
                                        className="text-xs bg-gray-100 hover:bg-gray-300 py-1 rounded"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4">
                                <div className="text-xs font-medium mb-1">Width</div>
                                <div className="flex gap-2">
                                    <button className="w-12 text-xs bg-gray-100 hover:bg-gray-300 py-1 rounded">
                                        D
                                    </button>
                                    <button className="w-12 text-xs bg-gray-100 hover:bg-gray-300 py-1 rounded">
                                        E
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {expanded === section && section !== "Size" && (
                        <div className="mt-4 text-sm text-gray-500 italic">
                            {/* Placeholder content */}
                            {section} filter content...
                        </div>
                    )}
                </div>
            ))}
        </aside>
    );
};

export default FilterSidebar;
