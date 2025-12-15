"use client";

import React, { useState, useEffect } from "react";
import { Header } from "Components/Admin/StyleComponent/Header";
import { PatternTable } from "Components/Admin/AdminProduct/AdminPattern/PatternTable";
import { PatternActions } from "Components/Admin/AdminProduct/AdminPattern/PatternActions";
import { PatternForm } from "Components/Admin/AdminProduct/AdminPattern/PatternForm";
import {
  useGetAllPatternsQuery,
  useAddPatternMutation,
  useUpdatePatternMutation,
  useDeletePatternMutation,
} from "Services/Admin/PatternApiSlice";
import { PrdPatternMst, Pattern } from "Types/Admin/AdminPatternType";
import { notifications } from "@mantine/notifications";

const PLANT = process.env.REACT_APP_PLANT;

const AdminPattern = () => {
  const { data: apiPatterns = [], isLoading } = useGetAllPatternsQuery({
    plant: PLANT,
  });

  const patterns: Pattern[] = apiPatterns.map((c: PrdPatternMst) => ({
    id: c.id,
    prd_pattern_desc: c.prd_pattern_desc,
    isactive: c.isactive,
  }));

  const [addPattern] = useAddPatternMutation();
  const [updatePattern] = useUpdatePatternMutation();
  const [deletePattern] = useDeletePatternMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingPattern, setEditingPattern] = useState<Pattern | null>(null);
  const [selectedPatternId, setSelectedPatternId] = useState<number | null>(null);

  const [filteredPatterns, setFilteredPatterns] = useState<Pattern[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = patterns ? [...patterns] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((pattern) => pattern.isactive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((pattern) => pattern.isactive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((pattern) =>
        pattern.prd_pattern_desc.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredPatterns);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredPatterns(filtered);
    }
  }, [patterns, filterOption, searchText]);

  const handleViewPattern = async (id: number) => {
    try {
      const patternToEdit = patterns.find((pattern) => pattern.id === id);

      if (patternToEdit) {
        setEditingPattern(patternToEdit);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get pattern details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load pattern details",
        color: "red",
      });
    }
  };

  const handleEditPattern = async (id: number) => {
    try {
      const patternToEdit = patterns.find((pattern) => pattern.id === id);

      if (patternToEdit) {
        setEditingPattern(patternToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get pattern details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load pattern details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: Pattern) => {
    try {
      const now = new Date().toISOString();
      const baseData = {
        prd_pattern_desc: data.prd_pattern_desc,
        crat: "",
        crby: "admin",
        isactive: "Y",
        plant: PLANT!,
        upat: "",
        upby: "admin",
      };

      if (editingPattern) {
        await updatePattern({
          id: data.id,
          plant: PLANT!,
          data: {
            id: data.id,
            prd_pattern_desc: data.prd_pattern_desc,
            isactive: "Y",
            plant: PLANT!,
            upat: "",
            upby: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Pattern updated successfully",
          color: "teal",
        });
      } else {
        await addPattern({
          plant: PLANT!,
          data: {
            id: 0,
            prd_pattern_desc: data.prd_pattern_desc,
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
          message: "Pattern added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingPattern(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save pattern:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedPatternId) {
      try {
        await deletePattern({
          id: selectedPatternId,
          plant: PLANT,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Pattern deleted successfully",
          color: "teal",
        });
        setSelectedPatternId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete pattern",
          color: "red",
        });
        console.error("Failed to delete pattern:", error);
      }
    }
  };

  const handleDeletePattern = async (id: number) => {
    try {
      await deletePattern({ id, plant: PLANT! }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Pattern deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete pattern",
        color: "red",
      });
      console.error("Failed to delete pattern:", error);
    }
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Patterns"
            onAdd={() => setShowForm(true)}
            addLabel="Add Pattern"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <PatternActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedPatternId}
              isDeleteDisabled={!selectedPatternId}
            />
            <PatternTable
              patterns={filteredPatterns}
              onSelectPattern={setSelectedPatternId}
              onDeletePattern={handleDeletePattern}
              onViewPattern={handleViewPattern}
              onEditPattern={handleEditPattern}
              selectedPattern={selectedPatternId}
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
              setEditingPattern(null);
              setViewMode(false);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span className="text-sm">Back</span>
          </button>
          <Header title={viewMode ? "View Pattern" : editingPattern ? "Edit Pattern" : "Add Pattern"} />
          <PatternForm
            initialValues={
              editingPattern || {
                id: 0,
                prd_pattern_desc: "",
                isactive: "Y",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingPattern(null);
            }}
            mode={viewMode ? "view" : editingPattern ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminPattern;
