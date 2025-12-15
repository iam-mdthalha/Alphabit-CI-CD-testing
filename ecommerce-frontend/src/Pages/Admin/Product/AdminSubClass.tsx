"use client";

import { notifications } from "@mantine/notifications";
import { SubClassActions } from "Components/Admin/AdminProduct/AdminSubClass/SubClassActions";
import { SubClassForm } from "Components/Admin/AdminProduct/AdminSubClass/SubClassForm";
import { SubClassTable } from "Components/Admin/AdminProduct/AdminSubClass/SubClassTable";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useMemo, useState } from "react";
import {
  useCreateSubClassMutation,
  useDeleteSubClassMutation,
  useGetAdminSubClassesQuery,
  useUpdateSubClassMutation,
} from "Services/Admin/SubClassApiSlice";
import {
  SubClassAdminRequestDTO,
  SubClassMstDTO,
} from "Types/Admin/AdminSubClassType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminSubClass = () => {
  const {
    data: apiSubClasses,
    isLoading,
    refetch,
  } = useGetAdminSubClassesQuery();
  const subClasses: SubClassMstDTO[] = apiSubClasses?.results || [];

  const [createSubClass] = useCreateSubClassMutation();
  const [updateSubClass] = useUpdateSubClassMutation();
  const [deleteSubClass] = useDeleteSubClassMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingSubClass, setEditingSubClass] = useState<SubClassMstDTO | null>(
    null
  );
  const [selectedSubClassId, setSelectedSubClassId] = useState<string | null>(
    null
  );
  const [searchText, setSearchText] = useState("");

  const filteredSubClasses = useMemo(() => {
    if (!subClasses) return [];
    return searchText
      ? subClasses.filter(
          (subClass) =>
            (subClass.subClassCode || "")
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            (subClass.subClassName || "")
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            (subClass.categoryCode || "")
              .toLowerCase()
              .includes(searchText.toLowerCase())
        )
      : [...subClasses];
  }, [subClasses, searchText]);

  const subClassMappingFromMstToRequest = (
    subClassMst: SubClassMstDTO | null
  ) => {
    if (subClassMst != null) {
      return {
        subClassCode: subClassMst.subClassCode,
        subClassName: subClassMst.subClassName,
        categoryCode: subClassMst.categoryCode,
        isActive: subClassMst.isActive,
      } as SubClassAdminRequestDTO;
    } else {
      return null;
    }
  };

  const handleViewSubClass = async (id: string) => {
    try {
      const subClassToView = subClasses.find(
        (subClass) => subClass.subClassCode === id
      );
      if (subClassToView) {
        setEditingSubClass(subClassToView);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get Sub Category details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load Sub Category details",
        color: "red",
      });
    }
  };

  const handleEditSubClass = async (id: string) => {
    try {
      const subClassToEdit = subClasses.find(
        (subClass) => subClass.subClassCode === id
      );
      if (subClassToEdit) {
        setEditingSubClass(subClassToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get Sub Category details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load Sub Category details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: SubClassAdminRequestDTO) => {
    try {
      if (editingSubClass) {
        const updatedData = {
          subClassCode: data.subClassCode,
          subClassName: data.subClassName,
          categoryCode: data.categoryCode,
          isActive: data.isActive,
          plant: PLANT!,
        };

        await updateSubClass({
          id: editingSubClass.subClassCode,
          data: updatedData,
        }).unwrap();

        notifications.show({
          title: "Success!",
          message: "Sub Category updated successfully",
          color: "teal",
        });
      } else {
        const createData = {
          ...data,
          plant: PLANT!,
        };
      console.log('Submitting data:', createData);

        await createSubClass(createData).unwrap();

        notifications.show({
          title: "Success!",
          message: "Sub Category created successfully",
          color: "teal",
        });
      }

      await refetch();
      setShowForm(false);
      setEditingSubClass(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save Sub Category:", error);
    }
  };

  const handleDeleteSubClass = async (id: string) => {
    try {
      await deleteSubClass(id).unwrap();
      await refetch();
      notifications.show({
        title: "Success!",
        message: "Sub Category deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete Sub Category",
        color: "red",
      });
      console.error("Failed to delete Sub Category:", error);
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
            <SubClassActions
              onSearchChange={setSearchText}
              isDeleteDisabled={!selectedSubClassId}
              onDelete={() =>
                selectedSubClassId && handleDeleteSubClass(selectedSubClassId)
              }
            />
            <SubClassTable
              subClasses={filteredSubClasses}
              onSelectSubClass={setSelectedSubClassId}
              onDeleteSubClass={handleDeleteSubClass}
              onViewSubClass={handleViewSubClass}
              onEditSubClass={handleEditSubClass}
              selectedSubClass={selectedSubClassId}
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
              setEditingSubClass(null);
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
                ? "View Sub Category"
                : editingSubClass
                ? "Edit Sub Category"
                : "Add Sub Category"
            }
          />
          <SubClassForm
            initialValues={
              subClassMappingFromMstToRequest(editingSubClass) || {
                subClassCode: "",
                subClassName: "",
                categoryCode: "",
                isActive: "Y",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingSubClass(null);
            }}
            mode={viewMode ? "view" : editingSubClass ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminSubClass;
