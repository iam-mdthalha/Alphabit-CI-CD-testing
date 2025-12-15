import { updateConfig } from "State/Admin/AdminSettings/ConfigurationSlice";
import { useAppDispatch, useAppSelector } from "State/Hooks";
import { RootState } from "State/store";
import Toggle from "../../Notification/Toggle";

const ShipmentExternalAPISettings = () => {
  const dispatch = useAppDispatch();
  const config = useAppSelector(
    (state: RootState) => state.configuration.config
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    input: "delhiveryApiKey" | "whatsappBusinessApiKey"
  ) => {
    dispatch(
      updateConfig({
        [input]: e.target.value,
      })
    );
  };

  const handleToggleInput = (
    enabled: boolean,
    input: "isShippingApiEnabled" | "isWhatsappBusinessApiEnabled"
  ) => {
    dispatch(
      updateConfig({
        [input]: enabled,
      })
    );
  };

  return (
    <div className="border-t pt-6">
      <h2 className="text-sm font-medium">External API</h2>
      <p className="text-xs text-gray-500 mt-1">
        Provide the API Key for the following External API
      </p>

      <div className="flex items-center gap-10 mt-4">
        <div className="flex-1 space-y-4">
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium"></h3>
                <p className="text-xs text-gray-500">Enable Shipping</p>
              </div>
              <Toggle
                enabled={config.isShippingApiEnabled}
                onChange={(enabled: boolean) =>
                  handleToggleInput(enabled, "isShippingApiEnabled")
                }
              />
            </div>
          </div>
          {config.isShippingApiEnabled && (
            <div className="flex items-center">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Delhivery API Key
                </label>
                <input
                  type="text"
                  value={config.delhiveryApiKey}
                  onChange={(e) => handleInputChange(e, "delhiveryApiKey")}
                  className="w-full px-3 py-2 border rounded-md text-xs"
                  placeholder="Enter API Key"
                />
              </div>
              <div>
                <img
                  src="/logo/delhivery.svg"
                  alt="Delhivery Icon"
                  className="w-32 px-4 py-2 rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-10 mt-4">
        <div className="flex-1 space-y-4">
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium"></h3>
                <p className="text-xs text-gray-500">
                  Enable Whatsapp Acknowledgement
                </p>
              </div>
              <Toggle
                enabled={config.isWhatsappBusinessApiEnabled}
                onChange={(enabled: boolean) =>
                  handleToggleInput(enabled, "isWhatsappBusinessApiEnabled")
                }
              />
            </div>
          </div>
          {config.isWhatsappBusinessApiEnabled && (
            <div className="flex items-center">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Whatsapp Business API
                </label>
                <input
                  type="text"
                  value={config.whatsappBusinessApiKey}
                  onChange={(e) =>
                    handleInputChange(e, "whatsappBusinessApiKey")
                  }
                  className="w-full px-3 py-2 border rounded-md text-xs"
                  placeholder="Enter API Key"
                />
              </div>
              <div>
                <img
                  src="/logo/whatsapp.svg"
                  alt="Whatsapp Icon"
                  className="w-32 px-4 py-2 rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentExternalAPISettings;
