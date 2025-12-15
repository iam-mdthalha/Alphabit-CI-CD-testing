import { Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import CustomDarkButtonFull from "Components/StyleComponent/CustomDarkButtonFull";
import { countries } from "Constants/Country";
import { states } from "Constants/State";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAddAddressMutation } from "Services/CustomerApiSlice";
import { addSelectedAddress } from "State/CustomerSlice/CustomerSlice";
import { AppDispatch } from "State/store";
import { CustomerAddressAPI } from "Types/CustomerAddress";

interface NewAddressSectionProps {
  next: () => void;
}

const CustomSelect: React.FC<{
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}> = ({ id, label, value, options, onChange, required = false, error }) => {
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
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && "*"}
      </label>

      <div
        id={id}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white`}
        onClick={() => setIsOpen((prev) => !prev)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
          if (e.key === "Escape") {
            setIsOpen(false);
            setSearchTerm("");
          }
        }}
      >
        {value || (
          <span className="text-gray-400">Select {label.toLowerCase()}</span>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsOpen(false);
                  setSearchTerm("");
                }
              }}
              aria-label={`Search ${label}`}
            />
          </div>

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                role="option"
                aria-selected={value === option}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  value === option ? "bg-blue-100" : ""
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
    </div>
  );
};

const CustomInput: React.FC<{
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  showCharCount?: boolean;
  error?: string;
}> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  maxLength,
  showCharCount = false,
  error,
}) => {
  return (
    <div className="relative">
      <div className="flex justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
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
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        required={required}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const NewAddressSection: React.FC<NewAddressSectionProps> = ({ next }) => {
  const dispatch: AppDispatch = useDispatch();
  const [addAddress, { isLoading: isAddingAddress }] = useAddAddressMutation();
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);

  const [formData, setFormData] = useState({
    id: 0,
    customerName: "",
    mobileNumber: "",
    addr1: "",
    addr2: "",
    addr3: "",
    addr4: "",
    state: "",
    pinCode: "",
    customerNo: "",
    country: "",
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      errors.customerName = "Customer Name is required";
    } else if (formData.customerName.length > 100) {
      errors.customerName = "Customer Name cannot exceed 100 characters";
    }

    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile Number is required";
    } else if (formData.mobileNumber.length > 10) {
      errors.mobileNumber = "Mobile Number cannot exceed 10 characters";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Invalid Mobile Number";
    }

    if (!formData.addr1.trim()) {
      errors.addr1 = "Address Line 1 is required";
    } else if (formData.addr1.length > 50) {
      errors.addr1 = "Address Line 1 cannot exceed 50 characters";
    }

    if (!formData.addr2.trim()) {
      errors.addr2 = "Address Line 2 is required";
    } else if (formData.addr2.length > 50) {
      errors.addr2 = "Address Line 2 cannot exceed 50 characters";
    }

    if (!formData.addr3.trim()) {
      errors.addr3 = "City is required";
    } else if (formData.addr3.length > 50) {
      errors.addr3 = "City cannot exceed 50 characters";
    }

    if (!formData.state.trim()) {
      errors.state = "State is required";
    }

    if (!formData.pinCode.trim()) {
      errors.pinCode = "Pin Code is required";
    } else if (formData.pinCode.length > 8) {
      errors.pinCode = "Pin Code cannot exceed 8 characters";
    } else if (!/^\d+$/.test(formData.pinCode)) {
      errors.pinCode = "Pin Code must contain only numbers";
    }

    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }

    if (formData.addr4 && formData.addr4.length > 50) {
      errors.addr4 = "Landmark cannot exceed 50 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [formData]);

  const handleSave = async () => {
    setHasTriedSubmit(true);

    if (!validateForm()) {
      notifications.show({
        title: "Invalid Shipping Address",
        message: "Please complete all required fields for the shipping address",
        color: "red",
      });
      return;
    }

    try {
      const response = await addAddress(formData).unwrap();
      const newAddress: CustomerAddressAPI = {
        ...formData,
        email: "",
        id: response.id,
      };

      dispatch(addSelectedAddress(newAddress));

      notifications.show({
        title: "Success",
        message: "Address saved successfully!",
        color: "green",
      });

      next();
    } catch (error) {
      console.error("Error saving address:", error);
      notifications.show({
        title: "Failed to save address",
        message: (error as unknown as { status: number, data: { message: string, results: { record: string, message: string, statusCode: number }, statusCode: number } } ).data.results.message,
        color: "red",
      });
    }
  };

  return (
    <Stack>
      <CustomInput
        id="customerName"
        label="Customer Name"
        value={formData.customerName}
        onChange={handleChange}
        required
        placeholder="Name (max 100 chars)"
        maxLength={100}
        showCharCount={true}
        error={hasTriedSubmit ? formErrors.customerName : undefined}
      />

      <CustomInput
        id="mobileNumber"
        label="Mobile Number"
        type="tel"
        value={formData.mobileNumber}
        onChange={handleChange}
        required
        placeholder="Mobile Number (max 10 chars)"
        maxLength={10}
        showCharCount={true}
        error={hasTriedSubmit ? formErrors.mobileNumber : undefined}
      />

      <CustomInput
        id="addr1"
        label="Address Line 1"
        value={formData.addr1}
        onChange={handleChange}
        required
        placeholder="Address Line 1 (max 50 chars)"
        maxLength={50}
        showCharCount={true}
        error={hasTriedSubmit ? formErrors.addr1 : undefined}
      />

      <CustomInput
        id="addr2"
        label="Address Line 2"
        value={formData.addr2}
        onChange={handleChange}
        required
        placeholder="Address Line 2 (max 50 chars)"
        maxLength={50}
        showCharCount={true}
        error={hasTriedSubmit ? formErrors.addr2 : undefined}
      />

      <CustomInput
        id="addr3"
        label="City"
        value={formData.addr3}
        onChange={handleChange}
        required
        placeholder="City (max 50 chars)"
        maxLength={50}
        showCharCount={true}
        error={hasTriedSubmit ? formErrors.addr3 : undefined}
      />

      <CustomSelect
        id="state"
        label="State"
        value={formData.state}
        options={states}
        onChange={(value) => handleSelectChange("state", value)}
        required
        error={hasTriedSubmit ? formErrors.state : undefined}
      />

      <CustomInput
        id="pinCode"
        label="Pin Code"
        value={formData.pinCode}
        onChange={handleChange}
        required
        placeholder="Pin Code (max 8 chars)"
        maxLength={8}
        showCharCount={true}
        error={hasTriedSubmit ? formErrors.pinCode : undefined}
      />

      <CustomSelect
        id="country"
        label="Country"
        value={formData.country}
        options={countries}
        onChange={(value) => handleSelectChange("country", value)}
        required
        error={hasTriedSubmit ? formErrors.country : undefined}
      />

      <CustomInput
        id="addr4"
        label="Landmark"
        value={formData.addr4}
        onChange={handleChange}
        placeholder="Landmark (max 50 chars)"
        maxLength={50}
        showCharCount={true}
        error={hasTriedSubmit ? formErrors.addr4 : undefined}
      />

      <div className="relative">
        {isAddingAddress && (
          <div className="absolute inset-0 flex justify-center items-center z-10">
            <svg
              className="animate-spin h-5 w-5 text-white"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
        <CustomDarkButtonFull onClick={handleSave} disabled={isAddingAddress}>
          {isAddingAddress ? "" : "Save Address"}
        </CustomDarkButtonFull>
      </div>
    </Stack>
  );
};

export default NewAddressSection;
