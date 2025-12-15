
import React from "react";
import { useNavigate } from "react-router-dom";
import GlossaryForm from "Components/Admin/AdminOtherDetails/AdminGlossary/GlossaryForm";
import { useCreateGlossaryMutation } from "Services/GlossaryApiSlice";
import { notifications } from "@mantine/notifications";

const AdminGlossaryAdd: React.FC = () => {
  const navigate = useNavigate();
  const [createGlossary] = useCreateGlossaryMutation();

  const handleSave = async (formData: FormData) => {
    try {
      await createGlossary(formData).unwrap();

      notifications.show({
        title: "Glossary Created",
        message: "The glossary has been successfully added.",
        color: "green",
      });

      navigate("/admin/other-details/glossary");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create glossary.",
        color: "red",
      });
      console.error("Create Glossary Error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin/other-details/glossary");
  };

  return (
    <div className="px-8 pt-6">
      <GlossaryForm item={null} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};

export default AdminGlossaryAdd;
