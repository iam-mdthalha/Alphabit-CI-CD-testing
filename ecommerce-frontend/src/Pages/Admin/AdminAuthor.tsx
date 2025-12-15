"use client";

import { notifications } from "@mantine/notifications";
import { AuthorActions } from "Components/Admin/AdminAuthor/AuthorActions";
import { AuthorForm } from "Components/Admin/AdminAuthor/AuthorForm";
import { AuthorTable } from "Components/Admin/AdminAuthor/AuthorTable";
import { Header } from "Components/Admin/StyleComponent/Header";
import { useEffect, useState } from "react";
import {
  useAddAuthorMutation,
  useDeleteAuthorMutation,
  useGetAllAuthorsQuery,
  useUpdateAuthorMutation,
} from "Services/Admin/AuthorApiSlice";
import { Author } from "Types/Admin/AdminAuthorType";

const PLANT = process.env.REACT_APP_PLANT;

const AdminAuthor = () => {
  const { data: apiAuthors = [], isLoading } = useGetAllAuthorsQuery({
    plant: PLANT || "",
  });

  const authors: Author[] = apiAuthors.map((author: Author) => ({
    id: author.id,
    author: author.author,
    isActive: author.isActive,
    crBy: author.crBy,
    upBy: author.upBy,
    createdAt: author.createdAt,
    updatedAt: author.updatedAt,
    plant: author.plant,
  }));

  const [addAuthor] = useAddAuthorMutation();
  const [updateAuthor] = useUpdateAuthorMutation();
  const [deleteAuthor] = useDeleteAuthorMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);

  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = authors ? [...authors] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter((author) => author.isActive === "Y");
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter((author) => author.isActive !== "Y");
    }

    if (searchText) {
      filtered = filtered.filter((author) =>
        author.author
          .trim()
          .toLowerCase()
          .includes(searchText.trim().toLowerCase())
      );
    }

    const currentFilteredJSON = JSON.stringify(filtered);
    const previousFilteredJSON = JSON.stringify(filteredAuthors);

    if (currentFilteredJSON !== previousFilteredJSON) {
      setFilteredAuthors(filtered);
    }
  }, [authors, filterOption, searchText]);

  const handleViewAuthor = async (id: number) => {
    try {
      const authorToView = authors.find((author) => author.id === id);

      if (authorToView) {
        setEditingAuthor(authorToView);
        setViewMode(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get author details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load author details",
        color: "red",
      });
    }
  };

  const handleEditAuthor = async (id: number) => {
    try {
      const authorToEdit = authors.find((author) => author.id === id);

      if (authorToEdit) {
        setEditingAuthor(authorToEdit);
        setViewMode(false);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to get author details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load author details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (data: { author: string; isActive: string }) => {
    try {
      if (editingAuthor) {
        await updateAuthor({
          id: editingAuthor.id,
          plant: PLANT || "",
          data: {
            author: data.author,
            isActive: data.isActive,
            upBy: "admin", 
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Author updated successfully",
          color: "teal",
        });
      } else {
        await addAuthor({
          plant: PLANT || "",
          data: {
            author: data.author,
            isActive: data.isActive,
            crBy: "admin", 
          },
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Author added successfully",
          color: "teal",
        });
      }

      setShowForm(false);
      setEditingAuthor(null);
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Operation failed",
        color: "red",
      });
      console.error("Failed to save author:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedAuthorId) {
      try {
        await deleteAuthor({
          id: selectedAuthorId,
          plant: PLANT || "",
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Author deleted successfully",
          color: "teal",
        });
        setSelectedAuthorId(null);
      } catch (error) {
        notifications.show({
          title: "Error!",
          message: "Failed to delete author",
          color: "red",
        });
        console.error("Failed to delete author:", error);
      }
    }
  };

  const handleDeleteAuthor = async (id: number) => {
    try {
      await deleteAuthor({
        id,
        plant: PLANT || "",
      }).unwrap();
      notifications.show({
        title: "Success!",
        message: "Author deleted successfully",
        color: "teal",
      });
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete author",
        color: "red",
      });
      console.error("Failed to delete author:", error);
    }
  };

  const authorMappingFromDTOToRequest = (editingAuthor: Author | null) => {
    if (editingAuthor != null) {
      return {
        author: editingAuthor.author,
        isActive: editingAuthor.isActive,
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
            title="Author"
            onAdd={() => setShowForm(true)}
            addLabel="Add Author"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <AuthorActions
              hideEdit={false}
              onDelete={handleDelete}
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isEditDisabled={!selectedAuthorId}
              isDeleteDisabled={!selectedAuthorId}
            />
            <AuthorTable
              authors={filteredAuthors}
              onSelectAuthor={setSelectedAuthorId}
              onDeleteAuthor={handleDeleteAuthor}
              onViewAuthor={handleViewAuthor}
              onEditAuthor={handleEditAuthor}
              selectedAuthor={selectedAuthorId}
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
              setEditingAuthor(null);
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
                ? "View Author"
                : editingAuthor
                ? "Edit Author"
                : "Add Author"
            }
          />
          <AuthorForm
            initialValues={
              authorMappingFromDTOToRequest(editingAuthor) || {
                isActive: "Y",
                author: "",
              }
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingAuthor(null);
            }}
            mode={viewMode ? "view" : editingAuthor ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminAuthor;
