import React, { useState } from "react";
import { FileUpload } from "Components/Admin/StyleComponent/FileUpload";

interface FormProps<T extends Record<string, any>> {
  initialValues: T;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  fields: {
    name: keyof T;
    label: string;
    type: string;
    required?: boolean;
    step?: string;
    options?: { value: string; label: string }[];
    accept?: string;
  }[];
}

export const Form = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  onCancel,
  fields,
}: FormProps<T>) => {
  const [formData, setFormData] = useState<T>(initialValues);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type !== "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleFileUpload = (file: File | null, fieldName: keyof T) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
        className="font-gilroyRegular tracking-wider space-y-4"
      >
        <div className="bg-white px-6 py-12 rounded-md shadow-md my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div
                key={field.name as string}
                className={
                  field.type === "textarea" || field.type === "file"
                    ? "col-span-2"
                    : ""
                }
              >
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  {field.label}
                </label>

                {field.type === "select" && field.options ? (
                  <select
                    name={field.name as string}
                    value={formData[field.name] as unknown as string}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    required={field.required}
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "file" ? (
                  <FileUpload
                    onFileSelect={(file: any) =>
                      handleFileUpload(file, field.name)
                    }
                    accept={field.accept || "image/*"}
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.name as string}
                    value={formData[field.name] as unknown as string}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-0"
                    required={field.required}
                    rows={4}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name as string}
                    value={formData[field.name] as unknown as string}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                    required={field.required}
                    step={field.step}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <hr className="border-gray-300 my-8" />

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
            Save
          </button>
        </div>
      </form>
    </>
  );
};
