"use client";

import React, { useState, useEffect } from "react";
import { Header } from "Components/Admin/StyleComponent/Header";
import { ModelTable } from "Components/Admin/AdminProduct/AdminModel/ModelTable";
import { ModelActions } from "Components/Admin/AdminProduct/AdminModel/ModelActions";
import { ModelForm } from "Components/Admin/AdminProduct/AdminModel/ModelForm";
import {
  useGetAllModelsQuery,
  useAddModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
} from "Services/Admin/ModelApiSlice";
import { PrdModelMst, Model } from "Types/Admin/AdminModelType";
import { notifications } from "@mantine/notifications";

const PLANT = process.env.REACT_APP_PLANT;

const AdminModel = () => {
  const { data: apiModels = [], isLoading } = useGetAllModelsQuery({
    plant: PLANT,
  });

  const models: Model[] = apiModels.map((c: PrdModelMst) => ({
    crAt: "",
    crBy: "admin",
    id: c.id,
    is_active: c.is_active,
    plant: PLANT!,
    prdModelDesc: c.prdModelDesc,
    upAt: "",
    upBy: "admin",
  }));

  const [addModel] = useAddModelMutation();
  const [updateModel] = useUpdateModelMutation();
  const [deleteModel] = useDeleteModelMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = models ? [...models] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((model) => model.is_active === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((model) => model.is_active !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((model) =>
        model.prdModelDesc.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredModels);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredModels(filtered);
    }
  }, [models, filterOption, searchText]);

  const handleViewModel = async (id: number) => {
    try {
      const modelToEdit = models.find((model) => model.id === id);

      if (modelToEdit) {
        setEditingModel(modelToEdit);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get model details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load model details",
        color: "red",
      });
    }
  };

  const handleEditModel = async (id: number) => {
    try {
      const modelToEdit = models.find((model) => model.id === id);

      if (modelToEdit) {
        setEditingModel(modelToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get model details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load model details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: Model) => {
    try {
      const now = new Date().toISOString();
      const baseData = {
        crAt: "",
        crBy: "admin",
        id: data.id,
        is_active: data.is_active,
        plant: PLANT!,
        prdModelDesc: data.prdModelDesc,
        upAt: "",
        upBy: "admin",
      };

      if (editingModel) {
        await updateModel({
          id: data.id,
          plant: PLANT!,
          data: {
            crAt: "",
            crBy: "admin",
            id: data.id,
            is_active: data.is_active,
            plant: PLANT!,
            prdModelDesc: data.prdModelDesc,
            upAt: "",
            upBy: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Model updated successfully",
          color: "teal",
        });
      } else {
        await addModel({
          plant: PLANT!,
          data: {
            crAt: "",
            crBy: "admin",
            id: data.id,
            is_active: "Y",
            plant: PLANT!,
            prdModelDesc: data.prdModelDesc,
            upAt: "",
            upBy: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Model added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingModel(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save model:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedModelId) {
      try {
        await deleteModel({
          id: selectedModelId,
          plant: PLANT,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Model deleted successfully",
          color: "teal",
        });
        setSelectedModelId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete model",
          color: "red",
        });
        console.error("Failed to delete model:", error);
      }
    }
  };

  const handleDeleteModel = async (id: number) => {
    try {
      await deleteModel({ id, plant: PLANT! }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Model deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete model",
        color: "red",
      });
      console.error("Failed to delete model:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Models"
            onAdd={() => setShowForm(true)}
            addLabel="Add Model"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <ModelActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedModelId}
              isDeleteDisabled={!selectedModelId}
            />
            <ModelTable
              models={filteredModels}
              onSelectModel={setSelectedModelId}
              onDeleteModel={handleDeleteModel}
              onViewModel={handleViewModel}
              onEditModel={handleEditModel}
              selectedModel={selectedModelId}
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
              setEditingModel(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header
            title={
              viewMode
                ? "View Model"
                : editingModel
                ? "Edit Model"
                : "Add Model"
            }
          />
          <ModelForm
            initialValues={
              editingModel || {
                crAt: "",
                crBy: "admin",
                id: 0,
                is_active: "",
                plant: PLANT!,
                prdModelDesc: "",
                upAt: "",
                upBy: "admin",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingModel(null);
            }}
            mode={viewMode ? "view" : editingModel ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminModel;
