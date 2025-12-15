import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { notifications } from "@mantine/notifications";
import { SellBookProductDTO } from "Types/SellProduct";
import {
  useCreateSellItemMutation,
  useUploadSellItemImagesMutation,
} from "Services/SellProductApiSlice";

const MAX_IMAGES = 5;

interface FormData {
  fullName: string;
  mobile: string;
  email: string;
  isbn: string;
  bookTitle: string;
  bookType: string;
  preferredStore: string;
}

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
      <label className="block text-vintageBg font-medium mb-1">
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
          className={`w-full px-3 py-2 border-2 ${
            error ? "border-red-400" : "border-vintageBg/30"
          } rounded-lg focus:outline-none focus:border-vintageBg bg-transparent text-vintageBg placeholder-vintageBg/50`}
        />

        {showCharCount && maxLength && (
          <p className="text-xs text-vintageBg/70 mt-1">
            {value.length}/{maxLength}
          </p>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

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
  return (
    <div className="mb-4">
      <label className="block text-vintageBg font-medium mb-1">
        {label} {required && "*"}
      </label>

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border-2 ${
          error ? "border-red-400" : "border-vintageBg/30"
        } rounded-lg focus:outline-none focus:border-vintageBg bg-vintageText text-vintageBg appearance-none`}
      >
        {placeholder && (
          <option value="" className="bg-vintageText text-vintageBg">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-vintageText text-vintageBg"
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

const RegisterForm: React.FC = () => {
  const [images, setImages] = useState<(File | null)[]>([null]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createSellItem] = useCreateSellItemMutation();
  const [uploadSellItemImages] = useUploadSellItemImagesMutation();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    mobile: "",
    email: "",
    isbn: "",
    bookTitle: "",
    bookType: "Old",
    preferredStore: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [validationChecks, setValidationChecks] = useState<Record<string, any>>(
    {
      fullName: {
        Required: false,
        "2-200 characters": false,
        "Letters and spaces only": false,
      },
      mobile: {
        Required: false,
        "10 digits": false,
        "Numbers only": false,
        "Valid starting digit (6-9)": false,
      },
      email: {
        "Max 100 characters": true,
        "Valid email format": true,
      },
      isbn: {
        Required: false,
        "10-20 characters": false,
        "Numbers and hyphens only": false,
        "Valid ISBN format (10 or 13 digits)": false,
      },
      bookTitle: {
        Required: false,
        "2-200 characters": false,
        "Valid characters only": false,
      },
    }
  );

  useEffect(() => {
    const newChecks = { ...validationChecks };

    newChecks.fullName = {
      Required: formData.fullName.length > 0,
      "2-200 characters":
        formData.fullName.length >= 2 && formData.fullName.length <= 200,
      "Letters and spaces only":
        /^[a-zA-Z\s]*$/.test(formData.fullName) ||
        formData.fullName.length === 0,
    };

    newChecks.mobile = {
      Required: formData.mobile.length > 0,
      "10 digits":
        formData.mobile.length >= 10 && formData.mobile.length <= 10,
      "Numbers only":
        /^\d+$/.test(formData.mobile) || formData.mobile.length === 0,
      "Valid starting digit (6-9)":
        /^[6-9]/.test(formData.mobile) || formData.mobile.length === 0,
    };

    newChecks.email = {
      "Max 100 characters": formData.email.length <= 100,
      "Valid email format":
        formData.email.length === 0 ||
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email),
    };

    newChecks.isbn = {
      Required: formData.isbn.length > 0,
      "10-20 characters":
        formData.isbn.length >= 10 && formData.isbn.length <= 20,
      "Numbers and hyphens only":
        /^[0-9\-]+$/.test(formData.isbn) || formData.isbn.length === 0,
      "Valid ISBN format (10 or 13 digits)": (() => {
        if (formData.isbn.length === 0) return true;
        const cleanIsbn = formData.isbn.replace(/-/g, "");
        return cleanIsbn.length === 10 || cleanIsbn.length === 13;
      })(),
    };

    newChecks.bookTitle = {
      Required: formData.bookTitle.length > 0,
      "2-200 characters":
        formData.bookTitle.length >= 2 && formData.bookTitle.length <= 200,
      "Valid characters only":
        /^[a-zA-Z0-9\s\-_,.()&:'"]*$/.test(formData.bookTitle) ||
        formData.bookTitle.length === 0,
    };

    setValidationChecks(newChecks);
  }, [formData]);

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required";
    } else if (formData.fullName.length > 200) {
      errors.fullName = "Full Name cannot exceed 200 characters";
    } else if (formData.fullName.length < 2) {
      errors.fullName = "Name must have at least 2 letters";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.fullName)) {
      errors.fullName = "Name can only contain letters and spaces";
    }

    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile Number is required";
    } else if (formData.mobile.length > 10) {
      errors.mobile = "Mobile Number cannot exceed 10 digits";
    } else if (formData.mobile.length < 10) {
      errors.mobile = "Mobile Number must have at least 10 digits";
    } else if (!/^\d+$/.test(formData.mobile)) {
      errors.mobile = "Mobile Number can only contain digits";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      errors.mobile = "Invalid mobile number format";
    }

    if (formData.email.length > 0) {
      if (formData.email.length > 100) {
        errors.email = "Email cannot exceed 100 characters";
      } else if (!/^\S+@\S+$/.test(formData.email)) {
        errors.email = "Invalid email format";
      } else if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
      ) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!formData.isbn.trim()) {
      errors.isbn = "ISBN is required";
    } else if (formData.isbn.length > 20) {
      errors.isbn = "ISBN cannot exceed 20 characters";
    } else if (formData.isbn.length < 10) {
      errors.isbn = "ISBN must have at least 10 characters";
    } else if (!/^[0-9\-]+$/.test(formData.isbn)) {
      errors.isbn = "ISBN can only contain numbers and hyphens";
    } else {
      const cleanIsbn = formData.isbn.replace(/-/g, "");
      if (!(cleanIsbn.length === 10 || cleanIsbn.length === 13)) {
        errors.isbn = "ISBN must be 10 or 13 digits";
      }
    }

    if (!formData.bookTitle.trim()) {
      errors.bookTitle = "Book Title is required";
    } else if (formData.bookTitle.length > 200) {
      errors.bookTitle = "Book Title cannot exceed 200 characters";
    } else if (formData.bookTitle.length < 2) {
      errors.bookTitle = "Book Title must have at least 2 characters";
    } else if (!/^[a-zA-Z0-9\s\-_,.()&:'"]*$/.test(formData.bookTitle)) {
      errors.bookTitle = "Book Title contains invalid characters";
    }

    if (!formData.bookType) {
      errors.bookType = "Book Type is required";
    } else if (!["Old", "New"].includes(formData.bookType)) {
      errors.bookType = "Please select a valid book type";
    }

    if (!formData.preferredStore) {
      errors.preferredStore = "Preferred Store is required";
    } else if (
      ![
        "grand-mall-velachery",
        "dlf-porur",
        "marina-mall-omr",
        "skywalk-chennai",
        "garuda-mall-bangalore",
      ].includes(formData.preferredStore)
    ) {
      errors.preferredStore = "Please select a valid store";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBlur = () => {
    validateForm();
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        notifications.show({
          title: "Invalid File Type",
          message: "Please upload only JPEG, JPG, PNG, or WebP images",
          color: "red",
        });
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        notifications.show({
          title: "File Too Large",
          message: "Image size must be less than 5MB",
          color: "red",
        });
        return;
      }
    }

    const updatedImages = [...images];
    updatedImages[index] = file;
    setImages(updatedImages);
  };

  const addImageInput = () => {
    if (images.length < MAX_IMAGES) {
      setImages([...images, null]);
    } else {
      notifications.show({
        title: "Maximum Images Reached",
        message: `You can only upload up to ${MAX_IMAGES} images`,
        color: "yellow",
      });
    }
  };

const removeImageInput = (index: number) => {

  // If it's the first image (required slot)
  if (index === 0) {
    // Just clear the image instead of removing the slot entirely
    const updatedImages = [...images];
    updatedImages[0] = null;
    setImages(updatedImages);

    notifications.show({
      message: "First image removed. Please upload a new required image.",
      color: "yellow",
    });

    return;
  }

    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    fileInputRefs.current = fileInputRefs.current.filter((_, i) => i !== index);
  };

  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1] || base64;
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        notifications.show({
          title: "Validation Error",
          message: "Please fill all required fields correctly",
          color: "red",
        });
        setIsSubmitting(false);
        return;
      }

      const hasValidImage = images.some((img) => img !== null);
      if (!hasValidImage) {
        notifications.show({
          title: "Submission Failed",
          message: "Please upload at least one product image",
          color: "red",
        });
        setIsSubmitting(false);
        return;
      }

      if (!images[0]) {
        notifications.show({
          title: "Submission Failed",
          message: "The first product image is required",
          color: "red",
        });
        setIsSubmitting(false);
        return;
      }

      const loadingNotification = notifications.show({
        title: "Submitting...",
        message: "Please wait while we process your book submission",
        loading: true,
        autoClose: false,
        withCloseButton: false,
      });

      const image1Base64 = images[0] ? await convertToBase64(images[0]) : "";
      const image2Base64 = images[1] ? await convertToBase64(images[1]) : "";

      const sellProductData: SellBookProductDTO = {
        bookTitle: formData.bookTitle,
        bookType: formData.bookType,
        emailId: formData.email,
        fullName: formData.fullName,
        isbn: formData.isbn,
        mobileNumber: formData.mobile,
        preferredStoreToSell: formData.preferredStore,
        image1: image1Base64,
        image2: image2Base64,
      };

      const response = await createSellItem(sellProductData).unwrap();

      if (response.id && images.length > 2) {
        const additionalImages = images
          .slice(2)
          .filter((img): img is File => img !== null);
        if (additionalImages.length > 0) {
          await uploadSellItemImages({
            id: response.id,
            images: additionalImages,
          }).unwrap();
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form Submitted:", {
        ...formData,
        images: images.filter((img) => img !== null),
      });

      notifications.hide(loadingNotification);

      notifications.show({
        title: "Success!",
        message: "Your book has been submitted successfully.",
        color: "green",
      });

      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        isbn: "",
        bookTitle: "",
        bookType: "Old",
        preferredStore: "",
      });
      setImages([null]);
      setFormErrors({});
      fileInputRefs.current = [];
    } catch (err: any) {
      console.error("Submission error:", err);
      let errorMessage = "Submission failed. Please try again.";

      if (err.data) {
        errorMessage = err.data.message || JSON.stringify(err.data);
      } else if (err.status === 500) {
        errorMessage = "Server error occurred. Please try again later.";
      } else if (err.status === 400) {
        errorMessage = "Invalid data submitted. Please check your inputs.";
      }

      notifications.show({
        title: "Submission Failed",
        message: errorMessage,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-1 rounded-2xl p-4 md:p-6 bg-vintageText relative">
      <h1 className="text-3xl md:text-4xl font-bold text-vintageBg mb-5">
        Sell on Our Store
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomInput
          id="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={(value) => handleInputChange("fullName", value)}
          required
          placeholder="Enter Full Name"
          maxLength={200}
          error={formErrors.fullName}
          showCharCount
          onBlur={handleBlur}
          validationChecks={validationChecks.fullName}
        />

        <CustomInput
          id="mobile"
          label="Mobile Number"
          type="tel"
          value={formData.mobile}
          onChange={(value) => handleInputChange("mobile", value)}
          required
          maxLength={10}
          placeholder="Enter 10-digit Mobile Number"
          error={formErrors.mobile}
          showCharCount
          onBlur={handleBlur}
          validationChecks={validationChecks.mobile}
        />

        <CustomInput
          id="email"
          label="Email ID"
          type="email"
          value={formData.email}
          onChange={(value) => handleInputChange("email", value)}
          required
          placeholder="Enter Email ID"
          maxLength={100}
          error={formErrors.email}
          showCharCount
          onBlur={handleBlur}
          validationChecks={validationChecks.email}
        />

        <CustomInput
          id="isbn"
          label="ISBN"
          value={formData.isbn}
          onChange={(value) => handleInputChange("isbn", value)}
          required
          maxLength={20}
          placeholder="Enter ISBN (10 or 13 digits)"
          error={formErrors.isbn}
          showCharCount
          onBlur={handleBlur}
          validationChecks={validationChecks.isbn}
        />

        <CustomInput
          id="bookTitle"
          label="Book Title"
          value={formData.bookTitle}
          onChange={(value) => handleInputChange("bookTitle", value)}
          required
          maxLength={200}
          placeholder="Enter Book Title"
          error={formErrors.bookTitle}
          showCharCount
          onBlur={handleBlur}
          validationChecks={validationChecks.bookTitle}
        />

        <CustomSelect
          id="bookType"
          label="Book Type"
          value={formData.bookType}
          options={[
            { label: "Old", value: "Old" },
            { label: "New", value: "New" },
          ]}
          onChange={(value) => handleInputChange("bookType", value)}
          required
          error={formErrors.bookType}
        />

        <CustomSelect
          id="preferredStore"
          label="Preferred Store to Sell In"
          value={formData.preferredStore}
          options={[
            { label: "Grand Mall Velachery", value: "grand-mall-velachery" },
            { label: "DLF Porur", value: "dlf-porur" },
            { label: "Marina Mall OMR", value: "marina-mall-omr" },
            { label: "Skywalk Chennai", value: "skywalk-chennai" },
            { label: "Garuda Mall Bangalore", value: "garuda-mall-bangalore" },
          ]}
          onChange={(value) => handleInputChange("preferredStore", value)}
          required
          placeholder="Select Store"
          error={formErrors.preferredStore}
        />

        <div>
          <label className="block mb-2 font-medium text-vintageBg text-sm">
            Upload Product Image(s) <span className="">*</span>
          </label>
          <p className="text-vintageBg/70 text-xs mb-3">
            First image is required. Supported formats: JPEG, JPG, PNG, WebP.
            Max 5MB per image.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative border border-vintageBg/20 rounded-lg p-2 flex flex-col items-center"
              >
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  ref={(el) => (fileInputRefs.current[index] = el)}
                  onChange={(e) =>
                    handleImageChange(index, e.target.files?.[0] || null)
                  }
                />

                {image ? (
                  <>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <p className="text-xs text-vintageBg mt-1 truncate w-full text-center">
                      {image.name}
                    </p>

                  {image && (
                    <button type="button"
                    onClick={() => removeImageInput(index)}
                    className="absolute -top-2 -right-2 text-red-600 bg-white p-1 rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                    <FaTrash size={10} />
                  </button>
               )}

                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => triggerFileInput(index)}
                    className="text-vintageBg text-xs flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-vintageBg/40 rounded-md hover:border-vintageBg/60 transition-colors"
                  >
                    <FaPlus size={16} className="mb-1" />
                    <span>{index === 0 ? "Required" : "Optional"}</span>
                  </button>
                )}
              </div>
            ))}

            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={addImageInput}
                className="border-2 border-dashed border-vintageBg/40 rounded-lg p-2 flex flex-col items-center justify-center text-vintageBg hover:border-vintageBg/60 transition-colors h-24"
              >
                <FaPlus size={16} className="mb-1" />
                <span className="text-xs">Add Image</span>
              </button>
            )}
          </div>

         {!images[0] && (
           <p className="text-red-600 font-semibold text-sm mt-2 bg-red-100 border border-red-300 p-2 rounded">
          ⚠️ At least one product image is required
          </p>
      )}

        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-sm px-4 py-3 font-semibold text-vintageText bg-vintageBg 
            hover:bg-vintageBg hover:bg-opacity-90 active:bg-vintageBg active:bg-opacity-80
            transition-colors duration-300 
            border border-vintageBg border-opacity-50 shadow-md
            disabled:opacity-70 disabled:cursor-not-allowed
            flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-vintageText mr-2"
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
                Submitting...
              </>
            ) : (
              "Submit Book"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
