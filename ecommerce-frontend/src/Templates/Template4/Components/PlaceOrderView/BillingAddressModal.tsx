import { countries } from "Constants/Country";
import { states } from "Constants/State";
import React, { useEffect, useRef, useState } from "react";
import { Address, CustomerAddressAPI } from "Types/CustomerAddress";
import {
  useGetBillingAddressQuery,
  useUpdateBillingAddressMutation,
} from "Services/CustomerApiSlice";
import {
  customerAddressToAddress,
  addressToCustomerAddress,
} from "Templates/Template4/Utils/addressUtils";
import { notifications } from "@mantine/notifications";

/* -----------------------------------------------------------
 *  CUSTOM INPUT
 * ----------------------------------------------------------- */
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
  readOnly?: boolean;
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
  readOnly = false,
}) => {
  const safeValue = value || "";

  return (
    <div className="mb-3">
      <label className="block text-vintageText font-medium mb-1">
        {label} {required && "*"}
      </label>

      <div className="relative">
        <input
          id={id}
          type={type}
          value={safeValue}
          readOnly={readOnly}
          onChange={(e) => {
            if (!readOnly) onChange(e.target.value);
          }}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-vintageText"
          } rounded-md bg-light bg-opacity-50 ${
            readOnly ? "cursor-not-allowed opacity-60" : ""
          }`}
        />

        {showCharCount && maxLength && (
          <p className="text-xs text-gray-500 mt-1">
            {safeValue.length}/{maxLength}
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {validationChecks && safeValue.length > 0 && (
        <div className="mt-2 bg-vintageBg border border-vintageText border-opacity-20 rounded p-3">
          <div className="font-semibold text-xs mb-2 text-vintageText">
            {label.toUpperCase()} REQUIREMENTS:
          </div>

          <ul className="text-xs space-y-1">
            {Object.entries(validationChecks).map(([rule, ok]) => (
              <li
                key={rule}
                className="flex items-center"
                style={{ color: ok ? "green" : "red" }}
              >
                <span className="mr-2">{ok ? "✔" : "✖"}</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/* -----------------------------------------------------------
 *  CUSTOM SELECT
 * ----------------------------------------------------------- */
const CustomSelect: React.FC<{
  id: string;
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}> = ({
  id,
  label,
  value,
  options,
  onChange,
  required,
  placeholder,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 0);
  }, [open]);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const safeValue = value || "";

  return (
    <div className="mb-3">
      <label className="block text-vintageText font-medium mb-1">
        {label} {required && "*"}
      </label>

      <div
        ref={ref}
        className={`relative border ${
          error ? "border-red-500" : "border-vintageText"
        } rounded-md bg-light bg-opacity-50 cursor-pointer`}
      >
        <div
          className="px-3 py-2 flex justify-between items-center"
          onClick={() => setOpen(!open)}
        >
          {safeValue ? (
            options.find((o) => o.value === safeValue)?.label
          ) : (
            <span className="text-gray-500">
              {placeholder || `Select ${label}`}
            </span>
          )}
          <span>{open ? "▲" : "▼"}</span>
        </div>

        {open && (
          <div className="absolute left-0 right-0 bg-white border rounded shadow-lg z-50 max-h-60 overflow-auto scrollbar-hide">
            <input
              ref={searchRef}
              className="w-full px-2 py-1 border-b"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {filtered.length ? (
              filtered.map((opt) => (
                <div
                  key={opt.value}
                  className="px-3 py-2 hover:bg-vintageText/10"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No results</div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

/* -----------------------------------------------------------
 *  BILLING MODAL
 * ----------------------------------------------------------- */

interface BillingAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Address;
  onSave: (value: Address) => void;
}

const BillingAddressModal: React.FC<BillingAddressModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<Address>({
    fullName: data.fullName || "",
    phone: data.phone || "",
    pincode: data.pincode || "",
    addressLine1: data.addressLine1 || "",
    addressLine2: data.addressLine2 || "",
    city: data.city || "",
    state: data.state || "",
    country: data.country || "",
    landmark: data.landmark || "",
    email: data.email || "",
    isDefault: data.isDefault || true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [validationChecks, setValidationChecks] = useState<any>({
    fullName: {
      Required: false,
      "1-50 characters": false,
      "Letters, spaces, hyphens only": false,
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
    landmark: { "Max 50 characters": true },
  });

  const [updateBillingAddress, { isLoading }] =
    useUpdateBillingAddressMutation();

  const { data: billingAPI, refetch } = useGetBillingAddressQuery(undefined, {
    skip: !isOpen,
  });

  useEffect(() => {
    if (isOpen && billingAPI?.results) {
      const apiData = billingAPI.results;
      const transformedData = {
        fullName: apiData.customerName || "",
        phone: apiData.mobileNumber || "",
        email: apiData.email || "",
        pincode: apiData.pinCode || "",
        addressLine1: apiData.addr1 || "",
        addressLine2: apiData.addr2 || "",
        city: apiData.addr3 || "",
        landmark: apiData.addr4 || "",
        state: apiData.state || "",
        country: apiData.country || "",
        isDefault: true,
      };
      setFormData(transformedData);
      setErrors({});
    }
  }, [isOpen, billingAPI]);

  useEffect(() => {
    const a = formData;
    const c = { ...validationChecks };

    c.fullName = {
      Required: (a.fullName || "").length > 0,
      "1-50 characters":
        (a.fullName || "").length >= 2 && (a.fullName || "").length <= 50,
      "Letters, spaces, hyphens only":
        /^[a-zA-Z\s\-']+$/.test(a.fullName || "") ||
        (a.fullName || "").length === 0,
    };

    c.addressLine1 = {
      Required: (a.addressLine1 || "").length > 0,
      "1-50 characters":
        (a.addressLine1 || "").length >= 5 &&
        (a.addressLine1 || "").length <= 50,
      "Valid characters only":
        /^[a-zA-Z0-9\s\-\/\.#,]+$/.test(a.addressLine1 || "") ||
        (a.addressLine1 || "").length === 0,
    };

    c.addressLine2 = {
      Required: (a.addressLine2 || "").length > 0,
      "1-50 characters":
        (a.addressLine2 || "").length >= 1 &&
        (a.addressLine2 || "").length <= 50,
      "Valid characters only":
        /^[a-zA-Z0-9\s\-\/\.#,]+$/.test(a.addressLine2 || "") ||
        (a.addressLine2 || "").length === 0,
    };

    c.city = {
      Required: (a.city || "").length > 0,
      "1-50 characters":
        (a.city || "").length >= 2 && (a.city || "").length <= 50,
      "Letters, spaces, hyphens only":
        /^[a-zA-Z\s\-]+$/.test(a.city || "") || (a.city || "").length === 0,
    };

    c.pincode = {
      Required: (a.pincode || "").length > 0,
      "Exactly 6 digits": (a.pincode || "").length === 6,
      "Numbers only":
        /^\d+$/.test(a.pincode || "") || (a.pincode || "").length === 0,
      "First digit should not be 0":
        /^[1-9]/.test(a.pincode || "") || (a.pincode || "").length === 0,
    };

    c.landmark = { "Max 50 characters": (a.landmark || "").length <= 50 };

    setValidationChecks(c);
  }, [formData]);

  const validateField = (name: keyof Address) => {
    const v = (formData[name] ?? "").toString().trim();
    let msg = "";

    switch (name) {
      case "fullName":
        if (!v) msg = "Name is required";
        else if (v.length < 2) msg = "Name must have 2+ letters";
        else if (v.length > 50) msg = "Name cannot exceed 50 characters";
        else if (!/^[a-zA-Z\s\-']+$/.test(v))
          msg = "Only letters, spaces & hyphens allowed";
        break;

      case "addressLine1":
        if (!v) msg = "Address Line 1 is required";
        else if (v.length < 5) msg = "Must be 5+ characters";
        else if (v.length > 50) msg = "Max 50 characters";
        else if (!/^[a-zA-Z0-9\s\-\/\.#,]+$/.test(v))
          msg = "Invalid characters";
        break;

      case "addressLine2":
        if (!v) msg = "Area is required";
        else if (v.length > 50) msg = "Max 50 characters";
        else if (!/^[a-zA-Z0-9\s\-\/\.#,]+$/.test(v))
          msg = "Invalid characters";
        break;

      case "city":
        if (!v) msg = "City is required";
        else if (v.length < 2) msg = "Must be 2+ letters";
        else if (v.length > 50) msg = "Max 50 characters";
        else if (!/^[a-zA-Z\s\-]+$/.test(v)) msg = "Invalid characters";
        break;

      case "pincode":
        if (!v) msg = "Pincode is required";
        else if (!/^\d{6}$/.test(v)) msg = "Must be 6 digits";
        else if (!/^[1-9]/.test(v)) msg = "Cannot start with 0";
        break;

      case "state":
        if (!v) msg = "State is required";
        break;

      case "country":
        if (!v) msg = "Country is required";
        break;

      case "landmark":
        if (v.length > 50) msg = "Max 50 characters";
        break;
    }

    setErrors((p) => ({ ...p, [name]: msg }));
    return msg === "";
  };

  const validateForm = () => {
    const fields: (keyof Address)[] = [
      "fullName",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "country",
      "pincode",
      "landmark",
    ];
    let ok = true;
    fields.forEach((f) => {
      if (!validateField(f)) ok = false;
    });
    return ok;
  };

  type UpdateBillingPayload = {
    addr1: string;
    addr2: string;
    addr3: string;
    addr4: string;
    country: string;
    customerName: string;
    email: string;
    mobileNumber: string;
    pinCode: string;
    state: string;
  };

  const saveHandler = async () => {
    if (!validateForm()) return;

    try {
      const apiData: CustomerAddressAPI = addressToCustomerAddress(
        formData,
        {}
      );

      const updatePayload: UpdateBillingPayload = {
        addr1: apiData.addr1 ?? "",
        addr2: apiData.addr2 ?? "",
        addr3: apiData.addr3 ?? "",
        addr4: apiData.addr4 ?? "",
        country: apiData.country ?? "",
        customerName: apiData.customerName ?? "",
        email: apiData.email ?? "",
        mobileNumber: apiData.mobileNumber ?? "",
        pinCode: apiData.pinCode ?? "",
        state: apiData.state ?? "",
      };

      await updateBillingAddress(updatePayload).unwrap();
      await refetch();

      notifications.show({
        title: "Billing Address Updated",
        message: "Your billing address has been saved.",
        color: "green",
      });

      onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-vintageBg border border-vintageText w-full max-w-2xl rounded-lg shadow-lg relative flex flex-col max-h-[90vh]">
        <div className="p-4 pb-2">
          <h2 className="text-xl font-bold text-vintageText">
            Billing Address
          </h2>
        </div>

        <div className="px-4 pt-2 pb-4 overflow-y-auto scrollbar-hide max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <CustomInput
              id="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={(v) => setFormData({ ...formData, fullName: v })}
              required
              maxLength={50}
              error={errors.fullName}
              onBlur={() => validateField("fullName")}
              showCharCount
              validationChecks={validationChecks.fullName}
            />

            <CustomInput
              id="phone"
              label="Mobile Number"
              type="tel"
              value={formData.phone}
              onChange={() => {}}
              readOnly
            />

            <CustomInput
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={() => {}}
              readOnly
            />

            <CustomInput
              id="addressLine1"
              label="Address Line 1"
              value={formData.addressLine1}
              onChange={(v) => setFormData({ ...formData, addressLine1: v })}
              required
              maxLength={50}
              error={errors.addressLine1}
              onBlur={() => validateField("addressLine1")}
              showCharCount
              validationChecks={validationChecks.addressLine1}
            />

            <CustomInput
              id="addressLine2"
              label="Address Line 2 (Area)"
              value={formData.addressLine2 || ""}
              onChange={(v) => setFormData({ ...formData, addressLine2: v })}
              required
              maxLength={50}
              error={errors.addressLine2}
              onBlur={() => validateField("addressLine2")}
              showCharCount
              validationChecks={validationChecks.addressLine2}
            />

            <CustomInput
              id="city"
              label="City"
              value={formData.city}
              onChange={(v) => setFormData({ ...formData, city: v })}
              required
              maxLength={50}
              error={errors.city}
              onBlur={() => validateField("city")}
              showCharCount
              validationChecks={validationChecks.city}
            />

            <CustomSelect
              id="state"
              label="State"
              value={formData.state}
              options={states.map((x) => ({ label: x, value: x }))}
              onChange={(v) => setFormData({ ...formData, state: v })}
              required
              error={errors.state}
            />

            <CustomInput
              id="pincode"
              label="Pincode"
              value={formData.pincode}
              onChange={(v) => setFormData({ ...formData, pincode: v })}
              required
              maxLength={6}
              error={errors.pincode}
              onBlur={() => validateField("pincode")}
              showCharCount
              validationChecks={validationChecks.pincode}
            />

            <CustomSelect
              id="country"
              label="Country"
              value={formData.country}
              options={countries.map((x) => ({ label: x, value: x }))}
              onChange={(v) => setFormData({ ...formData, country: v })}
              required
              error={errors.country}
            />

            <CustomInput
              id="landmark"
              label="Landmark (Optional)"
              value={formData.landmark || ""}
              onChange={(v) => setFormData({ ...formData, landmark: v })}
              maxLength={50}
              error={errors.landmark}
              onBlur={() => validateField("landmark")}
              showCharCount
              validationChecks={validationChecks.landmark}
            />
          </div>
        </div>

        <div className="p-4 pt-2 flex justify-end gap-3 border-t border-vintageText border-opacity-20">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-yellow-500 text-vintageBg rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={saveHandler}
            disabled={isLoading}
            className="px-4 py-2 bg-vintageText text-vintageBg rounded-md"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingAddressModal;
