import React from "react";
import EventsForm from "Components/Admin/AdminOtherDetails/AdminEvents/EventsForm";
import { useNavigate } from "react-router-dom";

const AdminEventsAdd: React.FC = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate("/admin/other-details/events");
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <button
        onClick={() => navigate(-1)}
        className="text-black-600 mb-3 flex items-center gap-1 hover:text-black-800"
      >
        ← Back
      </button>

      <h2 className="text-xl font-semibold mb-4">Add Event</h2>

      <EventsForm
        item={null}
        onSave={handleSave}
        onCancel={() => navigate(-1)}
        mode="add"
      />
    </div>
  );
};

export default AdminEventsAdd;
