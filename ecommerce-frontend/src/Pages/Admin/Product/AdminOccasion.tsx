"use client";

import React, { useState, useEffect } from "react";
import { Header } from "Components/Admin/StyleComponent/Header";
import { OccasionTable } from "Components/Admin/AdminProduct/AdminOccasion/OccasionTable";
import { OccasionActions } from "Components/Admin/AdminProduct/AdminOccasion/OccasionActions";
import { OccasionForm } from "Components/Admin/AdminProduct/AdminOccasion/OccasionForm";
import {
  useGetAllOccasionsQuery,
  useAddOccasionMutation,
  useUpdateOccasionMutation,
  useDeleteOccasionMutation,
} from "Services/Admin/OccasionApiSlice";
import { PrdOccasionMst, Occasion } from "Types/Admin/AdminOccasionType";
import { notifications } from "@mantine/notifications";

const PLANT = process.env.REACT_APP_PLANT;

const AdminOccasion = () => {
  const { data: apiOccasions = [], isLoading } = useGetAllOccasionsQuery({
    plant: PLANT,
  });

  const occasions: Occasion[] = apiOccasions.map((c: PrdOccasionMst) => ({
    id: c.id,
    prd_occasion_desc: c.prd_occasion_desc,
    isactive: c.isactive,
  }));

  const [addOccasion] = useAddOccasionMutation();
  const [updateOccasion] = useUpdateOccasionMutation();
  const [deleteOccasion] = useDeleteOccasionMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<Occasion | null>(null);
  const [selectedOccasionId, setSelectedOccasionId] = useState<number | null>(null);

  const [filteredOccasions, setFilteredOccasions] = useState<Occasion[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = occasions ? [...occasions] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((occasion) => occasion.isactive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((occasion) => occasion.isactive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((occasion) =>
        occasion.prd_occasion_desc.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredOccasions);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredOccasions(filtered);
    }
  }, [occasions, filterOption, searchText]);

  const handleViewOccasion = async (id: number) => {
    try {
      const occasionToEdit = occasions.find((occasion) => occasion.id === id);

      if (occasionToEdit) {
        setEditingOccasion(occasionToEdit);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get occasion details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load occasion details",
        color: "red",
      });
    }
  };

  const handleEditOccasion = async (id: number) => {
    try {
      const occasionToEdit = occasions.find((occasion) => occasion.id === id);

      if (occasionToEdit) {
        setEditingOccasion(occasionToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get occasion details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load occasion details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: Occasion) => {
    try {
      const baseData = {
        prd_occasion_desc: data.prd_occasion_desc,
        crat: "",
        crby: "admin",
        isactive: "Y",
        plant: PLANT!,
        upat: "",
        upby: "admin",
      };

      if (editingOccasion) {
        await updateOccasion({
          id: data.id,
          plant: PLANT!,
          data: {
            id: data.id,
            prd_occasion_desc: data.prd_occasion_desc,
            isactive: "Y",
            plant: PLANT!,
            upat: "",
            upby: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Occasion updated successfully",
          color: "teal",
        });
      } else {
        await addOccasion({
          plant: PLANT!,
          data: {
            id: 0,
            prd_occasion_desc: data.prd_occasion_desc,
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
          message: "Occasion added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingOccasion(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save occasion:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedOccasionId) {
      try {
        await deleteOccasion({
          id: selectedOccasionId,
          plant: PLANT,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Occasion deleted successfully",
          color: "teal",
        });
        setSelectedOccasionId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete occasion",
          color: "red",
        });
        console.error("Failed to delete occasion:", error);
      }
    }
  };

  const handleDeleteOccasion = async (id: number) => {
    try {
      await deleteOccasion({ id, plant: PLANT! }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Occasion deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete occasion",
        color: "red",
      });
      console.error("Failed to delete occasion:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Occasions"
            onAdd={() => setShowForm(true)}
            addLabel="Add Occasion"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <OccasionActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedOccasionId}
              isDeleteDisabled={!selectedOccasionId}
            />
            <OccasionTable
              occasions={filteredOccasions}
              onSelectOccasion={setSelectedOccasionId}
              onDeleteOccasion={handleDeleteOccasion}
              onViewOccasion={handleViewOccasion}
              onEditOccasion={handleEditOccasion}
              selectedOccasion={selectedOccasionId}
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
              setEditingOccasion(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header title={viewMode ? "View Occasion" : editingOccasion ? "Edit Occasion" : "Add Occasion"} />
          <OccasionForm
            initialValues={
              editingOccasion || {
                id: 0,
                prd_occasion_desc: "",
                isactive: "Y",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingOccasion(null);
            }}
            mode={viewMode ? "view" : editingOccasion ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminOccasion;
