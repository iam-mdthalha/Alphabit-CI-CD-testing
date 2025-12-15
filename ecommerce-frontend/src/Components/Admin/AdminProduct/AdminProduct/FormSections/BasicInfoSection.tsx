import { ProductAdminRequestDTO } from "Interface/Admin/Products/admin-product.interface";
import React, { useEffect, useState } from "react";

interface BasicInfoSectionProps {
  formData: ProductAdminRequestDTO;
  setFormData: React.Dispatch<React.SetStateAction<ProductAdminRequestDTO>>;
  mode: "add" | "edit" | "view";
  open: boolean;
  toggleSection: () => void;
  mainImageFile: File | null;
  setMainImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  addImageFiles: (File | null)[];
  setAddImageFiles: React.Dispatch<React.SetStateAction<(File | null)[]>>;
  addImgsLineNo: number[];
  setAddImgsLineNo: React.Dispatch<React.SetStateAction<number[]>>;
  existingMainImage?: string;
  existingAdditionalImages?: string[];
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  setFormData,
  mode,
  open,
  toggleSection,
  mainImageFile,
  setMainImageFile,
  addImageFiles,
  setAddImageFiles,
  addImgsLineNo,
  setAddImgsLineNo,
  existingMainImage,
  existingAdditionalImages,
}) => {
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [addImagePreviews, setAddImagePreviews] = useState<(string | null)[]>(
    Array(5).fill(null)
  );

  const fetchExistingProductCodes = async (): Promise<string[]> => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const products = await response.json();
      return products.map((product: any) => product.product?.item || "");
    } catch (error) {
      return [];
    }
  };

  const generateProductCode = async () => {
    setIsGeneratingCode(true);
    try {
      const existingCodes = await fetchExistingProductCodes();
      let baseCode = "PRD";
      if (formData.category)
        baseCode += formData.category.substring(0, 3).toUpperCase();
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
      setFormData((prev) => ({ ...prev, productCode: newCode }));
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    let maxLengths: Record<string, number> = {
      productName: 500,
      remarkTwo: 1000,
    };
    if (maxLengths[name] && value.length > maxLengths[name]) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let value = e.target.value;
    if (value.length > 100) value = value.slice(0, 100);

    const lines = value.split("\n");
    let start = 0;
    let end = lines.length - 1;

    while (start <= end && lines[start] === "") start++;
    while (end >= start && lines[end] === "") end--;

    const descriptions = lines.slice(start, end + 1);
    setFormData((prev) => ({ ...prev, productDescription: descriptions }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setMainImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setMainImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const file = e.target.files[0];
        const updatedImageFiles = [...addImageFiles];
        updatedImageFiles[index] = file;
        setAddImageFiles(updatedImageFiles);

        const reader = new FileReader();
        reader.onloadend = () => {
          const updatedPreviews = [...addImagePreviews];
          updatedPreviews[index] = reader.result as string;
          setAddImagePreviews(updatedPreviews);
        };
        reader.readAsDataURL(file);

        if (!existingAdditionalImages?.[index]) {
          setAddImgsLineNo((prev) => [...prev, index]);
        } else {
          setAddImgsLineNo((prev) =>
            prev.includes(index) ? prev : [...prev, index]
          );
        }
      }
    };

  return (
    <div className="font-gilroyRegular tracking-wider border rounded-md">
      <button
        type="button"
        onClick={toggleSection}
        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
      >
        <h3 className="text-lg font-medium">Basic Information</h3>
        {open ? (
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
            className="lucide lucide-chevron-up h-5 w-5"
          >
            <path d="m18 15-6-6-6 6" />
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
            className="lucide lucide-chevron-down h-5 w-5"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* PRODUCT CODE */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Product Code *
              <span className="text-xs">
                {mode !== "add" ? "(This field cannot be edited)" : ""}
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="productCode"
                value={formData.productCode || ""}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  mode !== "add" ? "bg-gray-100" : ""
                }`}
                required
                maxLength={20}
                placeholder="Enter product code(max 20 chars)"
                readOnly={mode !== "add"}
              />
              {mode === "add" && (
                <button
                  type="button"
                  onClick={generateProductCode}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-800"
                  title="Generate Product Code"
                  disabled={isGeneratingCode}
                >
                  {isGeneratingCode ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-loader animate-spin"
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
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-refresh-cw"
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

          {/* PRODUCT NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              readOnly={mode === "view"}
              maxLength={500}
              placeholder="Enter product name (max 500 chars)"
              required
            />
          </div>

          {/* PRODUCT DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Product Descriptions
            </label>
            <textarea
              name="productDescription"
              value={formData.productDescription || ""}
              onChange={handleDescriptionChange}
              className="w-full px-3 py-2 border rounded-md text-sm h-32"
              readOnly={mode === "view"}
              maxLength={100}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {Array.isArray(formData.productDescription)
                ? (formData.productDescription as string[]).join("\n").length
                : String(formData.productDescription).length}
              /100 characters
            </div>
          </div>

          {/* DETAILED DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Product Detailed Descriptions
            </label>
            <textarea
              name="remarkTwo"
              value={formData.remarkTwo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              readOnly={mode === "view"}
              maxLength={1000}
              placeholder="Enter remark (max 1000 chars)"
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {(formData.remarkTwo || "").length}/1000 characters
            </div>
          </div>

          {/* AUTHOR */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={formData.author || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              readOnly={mode === "view"}
              placeholder="Enter author name"
            />
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              readOnly={mode === "view"}
              placeholder="Enter ISBN number"
            />
          </div>

          {/* Additional Images section continues normally */}
          {/* MAIN PRODUCT IMAGE */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Main Product Image*
            </label>
            {mode !== "view" && (
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                required={
                  mode === "add" || (mode === "edit" && !existingMainImage)
                }
              />
            )}

            {(mainImagePreview || existingMainImage) && (
              <div className="mt-2">
                <img
                  src={mainImagePreview || existingMainImage || undefined}
                  alt="Category preview"
                  className="max-h-40 object-contain border rounded"
                  width="auto"
                  height="auto"
                />
                {mode === "edit" && existingMainImage && !mainImagePreview && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current uploaded image
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ADDITIONAL IMAGES LOOP */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Additional Product Image {index + 1}
              </label>

              {mode !== "view" && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAdditionalImagesChange(index)}
                  className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                />
              )}

              {(addImagePreviews[index] ||
                existingAdditionalImages?.[index]) && (
                <div className="mt-2">
                  <img
                    src={
                      addImagePreviews[index] ||
                      existingAdditionalImages?.[index] ||
                      undefined
                    }
                    alt="Category preview"
                    className="max-h-40 object-contain border rounded"
                    width="auto"
                    height="auto"
                  />
                  {mode === "edit" &&
                    existingAdditionalImages?.[index] &&
                    !addImagePreviews[index] && (
                      <p className="text-sm text-gray-500 mt-1">
                        Current uploaded image
                      </p>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
