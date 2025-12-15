import React from "react";
import { useNavigate } from "react-router-dom";
import HistoryTable from "Components/Admin/AdminOtherDetails/AdminHistory/HistoryTable";

import type { AdminHistory as AdminHistoryType } from "Types/Admin/AdminHistoryType";
import {
  useGetAllHistoryQuery,
  useDeleteHistoryMutation,
} from "Services/HistoryApiSlice";
import { notifications } from "@mantine/notifications";
import { Loader, Center } from "@mantine/core";

const AdminHistory: React.FC = () => {
  const navigate = useNavigate();
  const plant = process.env.REACT_APP_PLANT ?? "";

  const {
    data: items = [],
    isLoading,
    isError,
  } = useGetAllHistoryQuery({ plant });

  const [deleteHistory, { isLoading: isDeleting }] =
    useDeleteHistoryMutation();

  const handleAdd = () => navigate("/admin/other-details/history/add");

 const handleEdit = (item: AdminHistoryType) => {

    navigate("/admin/other-details/history/edit", { state: { item } });
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Delete this history entry? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await deleteHistory({ id, plant }).unwrap();
      notifications.show({
        title: "Deleted",
        message: "History entry deleted successfully",
        color: "green",
      });
    } catch (error: any) {
      console.error("Delete history error:", error);
      notifications.show({
        title: "Error",
        message:
          error?.data?.message || "Failed to delete history entry. Please try again.",
        color: "red",
      });
    }
  };

  if (isLoading) {
    return (
      <Center style={{ height: "400px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: "24px 48px" }}>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>History</h3>
        </div>
        <div style={{ color: "#b91c1c" }}>
          Failed to load history entries. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 48px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h3 style={{ margin: 0 }}>History</h3>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded shadow hover:bg-blue-700"
          disabled={isDeleting}
        >
          + Add History
        </button>
      </div>

      <HistoryTable items={items} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default AdminHistory;
