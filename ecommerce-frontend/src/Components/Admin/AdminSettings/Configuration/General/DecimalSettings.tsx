import React from "react";
import { useAppDispatch, useAppSelector } from "State/Hooks";
import { updateConfig } from "State/Admin/AdminSettings/ConfigurationSlice";

interface DecimalSettingsProps { }

const DecimalSettings: React.FC<DecimalSettingsProps> = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state: any) => state.configuration.config);

  const handleDecimalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateConfig({
      numberOfDecimal: e.target.value
    }));
  };

  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-4 rounded-md border border-gray-200">
      <div className="space-y-3">
        <div>
          <label htmlFor="decimal-points" className="block text-xs font-medium text-gray-700 mb-1">
            Number of Decimal
          </label>
          <select
            id="decimal-points"
            value={config.numberOfDecimal}
            onChange={handleDecimalChange}
            className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="0">0 (No decimal)</option>
            <option value="1">1 decimal place</option>
            <option value="2">2 decimal places</option>
            <option value="3">3 decimal places</option>
            <option value="4">4 decimal places</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DecimalSettings;
