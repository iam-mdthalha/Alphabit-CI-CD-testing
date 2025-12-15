import React from "react";

interface SectionContentOptionsProps {
  productOptions: {
    byProduct: boolean;
    byCategory: boolean;
    bySubCategory: boolean;
    byBrand: boolean;
    byModel: boolean;
  };
  onToggleOption: (option: "byProduct" | "byCategory" | "bySubCategory" | "byBrand" | "byModel") => void;
}

const SectionContentOptions: React.FC<SectionContentOptionsProps> = ({
  productOptions,
  onToggleOption,
}) => {
  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-4 rounded-md border border-gray-200">
      <h4 className="text-xs font-medium text-gray-700 mb-3">
        Content Options
      </h4>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Add Product Based On:
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="relative inline-block w-8 mr-2 align-middle select-none">
              <input
                id="by-product"
                type="checkbox"
                checked={productOptions.byProduct}
                onChange={() => onToggleOption("byProduct")}
                className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="by-product"
                className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer ${
                  productOptions.byProduct ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            </div>
            <span className="text-xs text-gray-700">Product</span>
          </div>

          <div className="flex items-center">
            <div className="relative inline-block w-8 mr-2 align-middle select-none">
              <input
                id="by-category"
                type="checkbox"
                checked={productOptions.byCategory}
                onChange={() => onToggleOption("byCategory")}
                className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="by-category"
                className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer ${
                  productOptions.byCategory ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            </div>
            <span className="text-xs text-gray-700">Category</span>
          </div>

          <div className="flex items-center">
            <div className="relative inline-block w-8 mr-2 align-middle select-none">
              <input
                id="by-subcategory"
                type="checkbox"
                checked={productOptions.bySubCategory}
                onChange={() => onToggleOption("bySubCategory")}
                className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="by-subcategory"
                className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer ${
                  productOptions.bySubCategory ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            </div>
            <span className="text-xs text-gray-700">Sub Category</span>
          </div>

          <div className="flex items-center">
            <div className="relative inline-block w-8 mr-2 align-middle select-none">
              <input
                id="by-brand"
                type="checkbox"
                checked={productOptions.byBrand}
                onChange={() => onToggleOption("byBrand")}
                className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="by-brand"
                className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer ${
                  productOptions.byBrand ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            </div>
            <span className="text-xs text-gray-700">Brand</span>
          </div>

          <div className="flex items-center">
            <div className="relative inline-block w-8 mr-2 align-middle select-none">
              <input
                id="by-model"
                type="checkbox"
                checked={productOptions.byModel}
                onChange={() => onToggleOption("byModel")}
                className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="by-model"
                className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer ${
                  productOptions.byModel ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            </div>
            <span className="text-xs text-gray-700">Model</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionContentOptions;
