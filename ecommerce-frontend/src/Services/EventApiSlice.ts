import {
  EventResponse,
  EventFormData,
  AudienceType,
  AdminEvent,
  EventType,
  TicketType,
} from "Types/Admin/AdminEventType";
import { ApiService } from "./ApiService";

export const EventApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query<
      AdminEvent[],
      { plant: string; search?: string }
    >({
      query: (params) => ({
        url: `/Event/getAll`,
        method: "GET",
        params: {
          plant: params.plant,
          ...(params.search && { search: params.search }),
        },
      }),
      transformResponse: (response: any) => {
        const eventsArray = response.results || [];

        return eventsArray.map((eventObj: any) => {
          const event = eventObj.eventHdr || {};
          const eventDet = eventObj.eventDet || [];

          const parseDate = (isoString: string) => {
            if (!isoString) return "";
            try {
              const date = new Date(isoString);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            } catch (e) {
              return "";
            }
          };

          const parseTime = (isoString: string) => {
            if (!isoString) return "";
            try {
              const date = new Date(isoString);
              const hours = String(date.getHours()).padStart(2, "0");
              const minutes = String(date.getMinutes()).padStart(2, "0");
              return `${hours}:${minutes}`;
            } catch (e) {
              return "";
            }
          };

          const eventDate = parseDate(event.eventDate);
          const eventStartTime = parseTime(event.eventStartTime);
          const eventEndTime = parseTime(event.eventEndTime);

          return {
            id: event.id,
            name: event.eventName,
            description: event.eventDescription,
            startDate: eventDate + " " + eventStartTime,
            endDate: eventDate + " " + eventEndTime,
            venue: event.eventAddress,
            audience: event.audienceType
              ? event.audienceType
                  .split(",")
                  .map((a: string) => a.trim() as AudienceType)
              : [],

            eventName: event.eventName,
            eventDescription: event.eventDescription,
            eventType: (event.eventType as EventType) || "Online",
            eventDate: eventDate,
            eventStartTime: eventStartTime,
            eventEndTime: eventEndTime,
            eventAddress: event.eventAddress,
            eventCity: event.eventCity,
            ticketType: (event.ticketType as TicketType) || "Free",
            audienceType: event.audienceType,
            plant: event.plant,
            createdAt: event.crAt,

            imageUrls: eventDet
              .map((det: any) => {
                const imageUrl = det.eventImage;
                console.log("Found image URL in eventDet:", imageUrl);
                return imageUrl;
              })
              .filter((url: string) => url && url.trim() !== ""),
          };
        });
      },
      providesTags: ["Event"],
    }),

    getEventById: builder.query<AdminEvent, { id: number; plant: string }>({
      query: (params) => ({
        url: `/Event`,
        method: "GET",
        params: {
          id: params.id,
          plant: params.plant,
        },
      }),
      transformResponse: (response: any) => {
        console.log("=== getEventById Raw Response ===");
        console.log("Full response:", response);

        const eventObj = response.results || {};
        const event = eventObj.eventHdr || {};
        const eventDet = eventObj.eventDet || [];

        console.log("eventHdr:", event);
        console.log("eventDet:", eventDet);
        console.log("Number of images in eventDet:", eventDet.length);

        const parseDate = (isoString: string) => {
          if (!isoString) return "";
          try {
            const date = new Date(isoString);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
          } catch (e) {
            return "";
          }
        };

        const parseTime = (isoString: string) => {
          if (!isoString) return "";
          try {
            const date = new Date(isoString);
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
          } catch (e) {
            return "";
          }
        };

        const eventDate = parseDate(event.eventDate);
        const eventStartTime = parseTime(event.eventStartTime);
        const eventEndTime = parseTime(event.eventEndTime);

        console.log("=== API RESPONSE PARSING ===");
        console.log("Raw eventType:", event.eventType);
        console.log("Raw ticketType:", event.ticketType);
        console.log(
          "EventDet images:",
          eventDet.map((det: any) => det.eventImage)
        );

        const imageUrls = eventDet
          .map((det: any) => det.eventImage)
          .filter((url: string) => url && url.trim() !== "");

        console.log("Extracted imageUrls:", imageUrls);

        return {
          id: event.id,
          name: event.eventName,
          description: event.eventDescription,
          startDate: eventDate + " " + eventStartTime,
          endDate: eventDate + " " + eventEndTime,
          venue: event.eventAddress,
          audience: event.audienceType
            ? event.audienceType
                .split(",")
                .map((a: string) => a.trim() as AudienceType)
            : [],

          eventName: event.eventName,
          eventDescription: event.eventDescription,
          eventType: (event.eventType === "In-Person"
            ? "In-Person"
            : "Online") as EventType,
          eventDate: eventDate,
          eventStartTime: eventStartTime,
          eventEndTime: eventEndTime,
          eventAddress: event.eventAddress,
          eventCity: event.eventCity,
          plant: event.plant,
          ticketType: (event.ticketType === "FREE"
            ? "Free"
            : "Chargeable") as TicketType,
          audienceType: event.audienceType,
          createdAt: event.crAt,

          imageUrls: imageUrls,
        };
      },
      providesTags: (result, error, arg) => [{ type: "Event", id: arg.id }],
    }),

    createEvent: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `/Event/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Event"],
    }),

    updateEvent: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: `/Event/update`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => {
        const data = JSON.parse(arg.get("data") as string);
        return [{ type: "Event", id: data.id }, "Event"];
      },
    }),

    deleteEvent: builder.mutation<void, { id: number; plant: string }>({
      query: (params) => ({
        url: `/Event/delete`,
        method: "DELETE",
        params: {
          id: params.id,
          plant: params.plant,
        },
      }),
      invalidatesTags: ["Event"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useLazyGetEventByIdQuery,
  useLazyGetAllEventsQuery,
} = EventApiSlice;
