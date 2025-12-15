import React, { useState } from "react";
import Select from "react-select";
import { useGetAllBrandsQuery } from "Services/Admin/BrandApiSlice";
import { useGetAllAdminProductsQuery } from "Services/Admin/ProductAdminApiSlice";
import {
  useAddBrandPromotionMutation,
  useUpdateBrandPromotionMutation,
} from "Services/Admin/BrandPromotionApiSlice";
import { BrandPromotionDto } from "Types/Admin/AdminBrandPromotionType";
import { notifications } from "@mantine/notifications";
import { useGetAllLocTypesQuery } from "Services/Admin/LocTypeApiSlice";

interface BrandPromotionFormProps {
  initialValues: BrandPromotionDto;
  onSubmit: (data: BrandPromotionDto) => void;
  onCancel: () => void;
  isViewMode?: boolean;
}

export const BrandPromotionForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isViewMode = false,
}: BrandPromotionFormProps) => {
  const [formData, setFormData] = useState<BrandPromotionDto>(initialValues);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isByValue, setIsByValue] = useState(
    initialValues.brandPromotionHdr.byValue === 1
  );
  const plant = process.env.REACT_APP_PLANT;

  const { data: locTypes = [], isLoading: locTypesLoading } =
    useGetAllLocTypesQuery({
      plant: plant,
    });

  const [addBrandPromotion] = useAddBrandPromotionMutation();
  const [updateBrandPromotion] = useUpdateBrandPromotionMutation();

  const { data: brands = [], isLoading: brandsLoading } = useGetAllBrandsQuery({
    plant: plant,
  });
  const { data: productsData, isLoading: productsLoading } =
    useGetAllAdminProductsQuery({
      category: undefined,
      pageSize: 100,
      activePage: 1,
      subCategory: undefined,
      brand: undefined,
    });

  const brandOptions = brands.map((brand) => ({
    value: brand.productBrandId,
    label: brand.productBrandDesc,
  }));

  const productOptions =
    productsData?.products?.map((product) => ({
      value: product.product.item,
      // value: product.product.id.toString(),
      label: `${product.product.item} - ${product.product.itemDesc}`,
    })) || [];

  const handleBrandChange = (selectedOption: any) => {
    setSelectedBrand(selectedOption);
    const updatedDet = [...formData.brandPromotionDet];
    updatedDet[0] = {
      ...updatedDet[0],
      buyProductBrandId: selectedOption.value,
    };
    setFormData({
      ...formData,
      brandPromotionDet: updatedDet,
    });
  };

  const handleProductChange = (selectedOption: any) => {
    setSelectedProduct(selectedOption);
    const updatedDet = [...formData.brandPromotionDet];
    updatedDet[0] = {
      ...updatedDet[0],
      getItem: selectedOption.value,
    };
    setFormData({
      ...formData,
      brandPromotionDet: updatedDet,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      brandPromotionHdr: {
        ...prev.brandPromotionHdr,
        [name]: type === "number" ? Number(value) : value,
      },
    }));
  };

  const handleDetailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value, type } = e.target;
    const updatedDet = [...formData.brandPromotionDet];
    updatedDet[index] = {
      ...updatedDet[index],
      [name]: type === "number" ? Number(value) : value,
    };
    setFormData({
      ...formData,
      brandPromotionDet: updatedDet,
    });
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      brandPromotionHdr: {
        ...prev.brandPromotionHdr,
        isActive: e.target.value,
      },
    }));
  };

  const handleByValueChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      brandPromotionHdr: {
        ...prev.brandPromotionHdr,
        byValue: value,
      },
    }));
  };

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";

    const [day, month, year] = dateStr.split("/");
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    return `${formattedDate}T00:00`;
  };

  const handleDateTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "start" | "end"
  ) => {
    const value = e.target.value;
    if (!value) return;

    const [datePart, timePart] = value.split("T");
    const [year, month, day] = datePart.split("-");
    const time = timePart ? timePart.substring(0, 5) : "00:00";

    setFormData((prev) => ({
      ...prev,
      brandPromotionHdr: {
        ...prev.brandPromotionHdr,
        [`${type}Date`]: `${day}/${month}/${year}`,
        [`${type}Time`]: time,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSubmit(formData);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save brand promotion",
        color: "red",
      });
      console.error("Failed to save brand promotion:", error);
    }
  };

  const handleAddDataClick = () => {
    setIsByValue(false);
    setFormData((prev) => ({
      ...prev,
      brandPromotionHdr: {
        ...prev.brandPromotionHdr,
        byValue: 0,
      },
    }));
  };

  const handleViewDataClick = () => {
    setIsByValue(true);
    setFormData((prev) => ({
      ...prev,
      brandPromotionHdr: {
        ...prev.brandPromotionHdr,
        byValue: 1,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="font-gilroyRegular tracking-wider space-y-4">
      <div className="bg-white px-6 py-12 rounded-md shadow-md my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Promotion Name:*
            </label>
            <input
              type="text"
              name="promotionName"
              value={formData.brandPromotionHdr.promotionName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
              required
              maxLength={100}
              placeholder="Enter promotion name (max 100 chars)"
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {formData.brandPromotionHdr.promotionName.length}/100 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Promotion Description:*
            </label>
            <textarea
              name="promotionDesc"
              value={formData.brandPromotionHdr.promotionDesc}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
              maxLength={200}
              placeholder="Enter promotion description (max 200 chars)"
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {formData.brandPromotionHdr.promotionDesc.length}/200 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Outlet/Location:*
            </label>
            <select
              name="outlet"
              value={formData.brandPromotionHdr.outlet}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
              disabled={isViewMode || locTypesLoading}
            >
              <option value="">Select a location</option>
              {locTypes.map((locType) => (
                <option key={locType.locTypeId} value={locType.locTypeId}>
                  {locType.locTypeDesc}
                </option>
              ))}
            </select>
          </div>

          <div className="px-5 pt-8">
            <label>
              <input
                onClick={handleAddDataClick}
                type="radio"
                name="type"
                className="mr-1"
                checked={formData.brandPromotionHdr.byValue === 0}
                readOnly={isViewMode}
                disabled={isViewMode}
              />
              By Quantity
            </label>
            <label className="px-2">
              <input
                onClick={handleViewDataClick}
                type="radio"
                name="type"
                className="mr-1"
                checked={formData.brandPromotionHdr.byValue === 1}
                readOnly={isViewMode}
                disabled={isViewMode}
              />
              By Value
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={formatDateForInput(formData.brandPromotionHdr.startDate)}
              onChange={(e) => handleDateTimeChange(e, "start")}
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
              readOnly={isViewMode}
              disabled={isViewMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={formatDateForInput(formData.brandPromotionHdr.endDate)}
              onChange={(e) => handleDateTimeChange(e, "end")}
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
              readOnly={isViewMode}
              disabled={isViewMode}
            />
          </div>

          <div className="pt-2 px-2">
            <label className="px-2">
              <input
                type="radio"
                name="isActive"
                value="Y"
                checked={formData.brandPromotionHdr.isActive === "Y"}
                onChange={handleActiveChange}
                className="mr-1"
                readOnly={isViewMode}
                disabled={isViewMode}
              />
              Active
            </label>
            <label className="px-2">
              <input
                type="radio"
                name="isActive"
                value="N"
                checked={formData.brandPromotionHdr.isActive === "N"}
                onChange={handleActiveChange}
                className="mr-1"
                readOnly={isViewMode}
                disabled={isViewMode}
              />
              Non Active
            </label>
          </div>
        </div>

        <div className="overflow-auto pt-5">
          {!isByValue && (
            <table className="min-w-full border border-gray-200 text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-semibold">
                <tr>
                  <th className="px-4 py-2 border">Buy Brand</th>
                  <th className="px-4 py-2 border">Buy Quantity</th>
                  <th className="px-4 py-2 border">Get Product</th>
                  <th className="px-4 py-2 border">Get Quantity</th>
                  <th className="px-4 py-2 border">Limit of Usage</th>
                </tr>
              </thead>
              <tbody>
                {formData.brandPromotionDet.map((det, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-2 border flex items-center gap-2">
                      <Select
                        options={brandOptions}
                        onChange={handleBrandChange}
                        value={brandOptions.find(
                          (opt) => opt.value === det.buyProductBrandId
                        )}
                        placeholder="Select a Brand..."
                        isDisabled={isViewMode}
                        isLoading={brandsLoading}
                        className="w-full basic-single"
                        classNamePrefix="select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{
                          IndicatorsContainer: () => null,
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: "1px solid #d1d5db",
                            borderRadius: "0.375rem",
                            minHeight: "auto",
                            padding: "0.25rem",
                            cursor: "pointer",
                            "&:hover": {
                              borderColor: "#d1d5db",
                            },
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          menu: (base) => ({ ...base, zIndex: 9999 }),
                          dropdownIndicator: () => ({ display: "none" }),
                          indicatorSeparator: () => ({ display: "none" }),
                        }}
                      />
                    </td>

                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        name="buyQty"
                        value={det.buyQty}
                        onChange={(e) => handleDetailChange(e, index)}
                        className="border px-2 py-1 rounded w-full text-right"
                        readOnly={isViewMode}
                        disabled={isViewMode}
                        maxLength={8}
                      />
                    </td>

                    <td className="px-4 py-2 border flex items-center gap-2">
                      <Select
                        options={productOptions}
                        onChange={handleProductChange}
                        value={productOptions.find(
                          (opt) => opt.value === det.getItem.toString()
                        )}
                        placeholder="Select a Product..."
                        isDisabled={isViewMode}
                        isLoading={productsLoading}
                        className="w-full basic-single"
                        classNamePrefix="select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{
                          IndicatorsContainer: () => null,
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: "1px solid #d1d5db",
                            borderRadius: "0.375rem",
                            minHeight: "auto",
                            padding: "0.25rem",
                            cursor: "pointer",
                            "&:hover": {
                              borderColor: "#d1d5db",
                            },
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          menu: (base) => ({ ...base, zIndex: 9999 }),
                          dropdownIndicator: () => ({ display: "none" }),
                          indicatorSeparator: () => ({ display: "none" }),
                        }}
                      />
                    </td>

                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        name="getQty"
                        value={det.getQty}
                        onChange={(e) => handleDetailChange(e, index)}
                        className="border px-2 py-1 rounded w-full text-right"
                        readOnly={isViewMode}
                        disabled={isViewMode}
                        maxLength={8}
                      />
                    </td>

                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        name="limitOfUsage"
                        value={det.limitOfUsage}
                        onChange={(e) => handleDetailChange(e, index)}
                        className="border px-2 py-1 rounded w-full text-right"
                        readOnly={isViewMode}
                        disabled={isViewMode}
                        maxLength={8}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {isByValue && (
            <table className="min-w-full border border-gray-200 text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-semibold">
                <tr>
                  <th className="px-4 py-2 border">Buy Brand</th>
                  <th className="px-4 py-2 border">Buy Quantity</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Promotion Value</th>
                  <th className="px-4 py-2 border">Limit of Usage</th>
                </tr>
              </thead>
              <tbody>
                {formData.brandPromotionDet.map((det, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">
                      <Select
                        options={brandOptions}
                        onChange={handleBrandChange}
                        value={brandOptions.find(
                          (opt) => opt.value === det.buyProductBrandId
                        )}
                        placeholder="Select a Brand..."
                        isDisabled={isViewMode}
                        isLoading={brandsLoading}
                        className="w-full basic-single"
                        classNamePrefix="select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{
                          IndicatorsContainer: () => null,
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: "1px solid #d1d5db",
                            borderRadius: "0.375rem",
                            minHeight: "auto",
                            padding: "0.25rem",
                            cursor: "pointer",
                            "&:hover": {
                              borderColor: "#d1d5db",
                            },
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          menu: (base) => ({ ...base, zIndex: 9999 }),
                          dropdownIndicator: () => ({ display: "none" }),
                          indicatorSeparator: () => ({ display: "none" }),
                        }}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        name="buyQty"
                        value={det.buyQty}
                        onChange={(e) => handleDetailChange(e, index)}
                        className="w-full border rounded px-2 py-1 text-right"
                        readOnly={isViewMode}
                        disabled={isViewMode}
                        maxLength={8}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <select
                        name="promotionType"
                        value={det.promotionType}
                        onChange={(e) => handleDetailChange(e, index)}
                        className="w-full border rounded px-2 py-1"
                        disabled={isViewMode}
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        name="promotion"
                        value={det.promotion}
                        onChange={(e) => handleDetailChange(e, index)}
                        className="w-full border rounded px-2 py-1 text-right"
                        readOnly={isViewMode}
                        disabled={isViewMode}
                        maxLength={8}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        name="limitOfUsage"
                        value={det.limitOfUsage}
                        onChange={(e) => handleDetailChange(e, index)}
                        className="w-full border rounded px-2 py-1 text-right"
                        readOnly={isViewMode}
                        disabled={isViewMode}
                        maxLength={8}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="text-blue-600 pt-3 px-2">
          <button
            type="button"
            className="text-blue-600"
            onClick={() => {
              if (!isViewMode) {
                setFormData((prev) => ({
                  ...prev,
                  brandPromotionDet: [
                    ...prev.brandPromotionDet,
                    {
                      plant: formData.brandPromotionHdr.plant,
                      id: 0,
                      lnNo: prev.brandPromotionDet.length + 1,
                      hdrId: formData.brandPromotionHdr.id,
                      buyProductBrandId: "",
                      buyQty: 0,
                      getItem: "",
                      getQty: 0,
                      promotionType: "",
                      promotion: 0,
                      limitOfUsage: 0,
                      usageUsed: 0,
                      crAt: "",
                      crBy: "",
                      upAt: "",
                      upBy: "",
                    },
                  ],
                }));
              }
            }}
          >
            + Add Another Line
          </button>
        </div>

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.brandPromotionHdr.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
            maxLength={200}
            placeholder="Enter notes (max 200 chars)"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {formData.brandPromotionHdr.notes.length}/200 characters
          </div>
        </div>

        <hr className="border-gray-300 my-8" />

        <div className="flex items-center justify-start gap-3 mt-4">
          <button
            className="px-6 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white text-blue-600 hover:bg-gray-50"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          {!isViewMode && (
            <button
              className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              type="submit"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
