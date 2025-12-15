"use client";

import React, { useState, useEffect } from "react";
import { Header } from "Components/Admin/StyleComponent/Header";
import { ColorTable } from "Components/Admin/AdminProduct/AdminColor/ColorTable";
import { ColorActions } from "Components/Admin/AdminProduct/AdminColor/ColorActions";
import { ColorForm } from "Components/Admin/AdminProduct/AdminColor/ColorForm";
import {
  useGetAllColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} from "Services/Admin/ColorApiSlice";
import { PrdColorMst, Color } from "Types/Admin/AdminColorType";
import { notifications } from "@mantine/notifications";

const PLANT = process.env.REACT_APP_PLANT;

const AdminColor = () => {
  const { data: apiColors = [], isLoading } = useGetAllColorsQuery({
    plant: PLANT,
  });

  const colors: Color[] = apiColors.map((c: PrdColorMst) => ({
    id: c.id,
    prd_color_desc: c.prd_color_desc,
    isactive: c.isactive,
  }));

  const [addColor] = useAddColorMutation();
  const [updateColor] = useUpdateColorMutation();
  const [deleteColor] = useDeleteColorMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

  const [filteredColors, setFilteredColors] = useState<Color[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = colors ? [...colors] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((color) => color.isactive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((color) => color.isactive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((color) =>
        color.prd_color_desc.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredColors);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredColors(filtered);
    }
  }, [colors, filterOption, searchText]);

  const handleViewColor = async (id: number) => {
    try {
      const colorToEdit = colors.find((color) => color.id === id);

      if (colorToEdit) {
        setEditingColor(colorToEdit);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get color details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load color details",
        color: "red",
      });
    }
  };

  const handleEditColor = async (id: number) => {
    try {
      const colorToEdit = colors.find((color) => color.id === id);

      if (colorToEdit) {
        setEditingColor(colorToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get color details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load color details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: Color) => {
    try {
      const baseData = {
        prd_color_desc: data.prd_color_desc,
        crat: "",
        crby: "admin",
        isactive: "Y",
        plant: PLANT!,
        upat: "",
        upby: "admin",
      };

      if (editingColor) {
        await updateColor({
          id: data.id,
          plant: PLANT!,
          data: {
            id: data.id,
            prd_color_desc: data.prd_color_desc,
            isactive: "Y",
            plant: PLANT!,
            upat: "",
            upby: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Color updated successfully",
          color: "teal",
        });
      } else {
        await addColor({
          plant: PLANT!,
          data: {
            id: 0,
            prd_color_desc: data.prd_color_desc,
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
          message: "Color added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingColor(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save color:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedColorId) {
      try {
        await deleteColor({
          id: selectedColorId,
          plant: PLANT,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Color deleted successfully",
          color: "teal",
        });
        setSelectedColorId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete color",
          color: "red",
        });
        console.error("Failed to delete color:", error);
      }
    }
  };

  const handleDeleteColor = async (id: number) => {
    try {
      await deleteColor({ id, plant: PLANT! }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Color deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete color",
        color: "red",
      });
      console.error("Failed to delete color:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Colors"
            onAdd={() => setShowForm(true)}
            addLabel="Add Color"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <ColorActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedColorId}
              isDeleteDisabled={!selectedColorId}
            />
            <ColorTable
              colors={filteredColors}
              onSelectColor={setSelectedColorId}
              onDeleteColor={handleDeleteColor}
              onViewColor={handleViewColor}
              onEditColor={handleEditColor}
              selectedColor={selectedColorId}
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
              setEditingColor(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header title={viewMode ? "View Color" : editingColor ? "Edit Color" : "Add Color"} />
          <ColorForm
            initialValues={
              editingColor || {
                id: 0,
                prd_color_desc: "",
                isactive: "Y",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingColor(null);
            }}
            mode={viewMode ? "view" : editingColor ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminColor;
