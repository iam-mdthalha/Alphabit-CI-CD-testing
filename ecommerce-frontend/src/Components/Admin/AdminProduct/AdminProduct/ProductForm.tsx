import { notifications } from "@mantine/notifications";
import { ProductAdminRequestDTO } from "Interface/Admin/Products/admin-product.interface";
import React, { useState } from "react";
import { BaseUOMSection } from "./FormSections/BaseUOMSection";
import { BasicInfoSection } from "./FormSections/BasicInfoSection";
import { CategoriesSection } from "./FormSections/CategoriesSection";
import { CustomAttributesSection } from "./FormSections/CustomAttributesSection";
import { GarmentsSection } from "./FormSections/GarmentsSection";
import { InventorySection } from "./FormSections/InventorySection";
import { ItemGroupSection } from "./FormSections/ItemGroupSection";
import { PurchaseSection } from "./FormSections/PurchaseSection";
import { SalesSection } from "./FormSections/SalesSection";
import { StatusSection } from "./FormSections/StatusSection";
import { TaxSection } from "./FormSections/TaxSection";

interface ProductFormProps {
  initialValues: ProductAdminRequestDTO;
  onSubmit: (
    data: ProductAdminRequestDTO,
    mainImageFile: File | null,
    additionalImageFiles: (File | null)[],
    addImgsLineNo: number[]
  ) => void;
  onCancel: () => void;
  mode: "add" | "edit" | "view";
  existingMainImage?: string;
  existingAdditionalImages?: string[];
}

const initialFormValues: ProductAdminRequestDTO = {
  productCode: "",
  productName: "",
  productDescription: [""],
  category: "",
  subCategory: "",
  brand: "",
  subClassId: "",
  author: "",
  language: "",
  academic: "",
  merchandise: "",
  baseUom: "pcs",
  model: "",
  purchaseUom: "pcs",
  cost: 0,
  salesUom: "pcs",
  mrp: 0,
  sellingPrice: 0,
  minimumSellingPrice: 0,
  inventoryUom: "pcs",
  minimumStkQty: 0,
  maximumStkQty: 0,
  isActive: "Y",
  isNewArrival: 0,
  isTopSelling: 0,
  remarkTwo: "",
  productGarmentType: {
    id: 0,
    size: "",
    fabric: "",
    collar: "",
    color: "",
    sleeve: "",
    occasion: "",
    pattern: "",
  },
  gst: 0,
  cgst: 0,
  sgst: 0,
  cess: 0,
  hsCode: "",
  minimumInvQty: 0,
  labelPara1: "",
  labelPara2: "",
  labelPara3: "",
  labelPara4: "",
  labelPara5: "",
  labelPara6: "",
  labelPara7: "",
  labelPara8: "",
  parameter1: "",
  parameter2: "",
  parameter3: "",
  parameter4: "",
  parameter5: "",
  parameter6: "",
  parameter7: "",
  parameter8: "",
  detailDescription: "",
  itemGroupId: undefined,
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  mode,
  existingMainImage,
  existingAdditionalImages,
}) => {
  const [formData, setFormData] = useState<ProductAdminRequestDTO>({
    ...initialFormValues,
    ...initialValues,
  });
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [addImageFiles, setAddImageFiles] = useState<(File | null)[]>(
    existingAdditionalImages ? Array(5).fill(null) : []
  );

  const [addImgsLineNo, setAddImgsLineNo] = useState<number[]>(
    existingAdditionalImages
      ? existingAdditionalImages.map((_, index) => index)
      : []
  );
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    categories: true,
    status: true,
    taxInfo: true,
    baseUOM: true,
    purchase: true,
    sales: true,
    inventory: true,
    garments: true,
    customAttributes: true,
    itemGroup: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const numberFields = [
    "cost",
    "mrp",
    "sellingPrice",
    "minimumSellingPrice",
    "minimumStkQty",
    "maximumStkQty",
    "gst",
    "cgst",
    "sgst",
    "cess",
    "minimumInvQty",
    "isNewArrival",
    "isTopSelling",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleGarmentChange = (field: string, value: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     productgarmenttype: {
  //       ...prev.productgarmenttype,
  //       [field]: value
  //     }
  //   }));
  // };

  const validatePrices = (): boolean => {
    if (Number(formData.sellingPrice) > Number(formData.mrp)) {
      notifications.show({
        title: "Validation Error",
        message: "Selling Price cannot be greater than MRP",
        color: "red",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePrices()) return;

    const submitData: ProductAdminRequestDTO = {
      ...formData,
      cost: Number(formData.cost),
      mrp: Number(formData.mrp),
      sellingPrice: Number(formData.sellingPrice),
      minimumSellingPrice: Number(formData.minimumSellingPrice),
      minimumStkQty: Number(formData.minimumStkQty),
      maximumStkQty: Number(formData.maximumStkQty),
      gst: Number(formData.gst),
      cgst: Number(formData.cgst),
      sgst: Number(formData.sgst),
      cess: Number(formData.cess),
      minimumInvQty: Number(formData.minimumInvQty),
      isNewArrival: Number(formData.isNewArrival),
      isTopSelling: Number(formData.isTopSelling),
    };

    onSubmit(submitData, mainImageFile, addImageFiles, addImgsLineNo);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="font-gilroyRegular tracking-wider bg-white px-6 py-12 rounded-md shadow-md my-6 space-y-6">
        <BasicInfoSection
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          open={openSections.basicInfo}
          toggleSection={() => toggleSection("basicInfo")}
          mainImageFile={mainImageFile}
          setMainImageFile={setMainImageFile}
          addImageFiles={addImageFiles}
          setAddImageFiles={setAddImageFiles}
          addImgsLineNo={addImgsLineNo}
          setAddImgsLineNo={setAddImgsLineNo}
          existingMainImage={existingMainImage}
          existingAdditionalImages={existingAdditionalImages}
        />

        <CategoriesSection
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          open={openSections.categories}
          toggleSection={() => toggleSection("categories")}
        />

        <StatusSection
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          open={openSections.status}
          toggleSection={() => toggleSection("status")}
        />

        <BaseUOMSection
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          open={openSections.baseUOM}
          toggleSection={() => toggleSection("baseUOM")}
        />

        <PurchaseSection
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          open={openSections.purchase}
          toggleSection={() => toggleSection("purchase")}
        />

        <SalesSection
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          open={openSections.sales}
          toggleSection={() => toggleSection("sales")}
        />

        <InventorySection
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          open={openSections.inventory}
          toggleSection={() => toggleSection("inventory")}
        />

        <TaxSection
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          open={openSections.taxInfo}
          toggleSection={() => toggleSection("taxInfo")}
        />

        {process.env.REACT_APP_STORE_TYPE !== "book" && (
          <GarmentsSection
            formData={formData}
            setFormData={setFormData}
            mode={mode}
            open={openSections.garments}
            toggleSection={() => toggleSection("garments")}
          />
        )}

        <CustomAttributesSection
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          open={openSections.customAttributes}
          toggleSection={() => toggleSection("customAttributes")}
        />

        <ItemGroupSection
          formData={formData}
          setFormData={setFormData}
          mode={mode}
          open={openSections.itemGroup}
          toggleSection={() => toggleSection("itemGroup")}
        />
      </div>

      {mode !== "view" && (
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            className="px-6 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white text-blue-600 hover:bg-gray-50"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            type="submit"
          >
            {mode === "add" ? "Create Product" : "Save Changes"}
          </button>
        </div>
      )}
    </form>
  );
};
