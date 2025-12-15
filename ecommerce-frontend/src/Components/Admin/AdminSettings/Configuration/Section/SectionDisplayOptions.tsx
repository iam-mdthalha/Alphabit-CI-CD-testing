import React from "react";

interface SectionDisplayOptionsProps {
  imageCount: number;
  setImageCount: (count: number) => void;
  productsView: {
    grid: boolean;
    table: boolean;
  };
  onToggleView: (view: string) => void;
}

const SectionDisplayOptions: React.FC<SectionDisplayOptionsProps> = ({
  imageCount,
  setImageCount,
  productsView,
  onToggleView,
}) => {
  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-4 rounded-md border border-gray-200">
      <h4 className="text-xs font-medium text-gray-700 mb-3">
        Display Options
      </h4>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Image Count
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="image-count-1"
                type="radio"
                checked={imageCount === 1}
                onChange={() => setImageCount(1)}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="image-count-1"
                className="ml-2 block text-xs text-gray-700"
              >
                1
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="image-count-2"
                type="radio"
                checked={imageCount === 2}
                onChange={() => setImageCount(2)}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="image-count-2"
                className="ml-2 block text-xs text-gray-700"
              >
                2
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="image-count-4"
                type="radio"
                checked={imageCount === 4}
                onChange={() => setImageCount(4)}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="image-count-4"
                className="ml-2 block text-xs text-gray-700"
              >
                4
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Products View
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="view-grid"
                type="radio"
                checked={productsView.grid}
                onChange={() => onToggleView("grid")}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="view-grid"
                className="ml-2 block text-xs text-gray-700"
              >
                Grid
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="view-table"
                type="radio"
                checked={productsView.table}
                onChange={() => onToggleView("table")}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="view-table"
                className="ml-2 block text-xs text-gray-700"
              >
                Table
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionDisplayOptions;
