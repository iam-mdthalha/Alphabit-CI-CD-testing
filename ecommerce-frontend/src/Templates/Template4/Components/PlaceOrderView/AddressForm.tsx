import { notifications } from "@mantine/notifications";
import { countries } from "Constants/Country";
import { states } from "Constants/State";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAddAddressMutation } from "Services/CustomerApiSlice";
import { addSelectedAddress } from "State/CustomerSlice/CustomerSlice";
import { AppDispatch } from "State/store";
import { CustomerAddressAPI } from "Types/CustomerAddress";
import ExistingAddressSelector from "./ExistingAddressSelector";
import BillingAddressForm from "./BillingAddressForm";

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  isDefault?: boolean;
}

interface AddressFormProps {
  onSubmit: (address: CustomerAddressAPI, sameAsBilling: boolean) => void;
  savedAddress: Address | null;
  existingAddresses: CustomerAddressAPI[];
  isAddressLoading: boolean;
}

const CustomSelect: React.FC<{
  id: string;
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
  error?: string;
}> = ({
  id,
  label,
  value,
  options,
  onChange,
  required,
  placeholder,
  openDropdown,
  setOpenDropdown,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  return (
    <div className="mb-4">
      <label className="block text-vintageText font-medium mb-1">
        {label} {required && "*"}
      </label>

      <div
        ref={selectRef}
        className={`relative border ${
          error ? "border-red-500" : "border-vintageText"
        } bg-light bg-opacity-50 rounded-md`}
      >
        <div
          className="px-3 py-2 cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedLabel || (
            <span className="text-gray-500">
              {placeholder || `Select ${label}`}
            </span>
          )}
          <span>{isOpen ? "▲" : "▼"}</span>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            <input
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 border rounded-md"
              placeholder={`Search ${label}...`}
            />

            {filtered.length > 0 ? (
              filtered.map((option) => (
                <div
                  key={option.value}
                  className="px-3 py-2 hover:bg-vintageText/10 cursor-pointer"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No results</div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

const CustomInput: React.FC<{
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  showCharCount?: boolean;
  onBlur?: () => void;
  validationChecks?: { [key: string]: boolean };
}> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  maxLength,
  error,
  showCharCount,
  onBlur,
  validationChecks,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-vintageText font-medium mb-1">
        {label} {required && "*"}
      </label>

      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-vintageText"
          } rounded-md bg-light bg-opacity-50`}
        />

        {showCharCount && maxLength && (
          <p className="text-xs text-gray-500 mt-1">
            {value.length}/{maxLength}
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {validationChecks && value.length > 0 && (
        <div className="mt-2 mb-2 bg-vintageBg border border-vintageText border-opacity-20 rounded-sm p-3 transition-all">
          <div className="font-semibold text-xs mb-1 text-vintageText">
            {label.toUpperCase()} REQUIREMENTS:
          </div>
          <ul className="list-none p-0 m-0 text-xs space-y-1">
            {Object.entries(validationChecks).map(([rule, isValid]) => (
              <li
                key={rule}
                style={{
                  color: isValid ? "green" : "red",
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "1em", marginRight: 6 }}>
                  {isValid ? "✔" : "✖"}
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  savedAddress,
  existingAddresses,
  isAddressLoading,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();

  const [addressType, setAddressType] = useState<"new" | "existing">("new");
  const [selectedExistingAddress, setSelectedExistingAddress] =
    useState<CustomerAddressAPI | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [address, setAddress] = useState<Address>(
    savedAddress || {
      fullName: "",
      phone: "",
      pincode: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      landmark: "",
      isDefault: true,
    }
  );

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

 
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const markFieldTouched = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [previousShippingValues, setPreviousShippingValues] =
    useState<Address | null>(null);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [isUsingExistingAddress, setIsUsingExistingAddress] = useState(false);

  const [validationChecks, setValidationChecks] = useState<Record<string, any>>(
    {
      fullName: {
        Required: false,
        "1-50 characters": false,
        "Letters, spaces, hyphens only": false,
      },
      phone: {
        Required: false,
        "Exactly 10 digits": false,
        "Numbers only": false,
        "Valid starting digit (6-9)": false,
      },
      addressLine1: {
        Required: false,
        "1-50 characters": false,
        "Valid characters only": false,
      },
      addressLine2: {
        Required: false,
        "1-50 characters": false,
        "Valid characters only": false,
      },
      city: {
        Required: false,
        "1-50 characters": false,
        "Letters, spaces, hyphens only": false,
      },
      pincode: {
        Required: false,
        "Exactly 6 digits": false,
        "Numbers only": false,
        "First digit should not be 0": false,
      },
      landmark: {
        "Max 50 characters": true,
      },
    }
  );

  const findMatchingExistingAddress = (
    billingAddr: Address
  ): CustomerAddressAPI | null => {
    if (!billingAddr || existingAddresses.length === 0) return null;

    return (
      existingAddresses.find((existingAddr) => {
        const normalize = (str: string) =>
          str.toLowerCase().trim().replace(/\s+/g, " ");

        return (
          normalize(existingAddr.customerName) ===
            normalize(billingAddr.fullName) &&
          existingAddr.mobileNumber === billingAddr.phone &&
          normalize(existingAddr.addr1) === normalize(billingAddr.addressLine1) &&
          normalize(existingAddr.addr2) === normalize(billingAddr.city) &&
          normalize(existingAddr.addr3) ===
            normalize(billingAddr.addressLine2 || "") &&
          existingAddr.pinCode === billingAddr.pincode &&
          normalize(existingAddr.state) === normalize(billingAddr.state) &&
          normalize(existingAddr.country) === normalize(billingAddr.country)
        );
      }) || null
    );
  };

  useEffect(() => {
    const newChecks = { ...validationChecks };

    newChecks.fullName = {
      Required: address.fullName.length > 0,
      "1-50 characters":
        address.fullName.length >= 1 && address.fullName.length <= 50,
      "Letters, spaces, hyphens only":
        /^[a-zA-Z\s\-']+$/.test(address.fullName) ||
        address.fullName.length === 0,
    };

    newChecks.phone = {
      Required: address.phone.length > 0,
      "Exactly 10 digits": address.phone.length === 10,
      "Numbers only": /^\d+$/.test(address.phone) || address.phone.length === 0,
      "Valid starting digit (6-9)":
        /^[6-9]/.test(address.phone) || address.phone.length === 0,
    };

    newChecks.addressLine1 = {
      Required: address.addressLine1.length > 0,
      "1-50 characters":
        address.addressLine1.length >= 1 && address.addressLine1.length <= 50,
      "Valid characters only":
        /^[a-zA-Z0-9\s\-\/\.#,]+$/.test(address.addressLine1) ||
        address.addressLine1.length === 0,
    };

    newChecks.addressLine2 = {
      Required: (address.addressLine2 || "").length > 0,
      "1-50 characters":
        (address.addressLine2 || "").length >= 1 &&
        (address.addressLine2 || "").length <= 50,
      "Valid characters only":
        /^[a-zA-Z0-9\s\-\/\.#,]+$/.test(address.addressLine2 || "") ||
        (address.addressLine2 || "").length === 0,
    };

    newChecks.city = {
      Required: address.city.length > 0,
      "1-50 characters": address.city.length >= 1 && address.city.length <= 50,
      "Letters, spaces, hyphens only":
        /^[a-zA-Z\s\-]+$/.test(address.city) || address.city.length === 0,
    };

    newChecks.pincode = {
      Required: address.pincode.length > 0,
      "Exactly 6 digits": address.pincode.length === 6,
      "Numbers only":
        /^\d+$/.test(address.pincode) || address.pincode.length === 0,
      "First digit should not be 0":
        /^[1-9]/.test(address.pincode) || address.pincode.length === 0,
    };

    newChecks.landmark = {
      "Max 50 characters": (address.landmark || "").length <= 50,
    };

    setValidationChecks(newChecks);
  }, [address]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!address.fullName.trim()) {
      errors.fullName = "Name is required";
    } else if (address.fullName.length > 50) {
      errors.fullName = "Name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z\s\-']+$/.test(address.fullName)) {
      errors.fullName =
        "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    if (!address.phone.trim()) {
      errors.phone = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(address.phone)) {
      errors.phone = "Mobile Number must be exactly 10 digits";
    } else if (!/^[6-9]/.test(address.phone)) {
      errors.phone = "Mobile Number must start with 6, 7, 8, or 9";
    }

    if (!address.addressLine1.trim()) {
      errors.addressLine1 = "Address Line 1 is required";
    } else if (address.addressLine1.length > 50) {
      errors.addressLine1 = "Address Line 1 cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9\s\-\/\.#,]+$/.test(address.addressLine1)) {
      errors.addressLine1 = "Address Line 1 contains invalid characters";
    }

    if (!address.addressLine2?.trim()) {
      errors.addressLine2 = "Area is required";
    } else if (address.addressLine2.length > 50) {
      errors.addressLine2 = "Area cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9\s\-\/\.#,]+$/.test(address.addressLine2)) {
      errors.addressLine2 = "Area contains invalid characters";
    }

    if (!address.city.trim()) {
      errors.city = "City is required";
    } else if (!/^[a-zA-Z\s\-]+$/.test(address.city)) {
      errors.city = "City can only contain letters, spaces, and hyphens";
    }

    if (!address.state.trim()) {
      errors.state = "State is required";
    }

    if (!address.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(address.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
    }

    if (!address.country.trim()) {
      errors.country = "Country is required";
    }

    if ((address.landmark || "").length > 50) {
      errors.landmark = "Landmark cannot exceed 50 characters";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  
  const handleBlur = (field: string) => {
    markFieldTouched(field);
    validateForm();
  };

  const handleInputChange = (name: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const e = { ...prev };
        delete e[name];
        return e;
      });
    }
  };

  const handleSameAsBilling = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    if (checked && !billingAddress) {
      notifications.show({
        title: "Billing Address Required",
        message:
          "Please add your billing address first before selecting 'Same as Billing Address'",
        color: "red",
      });
      return;
    }

    setSameAsBilling(checked);

    if (checked && billingAddress) {
      setPreviousShippingValues(address);

      const matchingExistingAddress =
        findMatchingExistingAddress(billingAddress);
      if (matchingExistingAddress) {
        setIsUsingExistingAddress(true);
        setSelectedExistingAddress(matchingExistingAddress);
        dispatch(addSelectedAddress(matchingExistingAddress));
        onSubmit(matchingExistingAddress, sameAsBilling);
      } else {
        setIsUsingExistingAddress(false);
        setSelectedExistingAddress(null);
        setAddress({ ...billingAddress });
      }
    } else if (!checked && previousShippingValues) {
      setIsUsingExistingAddress(false);
      setSelectedExistingAddress(null);
      setAddress(previousShippingValues);
    }
  };

  const handleExistingAddressSelect = (addr: CustomerAddressAPI) => {
    if (!billingAddress) {
      notifications.show({
        title: "Billing Address Required",
        message:
          "Please add your billing address before selecting a shipping address",
        color: "red",
      });
      return;
    }

    setSelectedExistingAddress(addr);
    dispatch(addSelectedAddress(addr));
    onSubmit(addr, sameAsBilling);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ⭐ Mark all fields as touched on submit
    setTouchedFields({
      fullName: true,
      phone: true,
      pincode: true,
      addressLine1: true,
      addressLine2: true,
      city: true,
      state: true,
      country: true,
      landmark: true,
    });

    if (!billingAddress) {
      notifications.show({
        title: "Billing Address Required",
        message: "Please add your billing address before proceeding",
        color: "red",
      });
      return;
    }

    if (!validateForm()) {
      notifications.show({
        title: "Validation Error",
        message: "Please fill all required fields correctly",
        color: "red",
      });
      return;
    }

    if (sameAsBilling) {
      if (billingAddress) {
        const shippingAddress: CustomerAddressAPI = {
          id: 0,
          customerName: billingAddress.fullName,
          mobileNumber: billingAddress.phone,
          email: "",
          addr1: billingAddress.addressLine1,
          addr2: billingAddress.addressLine2 || "",
          addr3: billingAddress.city,
          addr4: billingAddress.landmark || "",
          state: billingAddress.state,
          pinCode: billingAddress.pincode,
          country: billingAddress.country,
          customerNo: "",
        };

        dispatch(addSelectedAddress(shippingAddress));
        onSubmit(shippingAddress, sameAsBilling);
      }

      return;
    }

    if (isUsingExistingAddress && selectedExistingAddress) {
      return;
    }

    if (addressType === "existing" && selectedExistingAddress) {
      handleExistingAddressSelect(selectedExistingAddress);
      return;
    }

    try {
      const customerAddress: CustomerAddressAPI = {
        id: 0,
        customerName: address.fullName,
        mobileNumber: address.phone,
        email: "",
        addr1: address.addressLine1,
        addr2: address.addressLine2 || "",
        addr3: address.city,
        addr4: address.landmark || "",
        state: address.state,
        pinCode: address.pincode,
        country: address.country,
        customerNo: "",
      };

      const response = await addAddress(customerAddress).unwrap();

      const newAddress = { ...customerAddress, id: response.id };

      dispatch(addSelectedAddress(newAddress));
      onSubmit(newAddress, sameAsBilling);
    } catch (error) {
      let errorMessage = "Something went wrong";

      if (error && typeof error === "object" && "data" in error) {
        const errorData = (error as any).data;

        if (errorData?.results?.message) {
          errorMessage = errorData.results.message;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        }
      }

      notifications.show({
        title: "Failed to save address",
        message: errorMessage,
        color: "red",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BillingAddressForm onChange={(addr) => setBillingAddress(addr)} />

      <h2 className="text-xl font-bold text-vintageText">Shipping Address</h2>

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          className="mr-2"
          checked={sameAsBilling}
          onChange={handleSameAsBilling}
        />
        Same as Billing Address
      </label>

      {!sameAsBilling && (
        <>
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setAddressType("new")}
              className={`px-4 py-2 rounded-md border ${
                addressType === "new"
                  ? "bg-vintageText text-vintageBg border-vintageText"
                  : "bg-light text-vintageText border-vintageText hover:bg-vintageText hover:text-vintageBg"
              } transition-colors`}
            >
              Add New Address
            </button>

            <button
              type="button"
              onClick={() => setAddressType("existing")}
              className={`px-4 py-2 rounded-md border ${
                addressType === "existing"
                  ? "bg-vintageText text-vintageBg border-vintageText"
                  : "bg-light text-vintageText border-vintageText hover:bg-vintageText hover:text-vintageBg"
              } transition-colors`}
            >
              Use Existing Address
            </button>
          </div>

          {addressType === "existing" && (
            <ExistingAddressSelector
              existingAddresses={existingAddresses}
              onSelectAddress={handleExistingAddressSelect}
              isLoading={isAddingAddress}
            />
          )}

          {addressType === "new" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  id="fullName"
                  label="Full Name"
                  value={address.fullName}
                  onChange={(v) => handleInputChange("fullName", v)}
                  required
                  placeholder="Enter Full Name"
                  maxLength={50}
                  error={touchedFields.fullName ? formErrors.fullName : undefined}
                  showCharCount
                  onBlur={() => handleBlur("fullName")}
                  validationChecks={validationChecks.fullName}
                />

                <CustomInput
                  id="phone"
                  label="Mobile Number"
                  value={address.phone}
                  onChange={(v) => handleInputChange("phone", v)}
                  required
                  maxLength={10}
                  placeholder="Enter Mobile Number"
                  error={touchedFields.phone ? formErrors.phone : undefined}
                  showCharCount
                  onBlur={() => handleBlur("phone")}
                  validationChecks={validationChecks.phone}
                />

                <CustomInput
                  id="addressLine1"
                  label="Address Line 1"
                  value={address.addressLine1}
                  onChange={(v) => handleInputChange("addressLine1", v)}
                  required
                  maxLength={50}
                  placeholder="Enter Address Line 1"
                  error={
                    touchedFields.addressLine1 ? formErrors.addressLine1 : undefined
                  }
                  showCharCount
                  onBlur={() => handleBlur("addressLine1")}
                  validationChecks={validationChecks.addressLine1}
                />

                <CustomInput
                  id="addressLine2"
                  label="Address Line 2 (Area)"
                  value={address.addressLine2 || ""}
                  onChange={(v) => handleInputChange("addressLine2", v)}
                  required
                  maxLength={50}
                  placeholder="Enter Area"
                  error={
                    touchedFields.addressLine2 ? formErrors.addressLine2 : undefined
                  }
                  showCharCount
                  onBlur={() => handleBlur("addressLine2")}
                  validationChecks={validationChecks.addressLine2}
                />

                <CustomInput
                  id="city"
                  label="City"
                  value={address.city}
                  onChange={(v) => handleInputChange("city", v)}
                  required
                  maxLength={50}
                  placeholder="Enter City"
                  error={touchedFields.city ? formErrors.city : undefined}
                  showCharCount
                  onBlur={() => handleBlur("city")}
                  validationChecks={validationChecks.city}
                />

                <CustomSelect
                  id="state"
                  label="State"
                  value={address.state}
                  options={states.map((s) => ({ label: s, value: s }))}
                  onChange={(v) => handleInputChange("state", v)}
                  required
                  placeholder="Select State"
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  error={touchedFields.state ? formErrors.state : undefined}
                />

                <CustomInput
                  id="pincode"
                  label="Pincode"
                  value={address.pincode}
                  onChange={(v) => handleInputChange("pincode", v)}
                  required
                  maxLength={6}
                  placeholder="Enter Pincode"
                  error={touchedFields.pincode ? formErrors.pincode : undefined}
                  showCharCount
                  onBlur={() => handleBlur("pincode")}
                  validationChecks={validationChecks.pincode}
                />

                <CustomSelect
                  id="country"
                  label="Country"
                  value={address.country}
                  options={countries.map((c) => ({ label: c, value: c }))}
                  onChange={(v) => handleInputChange("country", v)}
                  required
                  placeholder="Select Country"
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                  error={touchedFields.country ? formErrors.country : undefined}
                />

                <CustomInput
                  id="landmark"
                  label="Landmark (Optional)"
                  value={address.landmark || ""}
                  onChange={(v) => handleInputChange("landmark", v)}
                  maxLength={50}
                  placeholder="Enter Landmark"
                  error={
                    touchedFields.landmark ? formErrors.landmark : undefined
                  }
                  showCharCount
                  onBlur={() => handleBlur("landmark")}
                  validationChecks={validationChecks.landmark}
                />
              </div>
            </>
          )}
        </>
      )}

      <button
        type="submit"
        disabled={isAddingAddress || isAddressLoading}
        className="w-full py-3 bg-vintageText text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAddingAddress ? "Validating Address..." : "Save & Continue"}
      </button>
    </form>
  );
};

export default AddressForm;
