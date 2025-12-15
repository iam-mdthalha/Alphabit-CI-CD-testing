import React from "react";

interface ProductGroupFormProps {
  initialValues: { itemGroupName: string };
  onSubmit: (data: { itemGroupName: string }) => void;
  onCancel: () => void;
  mode: "add" | "edit" | "view";
}

export const ProductGroupForm: React.FC<ProductGroupFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  mode,
}) => {
  const [formData, setFormData] = React.useState(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "itemGroupName" && value.length > 400) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isViewMode = mode === "view";
  const readOnlyProps = isViewMode ? { readOnly: true } : {};

  return (
    <form onSubmit={handleSubmit}>
      <div className="font-gilroyRegular tracking-wider bg-white px-6 py-12 rounded-md shadow-md my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Product Group Name*
              </label>
              <input
                type="text"
                name="itemGroupName"
                value={formData.itemGroupName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
                maxLength={400}
                placeholder="Enter product group name (max 400 chars)"
                {...readOnlyProps}
                required
              />
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
            {mode === "add" ? "Add Item Group" : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  );
};
