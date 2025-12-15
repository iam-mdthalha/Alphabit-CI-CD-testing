import React, { useEffect } from "react";
import EventsForm from "Components/Admin/AdminOtherDetails/AdminEvents/EventsForm";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useGetEventByIdQuery } from "Services/EventApiSlice";
import { notifications } from "@mantine/notifications";
import { Loader, Center } from "@mantine/core";

const AdminEventsEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || "edit";
  const plant = process.env.REACT_APP_PLANT;

  const {
    data: eventData,
    isLoading,
    error,
  } = useGetEventByIdQuery({ id: Number(id!), plant }, { skip: !id });

  useEffect(() => {
    if (error) {
      notifications.show({
        title: "Error",
        message: "Failed to load event details",
        color: "red",
        autoClose: 5000,
      });
    }
  }, [error]);

  const handleSave = () => {
    navigate("/admin/other-details/events");
  };

  if (isLoading) {
    return (
      <Center style={{ height: "400px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <button
        onClick={() => navigate(-1)}
        className="text-black-600 mb-3 flex items-center gap-1 hover:text-black-800"
      >
        ← Back
      </button>

      <h2 className="text-xl font-semibold mb-4">
        {mode === "view" ? "View Event" : "Edit Event"}
      </h2>

      {eventData ? (
        <EventsForm
          item={eventData}
          onSave={handleSave}
          onCancel={() => navigate(-1)}
          mode={mode}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          No event data found for ID {id}
        </div>
      )}
    </div>
  );
};

export default AdminEventsEdit;
