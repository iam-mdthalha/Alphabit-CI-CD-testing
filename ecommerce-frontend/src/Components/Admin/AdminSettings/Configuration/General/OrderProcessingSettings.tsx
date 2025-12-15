import React from "react";
import { useAppDispatch, useAppSelector } from "State/Hooks";
import { updateConfig } from "State/Admin/AdminSettings/ConfigurationSlice";

interface OrderProcessingSettingsProps { }

const OrderProcessingSettings: React.FC<OrderProcessingSettingsProps> = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state: any) => state.configuration.config);

  const handleToggle = (field: keyof typeof config) => {
    dispatch(updateConfig({
      [field]: config[field] === 1 ? 0 : 1
    }));
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateConfig({
      isLowStockThreshold: parseInt(e.target.value) || 0
    }));
  };

  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-4 rounded-md border border-gray-200">
      <h4 className="text-xs font-medium text-gray-700 mb-3">Order Processing</h4>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-medium text-gray-700">Auto Process Orders</label>
            <p className="text-xs text-gray-500">Automatically process orders when payment is received</p>
          </div>
          {/* isAutoProcessOrders */}
          <button
            onClick={() => handleToggle('isAutoProcessOrders')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${config.isAutoProcessOrders ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${config.isAutoProcessOrders ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-medium text-gray-700">Stock Check</label>
            <p className="text-xs text-gray-500">Check inventory before accepting orders</p>
          </div>
          {/* isStockCheck */}
          <button
            onClick={() => handleToggle('isStockCheck')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${config.isStockCheck ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${config.isStockCheck ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="pl-6 border-l-2 border-gray-200 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-medium text-gray-700">Low Stock Notifications</label>
              <p className="text-xs text-gray-500">Notify when inventory is low</p>
            </div>
            {/* isLowStockNotifications */}
            <button
              onClick={() => handleToggle('isLowStockNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${config.isLowStockNotifications ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${config.isLowStockNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div>
            <label htmlFor="low-stock-threshold" className="block text-xs font-medium text-gray-700 mb-1">
              Low Stock Threshold
            </label>
            {/* isLowStockThreshold */}
            <input
              id="low-stock-threshold"
              type="number"
              min="1"
              max="100"
              value={config.isLowStockThreshold}
              onChange={handleThresholdChange}
              className="block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderProcessingSettings;
