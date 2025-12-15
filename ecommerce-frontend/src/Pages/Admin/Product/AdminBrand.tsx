"use client";

import React, { useState, useEffect } from "react";
import { Header } from "Components/Admin/StyleComponent/Header";
import { BrandTable } from "Components/Admin/AdminProduct/AdminBrand/BrandTable";
import { BrandActions } from "Components/Admin/AdminProduct/AdminBrand/BrandActions";
import { BrandForm } from "Components/Admin/AdminProduct/AdminBrand/BrandForm";
import {
  useGetAllBrandsQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "Services/Admin/BrandApiSlice";
import { PrdBrandMst, Brand } from "Types/Admin/AdminBrandType";
import { notifications } from "@mantine/notifications";

const PLANT = process.env.REACT_APP_PLANT;

const AdminBrand = () => {
  const { data: apiBrands = [], isLoading } = useGetAllBrandsQuery({
    plant: PLANT,
  });

  const brands: Brand[] = apiBrands.map((c: PrdBrandMst) => ({
    catalogPath: "",
    comments1: "",
    comments2: "",
    createdAt: "",
    createdBy: "admin",
    id: c.id,
    is_active: c.is_active,
    plant: PLANT!,
    productBrandDesc: c.productBrandDesc,
    productBrandId: "",
    updatedAt: "",
    updatedBy: "admin",
  }));

  const [addBrand] = useAddBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = brands ? [...brands] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((brand) => brand.is_active === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((brand) => brand.is_active !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((brand) =>
        brand.productBrandDesc.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredBrands);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredBrands(filtered);
    }
  }, [brands, filterOption, searchText]);

  const handleViewBrand = async (id: number) => {
    try {
      const brandToEdit = brands.find((brand) => brand.id === id);

      if (brandToEdit) {
        setEditingBrand(brandToEdit);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get brand details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load brand details",
        color: "red",
      });
    }
  };

  const handleEditBrand = async (id: number) => {
    try {
      const brandToEdit = brands.find((brand) => brand.id === id);

      if (brandToEdit) {
        setEditingBrand(brandToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get brand details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load brand details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: Brand) => {
    try {
      const baseData = {
        catalogPath: "",
        comments1: "",
        comments2: "",
        createdAt: "",
        createdBy: "admin",
        id: 0,
        is_active: "Y",
        plant: PLANT!,
        productBrandDesc: data.productBrandDesc,
        productBrandId: "",
        updatedAt: "",
        updatedBy: "admin",
      };

      if (editingBrand) {
        await updateBrand({
          id: data.id,
          plant: PLANT!,
          data: {
            catalogPath: "",
            comments1: "",
            comments2: "",
            id: 0,
            is_active: "Y",
            plant: PLANT!,
            productBrandDesc: data.productBrandDesc,
            productBrandId: data.productBrandDesc,
            updatedAt: "",
            updatedBy: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Brand updated successfully",
          color: "teal",
        });
      } else {
        await addBrand({
          plant: PLANT!,
          data: {
            catalogPath: "",
            comments1: "",
            comments2: "",
            createdAt: "",
            createdBy: "",
            id: 0,
            is_active: "Y",
            plant: PLANT!,
            productBrandDesc: data.productBrandDesc,
            productBrandId: data.productBrandDesc,
            updatedAt: "",
            updatedBy: "",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Brand added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingBrand(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save brand:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedBrandId) {
      try {
        await deleteBrand({
          id: selectedBrandId,
          plant: PLANT,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Brand deleted successfully",
          color: "teal",
        });
        setSelectedBrandId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete brand",
          color: "red",
        });
        console.error("Failed to delete brand:", error);
      }
    }
  };

  const handleDeleteBrand = async (id: number) => {
    try {
      await deleteBrand({ id, plant: PLANT! }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Brand deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete brand",
        color: "red",
      });
      console.error("Failed to delete brand:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Brands"
            onAdd={() => setShowForm(true)}
            addLabel="Add Brand"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <BrandActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedBrandId}
              isDeleteDisabled={!selectedBrandId}
            />
            <BrandTable
              brands={filteredBrands}
              onSelectBrand={setSelectedBrandId}
              onDeleteBrand={handleDeleteBrand}
              onViewBrand={handleViewBrand}
              onEditBrand={handleEditBrand}
              selectedBrand={selectedBrandId}
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
              setEditingBrand(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header
            title={
              viewMode
                ? "View Brand"
                : editingBrand
                ? "Edit Brand"
                : "Add Brand"
            }
          />
          <BrandForm
            initialValues={
              editingBrand || {
                catalogPath: "",
                comments1: "",
                comments2: "",
                createdAt: "",
                createdBy: "admin",
                id: 0,
                is_active: "",
                plant: PLANT!,
                productBrandDesc: "",
                productBrandId: "",
                updatedAt: "",
                updatedBy: "admin",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingBrand(null);
            }}
            mode={viewMode ? "view" : editingBrand ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminBrand;
