import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HistoryForm, {
  HistoryFormValues,
} from "Components/Admin/AdminOtherDetails/AdminHistory/HistoryForm";

import type { AdminHistory, AdminHistoryDTO } from "Types/Admin/AdminHistoryType";
import { useUpdateHistoryMutation } from "Services/HistoryApiSlice";
import { notifications } from "@mantine/notifications";

interface LocationState {
  item?: AdminHistory;
}

const AdminHistoryEdit: React.FC = () => {
  const navigate = useNavigate();
  const plantEnv = process.env.REACT_APP_PLANT ?? "";

  const location = useLocation();
  const state = location.state as LocationState;
  const item = state?.item;

  const [updateHistory, { isLoading }] = useUpdateHistoryMutation();

  if (!item) {
    // if user refreshes edit page without state
    return (
      <div style={{ padding: "24px 48px" }}>
        <p>History entry not found.</p>
        <button
          onClick={() => navigate("/admin/other-details/history")}
          className="mt-2 px-4 py-2 border rounded text-sm"
        >
          Back to History
        </button>
      </div>
    );
  }

  const initialValues: HistoryFormValues = {
    year: item.year,
    title: item.title,
    description1: item.description1 ?? "",
    description2: item.description2 ?? "",
    description3: item.description3 ?? "",
    imageUrl: item.imageUrl ?? null,
  };

  const handleSubmit = async (values: HistoryFormValues, file: File | null) => {
    const payload: AdminHistoryDTO = {
      id: item.id,
      plant: item.plant || plantEnv,
      year: values.year,
      title: values.title,
      description1: values.description1,
      description2: values.description2,
      description3: values.description3,
    };

    try {
      await updateHistory({ data: payload, file }).unwrap();

      notifications.show({
        title: "Success",
        message: "History entry updated successfully.",
        color: "green",
      });

      navigate("/admin/other-details/history");
    } catch (error: any) {
      console.error("Update history error:", error);
      notifications.show({
        title: "Error",
        message:
          error?.data?.message ||
          "Failed to update history entry. Please try again.",
        color: "red",
      });
    }
  };

  return (
    <div style={{ padding: "24px 48px" }}>
      <h3 style={{ marginBottom: 16 }}>Edit History</h3>

      <HistoryForm
        mode="edit"
        initialValues={initialValues}
        loading={isLoading}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/other-details/history")}
      />
    </div>
  );
};

export default AdminHistoryEdit;
