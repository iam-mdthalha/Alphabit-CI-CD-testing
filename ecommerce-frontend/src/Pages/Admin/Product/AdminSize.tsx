"use client";

import React, { useState, useEffect } from "react";
import { Header } from "Components/Admin/StyleComponent/Header";
import { SizeTable } from "Components/Admin/AdminProduct/AdminSize/SizeTable";
import { SizeActions } from "Components/Admin/AdminProduct/AdminSize/SizeActions";
import { SizeForm } from "Components/Admin/AdminProduct/AdminSize/SizeForm";
import {
  useGetAllSizesQuery,
  useAddSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
} from "Services/Admin/SizeApiSlice";
import { PrdSizeMst, Size } from "Types/Admin/AdminSizeType";
import { notifications } from "@mantine/notifications";

const PLANT = process.env.REACT_APP_PLANT;

const AdminSize = () => {
  const { data: apiSizes = [], isLoading } = useGetAllSizesQuery({
    plant: PLANT,
  });

  const sizes: Size[] = apiSizes.map((c: PrdSizeMst) => ({
    id: c.id,
    prd_Size_Desc: c.prd_Size_Desc,
    isactive: c.isactive,
  }));

  const [addSize] = useAddSizeMutation();
  const [updateSize] = useUpdateSizeMutation();
  const [deleteSize] = useDeleteSizeMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);

  const [filteredSizes, setFilteredSizes] = useState<Size[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = sizes ? [...sizes] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((size) => size.isactive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((size) => size.isactive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((size) =>
        size.prd_Size_Desc.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredSizes);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredSizes(filtered);
    }
  }, [sizes, filterOption, searchText]);

  const handleViewSize = async (id: number) => {
    try {
      const sizeToEdit = sizes.find((size) => size.id === id);

      if (sizeToEdit) {
        setEditingSize(sizeToEdit);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get size details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load size details",
        color: "red",
      });
    }
  };

  const handleEditSize = async (id: number) => {
    try {
      const sizeToEdit = sizes.find((size) => size.id === id);

      if (sizeToEdit) {
        setEditingSize(sizeToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get size details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load size details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: Size) => {
    try {
      const baseData = {
        prd_Size_Desc: data.prd_Size_Desc,
        crat: "",
        crby: "admin",
        isactive: "Y",
        plant: PLANT!,
        upat: "",
        upby: "admin",
      };

      if (editingSize) {
        await updateSize({
          id: data.id,
          plant: PLANT!,
          data: {
            id: data.id,
            prd_Size_Desc: data.prd_Size_Desc,
            isactive: "Y",
            plant: PLANT!,
            upat: "",
            upby: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Size updated successfully",
          color: "teal",
        });
      } else {
        await addSize({
          plant: PLANT!,
          data: {
            id: 0,
            prd_Size_Desc: data.prd_Size_Desc,
            crat: "",
            crby: "admin",
            isactive: "Y",
            plant: PLANT!,
            upat: "",
            upby: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Size added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingSize(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save size:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedSizeId) {
      try {
        await deleteSize({
          id: selectedSizeId,
          plant: PLANT,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Size deleted successfully",
          color: "teal",
        });
        setSelectedSizeId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete size",
          color: "red",
        });
        console.error("Failed to delete size:", error);
      }
    }
  };

  const handleDeleteSize = async (id: number) => {
    try {
      await deleteSize({ id, plant: PLANT! }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Size deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete size",
        color: "red",
      });
      console.error("Failed to delete size:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Sizes"
            onAdd={() => setShowForm(true)}
            addLabel="Add Size"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <SizeActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedSizeId}
              isDeleteDisabled={!selectedSizeId}
            />
            <SizeTable
              sizes={filteredSizes}
              onSelectSize={setSelectedSizeId}
              onDeleteSize={handleDeleteSize}
              onViewSize={handleViewSize}
              onEditSize={handleEditSize}
              selectedSize={selectedSizeId}
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
              setEditingSize(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header title={viewMode ? "View Size" : editingSize ? "Edit Size" : "Add Size"} />
          <SizeForm
            initialValues={
              editingSize || {
                id: 0,
                prd_Size_Desc: "",
                isactive: "Y",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingSize(null);
            }}
            mode={viewMode ? "view" : editingSize ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminSize;
