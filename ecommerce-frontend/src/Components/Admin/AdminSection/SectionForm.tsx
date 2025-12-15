import { SectionProductTable } from "Components/Admin/AdminSection/SectionProductTable";
import React, { useState } from "react";
import { SectionAdminRequestDTO } from "Types/Admin/AdminSectionType";
import { getImage } from "Utilities/ImageConverter";
import { showNotification } from "@mantine/notifications";

interface SectionFormProps {
  initialValues: SectionAdminRequestDTO;
  onSubmit: (data: SectionAdminRequestDTO, imageFiles: (File | null)[]) => void;
  onCancel: () => void;
  mode: "add" | "edit" | "view";
  existingImages?: string[];
  onProductSelectionChange: (productIds: string[]) => void;
}

export const SectionForm: React.FC<SectionFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  mode,
  existingImages,
  onProductSelectionChange,
}) => {
  const [formData, setFormData] =
    useState<SectionAdminRequestDTO>(initialValues);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    initialValues.productList || []
  );

  const [productFilters, setProductFilters] = useState({
    category: "",
    subCategory: "",
    brand: "",
    productName: "",
  });

  const handleProductSelectionChange = (productIds: string[]) => {
    setSelectedProductIds(productIds);
    setFormData((prev) => ({ ...prev, productList: productIds }));
    onProductSelectionChange(productIds);
  };

  const handleFilterChange = (name: string, value: string) => {
    setProductFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    let maxLengths: Record<string, number> = {
      name: 200,
      description: 1000,
      ctaText: 50,
    };
    if (maxLengths[name] && value.length > maxLengths[name]) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductListChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      productList: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleImageChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const updatedImageFiles = [...imageFiles];
        updatedImageFiles[index] = file;
        setImageFiles(updatedImageFiles);

        const reader = new FileReader();
        reader.onloadend = () => {
          const updatedPreviews = [...imagePreviews];
          updatedPreviews[index] = reader.result as string;
          setImagePreviews(updatedPreviews);
        };
        reader.readAsDataURL(file);
      }
    };

  React.useEffect(() => {
    if (existingImages && existingImages.length > 0 && mode === "edit") {
      const updatedPreviews = [...imagePreviews];
      existingImages.forEach((image, index) => {
        if (image) {
          updatedPreviews[index] = getImage(image);
        }
      });
      setImagePreviews(updatedPreviews);
    }
  }, [existingImages, mode]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const [openSections, setOpenSections] = useState({
    search: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUploadedImages = imageFiles
      .slice(0, formData.imageCount)
      .filter(Boolean).length;

    const existingImageCount =
      mode === "edit" && existingImages
        ? existingImages.slice(0, formData.imageCount).filter(Boolean).length
        : 0;

    const totalAvailableImages = newUploadedImages + existingImageCount;

    if (totalAvailableImages < formData.imageCount) {
      showNotification({
        title: "Missing Images",
        message: `Please upload ${formData.imageCount} image${
          formData.imageCount > 1 ? "s" : ""
        } before submitting.`,
        color: "red",
      });
      return;
    }

    onSubmit({ ...formData, productList: selectedProductIds }, imageFiles);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="font-gilroyRegular tracking-wider bg-white px-2 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12 rounded-md shadow-md my-4 sm:my-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Section Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
              required
              readOnly={mode === "view"}
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Description*
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
              rows={3}
              required
              readOnly={mode === "view"}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {formData.description.length}/1000 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Image Count
            </label>
            <select
              name="imageCount"
              value={formData.imageCount}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
              disabled={mode === "view"}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: formData.imageCount }).map((_, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Section Image {index + 1} {mode === "view" && "*"}*
                </label>
                {mode === "view" ? (
                  existingImages && existingImages[index] ? (
                    <div className="mt-2">
                      <img
                        src={getImage(existingImages[index]) || undefined}
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
                      onChange={handleImageChange(index)}
                      className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                      required={mode === "add" && index === 0}
                    />
                    {(imagePreviews[index] ||
                      (mode === "edit" &&
                        existingImages &&
                        existingImages[index])) && (
                      <div className="mt-2">
                        <img
                          src={
                            imagePreviews[index] ||
                            (existingImages && existingImages[index]
                              ? getImage(existingImages[index])
                              : null) ||
                            undefined
                          }
                          alt="Category preview"
                          className="max-h-40 object-contain border rounded"
                        />
                        {mode === "edit" &&
                          existingImages &&
                          existingImages[index] &&
                          !imagePreviews[index] && (
                            <p className="text-sm text-gray-500 mt-1">
                              Current uploaded image
                            </p>
                          )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Call-to-Action Text
            </label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
              required
              readOnly={mode === "view"}
              maxLength={50}
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Product IDs (comma separated)
            </label>
            <input
              type="text"
              value={formData.productList.join(", ")}
              onChange={handleProductListChange}
              className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
              readOnly={mode === "view"}
            />
          </div> */}

          <div className="border rounded-md">
            <button
              type="button"
              onClick={() => toggleSection("search")}
              className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <h3 className="text-lg font-medium">Search Product</h3>
              {openSections.search ? (
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
                  className="lucide lucide-chevron-up-icon lucide-chevron-up h-5 w-5"
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
                  className="lucide lucide-chevron-down-icon lucide-chevron-down h-5 w-5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              )}
            </button>
            {openSections.search && (
              <>
                <div className="p-4">
                  <SectionProductTable
                    mode={mode}
                    formData={productFilters}
                    onFilterChange={handleFilterChange}
                    onSelectionChange={handleProductSelectionChange}
                    initialSelectedProducts={formData.productList}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {mode !== "view" && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-4">
          <button
            className="w-full sm:w-auto px-6 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white text-blue-600 hover:bg-gray-50"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            type="submit"
          >
            {mode === "add" ? "Create Section" : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  );
};
