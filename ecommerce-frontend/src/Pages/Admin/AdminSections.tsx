"use client";

import { notifications } from "@mantine/notifications";
import { SectionActions } from "Components/Admin/AdminSection/SectionActions";
import { SectionForm } from "Components/Admin/AdminSection/SectionForm";
import { SectionTable } from "Components/Admin/AdminSection/SectionTable";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useCreateSectionMutation,
  useDeleteSectionMutation,
  useGetAllSectionsQuery,
  useUpdateSectionMutation,
  useUploadSectionImagesMutation,
} from "Services/Admin/SectionApiSlice";
import CircularLoader from "Templates/Template3/Components/Common/CircularLoader";
import {
  SectionAdminDTO,
  SectionAdminRequestDTO,
} from "Types/Admin/AdminSectionType";

const AdminSection = () => {
  const {
    data: apiSections = [],
    isLoading,
    refetch,
  } = useGetAllSectionsQuery();
  const sections: SectionAdminDTO[] = apiSections as SectionAdminDTO[];

  const [createSection] = useCreateSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [uploadSectionImages] = useUploadSectionImagesMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionAdminDTO | null>(
    null
  );
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null
  );

  const [filteredSections, setFilteredSections] = useState<SectionAdminDTO[]>(
    []
  );
  const [searchText, setSearchText] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let filtered = sections ? [...sections] : [];

    if (searchText) {
      filtered = filtered.filter((section) =>
        section.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredSections);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredSections(filtered);
    }
  }, [sections, searchText]);

  const handleViewSection = async (id: number) => {
    try {
      const sectionToView = sections.find((section) => section.id === id);
      if (sectionToView) {
        setEditingSection(sectionToView);
        setViewMode(true);
        setShowForm(true);
      }
      refetch();
    } catch (error) {
      console.error("Failed to get section details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load section details",
        color: "red",
      });
    }
  };

  const handleEditSection = async (id: number) => {
    try {
      const sectionToEdit = sections.find((section) => section.id === id);
      if (sectionToEdit) {
        setEditingSection(sectionToEdit);
        const mappedData = sectionMappingFromDTOToRequest(sectionToEdit);
        setFormData(
          mappedData
            ? { ...mappedData, productList: sectionToEdit.productsList }
            : {
                name: "",
                description: "",
                ctaText: "Shop Now",
                imageCount: 1,
                productList: [],
              }
        );
        setViewMode(false);
        setShowForm(true);
      }
      refetch();
    } catch (error) {
      console.error("Failed to get section details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load section details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (
    data: SectionAdminRequestDTO,
    imageFiles: (File | null)[]
  ) => {
    let FileArray = imageFiles.filter((file) => file !== null) as File[];
    try {
      if (editingSection) {
        await updateSection({
          id: Number(editingSection.id),
          data: data,
        }).unwrap();
        if (FileArray.length > 0) {
          await uploadSectionImages({
            id: editingSection.id,
            images: FileArray,
          }).unwrap();
        }
        await refetch();
        notifications.show({
          title: "Success!",
          message: "Section updated successfully",
          color: "teal",
        });
      } else {
        const id = await createSection(data).unwrap();

        if (FileArray.length > 0) {
          await uploadSectionImages({
            id: id as number,
            images: FileArray,
          }).unwrap();
        }
        await refetch();
        notifications.show({
          title: "Success!",
          message: "Section created successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingSection(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save section:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedSectionId) {
      setIsDeleting(true);
      try {
        await deleteSection(selectedSectionId).unwrap();
        await refetch();
        setSelectedSectionId(null);
        notifications.show({
          title: "Success!",
          message: "Section deleted successfully",
          color: "teal",
        });
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete section",
          color: "red",
        });
        console.error("Failed to delete section:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteSection = async (id: number) => {
    try {
      await deleteSection(id).unwrap();
      notifications.show({
        title: "Success!",
        message: "Section deleted successfully",
        color: "teal",
      });
      refetch();
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete section",
        color: "red",
      });
      console.error("Failed to delete section:", error);
    }
  };

  const sectionMappingFromDTOToRequest = (
    sectionAdminDTO: SectionAdminDTO | null
  ) => {
    if (sectionAdminDTO != null) {
      return {
        ctaText: sectionAdminDTO.ctaText,
        description: sectionAdminDTO.description,
        imageCount: sectionAdminDTO.catalogCount,
        name: sectionAdminDTO.name,
        productList: sectionAdminDTO.productsList,
      } as SectionAdminRequestDTO;
    } else {
      return null;
    }
  };

  const [formData, setFormData] = useState<SectionAdminRequestDTO>(
    sectionMappingFromDTOToRequest(editingSection) || {
      name: "",
      description: "",
      ctaText: "",
      imageCount: 1,
      productList: [],
    }
  );

  const DEFAULT_FORM_VALUES = {
    name: "",
    description: "",
    ctaText: "Shop Now",
    imageCount: 1,
    productList: [],
  };

  return (
    <>
      {isDeleting ? (
        <CircularLoader />
      ) : (
        <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
          {!showForm ? (
            <>
              <Header
                title="Sections"
                onAdd={() => {
                  setShowForm(true);
                  setEditingSection(null);
                  setViewMode(false);
                  setFormData({
                    name: "",
                    description: "",
                    ctaText: "Shop Now",
                    imageCount: 1,
                    productList: [],
                  });
                }}
                addLabel="Add Section"
              />
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
                <SectionActions
                  onDelete={handleDelete}
                  onSearchChange={setSearchText}
                  isDeleteDisabled={!selectedSectionId}
                />
                <SectionTable
                  sections={filteredSections}
                  onSelectSection={setSelectedSectionId}
                  onDeleteSection={handleDeleteSection}
                  onViewSection={handleViewSection}
                  onEditSection={handleEditSection}
                  selectedSection={selectedSectionId}
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
                  setEditingSection(null);
                  setViewMode(false);
                }}
              >
                {/* <ArrowLeft className="h-4 w-4" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                
                <span className="text-sm">Back</span>
              </button>
              <Header
                title={
                  viewMode
                    ? "View Section"
                    : editingSection
                    ? "Edit Section"
                    : "Add Section"
                }
              />
              <SectionForm
                initialValues={
                  viewMode
                    ? sectionMappingFromDTOToRequest(editingSection)!
                    : editingSection
                    ? sectionMappingFromDTOToRequest(editingSection) ||
                      DEFAULT_FORM_VALUES
                    : DEFAULT_FORM_VALUES
                }
                existingImages={
                  [
                    editingSection?.image1 || undefined,
                    editingSection?.image2 || undefined,
                    editingSection?.image3 || undefined,
                    editingSection?.image4 || undefined,
                  ].filter(Boolean) as string[]
                }
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setViewMode(false);
                  setEditingSection(null);
                }}
                mode={viewMode ? "view" : editingSection ? "edit" : "add"}
                onProductSelectionChange={(productIds) => {
                  setFormData((prev: any) => ({
                    ...prev,
                    productList: productIds,
                  }));
                }}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AdminSection;