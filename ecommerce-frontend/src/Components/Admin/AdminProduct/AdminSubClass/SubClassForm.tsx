import React, { useState } from "react";
import { useGetAllCategoriesQuery } from "Services/Admin/CategoryAdminApiSlice";
import { SubClassAdminRequestDTO } from "Types/Admin/AdminSubClassType";
import { CategoryAdminDTO } from "Types/Admin/AdminCategoryType";
import { notifications } from "@mantine/notifications";

interface SubClassFormProps {
  initialValues: SubClassAdminRequestDTO;
  onSubmit: (data: SubClassAdminRequestDTO) => void;
  onCancel: () => void;
  mode: "add" | "edit" | "view";
}

export const SubClassForm: React.FC<SubClassFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  mode,
}) => {
  const { data: apiCategories, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery();
  const [formData, setFormData] =
    useState<SubClassAdminRequestDTO>(initialValues);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isIdManuallyEdited, setIsIdManuallyEdited] = useState(
    !!initialValues.subClassCode
  );

  const categories: CategoryAdminDTO[] = apiCategories || [];

  const fetchExistingSubClassCodes = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/subclasses");
      if (!response.ok) throw new Error("Failed to fetch Sub Category");
      const data = await response.json();
      return Array.isArray(data)
        ? data
            .map((subclass: any) => subclass.subClassCode || "")
            .filter(Boolean)
        : [];
    } catch (error) {
      console.error("Failed to fetch Sub Category codes:", error);
      return [];
    }
  };

  const generateSubClassCode = async () => {
    if (mode !== "add") return;

    setIsGeneratingCode(true);
    try {
      const existingCodes = await fetchExistingSubClassCodes();

      let baseCode = "SUB";
      baseCode += Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");

      let newCode = baseCode;
      let counter = 1;

      while (existingCodes.includes(newCode)) {
        const codeArray = newCode.split("");
        let position = codeArray.length - 1 - counter;

        if (position < 0) {
          newCode = baseCode + counter.toString().padStart(2, "0");
          counter++;
          continue;
        }

        if (!isNaN(parseInt(codeArray[position]))) {
          let num = parseInt(codeArray[position]);
          num = (num + 1) % 10;
          codeArray[position] = num.toString();
        } else {
          let charCode = codeArray[position].charCodeAt(0);
          charCode = ((charCode - 65 + 1) % 26) + 65;
          codeArray[position] = String.fromCharCode(charCode);
        }

        newCode = codeArray.join("");
        counter++;
      }

      setFormData((prev) => ({
        ...prev,
        subClassCode: newCode,
      }));
      setIsIdManuallyEdited(true);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to generate Sub Category code",
        color: "red",
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (
      (name === "subClassName" || name === "subClassCode") &&
      value.length > 100
    )
      return;

    if (name === "subClassName") {
      const newId = value.replace(/\s/g, "");
      setFormData((prev) => ({
        ...prev,
        subClassName: value,
        subClassCode: isIdManuallyEdited ? prev.subClassCode : newId,
      }));
    } else if (name === "subClassCode") {
      setIsIdManuallyEdited(value !== "");
      setFormData((prev) => ({ ...prev, subClassCode: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isViewMode = mode === "view";
  const readOnlyProps = isViewMode ? { readOnly: true } : {};

  return (
    <form onSubmit={handleSubmit} className="font-gilroyRegular tracking-wider">
      <div className="bg-white px-6 py-12 rounded-md shadow-md my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Sub Category Code*
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="subClassCode"
                  value={formData.subClassCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    mode !== "add" ? "bg-gray-100" : ""
                  }`}
                  required
                  readOnly={mode !== "add"}
                  maxLength={100}
                  placeholder="Enter Sub Category code or generate"
                />
                {mode === "add" && (
                  <button
                    type="button"
                    onClick={generateSubClassCode}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-800"
                    disabled={isGeneratingCode}
                    title="Generate Sub Category Code"
                  >
                    {isGeneratingCode ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-spin"
                      >
                        <path d="M12 2v4" />
                        <path d="m16.2 7.8 2.9-2.9" />
                        <path d="M18 12h4" />
                        <path d="m16.2 16.2 2.9 2.9" />
                        <path d="M12 18v4" />
                        <path d="m4.9 19.1 2.9-2.9" />
                        <path d="M2 12h4" />
                        <path d="m4.9 4.9 2.9 2.9" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M8 16H3v5" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Sub Category Name*
              </label>
              <input
                type="text"
                name="subClassName"
                value={formData.subClassName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                required
                maxLength={100}
                {...readOnlyProps}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Category*
              </label>
              <select
                name="categoryCode"
                required
                value={formData.categoryCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm"
                disabled={mode === "view" || isLoadingCategories}
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.categoryCode}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              {isLoadingCategories && (
                <p className="text-sm text-gray-500 mt-1">
                  Loading categories...
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Status*
              </label>
              <select
                name="isActive"
                required
                value={formData.isActive}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm"
                disabled={isViewMode}
              >
                <option value="Y">Active</option>
                <option value="N">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {mode !== "view" && (
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            className="px-6 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white text-blue-600 hover:bg-gray-50"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            type="submit"
          >
            {mode === "add" ? "Add Sub Category" : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  );
};
