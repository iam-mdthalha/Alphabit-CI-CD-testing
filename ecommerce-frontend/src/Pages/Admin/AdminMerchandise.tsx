"use client";

import { notifications } from "@mantine/notifications";
import { MerchandiseActions } from "Components/Admin/AdminMerchandise/MerchandiseActions";
import { MerchandiseForm } from "Components/Admin/AdminMerchandise/MerchandiseForm";
import { MerchandiseTable } from "Components/Admin/AdminMerchandise/MerchandiseTable";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useAddMerchandiseMutation,
  useDeleteMerchandiseMutation,
  useGetAllMerchandisesQuery,
  useUpdateMerchandiseMutation,
} from "Services/Admin/MerchandiseApiSlice";
import { Merchandise } from "Types/Admin/AdminMerchandiseType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminMerchandise = () => {
  const { data: apiMerchandises = [], isLoading } = useGetAllMerchandisesQuery({
    plant: PLANT || "",
  });

  const merchandises: Merchandise[] = apiMerchandises.map((merchandise: Merchandise) => ({
    id: merchandise.id,
    merchandise: merchandise.merchandise,
    isActive: merchandise.isActive,
    crBy: merchandise.crBy,
    upBy: merchandise.upBy,
    createdAt: merchandise.createdAt,
    updatedAt: merchandise.updatedAt,
    plant: merchandise.plant,
  }));

  const [addMerchandise] = useAddMerchandiseMutation();
  const [updateMerchandise] = useUpdateMerchandiseMutation();
  const [deleteMerchandise] = useDeleteMerchandiseMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingMerchandise, setEditingMerchandise] = useState<Merchandise | null>(null);
  const [selectedMerchandiseId, setSelectedMerchandiseId] = useState<number | null>(
    null
  );

  const [filteredMerchandises, setFilteredMerchandises] = useState<Merchandise[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = merchandises ? [...merchandises] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((merchandise) => merchandise.isActive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((merchandise) => merchandise.isActive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((merchandise) =>
        merchandise.merchandise
          .trim()
          .toLowerCase()
          .includes(searchText.trim().toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredMerchandises);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredMerchandises(filtered);
    }
  }, [merchandises, filterOption, searchText]);

  const handleViewMerchandise = async (id: number) => {
    try {
      const merchandiseToView = merchandises.find((merchandise) => merchandise.id === id);

      if (merchandiseToView) {
        setEditingMerchandise(merchandiseToView);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get merchandise details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load merchandise details",
        color: "red",
      });
    }
  };

  const handleEditMerchandise = async (id: number) => {
    try {
      const merchandiseToEdit = merchandises.find((merchandise) => merchandise.id === id);

      if (merchandiseToEdit) {
        setEditingMerchandise(merchandiseToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get merchandise details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load merchandise details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: { merchandise: string; isActive: string }) => {
    try {
      if (editingMerchandise) {
        await updateMerchandise({
          id: editingMerchandise.id,
          plant: PLANT || "",
          data: {
            merchandise: data.merchandise,
            isActive: data.isActive,
            upBy: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Merchandise updated successfully",
          color: "teal",
        });
      } else {
        await addMerchandise({
          plant: PLANT || "",
          data: {
            merchandise: data.merchandise,
            isActive: data.isActive,
            crBy: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Merchandise added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingMerchandise(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save merchandise:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedMerchandiseId) {
      try {
        await deleteMerchandise({
          id: selectedMerchandiseId,
          plant: PLANT || "",
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Merchandise deleted successfully",
          color: "teal",
        });
        setSelectedMerchandiseId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete merchandise",
          color: "red",
        });
        console.error("Failed to delete merchandise:", error);
      }
    }
  };

  const handleDeleteMerchandise = async (id: number) => {
    try {
      await deleteMerchandise({
        id,
        plant: PLANT || "",
      }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Merchandise deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete merchandise",
        color: "red",
      });
      console.error("Failed to delete merchandise:", error);
    }
  };

  const merchandiseMappingFromDTOToRequest = (
    editingMerchandise: Merchandise | null
  ) => {
    if (editingMerchandise != null) {
      return {
        merchandise: editingMerchandise.merchandise,
        isActive: editingMerchandise.isActive,
      };
    } else {
      return null;
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Merchandise"
            onAdd={() => setShowForm(true)}
            addLabel="Add Merchandise"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <MerchandiseActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedMerchandiseId}
              isDeleteDisabled={!selectedMerchandiseId}
            />
            <MerchandiseTable
              merchandises={filteredMerchandises}
              onSelectMerchandise={setSelectedMerchandiseId}
              onDeleteMerchandise={handleDeleteMerchandise}
              onViewMerchandise={handleViewMerchandise}
              onEditMerchandise={handleEditMerchandise}
              selectedMerchandise={selectedMerchandiseId}
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
              setEditingMerchandise(null);
              setViewMode(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
          <Header
            title={
              viewMode
                ? "View Merchandise"
                : editingMerchandise
                ? "Edit Merchandise"
                : "Add Merchandise"
            }
          />
          <MerchandiseForm
            initialValues={
              merchandiseMappingFromDTOToRequest(editingMerchandise) || {
                isActive: "Y",
                merchandise: "",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingMerchandise(null);
            }}
            mode={viewMode ? "view" : editingMerchandise ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminMerchandise;
