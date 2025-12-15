import React from "react";

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false
}) => {
  return (
    <div className="font-gilroyRegular tracking-wider flex items-center justify-between">
      <div>
        <label
          htmlFor={id}
          className="text-xs font-medium text-gray-700"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500">
            {description}
          </p>
        )}
      </div>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        />
        <label
          htmlFor={id}
          className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
            checked ? "bg-blue-500" : "bg-gray-300"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;