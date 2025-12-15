import React from "react";
import { CustomerAddressAPI } from "Types/CustomerAddress";

interface ExistingAddressSelectorProps {
  existingAddresses: CustomerAddressAPI[];
  onSelectAddress: (address: CustomerAddressAPI) => void;
  isLoading: boolean;
}

const ExistingAddressSelector: React.FC<ExistingAddressSelectorProps> = ({
  existingAddresses,
  onSelectAddress,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <svg
          className="animate-spin h-8 w-8 text-vintageText"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (existingAddresses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-vintageText">No saved addresses found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {existingAddresses.map((address) => (
        <div
          key={address.id}
          className="border border-vintageText rounded-md p-4 cursor-pointer hover:bg-light hover:bg-opacity-30 transition-colors"
          onClick={() => onSelectAddress(address)}
        >
          <div className="flex items-start">
            <input
              type="radio"
              name="existingAddress"
              className="mt-1 mr-3 text-vintageText"
              onChange={() => onSelectAddress(address)}
            />
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="font-semibold text-vintageText mr-4">
                  {address.customerName}
                </h3>
                <span className="text-vintageText">{address.mobileNumber}</span>
              </div>
              <p className="text-vintageText">
                {address.addr1}, {address.addr2},{" "}
                {address.addr4 && `${address.addr4}, `}
                {address.addr3}, {address.state} - {address.pinCode}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExistingAddressSelector;
