import React, { useState } from "react";
import { BannerAdminRequestDTO } from "Types/Admin/AdminBannerType";

interface BannerFormProps {
  initialValues: BannerAdminRequestDTO;
  onSubmit: (
    data: BannerAdminRequestDTO,
    imageFile?: File,
    mobileImageFile?: File
  ) => void;
  onCancel: () => void;
  mode: "add" | "edit" | "view";
  existingImage?: string;
  existingMobileImage?: string;
}

export const BannerForm: React.FC<BannerFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  mode,
  existingImage,
  existingMobileImage,
}) => {
  const [formData, setFormData] =
    useState<BannerAdminRequestDTO>(initialValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);
  const [mobileImagePreview, setMobileImagePreview] = useState<string | null>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let maxLengths: Record<string, number> = {
      title: 100,
      buttonText: 50,
      description: 200,
      link: 500,
    };
    if (maxLengths[name] && value.length > maxLengths[name]) {
      return;
    }
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

  const handleMobileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMobileImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMobileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, imageFile || undefined, mobileImageFile || undefined);
  };

  const isViewMode = mode === "view";
  const readOnlyProps = isViewMode ? { readOnly: true } : {};

  React.useEffect(() => {
    if (existingImage && mode === "edit") {
      setImagePreview(existingImage);
    }
  }, [existingImage, mode]);

  React.useEffect(() => {
    if (existingMobileImage && mode === "edit") {
      setMobileImagePreview(existingMobileImage);
    }
  }, [existingMobileImage, mode]);

  return (
    <form onSubmit={handleSubmit} className="font-gilroyRegular tracking-wider">
      <div className="bg-white px-6 py-12 rounded-md shadow-md my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                required
                maxLength={100}
                {...readOnlyProps}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0 min-h-[100px]"
                maxLength={200}
                {...readOnlyProps}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formData.description.length}/200 characters
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Button Text
              </label>
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                maxLength={50}
                {...readOnlyProps}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Link URL*
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                required
                maxLength={500}
                placeholder="https://example.com"
                {...readOnlyProps}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Desktop Image {!isViewMode && "*"}
              </label>
              {isViewMode ? (
                existingImage ? (
                  <div className="mt-2">
                    <img
                      src={existingImage}
                      alt="Desktop Banner preview"
                      className="max-h-40 object-contain border rounded"
                      width="auto"
                      height="auto"
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
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Desktop Banner preview"
                        className="max-h-40 object-contain border rounded"
                        width="auto"
                        height="auto"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Mobile Image {!isViewMode && "*"}
              </label>
              {isViewMode ? (
                existingMobileImage ? (
                  <div className="mt-2">
                    <img
                      src={existingMobileImage}
                      alt="Mobile Banner preview"
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
                    onChange={handleMobileImageChange}
                    className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                    required={mode === "add"}
                  />
                  {mobileImagePreview && (
                    <div className="mt-2">
                      <img
                        src={mobileImagePreview}
                        alt="Mobile Banner preview"
                        className="max-h-40 object-contain border rounded"
                      />
                    </div>
                  )}
                </>
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
            {mode === "add" ? "Add Banner" : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  );
};
