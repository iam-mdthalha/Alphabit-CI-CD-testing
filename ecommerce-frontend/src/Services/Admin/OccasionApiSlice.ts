import { ApiService } from "Services/ApiService";
import { PrdOccasionMst } from "Types/Admin/AdminOccasionType";

export const occasionApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllOccasions: builder.query<
      PrdOccasionMst[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "PrdOccasion/getAllOccasions",
        params: { plant, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PrdOccasion" as const, id })),
              { type: "PrdOccasion", id: "LIST" },
            ]
          : [{ type: "PrdOccasion", id: "LIST" }],
    }),
    getOccasionById: builder.query<PrdOccasionMst, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdOccasion/getOccasions/${id}`,
        params: { plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "PrdOccasion", id }],
    }),
    addOccasion: builder.mutation<
      PrdOccasionMst,
      { plant: string; data: PrdOccasionMst }
    >({
      query: ({ plant, data }) => ({
        url: `PrdOccasion/addOccasion?plant=${plant}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PrdOccasion", id: "LIST" }],
    }),
    updateOccasion: builder.mutation<
      PrdOccasionMst,
      { id: number; plant: string; data: Partial<PrdOccasionMst> }
    >({
      query: ({ id, plant, data }) => ({
        url: `PrdOccasion/updateOccasion/${id}`,
        method: "PUT",
        params: { plant },
        body: data,
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdOccasion", id }],
    }),
    deleteOccasion: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdOccasion/deleteOccasion/${id}`,
        method: "DELETE",
        params: { plant },
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdOccasion", id }],
    }),
  }),
});

export const {
  useGetAllOccasionsQuery,
  useLazyGetOccasionByIdQuery,
  useAddOccasionMutation,
  useUpdateOccasionMutation,
  useDeleteOccasionMutation,
} = occasionApiSlice;
