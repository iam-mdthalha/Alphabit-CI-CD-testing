import { ApiService } from "Services/ApiService";
import { Merchandise } from "Types/Admin/AdminMerchandiseType";

export const merchandiseApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllMerchandises: builder.query<
      Merchandise[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "merchandise/all",
        params: { plant, ...(search && { search }) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Merchandise" as const, id })),
              { type: "Merchandise", id: "LIST" },
            ]
          : [{ type: "Merchandise", id: "LIST" }],
    }),
    getMerchandiseById: builder.query<Merchandise, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: "merchandise",
        params: { id, plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "Merchandise", id }],
    }),
    addMerchandise: builder.mutation<
      Merchandise,
      { plant: string; data: { merchandise: string; crBy: string; isActive: string } }
    >({
      query: ({ plant, data }) => ({
        url: `merchandise/add`,
        method: "POST",
        params: { plant },
        body: data,
      }),
      invalidatesTags: [{ type: "Merchandise", id: "LIST" }],
    }),
    updateMerchandise: builder.mutation<
      Merchandise,
      { 
        id: number; 
        plant: string; 
        data: { merchandise: string; isActive: string; upBy: string } 
      }
    >({
      query: ({ id, plant, data }) => ({
        url: `merchandise/update`,
        method: "PUT",
        params: { id, plant },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Merchandise", id }],
    }),
    deleteMerchandise: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `merchandise/delete`,
        method: "DELETE",
        params: { id, plant },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Merchandise", id }],
    }),
  }),
});

export const {
  useGetAllMerchandisesQuery,
  useLazyGetMerchandiseByIdQuery,
  useAddMerchandiseMutation,
  useUpdateMerchandiseMutation,
  useDeleteMerchandiseMutation,
} = merchandiseApiSlice;