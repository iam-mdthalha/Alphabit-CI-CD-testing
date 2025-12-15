"use client";

import { notifications } from "@mantine/notifications";
import { SubCategoryActions } from "Components/Admin/AdminProduct/AdminSubcategory/SubCategoryActions";
import { SubCategoryForm } from "Components/Admin/AdminProduct/AdminSubcategory/SubcategoryForm";
import { SubCategoryTable } from "Components/Admin/AdminProduct/AdminSubcategory/SubCategoryTable";
// import { SubCategoryActions } from "Components/Admin/AdminProduct/AdminSubcategory/SubCategoryActions";
// import { SubCategoryForm } from "Components/Admin/AdminProduct/AdminSubcategory/SubcategoryForm";
// import { SubCategoryTable } from "Components/Admin/AdminProduct/AdminSubcategory/SubCategoryTable";


import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useAddSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetAllSubCategoriesQuery,
  useUpdateSubCategoryMutation,
} from "Services/Admin/SubCategoryApiSlice";
import {
  SubCategoryAdminDTO,
  SubCategoryAdminRequestDTO,
} from "Types/Admin/AdminSubCategoryType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminSubCategory = () => {
  const { data: apiSubCategories = [], isLoading } =
    useGetAllSubCategoriesQuery();

  const subCategories: SubCategoryAdminRequestDTO[] = apiSubCategories.map(
    (c: SubCategoryAdminDTO) =>
      ({
        isActive: c.isActive,
        subCategoryName: c.subCategoryName,
        subCategoryCode: c.subCategoryCode,
      } as SubCategoryAdminRequestDTO)
  );

  const [addSubCategory] = useAddSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategoryAdminDTO | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    string | null
  >(null);

  const [filteredSubCategories, setFilteredSubCategories] = useState<
    SubCategoryAdminDTO[]
  >([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = subCategories ? [...subCategories] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((subCategory) => subCategory.isActive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((subCategory) => subCategory.isActive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((subCategory) =>
        subCategory.subCategoryName
          .trim()
          .toLowerCase()
          .includes(searchText.trim().toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredSubCategories);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredSubCategories(filtered);
    }
  }, [subCategories, filterOption, searchText]);

  const handleViewSubCategory = async (id: string) => {
    try {
      const subCategoryToEdit = subCategories.find(
        (subCategory) => subCategory.subCategoryCode === id
      );

      if (subCategoryToEdit) {
        setEditingSubCategory(subCategoryToEdit);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get subCategory details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load subCategory details",
        color: "red",
      });
    }
  };

  const handleEditSubCategory = async (id: string) => {
    try {
      const subCategoryToEdit = subCategories.find(
        (subCategory) => subCategory.subCategoryCode === id
      );

      if (subCategoryToEdit) {
        setEditingSubCategory(subCategoryToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get subCategory details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load subCategory details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: SubCategoryAdminRequestDTO) => {
    try {
      const baseData = {
        isActive: data.isActive,
        subCategoryName: data.subCategoryName,
        subCategoryCode: data.subCategoryCode,
      };

      if (editingSubCategory) {
        await updateSubCategory({
          id: data.subCategoryCode,
          data: baseData,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "SubCategory updated successfully",
          color: "teal",
        });
      } else {
        await addSubCategory({
          data: baseData,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "SubCategory added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingSubCategory(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save subCategory:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedSubCategoryId) {
      try {
        await deleteSubCategory({
          id: selectedSubCategoryId,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "SubCategory deleted successfully",
          color: "teal",
        });
        setSelectedSubCategoryId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete subCategory",
          color: "red",
        });
        console.error("Failed to delete subCategory:", error);
      }
    }
  };

  const handleDeleteSubCategory = async (id: string) => {
    try {
      await deleteSubCategory({ id }).unwrap();
      notifications.show({
        title: "Success!",
        message: "SubCategory deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete subCategory",
        color: "red",
      });
      console.error("Failed to delete subCategory:", error);
    }
  };

  const subCategoryMappingFromDTOToRequest = (
    editingSubCategory: SubCategoryAdminDTO | null
  ) => {
    if (editingSubCategory != null) {
      return {
        subCategoryCode: editingSubCategory.subCategoryCode,
        subCategoryName: editingSubCategory.subCategoryName,
        isActive: editingSubCategory.isActive,
      } as SubCategoryAdminRequestDTO;
    } else {
      return null;
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Sub Category"
            onAdd={() => setShowForm(true)}
            addLabel="Add Sub Category"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <SubCategoryActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedSubCategoryId}
              isDeleteDisabled={!selectedSubCategoryId}
            />
            <SubCategoryTable
              subCategories={filteredSubCategories}
              onSelectSubCategory={setSelectedSubCategoryId}
              onDeleteSubCategory={handleDeleteSubCategory}
              onViewSubCategory={handleViewSubCategory}
              onEditSubCategory={handleEditSubCategory}
              selectedSubCategory={selectedSubCategoryId}
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
              setEditingSubCategory(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header
            title={
              viewMode
                ? "View SubCategory"
                : editingSubCategory
                ? "Edit SubCategory"
                : "Add SubCategory"
            }
          />
          <SubCategoryForm
            initialValues={
              subCategoryMappingFromDTOToRequest(editingSubCategory) || {
                isActive: "Y",
                subCategoryName: "",
                subCategoryCode: "",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingSubCategory(null);
            }}
            mode={viewMode ? "view" : editingSubCategory ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminSubCategory;
