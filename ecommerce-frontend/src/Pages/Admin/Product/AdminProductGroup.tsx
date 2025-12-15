"use client";
import { useMemo } from 'react';
import { notifications } from "@mantine/notifications";
import { ProductGroupActions } from "Components/Admin/AdminProduct/AdminProductGroup/ProductGroupActions";
import { ProductGroupForm } from "Components/Admin/AdminProduct/AdminProductGroup/ProductGroupForm";
import { ProductGroupTable } from "Components/Admin/AdminProduct/AdminProductGroup/ProductGroupTable";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useCreateItemGroupMutation,
  useDeleteItemGroupMutation,
  useGetAllItemGroupsQuery,
  useUpdateItemGroupMutation,
} from "Services/Admin/ProductGroupAdminApiSlice";
import { ItemGroup } from "Types/Admin/AdminProductGroupType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminProductGroup = () => {
  const {
    data: itemGroups = [],
    isLoading,
    refetch,
  } = useGetAllItemGroupsQuery(PLANT);

  const [createItemGroup] = useCreateItemGroupMutation();
  const [updateItemGroup] = useUpdateItemGroupMutation();
  const [deleteItemGroup] = useDeleteItemGroupMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingItemGroup, setEditingItemGroup] = useState<ItemGroup | null>(null);
  const [selectedItemGroupId, setSelectedItemGroupId] = useState<number | null>(null);

  const [searchText, setSearchText] = useState("");

  const filteredItemGroups = useMemo(() => {
    if (!itemGroups) return [];
    return searchText
      ? itemGroups.filter(itemGroup =>
        (itemGroup.itemGroupName || "")
          .toLowerCase()
          .includes(searchText.toLowerCase()))
      : [...itemGroups];
  }, [itemGroups, searchText]);

  const handleViewItemGroup = async (id: number) => {
    try {
      const itemGroupToView = itemGroups.find((itemGroup) => itemGroup.id === id);
      if (itemGroupToView) {
        setEditingItemGroup(itemGroupToView);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get item group details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load item group details",
        color: "red",
      });
    }
  };

  const handleEditItemGroup = async (id: number) => {
    try {
      const itemGroupToEdit = itemGroups.find((itemGroup) => itemGroup.id === id);
      if (itemGroupToEdit) {
        setEditingItemGroup(itemGroupToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get item group details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load item group details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: { itemGroupName: string }) => {
    try {
      let response;
      if (editingItemGroup) {
        response = await updateItemGroup({
          id: editingItemGroup.id,
          itemGroupName: data.itemGroupName,
          plant: PLANT,
        }).unwrap();
      } else {
        response = await createItemGroup({
          itemGroupName: data.itemGroupName,
          plant: PLANT,
        }).unwrap();
      }

      notifications.show({
        title: "Success!",
        message: typeof response === 'string' ? response :
          editingItemGroup ? "Item group updated successfully" : "Item group created successfully",
        color: "teal",
      });

      setShowForm(false);
      setEditingItemGroup(null);
      refetch();
    } catch (error: any) {
      notifications.show({
        title: "Error!",
        message: error?.data?.message || "Operation failed",
        color: "red",
      });
      console.error("Failed to save item group:", error);
    }
  };

  const handleDeleteItemGroup = async (id: number) => {
    try {
      const response = await deleteItemGroup({ id, plant: PLANT }).unwrap();

      notifications.show({
        title: "Success!",
        message: typeof response === 'string' ? response : "Item group deleted successfully",
        color: "teal",
      });
      refetch();
    } catch (error: any) {
      notifications.show({
        title: "Error!",
        message: error?.data?.message || "Failed to delete item group",
        color: "red",
      });
      console.error("Failed to delete item group:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Product Groups"
            onAdd={() => setShowForm(true)}
            addLabel="Add Product Group"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <ProductGroupActions
              onSearchChange={setSearchText}
              isDeleteDisabled={!selectedItemGroupId}
              onDelete={() =>
                selectedItemGroupId && handleDeleteItemGroup(selectedItemGroupId)
              }
            />
            <ProductGroupTable
              itemGroups={filteredItemGroups}
              onSelectItemGroup={setSelectedItemGroupId}
              onDeleteItemGroup={handleDeleteItemGroup}
              onViewItemGroup={handleViewItemGroup}
              onEditItemGroup={handleEditItemGroup}
              selectedItemGroup={selectedItemGroupId}
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
              setEditingItemGroup(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header
            title={
              viewMode
                ? "View Product Group"
                : editingItemGroup
                  ? "Edit Product Group"
                  : "Add Product Group"
            }
          />
          <ProductGroupForm
            initialValues={
              editingItemGroup
                ? { itemGroupName: editingItemGroup.itemGroupName }
                : { itemGroupName: "" }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingItemGroup(null);
            }}
            mode={viewMode ? "view" : editingItemGroup ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminProductGroup;