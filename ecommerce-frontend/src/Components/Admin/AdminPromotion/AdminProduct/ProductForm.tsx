import React, { useState } from "react";
import Select from "react-select";
import { useGetAllAdminProductsQuery } from "Services/Admin/ProductAdminApiSlice";
import { PromotionDet } from "Types/Admin/AdminProductPromotionType";
import { useGetAllLocTypesQuery } from "Services/Admin/LocTypeApiSlice";
import { useAppDispatch, useAppSelector } from "State/Hooks";

enum InternalPromotionType {
  BY_VALUE = "BY_VALUE",
  BY_QUANTITY = "BY_QUANTITY",
}

interface ProductPromotionFormProps {
  initialValues: {
    promotionHdr: {
      byValue: number;
      crAt: string;
      crBy: string;
      customerTypeId: string;
      endDate: string;
      endTime: string;
      id: number;
      isActive: string;
      notes: string;
      outlet: string;
      plant: string;
      promotionDesc: string;
      promotionName: string;
      startDate: string;
      startTime: string;
      upAt: string;
      upBy: string;
    };
    promotionDet: {
      buyItem: string;
      buyQty: number;
      crAt: string;
      crBy: string;
      getItem: string;
      getQty: number;
      hdrId: number;
      id: number;
      limitOfUsage: number;
      lnNo: number;
      plant: string;
      promotion: number;
      promotionType: string;
      upAt: string;
      upBy: string;
      usageUsed: number;
    }[];
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isViewMode?: boolean;
}

export const ProductPromotionForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isViewMode = false,
}: ProductPromotionFormProps) => {
  const [formData, setFormData] = useState(initialValues);
  const [selectedBuyProduct, setSelectedBuyProduct] = useState(null);
  const [selectedGetProduct, setSelectedGetProduct] = useState(null);
  const plant = process.env.REACT_APP_PLANT;

  const { data: locTypes = [], isLoading } = useGetAllLocTypesQuery({
    plant: plant,
  });

  const [isByValue, setIsByValue] = useState<boolean>(
    initialValues.promotionHdr.byValue === 1
  );

  const { data: productsData, isLoading: productsLoading } =
    useGetAllAdminProductsQuery({
      category: undefined,
      pageSize: 100,
      activePage: 1,
      subCategory: undefined,
      brand: undefined,
    });

  const productOptions =
    productsData?.products?.map((product) => ({
      value: product.product.item,
      // value: product.product.id.toString(),
      label: `${product.product.item} - ${product.product.itemDesc}`,
    })) || [];

  const handleBuyProductChange = (selectedOption: any, index: number) => {
    setSelectedBuyProduct(selectedOption);
    setFormData((prev) => ({
      ...prev,
      promotionDet: prev.promotionDet.map((item, i) =>
        i === index ? { ...item, buyItem: selectedOption.value } : item
      ),
    }));
  };

  const handleGetProductChange = (selectedOption: any, index: number) => {
    setSelectedGetProduct(selectedOption);
    setFormData((prev) => ({
      ...prev,
      promotionDet: prev.promotionDet.map((item, i) =>
        i === index ? { ...item, getItem: selectedOption.value } : item
      ),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("promotionHdr.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        promotionHdr: {
          ...prev.promotionHdr,
          [field]: type === "number" ? Number(value) : value,
        },
      }));
    } else if (name.startsWith("promotionDet.")) {
      const [_, index, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        promotionDet: prev.promotionDet.map((item, i) =>
          i === parseInt(index)
            ? { ...item, [field]: type === "number" ? Number(value) : value }
            : item
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleInternalPromotionType = (
    internalPromotionType: InternalPromotionType
  ) => {
    const newIsByValue =
      internalPromotionType === InternalPromotionType.BY_VALUE;
    setIsByValue(newIsByValue);
    setFormData((prev) => ({
      ...prev,
      promotionHdr: {
        ...prev.promotionHdr,
        byValue: newIsByValue ? 1 : 0,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatDateForInput = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return "";

    const [day, month, year] = dateStr.split("/");
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    return `${formattedDate}T${timeStr}:00`;
  };

  const handleDateTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "start" | "end"
  ) => {
    const value = e.target.value;
    if (!value) return;

    const [datePart, timePart] = value.split("T");
    const [year, month, day] = datePart.split("-");
    const time = timePart.substring(0, 5);

    setFormData((prev) => ({
      ...prev,
      promotionHdr: {
        ...prev.promotionHdr,
        [`${type}Date`]: `${day}/${month}/${year}`,
        [`${type}Time`]: time,
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
              name="promotionHdr.promotionName"
              value={formData.promotionHdr.promotionName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
              required
              maxLength={100}
              placeholder="Enter promotion name (max 100 chars)"
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {formData.promotionHdr.promotionName.length}/100 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Promotion Description:*
            </label>
            <textarea
              name="promotionHdr.promotionDesc"
              value={formData.promotionHdr.promotionDesc}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
              maxLength={200}
              placeholder="Enter promotion description (max 200 chars)"
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {formData.promotionHdr.promotionDesc.length}/200 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Outlet/Location:*
            </label>
            <select
              name="promotionHdr.outlet"
              value={formData.promotionHdr.outlet}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
              disabled={isViewMode || isLoading}
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
                onClick={() =>
                  handleInternalPromotionType(InternalPromotionType.BY_QUANTITY)
                }
                type="radio"
                name="type"
                className="mr-1"
                checked={formData.promotionHdr.byValue === 0}
                readOnly={isViewMode}
                disabled={isViewMode}
              />
              By Quantity
            </label>
            <label className="px-2">
              <input
                onClick={() =>
                  handleInternalPromotionType(InternalPromotionType.BY_VALUE)
                }
                type="radio"
                name="type"
                className="mr-1"
                checked={formData.promotionHdr.byValue === 1}
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
              value={formatDateForInput(
                formData.promotionHdr.startDate,
                formData.promotionHdr.startTime
              )}
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
              value={formatDateForInput(
                formData.promotionHdr.endDate,
                formData.promotionHdr.endTime
              )}
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
                name="promotionHdr.isActive"
                value="Y"
                checked={formData.promotionHdr.isActive === "Y"}
                onChange={handleChange}
                className="mr-1"
                readOnly={isViewMode}
                disabled={isViewMode}
              />
              Active
            </label>
            <label className="px-2">
              <input
                type="radio"
                name="promotionHdr.isActive"
                value="N"
                checked={formData.promotionHdr.isActive === "N"}
                onChange={handleChange}
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
                  <th className="px-4 py-2 border">Buy Product</th>
                  <th className="px-4 py-2 border">Buy Quantity</th>
                  <th className="px-4 py-2 border">Get Product</th>
                  <th className="px-4 py-2 border">Get Quantity</th>
                  <th className="px-4 py-2 border">Limit of Usage</th>
                </tr>
              </thead>
              <tbody>
                {formData.promotionDet.map((item: PromotionDet, index) => (
                  <tr key={index} className="bg-white">
                    <td className="px-4 py-2 border flex items-center gap-2">
                      <Select
                        options={productOptions}
                        onChange={(newValue) =>
                          handleBuyProductChange(newValue, index)
                        }
                        value={productOptions.find(
                          (opt) => opt.value === item.buyItem.toString()
                        )}
                        placeholder="Select a Product..."
                        isDisabled={isViewMode}
                        isLoading={productsLoading}
                        className="w-full basic-single"
                        classNamePrefix="select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorsContainer: () => null }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: "1px solid #d1d5db",
                            borderRadius: "0.375rem",
                            minHeight: "auto",
                            padding: "0.25rem",
                            cursor: "pointer",
                            "&:hover": { borderColor: "#d1d5db" },
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
                        name={`promotionDet.${index}.buyQty`}
                        value={item.buyQty}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full text-right"
                        readOnly={isViewMode}
                        disabled={isViewMode}
                        maxLength={8}
                      />
                    </td>
                    <td className="px-4 py-2 border flex items-center gap-2">
                      <Select
                        options={productOptions}
                        onChange={(newValue) =>
                          handleGetProductChange(newValue, index)
                        }
                        value={productOptions.find(
                          (opt) => opt.value === item.getItem.toString()
                        )}
                        placeholder="Select a Product..."
                        isDisabled={isViewMode}
                        isLoading={productsLoading}
                        className="w-full basic-single"
                        classNamePrefix="select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorsContainer: () => null }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: "1px solid #d1d5db",
                            borderRadius: "0.375rem",
                            minHeight: "auto",
                            padding: "0.25rem",
                            cursor: "pointer",
                            "&:hover": { borderColor: "#d1d5db" },
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
                        name={`promotionDet.${index}.getQty`}
                        value={item.getQty}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded w-full text-right"
                        readOnly={isViewMode}
                        disabled={isViewMode}
                        maxLength={8}
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="number"
                        name={`promotionDet.${index}.limitOfUsage`}
                        value={item.limitOfUsage}
                        onChange={handleChange}
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
                  <th className="px-4 py-2 border">Buy Product</th>
                  <th className="px-4 py-2 border">Buy Quantity</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Promotion Value</th>
                  <th className="px-4 py-2 border">Limit of Usage</th>
                </tr>
              </thead>
              <tbody>
                {formData.promotionDet.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">
                      <Select
                        options={productOptions}
                        onChange={(newValue) =>
                          handleBuyProductChange(newValue, index)
                        }
                        value={productOptions.find(
                          (opt) => opt.value === item.buyItem.toString()
                        )}
                        placeholder="Select a Product..."
                        isDisabled={isViewMode}
                        isLoading={productsLoading}
                        className="w-full basic-single"
                        classNamePrefix="select"
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorsContainer: () => null }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            border: "1px solid #d1d5db",
                            borderRadius: "0.375rem",
                            minHeight: "auto",
                            padding: "0.25rem",
                            cursor: "pointer",
                            "&:hover": { borderColor: "#d1d5db" },
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
                        name={`promotionDet.${index}.buyQty`}
                        value={item.buyQty}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1 text-right"
                        readOnly={isViewMode}
                        disabled={isViewMode}
                        maxLength={8}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <select
                        name={`promotionDet.${index}.promotionType`}
                        value={item.promotionType}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1"
                        disabled={isViewMode}
                      >
                        <option value="%">Percentage</option>
                        <option value="INR">Fixed Amount</option>
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        name={`promotionDet.${index}.promotion`}
                        value={item.promotion}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1 text-right"
                        readOnly={isViewMode}
                        disabled={isViewMode}
                        maxLength={8}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        name={`promotionDet.${index}.limitOfUsage`}
                        value={item.limitOfUsage}
                        onChange={handleChange}
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
            className="text-blue-600 hover:text-blue-800"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                promotionDet: [
                  ...prev.promotionDet,
                  {
                    buyItem: "",
                    buyQty: 0,
                    crAt: "",
                    crBy: "",
                    getItem: "",
                    getQty: 0,
                    hdrId: 0,
                    id: 0,
                    limitOfUsage: 0,
                    lnNo: prev.promotionDet.length + 1,
                    plant: formData.promotionHdr.plant,
                    promotion: 0,
                    promotionType: "%",
                    upAt: "",
                    upBy: "",
                    usageUsed: 0,
                  },
                ],
              }));
            }}
            disabled={isViewMode}
          >
            + Add Another Line
          </button>
        </div>

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Notes
          </label>
          <textarea
            name="promotionHdr.notes"
            value={formData.promotionHdr.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
            maxLength={200}
            placeholder="Enter notes (max 200 chars)"
          />
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
