import React from "react";

interface SectionLayoutOptionsProps {
  sectionLayout: string;
  setSectionLayout: (layout: string) => void;
  sectionPadding: string;
  setSectionPadding: (padding: string) => void;
}

const SectionLayoutOptions: React.FC<SectionLayoutOptionsProps> = ({
  sectionLayout,
  setSectionLayout,
  sectionPadding,
  setSectionPadding,
}) => {
  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-4 rounded-md border border-gray-200">
      <h4 className="text-xs font-medium text-gray-700 mb-3">Layout Options</h4>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Section Layout
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div
              className={`border rounded-md p-2 cursor-pointer ${
                sectionLayout === "grid"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSectionLayout("grid")}
            >
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-1 w-16">
                  <div className="bg-gray-300 h-3 rounded"></div>
                  <div className="bg-gray-300 h-3 rounded"></div>
                  <div className="bg-gray-300 h-3 rounded"></div>
                  <div className="bg-gray-300 h-3 rounded"></div>
                </div>
              </div>
              <div className="text-center mt-1 text-xs">Grid</div>
            </div>

            <div
              className={`border rounded-md p-2 cursor-pointer ${
                sectionLayout === "list"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSectionLayout("list")}
            >
              <div className="flex justify-center">
                <div className="flex flex-col w-16 space-y-1">
                  <div className="bg-gray-300 h-2 rounded"></div>
                  <div className="bg-gray-300 h-2 rounded"></div>
                  <div className="bg-gray-300 h-2 rounded"></div>
                </div>
              </div>
              <div className="text-center mt-1 text-xs">List</div>
            </div>

            <div
              className={`border rounded-md p-2 cursor-pointer ${
                sectionLayout === "card"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => setSectionLayout("card")}
            >
              <div className="flex justify-center">
                <div className="w-16">
                  <div className="border border-gray-300 rounded-md p-1">
                    <div className="bg-gray-300 h-2 rounded mb-1"></div>
                    <div className="bg-gray-300 h-6 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-1 text-xs">Card</div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Section Padding
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                id="padding-small"
                type="radio"
                checked={sectionPadding === "small"}
                onChange={() => setSectionPadding("small")}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="padding-small"
                className="ml-2 block text-xs text-gray-700"
              >
                Small
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="padding-medium"
                type="radio"
                checked={sectionPadding === "medium"}
                onChange={() => setSectionPadding("medium")}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="padding-medium"
                className="ml-2 block text-xs text-gray-700"
              >
                Medium
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="padding-large"
                type="radio"
                checked={sectionPadding === "large"}
                onChange={() => setSectionPadding("large")}
                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor="padding-large"
                className="ml-2 block text-xs text-gray-700"
              >
                Large
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionLayoutOptions;
