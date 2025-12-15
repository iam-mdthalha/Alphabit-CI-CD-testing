"use client";

import { notifications } from "@mantine/notifications";
import { LanguageActions } from "Components/Admin/AdminLanguage/LanguageActions";
import { LanguageForm } from "Components/Admin/AdminLanguage/LanguageForm";
import { LanguageTable } from "Components/Admin/AdminLanguage/LanguageTable";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useAddLanguageMutation,
  useDeleteLanguageMutation,
  useGetAllLanguagesQuery,
  useUpdateLanguageMutation,
} from "Services/Admin/LanguageApiSlice";
import { Language } from "Types/Admin/AdminLanguageType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminLanguage = () => {
  const { data: apiLanguages = [], isLoading } = useGetAllLanguagesQuery({
    plant: PLANT || "",
  });

  const languages: Language[] = apiLanguages.map((language: Language) => ({
    id: language.id,
    language: language.language,
    isActive: language.isActive,
    crBy: language.crBy,
    upBy: language.upBy,
    createdAt: language.createdAt,
    updatedAt: language.updatedAt,
    plant: language.plant,
  }));

  const [addLanguage] = useAddLanguageMutation();
  const [updateLanguage] = useUpdateLanguageMutation();
  const [deleteLanguage] = useDeleteLanguageMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(
    null
  );

  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = languages ? [...languages] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((language) => language.isActive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((language) => language.isActive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((language) =>
        language.language
          .trim()
          .toLowerCase()
          .includes(searchText.trim().toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredLanguages);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredLanguages(filtered);
    }
  }, [languages, filterOption, searchText]);

  const handleViewLanguage = async (id: number) => {
    try {
      const languageToView = languages.find((language) => language.id === id);

      if (languageToView) {
        setEditingLanguage(languageToView);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get language details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load language details",
        color: "red",
      });
    }
  };

  const handleEditLanguage = async (id: number) => {
    try {
      const languageToEdit = languages.find((language) => language.id === id);

      if (languageToEdit) {
        setEditingLanguage(languageToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get language details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load language details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: { language: string; isActive: string }) => {
    try {
      if (editingLanguage) {
        await updateLanguage({
          id: editingLanguage.id,
          plant: PLANT || "",
          data: {
            language: data.language,
            isActive: data.isActive,
            upBy: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Language updated successfully",
          color: "teal",
        });
      } else {
        await addLanguage({
          plant: PLANT || "",
          data: {
            language: data.language,
            isActive: data.isActive,
            crBy: "admin",
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Language added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingLanguage(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save language:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedLanguageId) {
      try {
        await deleteLanguage({
          id: selectedLanguageId,
          plant: PLANT || "",
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Language deleted successfully",
          color: "teal",
        });
        setSelectedLanguageId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete language",
          color: "red",
        });
        console.error("Failed to delete language:", error);
      }
    }
  };

  const handleDeleteLanguage = async (id: number) => {
    try {
      await deleteLanguage({
        id,
        plant: PLANT || "",
      }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Language deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete language",
        color: "red",
      });
      console.error("Failed to delete language:", error);
    }
  };

  const languageMappingFromDTOToRequest = (
    editingLanguage: Language | null
  ) => {
    if (editingLanguage != null) {
      return {
        language: editingLanguage.language,
        isActive: editingLanguage.isActive,
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
            title="Language"
            onAdd={() => setShowForm(true)}
            addLabel="Add Language"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <LanguageActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedLanguageId}
              isDeleteDisabled={!selectedLanguageId}
            />
            <LanguageTable
              languages={filteredLanguages}
              onSelectLanguage={setSelectedLanguageId}
              onDeleteLanguage={handleDeleteLanguage}
              onViewLanguage={handleViewLanguage}
              onEditLanguage={handleEditLanguage}
              selectedLanguage={selectedLanguageId}
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
              setEditingLanguage(null);
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
                ? "View Language"
                : editingLanguage
                ? "Edit Language"
                : "Add Language"
            }
          />
          <LanguageForm
            initialValues={
              languageMappingFromDTOToRequest(editingLanguage) || {
                isActive: "Y",
                language: "",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingLanguage(null);
            }}
            mode={viewMode ? "view" : editingLanguage ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminLanguage;
