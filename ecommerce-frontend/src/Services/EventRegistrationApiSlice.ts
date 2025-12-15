import {
  EventRegistration,
  EventRegistrationDTO,
  EventRegistrationResponse,
} from "Types/Admin/AdminEventRegistrationType";
import { ApiService } from "./ApiService";

export const EventRegistrationApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllEventRegistrations: builder.query<
      EventRegistration[],
      { plant: string }
    >({
      query: (params) => ({
        url: `/EventRegistration/getAll`,
        method: "GET",
        params: {
          plant: params.plant,
        },
      }),
      transformResponse: (response: any) => {
        const registrationsArray = response.results || response || [];

        return registrationsArray.map((registration: any) => {
          return {
            id: registration.id,
            eventHdrId: registration.eventHdrId,
            firstName: registration.firstName,
            lastName: registration.lastName,
            email: registration.email,
            contactNumber: registration.contactNumber,
            address: registration.address,
            city: registration.city,
            state: registration.state,
            country: registration.country,
            pin: registration.pin,
            plant: registration.plant,
            createdAt: registration.crAt,
            updatedAt: registration.modAt,
          };
        });
      },
      providesTags: ["EventRegistration"],
    }),

    getEventRegistrationById: builder.query<
      EventRegistration,
      { id: number; plant: string }
    >({
      query: (params) => ({
        url: `/EventRegistration`,
        method: "GET",
        params: {
          id: params.id,
          plant: params.plant,
        },
      }),
      transformResponse: (response: any) => {
        console.log("=== getEventRegistrationById Raw Response ===");
        console.log("Full response:", response);

        const registration = response.results || response || {};

        console.log("Registration data:", registration);

        return {
          id: registration.id,
          eventHdrId: registration.eventHdrId,
          firstName: registration.firstName,
          lastName: registration.lastName,
          email: registration.email,
          contactNumber: registration.contactNumber,
          address: registration.address,
          city: registration.city,
          state: registration.state,
          country: registration.country,
          pin: registration.pin,
          plant: registration.plant,
          createdAt: registration.crAt,
          updatedAt: registration.modAt,
        };
      },
      providesTags: (result, error, arg) => [
        { type: "EventRegistration", id: arg.id },
      ],
    }),

    createEventRegistration: builder.mutation<
      any,
      { data: EventRegistrationDTO; plant: string }
    >({
      query: ({ data, plant }) => ({
        url: `/EventRegistration/save`,
        method: "POST",
        params: {
          plant: plant,
        },
        body: data,
      }),
      invalidatesTags: ["EventRegistration"],
    }),

    updateEventRegistration: builder.mutation<
      any,
      { data: EventRegistrationDTO; plant: string }
    >({
      query: ({ data, plant }) => ({
        url: `/EventRegistration/update`,
        method: "PUT",
        params: {
          plant: plant,
        },
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "EventRegistration", id: arg.data.id },
        "EventRegistration",
      ],
    }),

    deleteEventRegistration: builder.mutation<
      void,
      { id: number; plant: string }
    >({
      query: (params) => ({
        url: `/EventRegistration/delete`,
        method: "DELETE",
        params: {
          id: params.id,
          plant: params.plant,
        },
      }),
      invalidatesTags: ["EventRegistration"],
    }),
  }),
});

export const {
  useGetAllEventRegistrationsQuery,
  useGetEventRegistrationByIdQuery,
  useCreateEventRegistrationMutation,
  useUpdateEventRegistrationMutation,
  useDeleteEventRegistrationMutation,
  useLazyGetEventRegistrationByIdQuery,
  useLazyGetAllEventRegistrationsQuery,
} = EventRegistrationApiSlice;
