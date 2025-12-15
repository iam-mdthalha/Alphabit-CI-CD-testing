import React from "react";
import { updateConfig } from "State/Admin/AdminSettings/ConfigurationSlice";
import { useAppDispatch, useAppSelector } from "State/Hooks";
import { RootState } from "State/store";

interface CustomerRetentionSettings {}

const CustomerRetentionSettings: React.FC<CustomerRetentionSettings> = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state: RootState) => state.configuration.config);
  const plant = process.env.REACT_APP_PLANT;

  const handleToggle = (field: keyof typeof config) => {
    dispatch(
      updateConfig({
        [field]: config[field] === 1 ? 0 : 1,
      })
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateConfig({
        [e.target.id]: parseInt(e.target.value) || 0,
      })
    );
  };


  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <h4 className="text-xs font-medium text-gray-700 mb-3">
        Customer Retention Settings
      </h4>
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            id="isLoyaltyPointsEnabled"
            type="checkbox"
            checked={config.isLoyaltyPointsEnabled}
            onChange={() => handleToggle("isLoyaltyPointsEnabled")}
            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label
            htmlFor="isLoyaltyPointsEnabled"
            className="ml-2 block text-xs text-gray-700"
          >
            Allow Loyalty Points
          </label>
        </div>


        {config.isLoyaltyPointsEnabled && (
          <div>
            <label
              htmlFor="loyaltyExpireDays"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Loyalty Expire Days
            </label>
            <input
              id="loyaltyExpireDays"
              type="number"
              min="1"
              value={config.loyaltyExpireDays}
              onChange={handleInputChange}
              className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

 
      </div>
    </div>
  );
};

export default CustomerRetentionSettings;
