"use client";

import { notifications } from "@mantine/notifications";
import { AcademicActions } from "Components/Admin/AdminAcademic/AcademicActions";
import { AcademicForm } from "Components/Admin/AdminAcademic/AcademicForm";
import { AcademicTable } from "Components/Admin/AdminAcademic/AcademicTable";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useAddAcademicMutation,
  useDeleteAcademicMutation,
  useGetAllAcademicsQuery,
  useUpdateAcademicMutation,
} from "Services/Admin/AcademicApiSlice";
import { Academic } from "Types/Admin/AdminAcademicType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminAcademic = () => {
  const { data: apiAcademics = [], isLoading } = useGetAllAcademicsQuery({
    plant: PLANT || "",
  });

  const academics: Academic[] = apiAcademics.map((academic: Academic) => ({
    id: academic.id,
    academic: academic.academic,
    isActive: academic.isActive,
    crBy: academic.crBy,
    upBy: academic.upBy,
    createdAt: academic.createdAt,
    updatedAt: academic.updatedAt,
    plant: academic.plant,
  }));

  const [addAcademic] = useAddAcademicMutation();
  const [updateAcademic] = useUpdateAcademicMutation();
  const [deleteAcademic] = useDeleteAcademicMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingAcademic, setEditingAcademic] = useState<Academic | null>(null);
  const [selectedAcademicId, setSelectedAcademicId] = useState<number | null>(
    null
  );

  const [filteredAcademics, setFilteredAcademics] = useState<Academic[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = academics ? [...academics] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((academic) => academic.isActive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((academic) => academic.isActive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((academic) =>
        academic.academic
          .trim()
          .toLowerCase()
          .includes(searchText.trim().toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredAcademics);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredAcademics(filtered);
    }
  }, [academics, filterOption, searchText]);

  const handleViewAcademic = async (id: number) => {
    try {
      const academicToView = academics.find((academic) => academic.id === id);

      if (academicToView) {
        setEditingAcademic(academicToView);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get academic details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load academic details",
        color: "red",
      });
    }
  };

  const handleEditAcademic = async (id: number) => {
    try {
      const academicToEdit = academics.find((academic) => academic.id === id);

      if (academicToEdit) {
        setEditingAcademic(academicToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get academic details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load academic details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: { academic: string; isActive: string }) => {
    try {
      if (editingAcademic) {
        await updateAcademic({
          id: editingAcademic.id,
          plant: PLANT || "",
          data: {
            academic: data.academic,
            isActive: data.isActive,
            upBy: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Academic updated successfully",
          color: "teal",
        });
      } else {
        await addAcademic({
          plant: PLANT || "",
          data: {
            academic: data.academic,
            isActive: data.isActive,
            crBy: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Academic added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingAcademic(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save academic:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedAcademicId) {
      try {
        await deleteAcademic({
          id: selectedAcademicId,
          plant: PLANT || "",
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Academic deleted successfully",
          color: "teal",
        });
        setSelectedAcademicId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete academic",
          color: "red",
        });
        console.error("Failed to delete academic:", error);
      }
    }
  };

  const handleDeleteAcademic = async (id: number) => {
    try {
      await deleteAcademic({
        id,
        plant: PLANT || "",
      }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Academic deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete academic",
        color: "red",
      });
      console.error("Failed to delete academic:", error);
    }
  };

  const academicMappingFromDTOToRequest = (
    editingAcademic: Academic | null
  ) => {
    if (editingAcademic != null) {
      return {
        academic: editingAcademic.academic,
        isActive: editingAcademic.isActive,
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
            title="Academic"
            onAdd={() => setShowForm(true)}
            addLabel="Add Academic"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <AcademicActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedAcademicId}
              isDeleteDisabled={!selectedAcademicId}
            />
            <AcademicTable
              academics={filteredAcademics}
              onSelectAcademic={setSelectedAcademicId}
              onDeleteAcademic={handleDeleteAcademic}
              onViewAcademic={handleViewAcademic}
              onEditAcademic={handleEditAcademic}
              selectedAcademic={selectedAcademicId}
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
              setEditingAcademic(null);
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
                ? "View Academic"
                : editingAcademic
                ? "Edit Academic"
                : "Add Academic"
            }
          />
          <AcademicForm
            initialValues={
              academicMappingFromDTOToRequest(editingAcademic) || {
                isActive: "Y",
                academic: "",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingAcademic(null);
            }}
            mode={viewMode ? "view" : editingAcademic ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminAcademic;
