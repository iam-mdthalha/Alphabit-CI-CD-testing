import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEventByIdQuery } from "Services/EventApiSlice";
import { notifications } from "@mantine/notifications";
import { Loader, Center, Card, Text, Group } from "@mantine/core";
import dayjs from "dayjs";

const AdminEventsView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const plant = process.env.REACT_APP_PLANT;

  const {
    data: event,
    isLoading,
    error,
  } = useGetEventByIdQuery({ id: Number(id!), plant }, { skip: !id });

  React.useEffect(() => {
    if (error) {
      notifications.show({
        title: "Error",
        message: "Failed to load event details",
        color: "red",
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <Center style={{ height: "400px" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-black-600 mb-3 flex items-center gap-1 hover:text-black-800"
        >
          ← Back
        </button>
        <div className="text-center py-8 text-gray-500">Event not found</div>
      </div>
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

      <h2 className="text-xl font-semibold mb-4">Event Details</h2>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="xl" fw={700}>
          {event.name || event.eventName}
        </Text>
        <Text mb="md">{event.description || event.eventDescription}</Text>
        <div className="space-y-3">
          <div>
            <Text size="sm" fw={600} c="dimmed">
              Date & Time
            </Text>
            <Text>
              {dayjs(
                event.startDate || `${event.eventDate} ${event.eventStartTime}`
              ).format("MMM D, YYYY hh:mm A")}{" "}
              -{" "}
              {dayjs(
                event.endDate || `${event.eventDate} ${event.eventEndTime}`
              ).format("MMM D, YYYY hh:mm A")}
            </Text>
          </div>

          <div>
            <Text size="sm" fw={600} c="dimmed">
              Venue
            </Text>
            <Text>{event.venue || event.eventAddress || "Not specified"}</Text>
          </div>

          <div>
            <Text size="sm" fw={600} c="dimmed">
              Audience
            </Text>
            <Text>
              {event.audience?.join(", ") ||
                event.audienceType ||
                "Not specified"}
            </Text>
          </div>

          {/* <div>
            <Text size="sm" fw={600} c="dimmed">
              Plant
            </Text>
            <Text>{event.plant}</Text>
          </div>

          {event.createdAt && (
            <div>
              <Text size="sm" fw={600} c="dimmed">
                Created
              </Text>
              <Text>
                {dayjs(event.createdAt).format("MMM D, YYYY hh:mm A")}
              </Text>
            </div>
          )} */}
        </div>
        {event.imageUrls && event.imageUrls.length > 0 && (
          <div className="mt-6">
            <Text size="sm" fw={600} c="dimmed" mb="sm">
              Images ({event.imageUrls.length})
            </Text>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {event.imageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Event image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/300x200?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs text-center py-1">
                    Image {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminEventsView;
