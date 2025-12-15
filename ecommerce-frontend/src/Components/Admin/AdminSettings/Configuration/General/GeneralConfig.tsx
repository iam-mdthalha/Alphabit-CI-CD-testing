import React from "react";
import CustomerRetentionSettings from "./CustomerRentionSettings";
import DecimalSettings from "./DecimalSettings";
import InventorySettings from "./InventorySettings";
import PaymentSettings from "./PaymentSettings";
import BroadcastSettings from "./BroadcastSettings";  

interface GeneralConfigProps {
}

const GeneralConfig: React.FC<GeneralConfigProps> = () => {
  return (
    <div className="font-gilroyRegular tracking-wider space-y-6">
      <div>
        <h3 className="text-sm font-medium">General Configuration</h3>
        <p className="text-xs text-gray-500 mt-1">
          Manage general application settings and display preferences
        </p>
      </div>

      <div className="space-y-4">
        <DecimalSettings />
        {/* <OrderProcessingSettings /> */}
        <PaymentSettings />
        <InventorySettings />
        <CustomerRetentionSettings />
         <BroadcastSettings />

      </div>
    </div>
  );
};

export default GeneralConfig;
