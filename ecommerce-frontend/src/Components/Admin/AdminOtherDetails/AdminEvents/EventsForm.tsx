import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import {
  useCreateEventMutation,
  useUpdateEventMutation,
} from "Services/EventApiSlice";
import { useGetAllEventRegistrationsQuery } from "Services/EventRegistrationApiSlice";
import { AdminEvent, AudienceType } from "Types/Admin/AdminEventType";
import { notifications } from "@mantine/notifications";

type Props = {
  item?: AdminEvent | null;
  onSave: () => void;
  onCancel: () => void;
  mode?: "add" | "edit" | "view";
};

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e6e6e6",
  padding: 16,
  borderRadius: 6,
};

const fieldStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "8px 10px",
  borderRadius: 4,
  border: "1px solid #d9d9d9",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...fieldStyle,
  minHeight: 80,
  resize: "vertical",
};

const EventsForm: React.FC<Props> = ({
  item = null,
  onSave,
  onCancel,
  mode = "add",
}) => {

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const [startDate, setStartDate] = useState<Date | null>(() => {
    if (item?.eventDate && item?.eventStartTime) {
      try {
        const dateStr = `${item.eventDate} ${item.eventStartTime}`;
        return dayjs(dateStr, "DD/MM/YYYY HH:mm").toDate();
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [endDate, setEndDate] = useState<Date | null>(() => {
    if (item?.eventDate && item?.eventEndTime) {
      try {
        const dateStr = `${item.eventDate} ${item.eventEndTime}`;
        return dayjs(dateStr, "DD/MM/YYYY HH:mm").toDate();
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [eventAddress, setEventAddress] = useState(item?.eventAddress ?? "");
  const [audience, setAudience] = useState<AudienceType[]>(
    item?.audience ?? []
  );
  const [eventCity, setEventCity] = useState(item?.eventCity ?? "Chennai");
  const [eventType, setEventType] = useState<"Online" | "In-Person">(() => {
    const type = item?.eventType;
    if (type === "In-Person" || type === "Online") {
      return type;
    }
    return "Online";
  });

  const [ticketType, setTicketType] = useState<"Free" | "Chargeable">(() => {
    const type = item?.ticketType;
    if (type === "Free" || type === "Chargeable") {
      return type;
    }

    if (type === "FREE") {
      return "Free";
    }
    return "Free";
  });
  const [files, setFiles] = useState<FileList | null>(null);

  const plant = process.env.REACT_APP_PLANT;
  const shouldLoadRegistrations = !!item?.id && mode !== "add";

  const {
    data: allRegistrations,
    isLoading: isRegistrationsLoading,
    isError: isRegistrationsError,
  } = useGetAllEventRegistrationsQuery(
    { plant: plant as string },
    { skip: !shouldLoadRegistrations }
  );

  const registrationsForThisEvent =
    allRegistrations?.filter(
      (registration) => registration.eventHdrId === item?.id
    ) ?? [];

  const isLoading = isCreating || isUpdating;

  function toggleAudience(val: AudienceType) {
    if (mode === "view") return;
    setAudience((prev) =>
      prev.includes(val) ? prev.filter((a) => a !== val) : [...prev, val]
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mode === "view") return;

    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const invalidFiles = Array.from(selectedFiles).filter(
        (file) => !file.type.startsWith("image/")
      );

      if (invalidFiles.length > 0) {
        notifications.show({
          title: "Error",
          message: "Please select only image files",
          color: "red",
          autoClose: 5000,
        });
        e.target.value = "";
        return;
      }

      setFiles(selectedFiles);
    } else {
      setFiles(null);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "view") return;

    try {
      if (!startDate || !endDate) {
        notifications.show({
          title: "Error",
          message: "Please select start and end dates",
          color: "red",
          autoClose: 5000,
        });
        return;
      }

      if (mode === "add" && (!files || files.length === 0)) {
        notifications.show({
          title: "Error",
          message: "Please upload at least one image file",
          color: "red",
          autoClose: 5000,
        });
        return;
      }

      const eventDate = dayjs(startDate!).format("DD/MM/YYYY");
      const eventStartTime = dayjs(startDate!).format("HH:mm");
      const eventEndTime = dayjs(endDate!).format("HH:mm");

      const eventData = {
        plant: plant,
        eventName: name,
        eventDescription: description,
        eventType: eventType,
        eventDate: eventDate,
        eventStartTime: eventStartTime,
        eventEndTime: eventEndTime,
        eventCity: eventCity,
        eventAddress: eventAddress,
        ticketType: ticketType === "Free" ? "FREE" : "Chargeable",
        audienceType: audience.length > 0 ? audience.join(",") : "Public",
      };

      const eventDataForUpdate =
        mode === "edit" && item?.id
          ? {
              ...eventData,
              id: item.id,
            }
          : eventData;

      const finalData = mode === "edit" ? eventDataForUpdate : eventData;

      const formData = new FormData();
      formData.append("data", JSON.stringify(finalData));

      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append("file", file);
        });
      } else if (mode === "add") {
        notifications.show({
          title: "Error",
          message: "At least one image file is required for new events",
          color: "red",
          autoClose: 5000,
        });
        return;
      }

      if (mode === "edit" && item?.id) {
        const result = await updateEvent(formData).unwrap();
        notifications.show({
          title: "Success",
          message: "Event updated successfully",
          color: "green",
        });
      } else {
        const result = await createEvent(formData).unwrap();
        notifications.show({
          title: "Success",
          message: "Event created successfully",
          color: "green",
        });
      }

      onSave();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message:
          error?.data?.message ||
          (mode === "edit"
            ? "Failed to update event"
            : "Failed to create event"),
        color: "red",
        autoClose: 5000,
      });
    }
  }

  const isViewMode = mode === "view";

  return (
    <>
      <form onSubmit={handleSubmit} style={cardStyle}>
        <button
          id="eventsFormSubmit"
          type="submit"
          style={{ display: "none" }}
        />
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <label>Start Date & Time</label>
            <DatePicker
              selected={startDate}
              onChange={(d) => !isViewMode && setStartDate(d)}
              required
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              placeholderText="dd/mm/yyyy --:--"
              className="form-input"
              disabled={isViewMode}
              isClearable
              onFocus={(e) => e.target.blur()}
            />
          </div>

          <div className="flex-1">
            <label>End Date & Time</label>
            <DatePicker
              selected={endDate}
              onChange={(d) => !isViewMode && setEndDate(d)}
              required
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              placeholderText="dd/mm/yyyy --:--"
              className="form-input"
              disabled={isViewMode}
              isClearable
              onFocus={(e) => e.target.blur()}
            />
          </div>
        </div>
        <div className="mb-3">
          <label>Event Name</label>
          <input
            style={fieldStyle}
            value={name}
            required
            onChange={(e) => !isViewMode && setName(e.target.value)}
            placeholder="Enter event name"
            disabled={isViewMode}
          />
        </div>
        <div className="mb-3">
          <label>Event Description</label>
          <textarea
            style={textareaStyle}
            value={description}
            required
            onChange={(e) => !isViewMode && setDescription(e.target.value)}
            placeholder="Enter event description"
            disabled={isViewMode}
          />
        </div>
        <div className="mb-3">
          <label>Event Address</label>
          <input
            style={fieldStyle}
            value={eventAddress}
            required
            onChange={(e) => !isViewMode && setEventAddress(e.target.value)}
            placeholder="Enter event address/venue"
            disabled={isViewMode}
          />
        </div>
        <div className="mb-3">
          <label>Event City</label>
          <input
            style={fieldStyle}
            value={eventCity}
            required
            onChange={(e) => !isViewMode && setEventCity(e.target.value)}
            placeholder="Enter city"
            disabled={isViewMode}
          />
        </div>
        <div className="mb-3">
          <label>Event Type</label>
          <select
            style={fieldStyle}
            value={eventType}
            required
            onChange={(e) =>
              !isViewMode &&
              setEventType(e.target.value as "Online" | "In-Person")
            }
            disabled={isViewMode}
          >
            <option value="">Select event type</option>
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Ticket Type</label>
          <select
            style={fieldStyle}
            value={ticketType}
            required
            onChange={(e) =>
              !isViewMode &&
              setTicketType(e.target.value as "Free" | "Chargeable")
            }
            disabled={isViewMode}
          >
            <option value="">Select ticket type</option>
            <option value="Free">Free</option>
            <option value="Chargeable">Chargeable</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Audience Type</label>
          <div className="flex gap-6 mt-2">
            {["Industry", "Government", "Academia", "Public"].map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={audience.includes(type as AudienceType)}
                  onChange={() => toggleAudience(type as AudienceType)}
                  disabled={isViewMode}
                />{" "}
                {type}
              </label>
            ))}
          </div>
        </div>

        {(mode === "edit" || mode === "view") &&
          item?.imageUrls &&
          item.imageUrls.length > 0 && (
            <div className="mb-3">
              <label>Current Images</label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {item.imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Event image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded border border-gray-300 hover:shadow-md transition-shadow"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/96x96?text=Image+Error";
                      }}
                      onLoad={() => console.log("Image loaded:", url)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              <small className="text-gray-500 mt-1 block">
                {item.imageUrls.length} image(s) uploaded
              </small>
            </div>
          )}

        {!isViewMode && (
          <div className="mb-3">
            <label>
              {mode === "add" ? "Upload Images" : "Upload New Images"}
              {mode === "add" && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={fieldStyle}
              accept="image/*"
              required={mode === "add"}
            />
            <small className="text-gray-500">
              {mode === "add"
                ? "At least one image is required"
                : "Optional: Select new images to add to existing ones"}
            </small>

            {files && files.length > 0 && (
              <div className="mt-2 text-sm text-green-600">
                Selected {files.length} new file(s):
                <ul className="mt-1 text-xs text-gray-500">
                  {Array.from(files).map((file, index) => (
                    <li key={index}>
                      • {file.name} ({Math.round(file.size / 1024)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </form>
       {/* Read-only registrations table */}
      {item?.id && (
        <div style={{ ...cardStyle, marginTop: 16 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">Event registrations</h3>
            {isRegistrationsLoading && (
              <span className="text-xs text-gray-500">Loading…</span>
            )}
          </div>

          {isRegistrationsError ? (
            <p className="text-sm text-red-600">
              Failed to load registrations. Please try again later.
            </p>
          ) : registrationsForThisEvent.length === 0 ? (
            <p className="text-sm text-gray-500">
              No registrations have been submitted for this event yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left border-b">#</th>
                    <th className="px-3 py-2 text-left border-b">Full Name</th>
                    <th className="px-3 py-2 text-left border-b">Email</th>
                    <th className="px-3 py-2 text-left border-b">
                      Mobile Number
                    </th>
                    <th className="px-3 py-2 text-left border-b">City</th>
                    <th className="px-3 py-2 text-left border-b">State</th>
                    <th className="px-3 py-2 text-left border-b">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {registrationsForThisEvent.map((reg: any, index: number) => {
                    const fullName = [reg.firstName, reg.lastName]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <tr
                        key={reg.id ?? index}
                        className="odd:bg-white even:bg-gray-50"
                      >
                        <td className="px-3 py-2 border-b align-top">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2 border-b align-top">
                          {fullName || "-"}
                        </td>
                        <td className="px-3 py-2 border-b align-top">
                          {reg.email || "-"}
                        </td>
                        <td className="px-3 py-2 border-b align-top">
                          {reg.contactNumber || "-"}
                        </td>
                        <td className="px-3 py-2 border-b align-top">
                          {reg.city || "-"}
                        </td>
                        <td className="px-3 py-2 border-b align-top">
                          {reg.state || "-"}
                        </td>
                        <td className="px-3 py-2 border-b align-top">
                          {reg.country || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}


      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>

        {!isViewMode && (
          <button
            onClick={() => document.getElementById("eventsFormSubmit")?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : mode === "edit"
              ? "Update Event"
              : "Create Event"}
          </button>
        )}
      </div>
    </>
  );
};

export default EventsForm;
