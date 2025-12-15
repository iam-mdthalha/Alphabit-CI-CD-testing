import React, { useState } from "react";
import { SubCategoryAdminRequestDTO } from "Types/Admin/AdminSubCategoryType";
import { notifications } from "@mantine/notifications";

interface SubCategoryFormProps {
  initialValues: SubCategoryAdminRequestDTO;
  onSubmit: (data: SubCategoryAdminRequestDTO) => void;
  onCancel: () => void;
  mode: "add" | "edit" | "view";
}

export const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  mode,
}) => {
  const [formData, setFormData] =
    useState<SubCategoryAdminRequestDTO>(initialValues);
  const [isIdManuallyEdited, setIsIdManuallyEdited] = useState(
    !!initialValues.subCategoryCode
  );
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const fetchExistingSubCategoryCodes = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/subcategories");
      if (!response.ok) throw new Error("Failed to fetch subcategories");
      const data = await response.json();
      return Array.isArray(data)
        ? data
            .map((subcat: any) => subcat.subCategoryCode || "")
            .filter(Boolean)
        : [];
    } catch (error) {
      console.error("Failed to fetch subcategory codes:", error);
      return [];
    }
  };

  const generateSubCategoryCode = async () => {
    if (mode !== "add") return;

    setIsGeneratingCode(true);
    try {
      const existingCodes = await fetchExistingSubCategoryCodes();

      let baseCode = "PSC";
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
        subCategoryCode: newCode,
      }));
      setIsIdManuallyEdited(true);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to generate subcategory code",
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

    if ((name === "prdTypeDesc" || name === "prdTypeId") && value.length > 100)
      return;

    if (name === "prdTypeDesc") {
      const newId = value.replace(/\s/g, "");
      setFormData((prev) => ({
        ...prev,
        subCategoryName: value,
        subCategoryCode: isIdManuallyEdited ? prev.subCategoryCode : newId,
      }));
    } else if (name === "prdTypeId") {
      setIsIdManuallyEdited(value !== "");
      setFormData((prev) => ({ ...prev, subCategoryCode: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <div className="font-gilroyRegular tracking-wider bg-white px-6 py-12 rounded-md shadow-md my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Sub Category ID{" "}
              <span className="text-xs">
                {mode !== "add" ? "(This field cannot be edited)" : ""}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="prdTypeId"
                value={formData.subCategoryCode}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  mode !== "add" ? "bg-gray-100" : ""
                }`}
                required
                readOnly={mode !== "add"}
                maxLength={100}
                placeholder="Enter sub category ID (max 100 chars)"
              />
              {mode === "add" && (
                <button
                  type="button"
                  onClick={generateSubCategoryCode}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-800"
                  title="Generate Subcategory Code"
                  disabled={isGeneratingCode}
                >
                  {isGeneratingCode ? (
                    // <Loader2 size={16} className="animate-spin" />
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
                      className="lucide lucide-loader-icon lucide-loader"
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
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-refresh-cw-icon lucide-refresh-cw"
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
              Sub Category Description
            </label>
            <input
              type="text"
              name="prdTypeDesc"
              value={formData.subCategoryName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
              readOnly={mode === "view"}
              maxLength={100}
              placeholder="Enter sub category description (max 100 chars)"
            />
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
            {mode === "add" ? "Add" : "Save"}
          </button>
        </div>
      )}
    </form>
  );
};
