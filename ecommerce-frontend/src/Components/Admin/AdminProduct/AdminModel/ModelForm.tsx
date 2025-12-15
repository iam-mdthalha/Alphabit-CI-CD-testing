import React, { useState } from "react";
import { Model } from "Types/Admin/AdminModelType";

interface ModelFormProps {
  initialValues: Model;
  onSubmit: (data: Model) => void;
  onCancel: () => void;
  mode: "add" | "edit" | "view";
}

export const ModelForm: React.FC<ModelFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  mode,
}) => {
  const [formData, setFormData] = useState<Model>(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <div className="font-gilroyRegular tracking-wider bg-white px-6 py-12 rounded-md shadow-md my-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Model Description
            </label>
            <input
              type="text"
              name="prdModelDesc"
              value={formData.prdModelDesc}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
              required
              readOnly={mode === "view"}
              placeholder="Enter model description (max 100 chars)"
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
