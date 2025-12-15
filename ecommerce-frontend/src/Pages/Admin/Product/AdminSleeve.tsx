"use client";

import React, { useState, useEffect } from "react";
import { Header } from "Components/Admin/StyleComponent/Header";
import { SleeveTable } from "Components/Admin/AdminProduct/AdminSleeve/SleeveTable";
import { SleeveActions } from "Components/Admin/AdminProduct/AdminSleeve/SleeveActions";
import { SleeveForm } from "Components/Admin/AdminProduct/AdminSleeve/SleeveForm";
import {
  useGetAllSleevesQuery,
  useAddSleeveMutation,
  useUpdateSleeveMutation,
  useDeleteSleeveMutation,
} from "Services/Admin/SleeveApiSlice";
import { PrdSleeveMst, Sleeve } from "Types/Admin/AdminSleeveType";
import { notifications } from "@mantine/notifications";

const PLANT = process.env.REACT_APP_PLANT;

const AdminSleeve = () => {
  const { data: apiSleeves = [], isLoading } = useGetAllSleevesQuery({
    plant: PLANT,
  });

  const sleeves: Sleeve[] = apiSleeves.map((c: PrdSleeveMst) => ({
    id: c.id,
    prd_sleeve: c.prd_sleeve,
    isactive: c.isactive,
  }));

  const [addSleeve] = useAddSleeveMutation();
  const [updateSleeve] = useUpdateSleeveMutation();
  const [deleteSleeve] = useDeleteSleeveMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingSleeve, setEditingSleeve] = useState<Sleeve | null>(null);
  const [selectedSleeveId, setSelectedSleeveId] = useState<number | null>(null);

  const [filteredSleeves, setFilteredSleeves] = useState<Sleeve[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = sleeves ? [...sleeves] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((sleeve) => sleeve.isactive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((sleeve) => sleeve.isactive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((sleeve) =>
        sleeve.prd_sleeve.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredSleeves);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredSleeves(filtered);
    }
  }, [sleeves, filterOption, searchText]);

  const handleViewSleeve = async (id: number) => {
    try {
      const sleeveToEdit = sleeves.find((sleeve) => sleeve.id === id);

      if (sleeveToEdit) {
        setEditingSleeve(sleeveToEdit);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get sleeve details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load sleeve details",
        color: "red",
      });
    }
  };

  const handleEditSleeve = async (id: number) => {
    try {
      const sleeveToEdit = sleeves.find((sleeve) => sleeve.id === id);

      if (sleeveToEdit) {
        setEditingSleeve(sleeveToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get sleeve details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load sleeve details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: Sleeve) => {
    try {
      const baseData = {
        prd_sleeve: data.prd_sleeve,
        crat: "",
        crby: "admin",
        isactive: "Y",
        plant: PLANT!,
        upat: "",
        upby: "admin",
      };

      if (editingSleeve) {
        await updateSleeve({
          id: data.id,
          plant: PLANT!,
          data: {
            id: data.id,
            prd_sleeve: data.prd_sleeve,
            isactive: "Y",
            plant: PLANT!,
            upat: "",
            upby: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Sleeve updated successfully",
          color: "teal",
        });
      } else {
        await addSleeve({
          plant: PLANT!,
          data: {
            id: 0,
            prd_sleeve: data.prd_sleeve,
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
          message: "Sleeve added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingSleeve(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save sleeve:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedSleeveId) {
      try {
        await deleteSleeve({
          id: selectedSleeveId,
          plant: PLANT,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Sleeve deleted successfully",
          color: "teal",
        });
        setSelectedSleeveId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete sleeve",
          color: "red",
        });
        console.error("Failed to delete sleeve:", error);
      }
    }
  };

  const handleDeleteSleeve = async (id: number) => {
    try {
      await deleteSleeve({ id, plant: PLANT! }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Sleeve deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete sleeve",
        color: "red",
      });
      console.error("Failed to delete sleeve:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Sleeves"
            onAdd={() => setShowForm(true)}
            addLabel="Add Sleeve"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <SleeveActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedSleeveId}
              isDeleteDisabled={!selectedSleeveId}
            />
            <SleeveTable
              sleeves={filteredSleeves}
              onSelectSleeve={setSelectedSleeveId}
              onDeleteSleeve={handleDeleteSleeve}
              onViewSleeve={handleViewSleeve}
              onEditSleeve={handleEditSleeve}
              selectedSleeve={selectedSleeveId}
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
              setEditingSleeve(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header title={viewMode ? "View Sleeve" : editingSleeve ? "Edit Sleeve" : "Add Sleeve"} />
          <SleeveForm
            initialValues={
              editingSleeve || {
                id: 0,
                prd_sleeve: "",
                isactive: "Y",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingSleeve(null);
            }}
            mode={viewMode ? "view" : editingSleeve ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminSleeve;
