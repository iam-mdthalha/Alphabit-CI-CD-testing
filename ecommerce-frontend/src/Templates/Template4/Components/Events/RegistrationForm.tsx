import React, { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";

interface RegistrationFormProps {
  event: {
    eventDetails: string;
    venue: string;
    dateTime: string;
  };
  onSubmit: (data: any) => void;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  city: string;
  state: string;
  country: string;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface FieldRequirements {
  fullName: string[];
  email: string[];
  mobileNumber: string[];
  city: string[];
  state: string[];
  country: string[];
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  event,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    mobileNumber: "",
    city: "",
    state: "",
    country: "India",
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requirements: FieldRequirements = {
    fullName: [
      "Required field",
      "2-50 characters",
      "Letters, spaces, hyphens only",
    ],
    email: ["Required field", "Valid email format"],
    mobileNumber: ["Exactly 10 digits", "Numbers only"],
    city: ["Required field", "2-50 characters", "Letters and spaces only"],
    state: [
      "Required field",
      "2-50 characters",
      "Letters, spaces, hyphens only",
    ],
    country: ["Required field"],
  };

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case "fullName":
        if (!value.trim()) return "Full Name is required";
        if (value.length < 2) return "Name must have 2+ letters";
        if (value.length > 50) return "Name must be 50 characters or less";
        if (!/^[a-zA-Z\s\-]+$/.test(value))
          return "Only letters, spaces, and hyphens allowed";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address";
        return "";

      case "mobileNumber":
        if (!value.trim()) return "Mobile number is required";
        if (!/^\d{10}$/.test(value))
          return "Enter a valid 10-digit mobile number";
        return "";

      case "city":
        if (!value.trim()) return "City is required";
        if (value.length < 2) return "City must have 2+ letters";
        if (value.length > 50) return "City must be 50 characters or less";
        if (!/^[a-zA-Z\s]+$/.test(value))
          return "Only letters and spaces allowed";
        return "";

      case "state":
        if (!value.trim()) return "State is required";
        if (value.length < 2) return "State must have 2+ letters";
        if (value.length > 50) return "State must be 50 characters or less";
        if (!/^[a-zA-Z\s\-]+$/.test(value))
          return "Only letters, spaces, and hyphens allowed";
        return "";

      case "country":
        if (!value.trim()) return "Country is required";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    if (field === "mobileNumber") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value),
      }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, formData[field]),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const allTouched = {
      fullName: true,
      email: true,
      mobileNumber: true,
      city: true,
      state: true,
      country: true,
    };
    setTouched(allTouched);

    const newErrors: FieldErrors = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(formData);

      notifications.show({
        title: "✅ Registration Submitted!",
        message: "Your registration is being processed",
        color: "green",
        autoClose: 3000,
      });
    } else {
      notifications.show({
        title: "⚠️ Please check your information",
        message: "Some fields need to be corrected",
        color: "red",
        autoClose: 4000,
      });
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", escHandler);
    return () => document.removeEventListener("keydown", escHandler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 scrollbar-hide">
        <div className="relative p-8 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <h2 className="text-3xl font-semibold text-vintageText font-melodramaRegular mb-2">
              Event Registration
            </h2>

            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 text-2xl transition-colors p-2 hover:bg-slate-100 rounded-full"
            >
              x
            </button>
          </div>
        </div>

        <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-vintageText rounded-2xl flex items-center justify-center text-white font-bold text-lg">
              📅
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                {event.eventDetails}
              </h3>
              <p className="text-slate-600 text-sm mb-1">{event.venue}</p>
              <p className="text-slate-500 text-sm">{event.dateTime}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <FormField
            label="Full Name *"
            name="fullName"
            type="text"
            value={formData.fullName}
            error={errors.fullName}
            maxLength={50}
            requirements={requirements.fullName}
            onChange={(value) => handleChange("fullName", value)}
            onBlur={() => handleBlur("fullName")}
            touched={touched.fullName}
          />

          <FormField
            label="Email *"
            name="email"
            type="email"
            value={formData.email}
            error={errors.email}
            requirements={requirements.email}
            onChange={(value) => handleChange("email", value)}
            onBlur={() => handleBlur("email")}
            touched={touched.email}
          />

          <FormField
            label="Mobile Number *"
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            error={errors.mobileNumber}
            requirements={requirements.mobileNumber}
            onChange={(value) => handleChange("mobileNumber", value)}
            onBlur={() => handleBlur("mobileNumber")}
            touched={touched.mobileNumber}
            maxLength={10}
          />

          <FormField
            label="City *"
            name="city"
            type="text"
            value={formData.city}
            error={errors.city}
            maxLength={50}
            requirements={requirements.city}
            onChange={(value) => handleChange("city", value)}
            onBlur={() => handleBlur("city")}
            touched={touched.city}
          />

          <FormField
            label="State *"
            name="state"
            type="text"
            value={formData.state}
            error={errors.state}
            maxLength={50}
            requirements={requirements.state}
            onChange={(value) => handleChange("state", value)}
            onBlur={() => handleBlur("state")}
            touched={touched.state}
          />

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Country *
            </label>

            <div className="relative">
              <select
                name="country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                onBlur={() => handleBlur("country")}
                className={`event-select w-full px-4 py-4 border-2 rounded-2xl focus:outline-none transition-all duration-300 appearance-none bg-white ${
                  errors.country && touched.country
                    ? "border-red-300 bg-red-50 focus:border-red-500"
                    : "border-slate-200 hover:border-slate-300 focus:border-blue-400"
                }`}
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Singapore">Singapore</option>
              </select>

              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>

            {errors.country && touched.country && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <span>⚠️</span>
                <span>{errors.country}</span>
              </div>
            )}

            {requirements.country && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-semibold text-slate-700 mb-2 tracking-wide">
                  Requirements:
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {requirements.country.map((req, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="text-green-500">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-2xl font-semibold hover:bg-slate-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-vintageText hover:bg-opacity-90 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Register Now"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  error?: string;
  maxLength?: number;
  requirements?: string[];
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  error,
  maxLength,
  requirements,
  touched,
  onChange,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            onBlur();
            setIsFocused(false);
          }}
          onFocus={() => setIsFocused(true)}
          maxLength={maxLength}
          className={`
            w-full px-4 py-4 border-2 rounded-2xl bg-white 
            focus:outline-none transition-all duration-300
            ${
              error && touched
                ? "border-red-300 bg-red-50 focus:border-red-500"
                : isFocused
                ? "border-blue-400 shadow-md"
                : "border-slate-200 hover:border-slate-300"
            }
          `}
          placeholder={`Enter your ${label.toLowerCase().replace(" *", "")}`}
        />

        {maxLength && (
          <div
            className={`
              absolute right-4 top-4 text-xs
              ${
                value.length > maxLength * 0.8
                  ? "text-orange-500"
                  : "text-slate-400"
              }
            `}
          >
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {error && touched && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {requirements && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-700 mb-2 tracking-wide">
            Requirements:
          </p>
          <ul className="text-xs text-slate-600 space-y-1">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="text-green-500">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
