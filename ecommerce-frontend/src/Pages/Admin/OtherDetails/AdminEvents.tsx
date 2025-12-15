import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllEventsQuery,
  useDeleteEventMutation,
} from "Services/EventApiSlice";
import EventsTable from "Components/Admin/AdminOtherDetails/AdminEvents/EventsTable";
import { AdminEvent } from "Types/Admin/AdminEventType";
import { notifications } from "@mantine/notifications";
import { Input, Loader, Center } from "@mantine/core";
import { Search } from "lucide-react";

const AdminEvents: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const plant = process.env.REACT_APP_PLANT;

  const {
    data: events = [],
    isLoading,
    refetch,
  } = useGetAllEventsQuery({
    plant,
    search: search || undefined,
  });

  const [deleteEvent] = useDeleteEventMutation();

  const handleView = (item: AdminEvent) => {
    navigate(`/admin/other-details/events/edit/${item.id}`, {
      state: { item, mode: "view" },
    });
  };

  const handleEdit = (item: AdminEvent) => {
    navigate(`/admin/other-details/events/edit/${item.id}`, {
      state: { item, mode: "edit" },
    });
  };

  const handleDelete = async (id: number) => {
    // const confirmDelete = window.confirm(
    //   "Are you sure you want to delete this event?"
    // );
    // if (!confirmDelete) return;

    try {
      await deleteEvent({ id, plant }).unwrap();
      notifications.show({
        title: "Success",
        message: "Event deleted successfully",
        color: "green",
        autoClose: 3000,
      });
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error?.data?.message || "Failed to delete event",
        color: "red",
        autoClose: 5000,
      });
    }
  };

  const handleAdd = () => {
    navigate(`/admin/other-details/events/add`);
  };

  if (isLoading) {
    return (
      <Center style={{ height: "400px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <div className="px-8 pt-6">
      <div className="flex items-center justify-between mb-5 max-w-6xl mx-auto">
        <h3 className="text-base font-medium">Events</h3>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftSection={<Search size={16} />}
            style={{ width: 300 }}
          />

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            + Add Event
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded shadow-sm w-full max-w-6xl mx-auto min-h-[260px]">
        <EventsTable
          items={events}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default AdminEvents;
