import React, { useState } from "react";
import { AcademicReqDTO } from "Types/Admin/AdminAcademicType";
import { notifications } from "@mantine/notifications";

interface AcademicFormProps {
  initialValues: { academic: string; isActive: string };
  onSubmit: (data: { academic: string; isActive: string }) => void;
  onCancel: () => void;
  mode: "add" | "edit" | "view";
}

export const AcademicForm: React.FC<AcademicFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  mode,
}) => {
  const [formData, setFormData] = useState<{
    academic: string;
    isActive: string;
  }>(initialValues);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Academic Name
            </label>
            <input
              type="text"
              name="academic"
              value={formData.academic}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
              readOnly={mode === "view"}
              maxLength={100}
              placeholder="Enter academic name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Status
            </label>
            <select
              name="isActive"
              value={formData.isActive}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
              disabled={mode === "view"}
            >
              <option value="Y">Active</option>
              <option value="N">Inactive</option>
            </select>
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
            {mode === "add" ? "Add Academic" : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  );
};
