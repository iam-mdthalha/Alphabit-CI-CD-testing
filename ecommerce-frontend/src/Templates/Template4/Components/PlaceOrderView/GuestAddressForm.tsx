import { notifications } from "@mantine/notifications";
import { countries } from "Constants/Country";
import { states } from "Constants/State";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { useLazyCheckPinCodeAvailabilityQuery } from "Services/ShipmentApiSlice";
import { addSelectedAddress } from "State/CustomerSlice/CustomerSlice";
import { AppDispatch } from "State/store";
import { CustomerAddressAPI } from "Types/CustomerAddress";

interface GuestAddressFormProps {
  onSubmit: (address: CustomerAddressAPI) => void;
  savedAddress: any;
  phoneNo: string;
}

interface FormData {
  customerName: string;
  mobileNumber: string;
  email: string;
  addr1: string;
  addr2: string;
  addr3: string;
  addr4: string;
  state: string;
  pinCode: string;
  country: string;
}

const CustomSelect: React.FC<{
  id: string;
  label: string;
  value: string;
  options: string[];
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
  required = false,
  placeholder,
  openDropdown,
  setOpenDropdown,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={selectRef}>
      <label htmlFor={id} className="block text-vintageText mb-2 font-medium">
        {label} {required && "*"}
      </label>
      <div
        id={id}
        className={`w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-vintageText"
        } bg-light bg-opacity-50 rounded-md focus:outline-none focus:ring-1 focus:ring-vintageText cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
          if (e.key === "Escape") {
            setIsOpen(false);
            setSearchTerm("");
          }
        }}
      >
        {value || (
          <span className="text-gray-400">
            {placeholder || `Select ${label.toLowerCase()}`}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-vintageBg border border-vintageText rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-vintageBorder">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full px-2 py-1 border border-vintageText rounded-md focus:outline-none focus:ring-1 focus:ring-vintageText"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsOpen(false);
                  setSearchTerm("");
                }
              }}
            />
          </div>

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                className={`px-3 py-2 cursor-pointer bg-vintageBg hover:text-vintageText ${
                  value === option ? "bg-vintageBg" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400">No results found</div>
          )}
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const PLANT = process.env.REACT_APP_PLANT;

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
  readonly?: boolean;
  validationChecks?: { [key: string]: boolean };
}> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  maxLength,
  error,
  showCharCount = false,
  readonly = false,
  validationChecks,
}) => {
  return (
    <div className="relative">
      <div className="flex justify-between">
        <label htmlFor={id} className="block text-vintageText mb-2 font-medium">
          {label} {required && "*"}
        </label>
        {showCharCount && maxLength && (
          <div className="text-right text-xs text-gray-400 mb-1">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        readOnly={readonly}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-vintageText"
        } bg-light bg-opacity-50 rounded-md focus:outline-none focus:ring-1 focus:ring-vintageText`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

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

const GuestAddressForm: React.FC<GuestAddressFormProps> = ({
  onSubmit,
  savedAddress,
  phoneNo,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [checkPinCodeAvailability] = useLazyCheckPinCodeAvailabilityQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    customerName: savedAddress?.customerName || "",
    mobileNumber: savedAddress?.mobileNumber || phoneNo || "",
    email: savedAddress?.email || "",
    addr1: savedAddress?.addr1 || "",
    addr2: savedAddress?.addr2 || "",
    addr3: savedAddress?.addr3 || "",
    addr4: savedAddress?.addr4 || "",
    state: savedAddress?.state || "",
    pinCode: savedAddress?.pinCode || "",
    country: savedAddress?.country || "",
  });

  const [validationChecks, setValidationChecks] = useState<Record<string, any>>(
    {
      customerName: {
        Required: false,
        "1-50 characters": false,
        "Letters, spaces, hyphens only": false,
      },
      mobileNumber: {
        Required: false,
        "Exactly 10 digits": false,
        "Numbers only": false,
        "Valid starting digit (6-9)": false,
      },
      email: {
        Required: false,
        "Valid email format": false,
        "Max 30 characters": false,
      },
      addr1: {
        Required: false,
        "1-50 characters": false,
        "Valid characters only": false,
      },
      addr2: {
        Required: false,
        "1-50 characters": false,
        "Valid characters only": false,
      },
      addr3: {
        Required: false,
        "1-50 characters": false,
        "Letters, spaces, hyphens only": false,
      },
      pinCode: {
        Required: false,
        "Exactly 6 digits": false,
        "Numbers only": false,
        "First digit should not be 0": false,
      },
      addr4: {
        "Max 50 characters": true,
      },
    }
  );

  useEffect(() => {
    const newChecks = { ...validationChecks };

    newChecks.customerName = {
      Required: formData.customerName.length > 0,
      "1-50 characters":
        formData.customerName.length >= 2 && formData.customerName.length <= 50,
      "Letters, spaces, hyphens only":
        /^[a-zA-Z\s\-']+$/.test(formData.customerName) ||
        formData.customerName.length === 0,
    };

    newChecks.mobileNumber = {
      Required: formData.mobileNumber.length > 0,
      "Exactly 10 digits": formData.mobileNumber.length === 10,
      "Numbers only":
        /^\d+$/.test(formData.mobileNumber) ||
        formData.mobileNumber.length === 0,
      "Valid starting digit (6-9)":
        /^[6-9]/.test(formData.mobileNumber) ||
        formData.mobileNumber.length === 0,
    };

    newChecks.email = {
      Required: formData.email.length > 0,
      "Valid email format":
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          formData.email
        ) || formData.email.length === 0,
      "Max 30 characters": formData.email.length <= 30,
    };

    newChecks.addr1 = {
      Required: formData.addr1.length > 0,
      "1-50 characters":
        formData.addr1.length >= 5 && formData.addr1.length <= 50,
      "Valid characters only":
        /^[a-zA-Z0-9\s\-\/\.#,]+$/.test(formData.addr1) ||
        formData.addr1.length === 0,
    };

    newChecks.addr2 = {
      Required: formData.addr2.length > 0,
      "1-50 characters":
        formData.addr2.length >= 1 && formData.addr2.length <= 50,
      "Valid characters only":
        /^[a-zA-Z0-9\s\-\/\.#,]+$/.test(formData.addr2) ||
        formData.addr2.length === 0,
    };

    newChecks.addr3 = {
      Required: formData.addr3.length > 0,
      "1-50 characters":
        formData.addr3.length >= 2 && formData.addr3.length <= 50,
      "Letters, spaces, hyphens only":
        /^[a-zA-Z\s\-]+$/.test(formData.addr3) || formData.addr3.length === 0,
    };

    newChecks.pinCode = {
      Required: formData.pinCode.length > 0,
      "Exactly 6 digits": formData.pinCode.length === 6,
      "Numbers only":
        /^\d+$/.test(formData.pinCode) || formData.pinCode.length === 0,
      "First digit should not be 0":
        /^[1-9]/.test(formData.pinCode) || formData.pinCode.length === 0,
    };

    newChecks.addr4 = {
      "Max 50 characters": formData.addr4.length <= 50,
    };

    setValidationChecks(newChecks);
  }, [formData]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      errors.customerName = "Name is required";
    } else if (formData.customerName.length > 50) {
      errors.customerName = "Name cannot exceed 50 characters";
    } else if (formData.customerName.length < 1) {
      errors.customerName = "Name must have at least 1 letters";
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.customerName)) {
      errors.customerName =
        "Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Mobile Number must be exactly 10 digits";
    } else if (!/^[6-9]/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Mobile Number must start with 6, 7, 8, or 9";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (formData.email.length > 30) {
      errors.email = "Email cannot exceed 30 characters";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      errors.email = "Invalid email format";
    }

    if (!formData.addr1.trim()) {
      errors.addr1 = "Address Line 1 is required";
    } else if (formData.addr1.length > 50) {
      errors.addr1 = "Address Line 1 cannot exceed 50 characters";
    } else if (formData.addr1.length < 1) {
      errors.addr1 = "Address Line 1 must have at least 1 characters";
    } else if (!/^[a-zA-Z0-9\s\-\/\.#,]+$/.test(formData.addr1)) {
      errors.addr1 = "Address Line 1 contains invalid characters";
    }

    if (!formData.addr2.trim()) {
      errors.addr2 = "Adress Line 2 is required";
    } else if (formData.addr2.length > 50) {
      errors.addr2 = "Adress Line 2 cannot exceed 50 characters";
    } else if (!/^[a-zA-Z0-9\s\-\/\.#,]+$/.test(formData.addr2)) {
      errors.addr2 = "Adress Line 2 contains invalid characters";
    }

    if (!formData.addr3.trim()) {
      errors.addr3 = "City/District/Town is required";
    } else if (formData.addr3.length > 50) {
      errors.addr3 = "City/District/Town cannot exceed 50 characters";
    } else if (formData.addr3.length < 1) {
      errors.addr3 = "City/District/Town must have at least 1 letters";
    } else if (!/^[a-zA-Z\s\-]+$/.test(formData.addr3)) {
      errors.addr3 = "City/District/Town can only contain letters, spaces, and hyphens";
    }

    if (!formData.state.trim()) {
      errors.state = "State is required";
    }

    if (!formData.pinCode.trim()) {
      errors.pinCode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      errors.pinCode = "Pincode must be 6 digits";
    } else if (!/^[1-9]/.test(formData.pinCode)) {
      errors.pinCode = "Pincode first digit cannot be 0";
    }

    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }

    if (formData.addr4.length > 50) {
      errors.addr4 = "Landmarks cannot exceed 50 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      notifications.show({
        title: "Invalid Form Data",
        message: "Please complete all required fields for the address details",
        color: "red",
      });
      return;
    }

    setIsLoading(true);

    try {
      //#region Opt Delhivery API Check pincode availability
      if (ecomConfig?.isShippingApiEnabled) {
        const pinCodeAvailability = {
          pinCode: formData.pinCode ?? "",
          productType: "",
        };

        const checkPinCodeAvailabilityRes = await checkPinCodeAvailability(
          pinCodeAvailability
        ).unwrap();

        if (checkPinCodeAvailabilityRes.delivery_codes.length === 0) {
          setFormErrors((prev) => ({
            ...prev,
            pinCode: "There is no shipment available for this location",
          }));
          setIsLoading(false);
          return;
        }
      }
      //#endregion

      const customerAddress: CustomerAddressAPI = {
        id: 0,
        customerName: formData.customerName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        addr1: formData.addr1,
        addr2: formData.addr2,
        addr3: formData.addr3,
        addr4: formData.addr4,
        state: formData.state,
        pinCode: formData.pinCode,
        country: formData.country,
        customerNo: "",
      };

      dispatch(addSelectedAddress(customerAddress));

      const addressForSubmit = {
        id: "guest",
        fullName: formData.customerName,
        phone: formData.mobileNumber,
        pincode: formData.pinCode,
        addressLine1: formData.addr1,
        addressLine2: formData.addr2,
        landmark: formData.addr4,
        city: formData.addr3,
        state: formData.state,
        addressType: "home" as const,
        isDefault: true,
        email: formData.email,
        country: formData.country,
      };

      onSubmit(customerAddress);
    } catch (error: any) {
      console.error("Address validation error:", error);
      setFormErrors((prev) => ({
        ...prev,
        pinCode: "Failed to validate address. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 md:py-8">
      <h2 className="text-xl font-semibold text-vintageText text-center mb-4 md:mb-6 font-melodramaRegular tracking-widest">
        Delivery Address
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            id="customerName"
            label="Full Name"
            value={formData.customerName}
            onChange={(value) => handleInputChange("customerName", value)}
            required
            placeholder="Enter Full Name"
            maxLength={50}
            error={formErrors.customerName}
            showCharCount={true}
            validationChecks={validationChecks.customerName}
          />

          <CustomInput
            id="mobileNumber"
            label="Mobile Number"
            type="tel"
            value={formData.mobileNumber}
            onChange={(value) => handleInputChange("mobileNumber", value)}
            required
            placeholder="Enter Mobile Number"
            maxLength={10}
            error={formErrors.mobileNumber}
            showCharCount={true}
            validationChecks={validationChecks.mobileNumber}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange("email", value)}
            required
            placeholder="Enter Email"
            maxLength={30}
            error={formErrors.email}
            showCharCount={true}
            validationChecks={validationChecks.email}
          />

          <CustomInput
            id="addr1"
            label="Address Line 1"
            value={formData.addr1}
            onChange={(value) => handleInputChange("addr1", value)}
            required
            placeholder="Enter House No, Building, Street"
            maxLength={50}
            error={formErrors.addr1}
            showCharCount={true}
            validationChecks={validationChecks.addr1}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            id="addr2"
            label="Address Line 2"
            value={formData.addr2}
            onChange={(value) => handleInputChange("addr2", value)}
            required
            placeholder="Enter Area"
            maxLength={50}
            error={formErrors.addr2}
            showCharCount={true}
            validationChecks={validationChecks.addr2}
          />

          <CustomInput
            id="addr3"
            label="City/District/Town"
            value={formData.addr3}
            onChange={(value) => handleInputChange("addr3", value)}
            required
            placeholder="Enter City/District/Town"
            maxLength={50}
            error={formErrors.addr3}
            showCharCount={true}
            validationChecks={validationChecks.addr3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <CustomSelect
              id="state"
              label="State"
              value={formData.state}
              options={states}
              onChange={(value) => handleInputChange("state", value)}
              required
              placeholder="Select State"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              error={formErrors.state}
            />
          </div>

          <CustomInput
            id="pinCode"
            label="Pin Code"
            value={formData.pinCode}
            onChange={(value) => handleInputChange("pinCode", value)}
            required
            placeholder="Enter Pin Code"
            maxLength={6}
            error={formErrors.pinCode}
            showCharCount={true}
            validationChecks={validationChecks.pinCode}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <CustomSelect
              id="country"
              label="Country"
              value={formData.country}
              options={countries}
              onChange={(value) => handleInputChange("country", value)}
              required
              placeholder="Select Country"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              error={formErrors.country}
            />
          </div>

          <CustomInput
            id="addr4"
            label="Landmarks"
            value={formData.addr4}
            onChange={(value) => handleInputChange("addr4", value)}
            placeholder="Enter Landmarks"
            maxLength={50}
            error={formErrors.addr4}
            showCharCount={true}
            validationChecks={validationChecks.addr4}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-vintageText text-white rounded-md font-medium hover:bg-opacity-90 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
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
              Validating Address...
            </div>
          ) : (
            "Save & Continue"
          )}
        </button>
      </form>
    </div>
  );
};

export default GuestAddressForm;
