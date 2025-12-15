import React, { useState } from "react";
import { CategoryAdminRequestDTO } from "Types/Admin/AdminCategoryType";
import { getImage } from "Utilities/ImageConverter";
import { notifications } from "@mantine/notifications";

interface CategoryFormProps {
  initialValues: CategoryAdminRequestDTO;
  onSubmit: (data: CategoryAdminRequestDTO, imageFile?: File) => void;
  onCancel: () => void;
  mode: "add" | "edit" | "view";
  existingImage?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  mode,
  existingImage,
}) => {
  const [formData, setFormData] =
    useState<CategoryAdminRequestDTO>(initialValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const fetchExistingCategoryCodes = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      return Array.isArray(data)
        ? data.map((cat: any) => cat.categoryCode || "").filter(Boolean)
        : [];
    } catch (error) {
      console.error("Failed to fetch category codes:", error);
      return [];
    }
  };

  const generateCategoryCode = async () => {
    if (mode !== "add") return;

    setIsGeneratingCode(true);
    try {
      const existingCodes = await fetchExistingCategoryCodes();

      let baseCode = "PC";
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
        categoryCode: newCode,
      }));
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to generate category code",
        color: "red",
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, imageFile || undefined);
  };

  const isViewMode = mode === "view";
  const readOnlyProps = isViewMode ? { readOnly: true } : {};

  React.useEffect(() => {
    if (existingImage && mode === "edit") {
      const existingImageUrl = getImage(existingImage);
      setImagePreview(existingImageUrl);
    }
  }, [existingImage, mode]);

  return (
    <form onSubmit={handleSubmit} className="font-gilroyRegular tracking-wider">
      <div className="bg-white px-6 py-12 rounded-md shadow-md my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Category Code*{" "}
                <span className="text-xs">
                  {mode !== "add" ? "(This field cannot be edited)" : ""}
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="categoryCode"
                  value={formData.categoryCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0 ${
                    mode !== "add" ? "bg-gray-100" : ""
                  }`}
                  readOnly={mode !== "add"}
                  required
                  placeholder="Enter category code (max 100 chars)"
                  {...readOnlyProps}
                />
                {mode === "add" && (
                  <button
                    type="button"
                    onClick={generateCategoryCode}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-800"
                    title="Generate Category Code"
                    disabled={isGeneratingCode}
                  >
                    {isGeneratingCode ? (
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
                Category Image {!isViewMode && "*"}
              </label>
              {isViewMode ? (
                existingImage ? (
                  <div className="mt-2">
                    <img
                      src={getImage(existingImage ?? null) || undefined}
                      alt="Category preview"
                      className="max-h-40 object-contain border rounded"
                    />
                  </div>
                ) : (
                  <span className="text-gray-400">No image</span>
                )
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                    required={mode === "add"}
                  />
                  {(imagePreview || (mode === "edit" && existingImage)) && (
                    <div className="mt-2">
                      <img
                        src={
                          imagePreview ||
                          getImage(existingImage ?? null) ||
                          undefined
                        }
                        alt="Category preview"
                        className="max-h-40 object-contain border rounded"
                        width="auto"
                        height="auto"
                      />
                      {mode === "edit" && existingImage && !imagePreview && (
                        <p className="text-sm text-gray-500 mt-1">
                          Current uploaded image
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Category Name*
              </label>
              <input
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                {...readOnlyProps}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Active
              </label>
              {isViewMode ? (
                <div className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 bg-gray-100">
                  {formData.isActive === "Y" ? "Active" : "Inactive"}
                </div>
              ) : (
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                  required
                >
                  <option value="Y">Active</option>
                  <option value="N">Inactive</option>
                </select>
              )}
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
            {mode === "add" ? "Add Category" : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  );
};
