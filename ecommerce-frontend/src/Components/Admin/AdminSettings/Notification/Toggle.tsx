import React from "react";

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onChange }) => {
  return (
    <button
      type="button"
      className={`${
        enabled ? "bg-blue-600" : "bg-gray-200"
      } font-gilroyRegular tracking-wider relative inline-flex h-6 w-11 items-center rounded-full`}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </button>
  );
};

export default Toggle;