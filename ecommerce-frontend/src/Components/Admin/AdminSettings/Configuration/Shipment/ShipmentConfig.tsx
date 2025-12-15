import React from "react";
import PickupLocationSettings from "./PickupLocationSettings";
import ShipmentExternalAPISettings from "./ShipmentExternalAPISettings";

interface ShipmentConfigProps {
  // setHasChanges: (hasChanges: boolean) => void;
  // onConfigChange: (config: Partial<EcommerceConfigDto>) => void;
}

const ShipmentConfig: React.FC<ShipmentConfigProps> = (
  // { setHasChanges }
) => {
  

  return (
    <div className="font-gilroyRegular tracking-wider space-y-6">
      <div>
        <h3 className="text-sm font-medium">Shipment Configuration</h3>
        <p className="text-xs text-gray-500 mt-1">
          Manage what sections appear and their order
        </p>
      </div>
      <div className="space-y-4">

        <PickupLocationSettings />
        <ShipmentExternalAPISettings />
      </div>
    </div>
  );
};

export default ShipmentConfig;
