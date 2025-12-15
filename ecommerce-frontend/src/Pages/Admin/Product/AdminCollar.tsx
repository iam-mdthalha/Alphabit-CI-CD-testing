"use client";

import { notifications } from "@mantine/notifications";
import { CollarActions } from "Components/Admin/AdminProduct/AdminCollar/CollarActions";
import { CollarForm } from "Components/Admin/AdminProduct/AdminCollar/CollarForm";
import { CollarTable } from "Components/Admin/AdminProduct/AdminCollar/CollarTable";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useAddCollarMutation,
  useDeleteCollarMutation,
  useGetAllCollarsQuery,
  useUpdateCollarMutation,
} from "Services/Admin/CollarApiSlice";
import { Collar, PrdCollarMst } from "Types/Admin/AdminCollarType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminCollar = () => {
  const { data: apiCollars = [], isLoading } = useGetAllCollarsQuery({
    plant: PLANT,
  });

  const collars: Collar[] = apiCollars.map((c: PrdCollarMst) => ({
    id: c.id,
    collar_description: c.collar,
    isactive: c.isactive,
  }));

  const [addCollar] = useAddCollarMutation();
  const [updateCollar] = useUpdateCollarMutation();
  const [deleteCollar] = useDeleteCollarMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingCollar, setEditingCollar] = useState<Collar | null>(null);
  const [selectedCollarId, setSelectedCollarId] = useState<number | null>(null);

  const [filteredCollars, setFilteredCollars] = useState<Collar[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = collars ? [...collars] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((collar) => collar.isactive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((collar) => collar.isactive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((collar) =>
        collar.collar_description
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredCollars);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredCollars(filtered);
    }
  }, [collars, filterOption, searchText]);

  const handleViewCollar = async (id: number) => {
    try {
      const collarToEdit = collars.find((collar) => collar.id === id);

      if (collarToEdit) {
        setEditingCollar(collarToEdit);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get collar details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load collar details",
        color: "red",
      });
    }
  };

  const handleEditCollar = async (id: number) => {
    try {
      const collarToEdit = collars.find((collar) => collar.id === id);

      if (collarToEdit) {
        setEditingCollar(collarToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get collar details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load collar details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: Collar) => {
    try {
      const baseData = {
        collar: data.collar_description,
        crat: "",
        crby: "admin",
        isactive: "Y",
        plant: PLANT!,
        upat: "",
        upby: "admin",
      };

      if (editingCollar) {
        await updateCollar({
          id: data.id,
          plant: PLANT!,
          data: {
            id: data.id,
            collar: data.collar_description,
            isactive: "Y",
            plant: PLANT!,
            upat: "",
            upby: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Collar updated successfully",
          color: "teal",
        });
      } else {
        await addCollar({
          plant: PLANT!,
          data: {
            id: 0,
            collar: data.collar_description,
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
          message: "Collar added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingCollar(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save collar:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedCollarId) {
      try {
        await deleteCollar({
          id: selectedCollarId,
          plant: PLANT,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Collar deleted successfully",
          color: "teal",
        });
        setSelectedCollarId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete collar",
          color: "red",
        });
        console.error("Failed to delete collar:", error);
      }
    }
  };

  const handleDeleteCollar = async (id: number) => {
    try {
      await deleteCollar({ id, plant: PLANT! }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Collar deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete collar",
        color: "red",
      });
      console.error("Failed to delete collar:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Collars"
            onAdd={() => setShowForm(true)}
            addLabel="Add Collar"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <CollarActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedCollarId}
              isDeleteDisabled={!selectedCollarId}
            />
            <CollarTable
              collars={filteredCollars}
              onSelectCollar={setSelectedCollarId}
              onDeleteCollar={handleDeleteCollar}
              onViewCollar={handleViewCollar}
              onEditCollar={handleEditCollar}
              selectedCollar={selectedCollarId}
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
              setEditingCollar(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header
            title={
              viewMode
                ? "View Collar"
                : editingCollar
                ? "Edit Collar"
                : "Add Collar"
            }
          />
          <CollarForm
            initialValues={
              editingCollar || {
                id: 0,
                collar_description: "",
                isactive: "Y",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingCollar(null);
            }}
            mode={viewMode ? "view" : editingCollar ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminCollar;
