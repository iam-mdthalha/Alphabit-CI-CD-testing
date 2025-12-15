import { zodResolver } from "@hookform/resolvers/zod";
import { IconTrash } from "@tabler/icons-react";
import Toggle from "Components/Admin/AdminSettings/Notification/Toggle";
import { useGetLoyaltyConfigQuery, useSaveLoyaltyConfigMutation } from "features/admin/admin.api";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import { useGetAllAdminProductsQuery } from "Services/Admin/ProductAdminApiSlice";
import { useAppSelector } from "State/Hooks";
import z from "zod";

const loyaltyByPricesSchema = z
  .object({
    price: z.number().optional(),
    points: z.number().optional(),
    fromDate: z.date().optional(),
    toDate: z.date().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.fromDate && val.toDate && val.toDate < val.fromDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toDate"],
        message: "To date cannot be before From date",
      });
    }
  });

const loyaltyByProductsSchema = z
  .object({
    item: z.string().optional(),
    points: z.number().optional(),
    fromDate: z.date().optional(),
    toDate: z.date().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.fromDate && val.toDate && val.toDate < val.fromDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["toDate"],
        message: "To date cannot be before From date",
      });
    }
  });

export const loyaltyPointsSchema = z
  .object({
    title: z
      .string()
      .min(1, { message: "Title is required" })
      .max(100, { message: "Title cannot exceed 100 characters" }),
    description: z.string().optional(),

    byPriceEnabled: z.boolean(),
    byPriceScheduled: z.boolean(),
    loyaltyByPrices: z
      .array(loyaltyByPricesSchema)
      .superRefine((arr, ctx) => {
        // prevent overlapping ranges
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            const a = arr[i];
            const b = arr[j];
            if (a.fromDate && a.toDate && b.fromDate && b.toDate) {
              const overlap = a.fromDate <= b.toDate && b.fromDate <= a.toDate;
              if (overlap) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: [j],
                  message: `Date range at row ${j + 1} overlaps with row ${
                    i + 1
                  }`,
                });
              }
            }
          }
        }
      })
      .optional(),

    byProductEnabled: z.boolean(),
    byProductScheduled: z.boolean(),
    loyaltyByProducts: z
      .array(loyaltyByProductsSchema)
      .superRefine((arr, ctx) => {
        // prevent overlapping ranges for same product
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            const a = arr[i];
            const b = arr[j];
            if (
              a.item === b.item &&
              a.fromDate &&
              a.toDate &&
              b.fromDate &&
              b.toDate
            ) {
              const overlap = a.fromDate <= b.toDate && b.fromDate <= a.toDate;
              if (overlap) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: [j],
                  message: `Date range for product "${a.item}" at row ${
                    j + 1
                  } overlaps with row ${i + 1}`,
                });
              }
            }
          }
        }
      })
      .optional(),

    redeemPoints: z
      .number()
      .min(1, { message: "Redeem Points value should be minimum 1" }),
    redeemPrice: z
      .number()
      .min(1, { message: "Redeem Price value should be minimum 1" }),
    returnPoints: z
      .number()
      .min(1, { message: "Return Points value should be minimum 1" }),
    returnPrice: z
      .number()
      .min(1, { message: "Return Price value should be minimum 1" }),
    pointsUponRegister: z.boolean(),
    uponRegisterPoints: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    // ✅ Rule 1: byPriceEnabled → loyaltyByPrices required
    if (data.byPriceEnabled) {
      if (!data.loyaltyByPrices || data.loyaltyByPrices.length === 0) {
        ctx.addIssue({
          path: ["loyaltyByPrices"],
          code: "custom",
          message: "Loyalty By Prices is required when By Price is enabled",
        });
      }
    }

    // ✅ Rule 2: byPriceScheduled → fromDate & toDate required
    if (data.byPriceScheduled && data.loyaltyByPrices) {
      data.loyaltyByPrices.forEach((row, idx) => {
        if (!row.fromDate || !row.toDate) {
          ctx.addIssue({
            path: ["loyaltyByPrices", idx],
            code: "custom",
            message:
              "From Date and To Date are required when By Price scheduling is enabled",
          });
        }
      });
    }

    // ✅ Rule: byPriceEnabled → price + points required
    if (data.byPriceEnabled && data.loyaltyByPrices) {
      data.loyaltyByPrices.forEach((row, idx) => {
        if (!(row.price ?? 0 > 0)) {
          ctx.addIssue({
            path: ["loyaltyByPrices", idx, "price"],
            code: "custom",
            message: "Price value should be minimum 1",
          });
        }
        if (!row.points || row.points < 1) {
          ctx.addIssue({
            path: ["loyaltyByPrices", idx, "points"],
            code: "custom",
            message: "Points value should be minimum 1",
          });
        }
      });
    }

    // ✅ Rule 3: byProductEnabled → loyaltyByProducts required
    if (data.byProductEnabled) {
      if (!data.loyaltyByProducts || data.loyaltyByProducts.length === 0) {
        ctx.addIssue({
          path: ["loyaltyByProducts"],
          code: "custom",
          message: "Loyalty By Products is required when By Product is enabled",
        });
      }
    }

    // ✅ Rule 4: byProductScheduled → fromDate & toDate required
    if (data.byProductScheduled && data.loyaltyByProducts) {
      data.loyaltyByProducts.forEach((row, idx) => {
        if (!row.fromDate || !row.toDate) {
          ctx.addIssue({
            path: ["loyaltyByProducts", idx],
            code: "custom",
            message:
              "From Date and To Date are required when By Product scheduling is enabled",
          });
        }
      });
    }

    // ✅ Rule: byProductEnabled → item + points required
    if (data.byProductEnabled && data.loyaltyByProducts) {
      data.loyaltyByProducts.forEach((row, idx) => {
        if (!row.item || row.item.trim() === "") {
          ctx.addIssue({
            path: ["loyaltyByProducts", idx, "item"],
            code: "custom",
            message: "Product is required when By Product is enabled",
          });
        }
        if (!row.points || row.points < 1) {
          ctx.addIssue({
            path: ["loyaltyByProducts", idx, "points"],
            code: "custom",
            message:
              "Points value should be minimum 1 when By Product is enabled",
          });
        }
      });
    }
  });

type LoyaltyPointsForm = z.infer<typeof loyaltyPointsSchema>;

const AdminLoyaltyPoints = () => {
  const { config, hasChanges } = useAppSelector(
    (state: any) => state.configuration
  );

  const [byPrice, setByPrice] = useState<{
    enabled: boolean;
    scheduled: boolean;
  }>({ enabled: false, scheduled: false });
  const [byProduct, setByProduct] = useState<{
    enabled: boolean;
    scheduled: boolean;
  }>({ enabled: false, scheduled: false });

  const { data: productsData, isLoading: productsLoading } =
    useGetAllAdminProductsQuery({
      category: undefined,
      pageSize: 100,
      activePage: 1,
      subCategory: undefined,
      brand: undefined,
    });

  const [saveLoyaltyConfig, { isLoading: saveLoyaltyConfigLoading }] = useSaveLoyaltyConfigMutation();

  const { data: loyaltyConfigData, isLoading: loyaltyConfigLoading, isFetching: loyaltyConfigFetching } = useGetLoyaltyConfigQuery();


  const productOptions =
    productsData?.products?.map((product) => ({
      value: product.product.item,
      // value: product.product.id.toString(),
      label: `${product.product.item} - ${product.product.itemDesc}`,
    })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<LoyaltyPointsForm>({
    resolver: zodResolver(loyaltyPointsSchema),
    defaultValues: {
      title: "",
      description: "",
      byPriceEnabled: false,
      byPriceScheduled: false,
      loyaltyByPrices: [{ price: 0, points: 0 }],
      byProductEnabled: false,
      byProductScheduled: false,
      loyaltyByProducts: [{ item: "", points: 0 }],
      redeemPoints: 1,
      redeemPrice: 1,
      returnPoints: 1,
      returnPrice: 1,
      pointsUponRegister: false,
      uponRegisterPoints: 0
    },
  });

  const {
    fields: byPriceFields,
    append: addByPriceRow,
    remove: removeByPriceRow,
  } = useFieldArray({ control, name: "loyaltyByPrices" });

  const {
    fields: byProductFields,
    append: addByProductRow,
    remove: removeByProductRow,
  } = useFieldArray({ control, name: "loyaltyByProducts" });

  
  useEffect(() => {
    if(loyaltyConfigData) {
      console.log(loyaltyConfigData);

      const parsedLoyaltyByPrices = loyaltyConfigData.results.loyaltyByPrices?.map((item: any) => ({
      ...item,
      fromDate: item.fromDate ? new Date(item.fromDate) : undefined,
      toDate: item.toDate ? new Date(item.toDate) : undefined,
    })) ?? [];

    const parsedLoyaltyByProducts = loyaltyConfigData.results.loyaltyByProducts?.map((item: any) => ({
      ...item,
      fromDate: item.fromDate ? new Date(item.fromDate) : undefined,
      toDate: item.toDate ? new Date(item.toDate) : undefined,
    })) ?? [];

      setValue("title", loyaltyConfigData.results.title);
      setValue("description", loyaltyConfigData.results.description);
      setValue("byPriceEnabled", loyaltyConfigData.results.byPriceEnabled);
      if(loyaltyConfigData.results.byPriceEnabled) {
        setByPrice((prev) => ({
          ...prev, enabled: true
        }));
      }
      setValue("byProductEnabled", loyaltyConfigData.results.byProductEnabled);
      if(loyaltyConfigData.results.byProductEnabled) {
        setByProduct((prev) => ({
          ...prev, enabled: true
        }));
      }
      setValue("byPriceScheduled", loyaltyConfigData.results.byPriceScheduled);
      if(loyaltyConfigData.results.byPriceScheduled) {
        setByPrice((prev) => ({
          ...prev, scheduled: true
        }));
      }
      setValue("byProductScheduled", loyaltyConfigData.results.byProductScheduled);
      if(loyaltyConfigData.results.byProductScheduled) {
        setByProduct((prev) => ({
          ...prev, scheduled: true
        }));
      }
      setValue("redeemPoints", loyaltyConfigData.results.redeemPoints);
      setValue("redeemPrice", loyaltyConfigData.results.redeemPrice);
      setValue("returnPoints", loyaltyConfigData.results.returnPoints);
      setValue("returnPrice", loyaltyConfigData.results.returnPrice);
      setValue("pointsUponRegister", loyaltyConfigData.results.pointsUponRegister);
      setValue("uponRegisterPoints", loyaltyConfigData.results.uponRegisterPoints);
      setValue("loyaltyByPrices", parsedLoyaltyByPrices);
      setValue("loyaltyByProducts", parsedLoyaltyByProducts);
    }
  }, [loyaltyConfigData]);

  useEffect(() => {
    if (config?.loyaltyPoints) {
      reset(config.loyaltyPoints);
    }
  }, [config, reset]);

  const onSubmit = async (data: LoyaltyPointsForm) => {
    try {
      // await api.saveLoyaltyPoints(data);
      const response = await saveLoyaltyConfig({data: data}).unwrap();
    } catch (err) {
      console.error("Error saving loyalty points:", err);
    }
  };
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Loyalty Points</h1>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white rounded-md bg-blue-600 hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </header>

      <div className="mt-6 bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-medium">Basic Details</h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your loyalty points information
              </p>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className="w-full px-3 py-2 border rounded-md text-xs"
                    placeholder="Enter title"
                  />
                  <p className="text-xs text-red-500">
                    {errors.title?.message}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter Description"
                    {...register("description")}
                    // value={formData.productDescription || ""}
                    // onChange={handleDescriptionChange}
                    className="w-full px-3 py-2 border rounded-md text-sm h-32"
                    // readOnly={mode === "view"}
                    maxLength={100}
                  />
                  <p className="text-xs text-red-500">
                    {errors.description?.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-sm font-medium">By Price</h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Set Loyalty Points by Price
                  </p>
                </div>
                <div>
                  <Controller
                    name="byPriceEnabled"
                    control={control}
                    render={({ field }) => (
                      <Toggle
                        enabled={field.value}
                        onChange={(value) => {
                          setByPrice((prev) => ({ ...prev, enabled: value }));
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              {byPrice.enabled ? (
                <div>
                  <div className="flex items-center my-6">
                    <Controller
                      name="byPriceScheduled"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={() => {
                            setByPrice((prev) => ({
                              ...prev,
                              scheduled: !prev.scheduled,
                            }));
                            field.onChange(!field.value);
                          }}
                          className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                      )}
                    />

                    <label
                      htmlFor="byPriceScheduled"
                      className="ml-2 block text-xs text-gray-700"
                    >
                      Scheduled
                    </label>
                  </div>

                  {!byPrice.scheduled ? (
                    <table className="min-w-full border border-gray-200 text-sm text-left">
                      <thead className="bg-gray-100 text-gray-600 font-semibold">
                        <tr>
                          <th className="px-4 py-2 border">Price</th>
                          <th className="px-4 py-2 border">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byPriceFields.map((field, idx) => (
                          <tr key={field.id} className="bg-white">
                            <td className="px-4 py-2 border">
                              <input
                                type="number"
                                {...register(`loyaltyByPrices.${idx}.price`, {
                                  valueAsNumber: true,
                                })}
                                className="border px-2 py-1 rounded w-full text-left"
                                placeholder="Enter Price"
                                maxLength={8}
                              />
                            </td>
                            <td className="px-4 py-2 border">
                              <input
                                type="number"
                                {...register(`loyaltyByPrices.${idx}.points`, {
                                  valueAsNumber: true,
                                })}
                                className="border px-2 py-1 rounded w-full text-left"
                                placeholder="Enter Points"
                                maxLength={8}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="min-w-full border border-gray-200 text-sm text-left">
                      <thead className="bg-gray-100 text-gray-600 font-semibold">
                        <tr>
                          <th className="px-4 py-2 border">Price</th>
                          <th className="px-4 py-2 border">Points</th>
                          <th className="px-4 py-2 border">From Date</th>
                          <th className="px-4 py-2 border">To Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byPriceFields.map((field, idx) => (
                          <tr key={field.id} className="bg-white">
                            <td className="px-4 py-2 border">
                              <input
                                type="number"
                                {...register(`loyaltyByPrices.${idx}.price`, {
                                  valueAsNumber: true,
                                })}
                                className="border px-2 py-1 rounded w-full text-left"
                                placeholder="Enter Price"
                                maxLength={8}
                              />
                            </td>
                            <td className="px-4 py-2 border">
                              <input
                                type="number"
                                {...register(`loyaltyByPrices.${idx}.points`, {
                                  valueAsNumber: true,
                                })}
                                className="border px-2 py-1 rounded w-full text-left"
                                placeholder="Enter Points"
                                maxLength={8}
                              />
                            </td>
                            <td className="px-4 py-2 border">
                              <input
                                type="date"
                                {...register(
                                  `loyaltyByPrices.${idx}.fromDate`,
                                  { valueAsDate: true }
                                )}
                                min={
                                  idx > 0 ? watch(`loyaltyByPrices.${idx - 1}.toDate`)?.toISOString()
                                    .split("T")[0] : undefined
                                }
                                className="w-full px-3 py-2 border rounded-md text-xs"
                                placeholder="Select From Date"
                              />
                            </td>
                            <td className="px-4 py-2 border">
                              <input
                                type="date"
                                {...register(`loyaltyByPrices.${idx}.toDate`, {
                                  valueAsDate: true,
                                })}
                                min={
                                  watch(`loyaltyByPrices.${idx}.fromDate`)
                                    ?.toISOString()
                                    .split("T")[0] || undefined
                                }
                                className="w-full px-3 py-2 border rounded-md text-xs"
                                placeholder="Select To Date"
                              />
                            </td>
                            {idx > 0 ? (
                              <td className="px-4 py-2 border">
                                <button
                                  type="button"
                                  onClick={() => removeByPriceRow(idx)}
                                  className="text-red-500 text-xs"
                                >
                                  <IconTrash />
                                </button>
                              </td>
                            ) : (
                              <></>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {Array.isArray(errors.loyaltyByPrices) &&
                    errors.loyaltyByPrices?.map((err, index) => (
                      <div key={index} className="text-xs text-red-500">
                        {err?.price?.message && (
                          <p>Price: {err.price.message}</p>
                        )}
                        {err?.points?.message && (
                          <p>Points: {err.points.message}</p>
                        )}
                        {err?.fromDate?.message && (
                          <p>From Date: {err.fromDate.message}</p>
                        )}
                        {err?.toDate?.message && (
                          <p>To Date: {err.toDate.message}</p>
                        )}
                        {err?.message && <p>{err.message}</p>}
                      </div>
                    ))}
                  {byPrice.scheduled ? (
                    <div className="text-blue-600 pt-3 px-2">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          addByPriceRow({ price: 0, points: 0 });
                        }}
                        // disabled={isViewMode}
                      >
                        + Add Another Line
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-sm font-medium">By Product</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Set Loyalty Points by product
                  </p>
                </div>
                <div>
                  <Controller
                    name="byProductEnabled"
                    control={control}
                    render={({ field }) => (
                      <Toggle
                        enabled={field.value}
                        onChange={(value) => {
                          setByProduct((prev) => ({ ...prev, enabled: value }));
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              {byProduct.enabled ? (
                <div>
                  <div className="flex items-center my-6">
                    <Controller
                      name="byProductScheduled"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="byProductScheduled"
                          type="checkbox"
                          checked={field.value}
                          onChange={() => {
                            setByProduct((prev) => ({
                              ...prev,
                              scheduled: !prev.scheduled,
                            }));
                            field.onChange(!field.value);
                          }}
                          className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                      )}
                    />

                    <label
                      htmlFor="byProductScheduled"
                      className="ml-2 block text-xs text-gray-700"
                    >
                      Scheduled
                    </label>
                  </div>
                  {!byProduct.scheduled ? (
                    <table className="min-w-full border border-gray-200 text-sm text-left">
                      <thead className="bg-gray-100 text-gray-600 font-semibold">
                        <tr>
                          <th className="px-4 py-2 border">Product</th>
                          <th className="px-4 py-2 border">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byProductFields.map((field, idx) => (
                          <tr key={field.id} className="bg-white">
                            <td className="px-4 py-2 border">
                              <Controller
                                name={`loyaltyByProducts.${idx}.item`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    options={productOptions}
                                    onChange={(newValue) =>
                                      field.onChange(newValue!.value)
                                    }
                                    value={
                                      productOptions.find(
                                        (o) => o.value === field.value
                                      ) || null
                                    }
                                    placeholder="Select a Product..."
                                    // isDisabled={isViewMode}
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
                                        "&:hover": { borderColor: "#d1d5db" },
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      dropdownIndicator: () => ({
                                        display: "none",
                                      }),
                                      indicatorSeparator: () => ({
                                        display: "none",
                                      }),
                                    }}
                                  />
                                )}
                              />
                            </td>
                            <td className="px-4 py-2 border">
                              <input
                                type="number"
                                {...register(
                                  `loyaltyByProducts.${idx}.points`,
                                  { valueAsNumber: true }
                                )}
                                className="border px-2 py-1 rounded w-full text-left"
                                placeholder="Enter Points"
                                maxLength={8}
                              />
                            </td>
                            {idx > 0 ? (
                              <td className="px-4 py-2 border">
                                <button
                                  type="button"
                                  onClick={() => removeByProductRow(idx)}
                                  className="text-red-500 text-xs"
                                >
                                  <IconTrash />
                                </button>
                              </td>
                            ) : (
                              <></>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="min-w-full border border-gray-200 text-sm text-left">
                      <thead className="bg-gray-100 text-gray-600 font-semibold">
                        <tr>
                          <th className="px-4 py-2 border">Product</th>
                          <th className="px-4 py-2 border">Points</th>
                          <th className="px-4 py-2 border">From Date</th>
                          <th className="px-4 py-2 border">To Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byProductFields.map((field, idx) => (
                          <tr className="bg-white">
                            <td className="px-4 py-2 border">
                              <Controller
                                name={`loyaltyByProducts.${idx}.item`}
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    options={productOptions}
                                    onChange={(newValue) =>
                                      field.onChange(newValue!.value)
                                    }
                                    value={
                                      productOptions.find(
                                        (o) => o.value === field.value
                                      ) || null
                                    }
                                    placeholder="Select a Product..."
                                    // isDisabled={isViewMode}
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
                                        "&:hover": { borderColor: "#d1d5db" },
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      dropdownIndicator: () => ({
                                        display: "none",
                                      }),
                                      indicatorSeparator: () => ({
                                        display: "none",
                                      }),
                                    }}
                                  />
                                )}
                              />
                            </td>
                            <td className="px-4 py-2 border">
                              <input
                                type="number"
                                {...register(
                                  `loyaltyByProducts.${idx}.points`,
                                  { valueAsNumber: true }
                                )}
                                className="border px-2 py-1 rounded w-full text-left"
                                placeholder="Enter Points"
                                maxLength={8}
                              />
                            </td>
                            <td className="px-4 py-2 border">
                              <input
                                type="date"
                                {...register(
                                  `loyaltyByProducts.${idx}.fromDate`,
                                  {
                                    valueAsDate: true,
                                  }
                                )}
                                min={
                                  idx > 0 ? watch(`loyaltyByProducts.${idx - 1}.toDate`)?.toISOString()
                                    .split("T")[0] : undefined
                                }
                                className="w-full px-3 py-2 border rounded-md text-xs"
                                placeholder="Select From Date"
                              />
                            </td>
                            <td className="px-4 py-2 border">
                              <input
                                type="date"
                                {...register(
                                  `loyaltyByProducts.${idx}.toDate`,
                                  {
                                    valueAsDate: true,
                                  }
                                )}
                                min={
                                  watch(`loyaltyByProducts.${idx}.toDate`)
                                    ?.toISOString()
                                    .split("T")[0] || undefined
                                }
                                className="w-full px-3 py-2 border rounded-md text-xs"
                                placeholder="Select To Date"
                              />
                            </td>
                            {idx > 0 ? (
                              <td className="px-4 py-2 border">
                                <button
                                  type="button"
                                  onClick={() => removeByProductRow(idx)}
                                  className="text-red-500 text-xs"
                                >
                                  <IconTrash />
                                </button>
                              </td>
                            ) : (
                              <></>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}{" "}
                  {Array.isArray(errors.loyaltyByProducts) &&
                    errors.loyaltyByProducts?.map((err, index) => (
                      <div key={index} className="text-xs text-red-500">
                        {err?.item?.message && <p>Item: {err.item.message}</p>}
                        {err?.points?.message && (
                          <p>Points: {err.points.message}</p>
                        )}
                        {err?.fromDate?.message && (
                          <p>From Date: {err.fromDate.message}</p>
                        )}
                        {err?.toDate?.message && (
                          <p>To Date: {err.toDate.message}</p>
                        )}
                        {err?.message && <p>{err.message}</p>}
                      </div>
                    ))}
                  <div className="text-blue-600 pt-3 px-2">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        addByProductRow({ item: "", points: 0 });
                      }}
                      // disabled={isViewMode}
                    >
                      + Add Another Line
                    </button>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-sm font-medium">Redeem</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Set Price for the Redeem Points
                  </p>
                </div>
              </div>

              <div className="my-3">
                <table className="min-w-full border border-gray-200 text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 font-semibold">
                    <tr>
                      <th className="px-4 py-2 border">Points</th>
                      <th className="px-4 py-2 border">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-4 py-2 border">
                        <input
                          type="number"
                          {...register("redeemPoints", { valueAsNumber: true })}
                          className="border px-2 py-1 rounded w-full text-left"
                          placeholder="Enter Points"
                          maxLength={8}
                        />
                        <p className="text-xs text-red-500">
                          {errors.redeemPoints?.message}
                        </p>
                      </td>
                      <td className="px-4 py-2 border">
                        <input
                          type="number"
                          {...register("redeemPrice", { valueAsNumber: true })}
                          className="border px-2 py-1 rounded w-full text-left"
                          placeholder="Enter Price"
                          maxLength={8}
                        />
                        <p className="text-xs text-red-500">
                          {errors.redeemPrice?.message}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-sm font-medium">Return</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Set Price for the Return Points
                  </p>
                </div>
              </div>

              <div className="my-3">
                <table className="min-w-full border border-gray-200 text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 font-semibold">
                    <tr>
                      <th className="px-4 py-2 border">Points</th>
                      <th className="px-4 py-2 border">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-4 py-2 border">
                        <input
                          type="number"
                          {...register("returnPoints", { valueAsNumber: true })}
                          className="border px-2 py-1 rounded w-full text-left"
                          placeholder="Enter Points"
                          maxLength={8}
                        />
                        <p className="text-xs text-red-500">
                          {errors.returnPoints?.message}
                        </p>
                      </td>
                      <td className="px-4 py-2 border">
                        <input
                          type="number"
                          {...register("returnPrice", { valueAsNumber: true })}
                          className="border px-2 py-1 rounded w-full text-left"
                          placeholder="Enter Price"
                          maxLength={8}
                        />
                        <p className="text-xs text-red-500">
                          {errors.returnPrice?.message}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-sm font-medium">General Configuration</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Set Points for Customer Behavior
                  </p>
                </div>
              </div>

              <div className="my-3">
                <table className="min-w-full border border-gray-200 text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 font-semibold">
                    <tr>
                      <th className="px-4 py-2 border">Toggle</th>
                      <th className="px-4 py-2 border">Behavior</th>
                      <th className="px-4 py-2 border">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-4 py-2 border">
                        <div className="flex items-center justify-center my-6">
                          <Controller
                            name="pointsUponRegister"
                            control={control}
                            render={({ field }) => (
                              <input
                                id="pointsUponRegister"
                                type="checkbox"
                                checked={field.value}
                                onChange={() => {
                                  field.onChange(!field.value);
                                }}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                            )}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 border">
                       
                        <p className="text-xs text-gray-900">
                          Points Upon Customer Registration
                        </p>
                      </td>
                      <td className="px-4 py-2 border">
                        <input
                          type="number"
                          {...register("uponRegisterPoints", { valueAsNumber: true })}
                          className="border px-2 py-1 rounded w-full text-left"
                          placeholder="Enter Points"
                          maxLength={8}
                        />
                        <p className="text-xs text-red-500">
                          {errors.uponRegisterPoints?.message}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdminLoyaltyPoints;
