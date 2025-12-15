"use client";

import { notifications } from "@mantine/notifications";
import { CategoryPromotionForm } from "Components/Admin/AdminPromotion/AdminCategory/CategoryForm";
import { CategoryPromotionTable } from "Components/Admin/AdminPromotion/AdminCategory/CategoryTable";
import { Card } from "Components/Admin/StyleComponent/Card";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useAddCategoryPromotionMutation,
  useDeleteCategoryPromotionMutation,
  useGetAllCategoryPromotionsQuery,
  useGetCategoryPromotionByIdQuery,
  useUpdateCategoryPromotionMutation,
} from "Services/Admin/CategoryPromotionApiSlice";
import {
  AddCategoryPromotionPayload,
  CategoryPromotion,
} from "Types/Admin/AdminCategoryPromotionType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminPromotionCategory = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPromotionCategory, setEditingPromotionCategory] =
    useState<CategoryPromotion | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [selectAll, setSelectAll] = useState(false);

  const { data: promotionsData, refetch } = useGetAllCategoryPromotionsQuery({
    plant: PLANT,
  });
  const [deleteCategoryPromotion] = useDeleteCategoryPromotionMutation();
  const [addCategoryPromotion] = useAddCategoryPromotionMutation();
  const [updateCategoryPromotion] = useUpdateCategoryPromotionMutation();
  const { data: singlePromotion, isFetching: isFetchingSingle } =
    useGetCategoryPromotionByIdQuery(
      {
        id: editingPromotionCategory?.categoryPromotionHdr.id || 0,
        plant: PLANT,
      },
      { skip: !editingPromotionCategory?.categoryPromotionHdr.id }
    );

  useEffect(() => {
    if (singlePromotion && editingPromotionCategory) {
      setEditingPromotionCategory(singlePromotion);
    }
  }, [singlePromotion]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleEdit = (promotion: CategoryPromotion) => {
    setEditingPromotionCategory(promotion);
    setIsViewMode(false);
    setShowForm(true);
  };

  const handleView = (promotion: CategoryPromotion) => {
    setEditingPromotionCategory(promotion);
    setIsViewMode(true);
    setShowForm(true);
  };

  const handleDelete = async (promotion: CategoryPromotion) => {
    try {
      await deleteCategoryPromotion({
        id: promotion.categoryPromotionHdr.id,
        plant: PLANT,
      }).unwrap();

      notifications.show({
        title: "Success",
        message: "Category promotion deleted successfully",
        color: "red",
      });

      refetch();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete category promotion",
        color: "red",
      });
      console.error("Failed to delete promotion:", error);
    }
  };

  const handleSubmit = async (data: AddCategoryPromotionPayload) => {
    try {
      if (editingPromotionCategory && !isViewMode) {
        await updateCategoryPromotion({
          ...data,
          categoryPromotionHdr: {
            ...data.categoryPromotionHdr,
            id: editingPromotionCategory.categoryPromotionHdr.id,
          },
        }).unwrap();

        notifications.show({
          title: "Success",
          message: "Category promotion updated successfully",
          color: "green",
        });
      } else if (!isViewMode) {
        await addCategoryPromotion(data).unwrap();

        notifications.show({
          title: "Success",
          message: "Category promotion added successfully",
          color: "green",
        });
      }

      setShowForm(false);
      setEditingPromotionCategory(null);
      refetch();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save category promotion",
        color: "red",
      });
      console.error("Failed to save promotion:", error);
    }
  };

  const transformPromotionsToTableData = (
    promotions: CategoryPromotion[] | undefined
  ) => {
    if (!promotions) return [];

    return promotions.map((promotion) => ({
      id: promotion.categoryPromotionHdr.id,
      outlet: promotion.categoryPromotionHdr.outlet,
      promotion: promotion.categoryPromotionHdr.promotionName,
      promotion_description: promotion.categoryPromotionHdr.promotionDesc,
      start_date_or_time: `${promotion.categoryPromotionHdr.startDate} - ${promotion.categoryPromotionHdr.startTime}`,
      end_date_or_time: `${promotion.categoryPromotionHdr.endDate} - ${promotion.categoryPromotionHdr.endTime}`,
      isActive: promotion.categoryPromotionHdr.isActive,
      originalData: promotion,
    }));
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Category Promotion"
            onAdd={() => {
              setEditingPromotionCategory(null);
              setIsViewMode(false);
              setShowForm(true);
            }}
            addLabel="Add Category Promotion"
          />
          <Card>
            <CategoryPromotionTable
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
              setEditingPromotionCategory(null);
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
                ? "View Category Promotion"
                : editingPromotionCategory
                ? "Edit Category Promotion"
                : "Add Category Promotion"
            }
          />
          <CategoryPromotionForm
            initialValues={
              editingPromotionCategory
                ? {
                    ...editingPromotionCategory,
                    categoryPromotionHdr: {
                      ...editingPromotionCategory.categoryPromotionHdr,
                      crAt:
                        editingPromotionCategory.categoryPromotionHdr.crAt ||
                        "",
                      crBy:
                        editingPromotionCategory.categoryPromotionHdr.crBy ||
                        "",
                      upAt:
                        editingPromotionCategory.categoryPromotionHdr.upAt ||
                        "",
                      upBy:
                        editingPromotionCategory.categoryPromotionHdr.upBy ||
                        "",
                    },
                    categoryPromotionDet:
                      editingPromotionCategory.categoryPromotionDet.map(
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
                    categoryPromotionHdr: {
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
                    categoryPromotionDet: [
                      {
                        buyProductClassId: "",
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
              setEditingPromotionCategory(null);
            }}
            isViewMode={isViewMode}
          />
        </>
      )}
    </div>
  );
};

export default AdminPromotionCategory;
