import React from "react";

interface ActionButtonsProps {}

const ActionButtons: React.FC<ActionButtonsProps> = () => {
  return (
    <div className="font-gilroyRegular tracking-wider flex justify-end space-x-2 pt-4">
      <button className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
        Reset Defaults
      </button>
      <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
        Save Changes
      </button>
    </div>
  );
};

export default ActionButtons;
