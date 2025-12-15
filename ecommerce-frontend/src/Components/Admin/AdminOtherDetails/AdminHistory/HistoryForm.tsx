import React, { useState, ChangeEvent, FormEvent } from "react";

export type HistoryFormMode = "add" | "edit";

export interface HistoryFormValues {
  year: number;
  title: string;
  description1: string;
  description2: string;
  description3: string;
  imageUrl?: string | null;
}

interface HistoryFormProps {
  mode: HistoryFormMode;
  initialValues: HistoryFormValues;
  loading?: boolean;
  onSubmit: (values: HistoryFormValues, file: File | null) => Promise<void> | void;
  onCancel?: () => void;
}

const HistoryForm: React.FC<HistoryFormProps> = ({
  mode,
  initialValues,
  loading = false,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState<HistoryFormValues>(initialValues);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialValues.imageUrl ?? null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: name === "year" ? Number(value) : value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0] ?? null;
    setFile(chosen);
    if (chosen) {
      setPreviewUrl(URL.createObjectURL(chosen));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!values.year) {
      newErrors.year = "Year is required";
    }
    if (!values.title.trim()) {
      newErrors.title = "Title is required";
    }

    // For ADD: image is required. For EDIT: optional.
    if (mode === "add" && !file) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit(values, file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Year */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Year<span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="year"
          value={values.year || ""}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          placeholder="2025"
        />
        {errors.year && (
          <span className="text-xs text-red-600">{errors.year}</span>
        )}
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          Title<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          placeholder="Enter title"
        />
        {errors.title && (
          <span className="text-xs text-red-600">{errors.title}</span>
        )}
      </div>

      {/* Description 1 */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Description 1</label>
        <textarea
          name="description1"
          value={values.description1}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[70px]"
        />
      </div>

      {/* Description 2 */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Description 2</label>
        <textarea
          name="description2"
          value={values.description2}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[70px]"
        />
      </div>

      {/* Description 3 */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Description 3</label>
        <textarea
          name="description3"
          value={values.description3}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[70px]"
        />
      </div>

      {/* Image upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Image{mode === "add" && <span className="text-red-500">*</span>}
        </label>

        {previewUrl && (
          <div className="mb-2">
            <img
              src={previewUrl}
              alt="Current"
              className="h-24 w-auto rounded border border-gray-200 object-cover"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm"
        />

        {errors.image && (
          <span className="text-xs text-red-600">{errors.image}</span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Saving..." : mode === "add" ? "Create History" : "Update History"}
        </button>
      </div>
    </form>
  );
};

export default HistoryForm;
