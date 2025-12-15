import { CustomerAddressAPI, Address } from "Types/CustomerAddress";

export const customerAddressToAddress = (
  customerAddress: CustomerAddressAPI
): Address => {
  return {
    fullName: customerAddress.customerName,
    phone: customerAddress.mobileNumber,
    pincode: customerAddress.pinCode,
    addressLine1: customerAddress.addr1,
    addressLine2: customerAddress.addr2,
    city: customerAddress.addr3,
    state: customerAddress.state,
    country: customerAddress.country,
    landmark: customerAddress.addr4 || "",
    email: customerAddress.email,
    isDefault: true,
  };
};

export const addressToCustomerAddress = (
  address: Address,
  existingData?: Partial<CustomerAddressAPI>
): CustomerAddressAPI => {
  return {
    id: existingData?.id || 0,
    customerNo: existingData?.customerNo || "",
    customerName: address.fullName,
    mobileNumber: address.phone,
    email: address.email,
    addr1: address.addressLine1,
    addr2: address.addressLine2,
    addr3: address.city,
    addr4: address.landmark || "",
    state: address.state,
    pinCode: address.pincode,
    country: address.country,
  };
};
