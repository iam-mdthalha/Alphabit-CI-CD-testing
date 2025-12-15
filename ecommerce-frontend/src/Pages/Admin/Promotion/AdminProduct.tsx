"use client";

import { notifications } from "@mantine/notifications";
import { ProductPromotionForm } from "Components/Admin/AdminPromotion/AdminProduct/ProductForm";
import { ProductPromotionTable } from "Components/Admin/AdminPromotion/AdminProduct/ProductTable";
import { Card } from "Components/Admin/StyleComponent/Card";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useAddProductPromotionMutation,
  useDeleteProductPromotionMutation,
  useGetAllProductPromotionsQuery,
  useGetProductPromotionByIdQuery,
  useUpdateProductPromotionMutation,
} from "Services/Admin/ProductPromotionApiSlice";
import {
  AddProductPromotionPayload,
  ProductPromotion,
} from "Types/Admin/AdminProductPromotionType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminPromotionProduct = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPromotionProduct, setEditingPromotionProduct] =
    useState<ProductPromotion | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [selectAll, setSelectAll] = useState(false);

  const { data: promotionsData, refetch } = useGetAllProductPromotionsQuery({
    plant: PLANT,
  });
  const [deleteProductPromotion] = useDeleteProductPromotionMutation();
  const [addProductPromotion] = useAddProductPromotionMutation();
  const [updateProductPromotion] = useUpdateProductPromotionMutation();
  const { data: singlePromotion, isFetching: isFetchingSingle } =
    useGetProductPromotionByIdQuery(
      { id: editingPromotionProduct?.promotionHdr.id || 0, plant: PLANT },
      { skip: !editingPromotionProduct?.promotionHdr.id }
    );

  useEffect(() => {
    if (singlePromotion && editingPromotionProduct) {
      setEditingPromotionProduct(singlePromotion);
    }
  }, [singlePromotion]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleEdit = (promotion: ProductPromotion) => {
    setEditingPromotionProduct(promotion);
    setIsViewMode(false);
    setShowForm(true);
  };

  const handleView = (promotion: ProductPromotion) => {
    setEditingPromotionProduct(promotion);
    setIsViewMode(true);
    setShowForm(true);
  };

  const handleDelete = async (promotion: ProductPromotion) => {
    try {
      await deleteProductPromotion({
        id: promotion.promotionHdr.id,
        plant: PLANT,
      }).unwrap();

      notifications.show({
        title: "Success",
        message: "Product promotion deleted successfully",
        color: "red",
      });

      refetch();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete product promotion",
        color: "red",
      });
      console.error("Failed to delete promotion:", error);
    }
  };

  const handleSubmit = async (data: AddProductPromotionPayload) => {
    try {
      if (editingPromotionProduct && !isViewMode) {
        await updateProductPromotion({
          ...data,
          promotionHdr: {
            ...data.promotionHdr,
            id: editingPromotionProduct.promotionHdr.id,
          },
        }).unwrap();

        notifications.show({
          title: "Success",
          message: "Product promotion updated successfully",
          color: "green",
        });
      } else if (!isViewMode) {
        await addProductPromotion(data).unwrap();

        notifications.show({
          title: "Success",
          message: "Product promotion added successfully",
          color: "green",
        });
      }

      setShowForm(false);
      setEditingPromotionProduct(null);
      refetch();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save product promotion",
        color: "red",
      });
      console.error("Failed to save promotion:", error);
    }
  };

  const transformPromotionsToTableData = (
    promotions: ProductPromotion[] | undefined
  ) => {
    if (!promotions) return [];

    return promotions.map((promotion) => ({
      id: promotion.promotionHdr.id,
      outlet: promotion.promotionHdr.outlet,
      promotion: promotion.promotionHdr.promotionName,
      promotion_description: promotion.promotionHdr.promotionDesc,
      start_date_or_time: `${promotion.promotionHdr.startDate} - ${promotion.promotionHdr.startTime}`,
      end_date_or_time: `${promotion.promotionHdr.endDate} - ${promotion.promotionHdr.endTime}`,
      isActive: promotion.promotionHdr.isActive,
      originalData: promotion,
    }));
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Product Promotion"
            onAdd={() => {
              setEditingPromotionProduct(null);
              setIsViewMode(false);
              setShowForm(true);
            }}
            addLabel="Add Product Promotion"
          />
          <Card>
            <ProductPromotionTable
              promotions={transformPromotionsToTableData(promotionsData)}
              onEdit={(promotion) => handleEdit(promotion.originalData)}
              onView={(promotion) => handleView(promotion.originalData)}
              onDelete={(promotion) => handleDelete(promotion.originalData)}
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </Card>
        </>
      ) : (
        <>
          <button
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4"
            onClick={() => {
              setShowForm(false);
              setEditingPromotionProduct(null);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left-icon lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
          <Header
            title={
              isViewMode
                ? "View Product Promotion"
                : editingPromotionProduct
                ? "Edit Product Promotion"
                : "Add Product Promotion"
            }
          />
          <ProductPromotionForm
            initialValues={
              editingPromotionProduct
                ? {
                    ...editingPromotionProduct,
                    promotionHdr: {
                      ...editingPromotionProduct.promotionHdr,
                      crAt: editingPromotionProduct.promotionHdr.crAt || "",
                      crBy: editingPromotionProduct.promotionHdr.crBy || "",
                      upAt: editingPromotionProduct.promotionHdr.upAt || "",
                      upBy: editingPromotionProduct.promotionHdr.upBy || "",
                    },
                    promotionDet: editingPromotionProduct.promotionDet.map(
                      (det) => ({
                        ...det,
                        crAt: det.crAt || "",
                        crBy: det.crBy || "",
                        upAt: det.upAt || "",
                        upBy: det.upBy || "",
                        usageUsed: det.usageUsed || 0,
                      })
                    ),
                  }
                : {
                    promotionHdr: {
                      byValue: 0,
                      crAt: "",
                      crBy: "",
                      customerTypeId: "",
                      endDate: "",
                      endTime: "",
                      id: 0,
                      isActive: "Y",
                      notes: "",
                      outlet: "",
                      plant: PLANT,
                      promotionDesc: "",
                      promotionName: "",
                      startDate: "",
                      startTime: "",
                      upAt: "",
                      upBy: "",
                    },
                    promotionDet: [
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
                        lnNo: 1,
                        plant: PLANT,
                        promotion: 0,
                        promotionType: "%",
                        upAt: "",
                        upBy: "",
                        usageUsed: 0,
                      },
                    ],
                  }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingPromotionProduct(null);
            }}
            isViewMode={isViewMode}
          />
        </>
      )}
    </div>
  );
};

export default AdminPromotionProduct;
