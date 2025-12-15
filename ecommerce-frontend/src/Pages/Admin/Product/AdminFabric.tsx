"use client";

import React, { useState, useEffect } from "react";
import { Header } from "Components/Admin/StyleComponent/Header";
import { FabricTable } from "Components/Admin/AdminProduct/AdminFabric/FabricTable";
import { FabricActions } from "Components/Admin/AdminProduct/AdminFabric/FabricActions";
import { FabricForm } from "Components/Admin/AdminProduct/AdminFabric/FabricForm";
import {
  useGetAllFabricsQuery,
  useAddFabricMutation,
  useUpdateFabricMutation,
  useDeleteFabricMutation,
} from "Services/Admin/FabricApiSlice";
import { PrdFabricMst, Fabric } from "Types/Admin/AdminFabricType";
import { notifications } from "@mantine/notifications";

const PLANT = process.env.REACT_APP_PLANT;

const AdminFabric = () => {
  const { data: apiFabrics = [], isLoading } = useGetAllFabricsQuery({
    plant: PLANT,
  });

  const fabrics: Fabric[] = apiFabrics.map((c: PrdFabricMst) => ({
    id: c.id,
    prd_fabric: c.prd_fabric,
    isactive: c.isactive,
  }));

  const [addFabric] = useAddFabricMutation();
  const [updateFabric] = useUpdateFabricMutation();
  const [deleteFabric] = useDeleteFabricMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
  const [selectedFabricId, setSelectedFabricId] = useState<number | null>(null);

  const [filteredFabrics, setFilteredFabrics] = useState<Fabric[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = fabrics ? [...fabrics] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((fabric) => fabric.isactive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((fabric) => fabric.isactive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((fabric) =>
        fabric.prd_fabric.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredFabrics);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredFabrics(filtered);
    }
  }, [fabrics, filterOption, searchText]);

  const handleViewFabric = async (id: number) => {
    try {
      const fabricToEdit = fabrics.find((fabric) => fabric.id === id);

      if (fabricToEdit) {
        setEditingFabric(fabricToEdit);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get fabric details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load fabric details",
        color: "red",
      });
    }
  };

  const handleEditFabric = async (id: number) => {
    try {
      const fabricToEdit = fabrics.find((fabric) => fabric.id === id);

      if (fabricToEdit) {
        setEditingFabric(fabricToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get fabric details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load fabric details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: Fabric) => {
    try {
      const baseData = {
        prd_fabric: data.prd_fabric,
        crat: "",
        crby: "admin",
        isactive: "Y",
        plant: PLANT!,
        upat: "",
        upby: "admin",
      };

      if (editingFabric) {
        await updateFabric({
          id: data.id,
          plant: PLANT!,
          data: {
            id: data.id,
            prd_fabric: data.prd_fabric,
            isactive: "Y",
            plant: PLANT!,
            upat: "",
            upby: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Fabric updated successfully",
          color: "teal",
        });
      } else {
        await addFabric({
          plant: PLANT!,
          data: {
            id: 0,
            prd_fabric: data.prd_fabric,
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
          message: "Fabric added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingFabric(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save fabric:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedFabricId) {
      try {
        await deleteFabric({
          id: selectedFabricId,
          plant: PLANT,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Fabric deleted successfully",
          color: "teal",
        });
        setSelectedFabricId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete fabric",
          color: "red",
        });
        console.error("Failed to delete fabric:", error);
      }
    }
  };

  const handleDeleteFabric = async (id: number) => {
    try {
      await deleteFabric({ id, plant: PLANT! }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Fabric deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete fabric",
        color: "red",
      });
      console.error("Failed to delete fabric:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Fabrics"
            onAdd={() => setShowForm(true)}
            addLabel="Add Fabric"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <FabricActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedFabricId}
              isDeleteDisabled={!selectedFabricId}
            />
            <FabricTable
              fabrics={filteredFabrics}
              onSelectFabric={setSelectedFabricId}
              onDeleteFabric={handleDeleteFabric}
              onViewFabric={handleViewFabric}
              onEditFabric={handleEditFabric}
              selectedFabric={selectedFabricId}
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
              setEditingFabric(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header
            title={
              viewMode
                ? "View Fabric"
                : editingFabric
                ? "Edit Fabric"
                : "Add Fabric"
            }
          />
          <FabricForm
            initialValues={
              editingFabric || {
                id: 0,
                prd_fabric: "",
                isactive: "Y",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingFabric(null);
            }}
            mode={viewMode ? "view" : editingFabric ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminFabric;
