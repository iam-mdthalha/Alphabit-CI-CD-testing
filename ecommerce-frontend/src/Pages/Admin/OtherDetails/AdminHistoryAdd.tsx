import React from "react";
import { useNavigate } from "react-router-dom";
import HistoryForm, {
  HistoryFormValues,
} from "Components/Admin/AdminOtherDetails/AdminHistory/HistoryForm";

import type { AdminHistoryDTO } from "Types/Admin/AdminHistoryType";
import { useCreateHistoryMutation } from "Services/HistoryApiSlice";
import { notifications } from "@mantine/notifications";

const AdminHistoryAdd: React.FC = () => {
  const navigate = useNavigate();
  const plant = process.env.REACT_APP_PLANT ?? "";

  const [createHistory, { isLoading }] = useCreateHistoryMutation();

  const initialValues: HistoryFormValues = {
    year: new Date().getFullYear(),
    title: "",
    description1: "",
    description2: "",
    description3: "",
    imageUrl: undefined,
  };

  const handleSubmit = async (values: HistoryFormValues, file: File | null) => {
    if (!file) {
      
      notifications.show({
        title: "Image required",
        message: "Please upload an image for this history entry.",
        color: "red",
      });
      return;
    }

    const payload: AdminHistoryDTO = {
      plant,
      year: values.year,
      title: values.title,
      description1: values.description1,
      description2: values.description2,
      description3: values.description3,
    };

    try {
      await createHistory({ data: payload, file }).unwrap();

      notifications.show({
        title: "Success",
        message: "History entry created successfully.",
        color: "green",
      });

      navigate("/admin/other-details/history");
    } catch (error: any) {
      console.error("Create history error:", error);
      notifications.show({
        title: "Error",
        message:
          error?.data?.message ||
          "Failed to create history entry. Please try again.",
        color: "red",
      });
    }
  };

  return (
    <div style={{ padding: "24px 48px" }}>
      <h3 style={{ marginBottom: 16 }}>Add History</h3>

      <HistoryForm
        mode="add"
        initialValues={initialValues}
        loading={isLoading}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/other-details/history")}
      />
    </div>
  );
};

export default AdminHistoryAdd;
