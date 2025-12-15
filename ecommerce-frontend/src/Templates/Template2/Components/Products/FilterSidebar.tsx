import type React from "react";
import { useEffect, useState } from "react";
import {
  // useGetAllPrdCollarMstQuery,
  // useGetAllPrdColorMstQuery,
  // useGetAllPrdFabricMstQuery,
  // useGetAllPrdOccasionMstQuery,
  // useGetAllPrdPatternMstQuery,
  useGetAllPrdSizeMstQuery,
  // useGetAllPrdSleeveMstQuery,
} from "Services/ProductFilterApiSlice";
import { useGetAllSizesQuery } from "Services/Admin/SizeApiSlice";

interface FilterSidebarProps {
  onClose?: () => void;
  onFilterChange: (filter: string, category: string) => void;
  selectedFilters: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onClose,
  onFilterChange,
  selectedFilters,
}) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisabled(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const toggleAccordion = (id: string) => {
    if (!disabled) {
      setOpenAccordion(openAccordion === id ? null : id);
    }
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    if (disabled) return;
    const numValue = parseInt(value) || 0;
    if (type === "min") {
      setPriceRange([numValue, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], numValue]);
    }
  };

  const applyPriceFilter = () => {
    if (!disabled) {
      onFilterChange(`Rs. ${priceRange[0]} - Rs. ${priceRange[1]}`, "Price");
    }
  };

  const { data: sizes } = useGetAllSizesQuery({
    plant: process.env.REACT_APP_PLANT || "",
  });

  // const { data: sizes } = useGetAllPrdSizeMstQuery({
  //   plant: process.env.REACT_APP_PLANT,
  // });

  // const { data: sleeves } = useGetAllPrdSleeveMstQuery({
  //   plant: process.env.REACT_APP_PLANT,
  // });
  // const { data: colors } = useGetAllPrdColorMstQuery({
  //   plant: process.env.REACT_APP_PLANT,
  // });
  // const { data: fabrics } = useGetAllPrdFabricMstQuery({
  //   plant: process.env.REACT_APP_PLANT,
  // });
  // const { data: occasions } = useGetAllPrdOccasionMstQuery({
  //   plant: process.env.REACT_APP_PLANT,
  // });
  // const { data: collars } = useGetAllPrdCollarMstQuery({
  //   plant: process.env.REACT_APP_PLANT,
  // });
  // const { data: patterns } = useGetAllPrdPatternMstQuery({
  //   plant: process.env.REACT_APP_PLANT,
  // });

  const extractContent = (data: any, key: string) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    const firstItem = data[0];

    if (firstItem && typeof firstItem === "object") {
      const availableKeys = Object.keys(firstItem);

      if (firstItem[key] === undefined) {
        const similarKey = availableKeys.find((k) =>
          k.toLowerCase().includes(key.toLowerCase())
        );

        if (similarKey) {
          return data.map((item: any) => item[similarKey]);
        }
      }
    }

    return data.map((item: any) => {
      if (typeof item === "string") return item;
      return item[key] || `Unknown ${key}`;
    });
  };

  useEffect(() => {
    if (sizes) {
    }
  }, [sizes]);

  const filterOptions = [
    {
      id: "size",
      label: "Size",
      category: "Size",
      content: extractContent(sizes, "PRD_SIZE_DESC"),
    },
    // {
    //   id: "sleeve",
    //   label: "Sleeve",
    //   category: "Sleeve",
    //   content: extractContent(sleeves, "PRD_SLEEVE"),
    // },
    // {
    //   id: "color",
    //   label: "Color",
    //   category: "Color",
    //   content: extractContent(colors, "PRD_COLOR_DESC"),
    // },
    // {
    //   id: "fabric",
    //   label: "Fabric",
    //   category: "Fabric",
    //   content: extractContent(fabrics, "PRD_FABRIC"),
    // },
    // {
    //   id: "occasion",
    //   label: "Occasion",
    //   category: "Occasion",
    //   content: extractContent(occasions, "PRD_OCCASION_DESC"),
    // },
    // {
    //   id: "collar",
    //   label: "Collar",
    //   category: "Collar",
    //   content: extractContent(collars, "COLLAR"),
    // },
    // {
    //   id: "pattern",
    //   label: "Pattern",
    //   category: "Pattern",
    //   content: extractContent(patterns, "PRD_PATTERN_DESC"),
    // },
  ];

  return (
    <div className="h-full overflow-y-auto hide-scrollbar">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">FILTERS</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={disabled}
          >
            {/* <XIcon size={24} /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-icon lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
      <div>
        <div className="border-b p-4">
          <h3 className="font-medium mb-4">Price Range</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <label htmlFor="minPrice" className="block text-sm mb-1">
                From
              </label>
              <input
                type="number"
                id="minPrice"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange("min", e.target.value)}
                className="border p-1 w-24"
                disabled={disabled}
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm mb-1">
                To
              </label>
              <input
                type="number"
                id="maxPrice"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange("max", e.target.value)}
                className="border p-1 w-24"
                disabled={disabled}
              />
            </div>
          </div>
          <button
            onClick={applyPriceFilter}
            className="w-full bg-black text-white py-2 px-4 hover:bg-gray-800"
            disabled={disabled}
          >
            Apply
          </button>
        </div>
        {filterOptions.map((option) => (
          <div key={option.id} className="border-b">
            <button
              className="flex justify-between items-center w-full p-4 text-left"
              onClick={() => toggleAccordion(option.id)}
              disabled={disabled}
            >
              {option.label}
              <span>{openAccordion === option.id ? "-" : "+"}</span>
            </button>
            {openAccordion === option.id && (
              <div className="p-4">
                <div className="space-y-2">
                  {(option.content as string[]).map((item) => (
                    <div key={item} className="flex items-center">
                      <input
                        type="checkbox"
                        id={item}
                        checked={selectedFilters.includes(item)}
                        onChange={() =>
                          !disabled && onFilterChange(item, option.category)
                        }
                        className="mr-2"
                        disabled={disabled}
                      />
                      <label htmlFor={item}>{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
