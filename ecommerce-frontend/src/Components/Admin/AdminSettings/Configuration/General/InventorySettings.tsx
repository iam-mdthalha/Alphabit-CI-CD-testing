import React from "react";
import { useGetAllLocTypesQuery } from "Services/Admin/LocTypeApiSlice";
import { updateConfig } from "State/Admin/AdminSettings/ConfigurationSlice";
import { useAppDispatch, useAppSelector } from "State/Hooks";

interface InventorySettingsProps {}

const InventorySettings: React.FC<InventorySettingsProps> = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state: any) => state.configuration.config);
  const plant = process.env.REACT_APP_PLANT;

  const { data: locTypes = [], isLoading } = useGetAllLocTypesQuery({
    plant: plant,
  });

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

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      updateConfig({
        location: e.target.value,
      })
    );
  };

  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-4 rounded-md border border-gray-200">
      <h4 className="text-xs font-medium text-gray-700 mb-3">
        Inventory Settings
      </h4>
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            id="allow_LTAVAILINVQTY"
            type="checkbox"
            checked={config.allow_LTAVAILINVQTY === 1}
            onChange={() => handleToggle("allow_LTAVAILINVQTY")}
            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label
            htmlFor="allow_LTAVAILINVQTY"
            className="ml-2 block text-xs text-gray-700"
          >
            Allow low available inventory quantity
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="show_MINAVAILINVQTY"
            type="checkbox"
            checked={config.show_MINAVAILINVQTY === 1}
            onChange={() => handleToggle("show_MINAVAILINVQTY")}
            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label
            htmlFor="show_MINAVAILINVQTY"
            className="ml-2 block text-xs text-gray-700"
          >
            Show minimum available inventory quantity
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="show_PRVSALES"
            type="checkbox"
            checked={config.show_PRVSALES === 1}
            onChange={() => handleToggle("show_PRVSALES")}
            className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
          />
          <label
            htmlFor="show_PRVSALES"
            className="ml-2 block text-xs text-gray-700"
          >
            Show previous sales
          </label>
        </div>

        {config.show_PRVSALES === 1 && (
          <div>
            <label
              htmlFor="prvsales_PERIOD"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Previous sales period (days)
            </label>
            <input
              id="prvsales_PERIOD"
              type="number"
              min="1"
              value={config.prvsales_PERIOD}
              onChange={handleInputChange}
              className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="location"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Warehouse Location Type
          </label>
          <select
            id="location"
            value={config.location}
            onChange={handleLocationChange}
            className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="">Select a location</option>
            {locTypes.map((locType) => (
              <option key={locType.locTypeId} value={locType.locTypeId}>
                {locType.locTypeDesc}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default InventorySettings;
