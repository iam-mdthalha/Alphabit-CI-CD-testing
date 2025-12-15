"use client";

import { notifications } from "@mantine/notifications";
import { CategoryActions } from "Components/Admin/AdminProduct/AdminCategory/CategoryActions";
import { CategoryForm } from "Components/Admin/AdminProduct/AdminCategory/CategoryForm";
import { CategoryTable } from "Components/Admin/AdminProduct/AdminCategory/CategoryTable";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
  useUploadCategoryImageMutation,
} from "Services/Admin/CategoryAdminApiSlice";
import {
  CategoryAdminDTO,
  CategoryAdminRequestDTO,
} from "Types/Admin/AdminCategoryType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminCategory = () => {
  const {
    data: apiCategories,
    isLoading,
    refetch,
  } = useGetAllCategoriesQuery();
  const categories: CategoryAdminDTO[] = apiCategories || [];

  const [createCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [uploadCategoryImage] = useUploadCategoryImageMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryAdminDTO | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const [filteredCategories, setFilteredCategories] = useState<
    CategoryAdminDTO[]
  >([]);
  const [searchText, setSearchText] = useState("");

  const categoryMappingFromMstToRequest = (
    categoryMst: CategoryAdminDTO | null
  ) => {
    if (categoryMst != null) {
      return {
        categoryCode: categoryMst.categoryCode,
        categoryName: categoryMst.categoryName,
        isActive: categoryMst.isActive,
      } as CategoryAdminRequestDTO;
    } else {
      return null;
    }
  };

  useEffect(() => {
    let filtered = categories ? [...categories] : [];

    if (searchText) {
      filtered = filtered.filter((category) =>
        (category.categoryName || "")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredCategories);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredCategories(filtered);
    }
  }, [categories, searchText]);

  const handleViewCategory = async (id: number) => {
    try {
      const categoryToView = categories.find((category) => category.id === id);
      if (categoryToView) {
        setEditingCategory(categoryToView);
        setViewMode(true);
        setShowForm(true);
      }
      refetch();
    } catch (error) {
      console.error("Failed to get category details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load category details",
        color: "red",
      });
    }
  };

  const handleEditCategory = async (id: number) => {
    try {
      const categoryToEdit = categories.find((category) => category.id === id);
      if (categoryToEdit) {
        setEditingCategory(categoryToEdit);
        setViewMode(false);
        setShowForm(true);
      }
      refetch();
    } catch (error) {
      console.error("Failed to get category details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load category details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (
    data: CategoryAdminRequestDTO,
    imageFile?: File
  ) => {
    try {
      if (editingCategory) {
        const updatedData = {
          categoryCode: data.categoryCode,
          categoryName: data.categoryName,
          isActive: data.isActive,
        };

        await updateCategory({
          id: editingCategory.id,
          data: updatedData,
        }).unwrap();

        if (imageFile) {
          await uploadCategoryImage({
            id: editingCategory.id,
            image: imageFile,
          }).unwrap();
        }

        notifications.show({
          title: "Success!",
          message: "Category updated successfully",
          color: "teal",
        });
        refetch();
      } else {
        const id = await createCategory({ data }).unwrap();

        if (imageFile) {
          await uploadCategoryImage({
            id: id as number,
            image: imageFile,
          }).unwrap();
        }
        await refetch();
        notifications.show({
          title: "Success!",
          message: "Category created successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingCategory(null);
      refetch();
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });

      console.error("Failed to save category:", error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory({ id }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Category deleted successfully",
        color: "teal",
      });
      refetch();
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete category",
        color: "red",
      });
      console.error("Failed to delete category:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Categories"
            onAdd={() => setShowForm(true)}
            addLabel="Add Category"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <CategoryActions
              onSearchChange={setSearchText}
              isDeleteDisabled={!selectedCategoryId}
              onDelete={() =>
                selectedCategoryId && handleDeleteCategory(selectedCategoryId)
              }
            />
            <CategoryTable
              categories={filteredCategories}
              onSelectCategory={setSelectedCategoryId}
              onDeleteCategory={handleDeleteCategory}
              onViewCategory={handleViewCategory}
              onEditCategory={handleEditCategory}
              selectedCategory={selectedCategoryId}
              isLoading={isLoading}
            />
          </div>
        </>
      ) : (
        <>
          <button
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4"
            onClick={() => {
              setShowForm(false);
              setEditingCategory(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header
            title={
              viewMode
                ? "View Category"
                : editingCategory
                ? "Edit Category"
                : "Add Category"
            }
          />
          <CategoryForm
            initialValues={
              categoryMappingFromMstToRequest(editingCategory) || {
                categoryCode: "",
                categoryName: "",
                isActive: "Y",
              }
            }
            existingImage={editingCategory?.image}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingCategory(null);
            }}
            mode={viewMode ? "view" : editingCategory ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminCategory;
