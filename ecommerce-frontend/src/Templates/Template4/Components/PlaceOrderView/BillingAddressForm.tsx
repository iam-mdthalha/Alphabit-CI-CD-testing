import React, { useEffect, useState, useCallback } from "react";
import { Address, CustomerAddressAPI } from "Types/CustomerAddress";
import BillingAddressModal from "./BillingAddressModal";
import {
  useGetBillingAddressQuery,
  useUpdateBillingAddressMutation,
} from "Services/CustomerApiSlice";
import { customerAddressToAddress } from "Templates/Template4/Utils/addressUtils";

interface BillingAddressFormProps {
  onChange: (addr: Address | null) => void;
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = ({
  onChange,
}) => {
  const [billing, setBilling] = useState<Address | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: billingAddressData,
    isLoading,
    refetch,
  } = useGetBillingAddressQuery();

  const emptyAddress: Address = {
    fullName: "",
    phone: "",
    pincode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    landmark: "",
    email: "",
    isDefault: true,
  };

  const stableOnChange = useCallback(onChange, []);

  useEffect(() => {
    if (billingAddressData && billingAddressData.results) {
      if (billingAddressData.statusCode !== 401) {
        const apiData = billingAddressData.results;

        const hasAddressData =
          apiData.addr1 && apiData.state && apiData.pincode;

        if (hasAddressData) {
          const transformedAddress = customerAddressToAddress(apiData);
          setBilling(transformedAddress);
          stableOnChange(transformedAddress);
        } else {
          setBilling(null);
          stableOnChange(null);
        }
      }
    }
  }, [billingAddressData, stableOnChange]);

  const handleSave = (updated: Address) => {
    setBilling(updated);
    stableOnChange(updated);
    setModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="bg-vintageBg bg-opacity-50 border border-vintageText rounded-md p-4 mb-6">
        <h2 className="text-xl font-bold text-vintageText mb-3">
          Billing Address
        </h2>
        <div className="flex justify-between items-center bg-light bg-opacity-50 border border-vintageText rounded-md p-3">
          <span className="text-vintageText">Loading billing address...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-vintageBg bg-opacity-50 border border-vintageText rounded-md p-4 mb-6">
      <h2 className="text-xl font-bold text-vintageText mb-3">
        Billing Address
      </h2>

      {!billing ? (
        <div className="flex justify-between items-center bg-light bg-opacity-50 border border-vintageText rounded-md p-3">
          <span className="text-vintageText">No Billing Address Added</span>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3 py-1 bg-vintageText text-vintageBg rounded-md hover:bg-opacity-90"
          >
            Add
          </button>
        </div>
      ) : (
        <div className="bg-light bg-opacity-50 border border-vintageText rounded-md p-3">
          <div className="text-vintageText leading-relaxed">
            <p>
              <strong>{billing.fullName}</strong>
            </p>
            <p>{billing.phone}</p>
            <p>{billing.email}</p>
            <p>
              {billing.addressLine1}, {billing.addressLine2}
            </p>
            <p>
              {billing.city}, {billing.state}
            </p>
            <p>
              {billing.country} - {billing.pincode}
            </p>
            {billing.landmark && <p>Landmark: {billing.landmark}</p>}
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-3 px-3 py-1 bg-vintageText text-vintageBg rounded-md hover:bg-opacity-90"
          >
            Edit
          </button>
        </div>
      )}

      <BillingAddressModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        data={billing || emptyAddress}
        onSave={handleSave}
      />
    </div>
  );
};

export default BillingAddressForm;
