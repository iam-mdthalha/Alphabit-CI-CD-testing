import React, { useState } from "react";

interface ToggleItemProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({
  id,
  label,
  description,
  checked,
  onChange,
}) => (
  <div className="flex items-center justify-between">
    <div>
      <label htmlFor={id} className="text-xs font-medium text-gray-700">
        {label}
      </label>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
    <div className="relative inline-block w-10 mr-2 align-middle select-none">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
      />
      <label
        htmlFor={id}
        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${
          checked ? "bg-blue-500" : "bg-gray-300"
        }`}
      />
    </div>
  </div>
);

const DisplayOptions: React.FC = () => {
  const [displaySettings, setDisplaySettings] = useState({
    model: true,
    size: true,
    sleeve: true,
    color: true,
    fabric: true,
    occasion: true,
    collar: true,
    pattern: true,
  });

  const handleToggle = (setting: keyof typeof displaySettings) => {
    setDisplaySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const toggleConfigs = [
    {
      id: "model-toggle",
      label: "Model",
      description: "Display model information",
      setting: "model" as const,
    },
    {
      id: "size-toggle",
      label: "Size",
      description: "Show available sizes",
      setting: "size" as const,
    },
    {
      id: "sleeve-toggle",
      label: "Sleeve",
      description: "Display sleeve types",
      setting: "sleeve" as const,
    },
    {
      id: "color-toggle",
      label: "Color",
      description: "Show available colors",
      setting: "color" as const,
    },
    {
      id: "fabric-toggle",
      label: "Fabric",
      description: "Display fabric material",
      setting: "fabric" as const,
    },
    {
      id: "occasion-toggle",
      label: "Occasion",
      description: "Show usage occasions",
      setting: "occasion" as const,
    },
    {
      id: "collar-toggle",
      label: "Collar",
      description: "Display collar styles",
      setting: "collar" as const,
    },
    {
      id: "pattern-toggle",
      label: "Pattern",
      description: "Show available patterns",
      setting: "pattern" as const,
    },
  ];

  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-4 rounded-md border border-gray-200">
      {/* <h4 className="text-xs font-medium text-gray-700 mb-3">
        Product Attributes Display
      </h4> */}

      <div className="space-y-3">
        {toggleConfigs.map(({ id, label, description, setting }) => (
          <ToggleItem
            key={id}
            id={id}
            label={label}
            description={description}
            checked={displaySettings[setting]}
            onChange={() => handleToggle(setting)}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayOptions;
