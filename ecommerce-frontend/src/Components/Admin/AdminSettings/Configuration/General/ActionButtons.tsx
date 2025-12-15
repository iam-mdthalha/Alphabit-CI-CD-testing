import React from "react";

interface ActionButtonsProps {
  onSave?: () => void;
  onReset?: () => void;
  saveDisabled?: boolean;
  resetDisabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave = () => {},
  onReset = () => {},
  saveDisabled = false,
  resetDisabled = false,
}) => {
  return (
    <div className="font-gilroyRegular tracking-wider flex justify-end space-x-2 pt-4">
      <button
        onClick={onReset}
        disabled={resetDisabled}
        className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reset Defaults
      </button>
      <button
        onClick={onSave}
        disabled={saveDisabled}
        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Changes
      </button>
    </div>
  );
};

export default ActionButtons;
