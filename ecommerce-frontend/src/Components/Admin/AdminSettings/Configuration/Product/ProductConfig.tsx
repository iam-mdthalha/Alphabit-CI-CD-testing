import React from "react";
import { useAppDispatch, useAppSelector } from "State/Hooks";
import { updateConfig } from "State/Admin/AdminSettings/ConfigurationSlice";

interface ProductConfigProps { }

const ProductConfig: React.FC<ProductConfigProps> = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector((state: any) => state.configuration.config);

  const handleToggle = (field: keyof typeof config) => {
    dispatch(updateConfig({
      [field]: config[field] === 1 ? 0 : 1
    }));
  };

  return (
    <div className="font-gilroyRegular tracking-wider space-y-6">
      <div>
        <h3 className="text-sm font-medium">Product Configuration</h3>
        <p className="text-xs text-gray-500 mt-1">
          Customize how products are displayed and managed
        </p>
      </div>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-md border border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              {/* isModel */}
              <div>
                <label className="text-xs font-medium text-gray-700">Model</label>
                <p className="text-xs text-gray-500">Display model information</p>
              </div>
              <button
                onClick={() => handleToggle('isModel')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${config.isModel ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${config.isModel ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              {/* isSize */}
              <div>
                <label className="text-xs font-medium text-gray-700">Size</label>
                <p className="text-xs text-gray-500">Show available sizes</p>
              </div>
              <button
                onClick={() => handleToggle('isSize')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${config.isSize ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${config.isSize ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              {/* isSleeve */}
              <div>
                <label className="text-xs font-medium text-gray-700">Sleeve</label>
                <p className="text-xs text-gray-500">Display sleeve types</p>
              </div>
              <button
                onClick={() => handleToggle('isSleeve')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${config.isSleeve ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${config.isSleeve ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              {/* isColor */}
              <div>
                <label className="text-xs font-medium text-gray-700">Color</label>
                <p className="text-xs text-gray-500">Show available colors</p>
              </div>
              <button
                onClick={() => handleToggle('isColor')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${config.isColor ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${config.isColor ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              {/* isFabric */}
              <div>
                <label className="text-xs font-medium text-gray-700">Fabric</label>
                <p className="text-xs text-gray-500">Display fabric material</p>
              </div>
              <button
                onClick={() => handleToggle('isFabric')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${config.isFabric ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${config.isFabric ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              {/* isOccasion */}
              <div>
                <label className="text-xs font-medium text-gray-700">Occasion</label>
                <p className="text-xs text-gray-500">Show usage occasions</p>
              </div>
              <button
                onClick={() => handleToggle('isOccasion')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${config.isOccasion ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${config.isOccasion ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              {/* isCollar */}
              <div>
                <label className="text-xs font-medium text-gray-700">Collar</label>
                <p className="text-xs text-gray-500">Display collar styles</p>
              </div>
              <button
                onClick={() => handleToggle('isCollar')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${config.isCollar ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${config.isCollar ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              {/* isPattern */}
              <div>
                <label className="text-xs font-medium text-gray-700">Pattern</label>
                <p className="text-xs text-gray-500">Show available patterns</p>
              </div>
              <button
                onClick={() => handleToggle('isPattern')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${config.isPattern ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white ${config.isPattern ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductConfig;
