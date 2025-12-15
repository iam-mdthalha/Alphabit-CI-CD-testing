import React, { useState } from "react";
import GeneralConfig from "./General/GeneralConfig";
import ProductConfig from "./Product/ProductConfig";
import ShipmentConfig from "./Shipment/ShipmentConfig";

type ConfigMenuType = "general" | "section" | "product" | "shipment";

interface ConfigurationTabProps {}

const ConfigurationTab: React.FC<ConfigurationTabProps> = () => {
  const [activeMenu, setActiveMenu] = useState<ConfigMenuType>("general");

  const handleMenuChange = (menu: ConfigMenuType) => {
    setActiveMenu(menu);
  };

  return (
    <div className="font-gilroyRegular tracking-wider flex">
      <div className="w-48 border-r h-full py-4">
        <div className="flex flex-col space-y-1">
          <button
            className={`px-4 py-2 text-left text-sm font-medium ${activeMenu === "general"
              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
              }`}
            onClick={() => handleMenuChange("general")}
          >
            General
          </button>
          {/* <button
            className={`px-4 py-2 text-left text-sm font-medium ${activeMenu === "section"
              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
              }`}
            onClick={() => handleMenuChange("section")}
          >
            Section
          </button> */}
          <button
            className={`px-4 py-2 text-left text-sm font-medium ${activeMenu === "product"
              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
              }`}
            onClick={() => handleMenuChange("product")}
          >
            Product
          </button>
          <button
            className={`px-4 py-2 text-left text-sm font-medium ${activeMenu === "shipment"
              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
              : "text-gray-600 hover:bg-gray-50"
              }`}
            onClick={() => handleMenuChange("shipment")}
          >
            Shipment
          </button>
        </div>
      </div>
      <div className="flex-1 p-6">
        {activeMenu === "general" && <GeneralConfig />}
        {/* {activeMenu === "section" && <SectionConfig />} */}
        {activeMenu === "product" && <ProductConfig />}
        {activeMenu === "shipment" && <ShipmentConfig />}
      </div>
    </div>
  );
};

export default ConfigurationTab;
