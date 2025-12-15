import React from "react";
import { useAppDispatch, useAppSelector } from "State/Hooks";
import { updateConfig } from "State/Admin/AdminSettings/ConfigurationSlice";

const BroadcastSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state: any) => state.configuration.config || {});

  /** Handle checkbox + textarea updates */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, type } = e.target;
    const value = type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    console.log("Updating field:", id, "Value:", value);  
    dispatch(updateConfig({ [id]: value }));
  };

  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-4 rounded-md border border-gray-200">
      <h4 className="text-xs font-medium text-gray-700 mb-3">Broadcast Settings</h4>

      {/* Enable Broadcast Checkbox */}
      <div className="flex items-center gap-2 mb-4">
        <input
          id="isBroadcastEnabled"
          type="checkbox"
          checked={config.isBroadcastEnabled || false}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="isBroadcastEnabled" className="text-xs text-gray-700 font-medium">
          Display Broadcast
        </label>
      </div>

      {/* Broadcast Message — shown only if checkbox is enabled */}
      {config.isBroadcastEnabled && (
        <div>
          <label
            htmlFor="broadcastMessage"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            Broadcast Message
          </label>

          <textarea
            id="broadcastMessage"
            rows={3}
            value={config.broadcastMessage || ""}
            onChange={handleChange}
            maxLength={1000}
            className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter broadcast message..."
          />

          <div className="text-right text-[10px] text-gray-400 mt-1">
            {(config.broadcastMessage?.length || 0)}/1000
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcastSettings;
