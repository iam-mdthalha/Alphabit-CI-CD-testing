"use client";

import { notifications } from "@mantine/notifications";
import { BrandPromotionForm } from "Components/Admin/AdminPromotion/AdminBrand/BrandForm";
import { BrandPromotionTable } from "Components/Admin/AdminPromotion/AdminBrand/BrandTable";
import { Card } from "Components/Admin/StyleComponent/Card";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useAddBrandPromotionMutation,
  useDeleteBrandPromotionMutation,
  useGetAllBrandPromotionsQuery,
  useGetBrandPromotionByIdQuery,
  useUpdateBrandPromotionMutation,
} from "Services/Admin/BrandPromotionApiSlice";
import { BrandPromotionDto } from "Types/Admin/AdminBrandPromotionType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminBrand = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] =
    useState<BrandPromotionDto | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [selectAll, setSelectAll] = useState(false);

  const { data: promotionsData, refetch } = useGetAllBrandPromotionsQuery({
    plant: PLANT,
  });
  const [deleteBrandPromotion] = useDeleteBrandPromotionMutation();
  const [addBrandPromotion] = useAddBrandPromotionMutation();
  const [updateBrandPromotion] = useUpdateBrandPromotionMutation();
  const { data: singlePromotion, isFetching: isFetchingSingle } =
    useGetBrandPromotionByIdQuery(
      { id: editingPromotion?.brandPromotionHdr.id || 0, plant: PLANT },
      { skip: !editingPromotion?.brandPromotionHdr.id }
    );

  useEffect(() => {
    if (singlePromotion && editingPromotion) {
      setEditingPromotion(singlePromotion);
    }
  }, [singlePromotion]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleEdit = (promotion: BrandPromotionDto) => {
    setEditingPromotion(promotion);
    setIsViewMode(false);
    setShowForm(true);
  };

  const handleView = (promotion: BrandPromotionDto) => {
    setEditingPromotion(promotion);
    setIsViewMode(true);
    setShowForm(true);
  };

  const handleDelete = async (promotion: BrandPromotionDto) => {
    try {
      await deleteBrandPromotion({
        id: promotion.brandPromotionHdr.id,
        plant: PLANT,
      }).unwrap();

      notifications.show({
        title: "Success",
        message: "Brand promotion deleted successfully",
        color: "red",
      });

      refetch();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete brand promotion",
        color: "red",
      });
      console.error("Failed to delete promotion:", error);
    }
  };

  const handleSubmit = async (data: BrandPromotionDto) => {
    try {
      const payload = {
        brandPromotionHdr: {
          ...data.brandPromotionHdr,
          plant: PLANT,
        },
        brandPromotionDet: data.brandPromotionDet,
      };

      if (editingPromotion && !isViewMode) {
        await updateBrandPromotion(payload).unwrap();
        notifications.show({
          title: "Success",
          message: "Brand promotion updated successfully",
          color: "green",
        });
      } else if (!isViewMode) {
        await addBrandPromotion(payload).unwrap();
        notifications.show({
          title: "Success",
          message: "Brand promotion added successfully",
          color: "green",
        });
      }

      setShowForm(false);
      setEditingPromotion(null);
      refetch();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save brand promotion",
        color: "red",
      });
      console.error("Failed to save promotion:", error);
    }
  };

  const transformPromotionsToTableData = (
    promotions: BrandPromotionDto[] | undefined
  ) => {
    if (!promotions) return [];

    return promotions.map((promotion) => ({
      id: promotion.brandPromotionHdr.id,
      outlet: promotion.brandPromotionHdr.outlet,
      promotion: promotion.brandPromotionHdr.promotionName,
      promotion_description: promotion.brandPromotionHdr.promotionDesc,
      start_date_or_time: `${promotion.brandPromotionHdr.startDate} - ${promotion.brandPromotionHdr.startTime}`,
      end_date_or_time: `${promotion.brandPromotionHdr.endDate} - ${promotion.brandPromotionHdr.endTime}`,
      isActive: promotion.brandPromotionHdr.isActive,
      originalData: promotion,
    }));
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Brand Promotion"
            onAdd={() => {
              setEditingPromotion(null);
              setIsViewMode(false);
              setShowForm(true);
            }}
            addLabel="Add Brand Promotion"
          />
          <Card>
            <BrandPromotionTable
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
              setEditingPromotion(null);
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
                ? "View Brand Promotion"
                : editingPromotion
                ? "Edit Brand Promotion"
                : "Add Brand Promotion"
            }
          />
          <BrandPromotionForm
            initialValues={
              editingPromotion
                ? {
                    ...editingPromotion,
                    brandPromotionHdr: {
                      ...editingPromotion.brandPromotionHdr,
                      crAt: editingPromotion.brandPromotionHdr.crAt || "",
                      crBy: editingPromotion.brandPromotionHdr.crBy || "",
                      upAt: editingPromotion.brandPromotionHdr.upAt || "",
                      upBy: editingPromotion.brandPromotionHdr.upBy || "",
                    },
                    brandPromotionDet: editingPromotion.brandPromotionDet.map(
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
                    brandPromotionHdr: {
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
                    brandPromotionDet: [
                      {
                        buyProductBrandId: "",
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
                        promotionType: "INR",
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
              setEditingPromotion(null);
            }}
            isViewMode={isViewMode}
          />
        </>
      )}
    </div>
  );
};

export default AdminBrand;
