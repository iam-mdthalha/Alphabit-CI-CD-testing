import { ApiService } from "Services/ApiService";
import { PrdCollarMst } from "Types/Admin/AdminCollarType";

export const collarApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllCollars: builder.query<
      PrdCollarMst[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "PrdCollar/getAllCollars",
        params: { plant, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Collars" as const, id })),
              { type: "Collars", id: "LIST" },
            ]
          : [{ type: "Collars", id: "LIST" }],
    }),
    getCollarById: builder.query<PrdCollarMst, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdCollar/getCollar/${id}`,
        params: { plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "Collars", id }],
    }),
    addCollar: builder.mutation<
      PrdCollarMst,
      { plant: string; data: PrdCollarMst }
    >({
      query: ({ plant, data }) => ({
        url: `PrdCollar/addCollar?plant=${plant}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Collars", id: "LIST" }],
    }),
    updateCollar: builder.mutation<
      PrdCollarMst,
      { id: number; plant: string; data: Partial<PrdCollarMst> }
    >({
      query: ({ id, plant, data }) => ({
        url: `PrdCollar/updateCollar/${id}`,
        method: "PUT",
        params: { plant },
        body: data,
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Collars", id }],
    }),
    deleteCollar: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdCollar/deleteCollar/${id}`,
        method: "DELETE",
        params: { plant },
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Collars", id }],
    }),
  }),
});

export const {
  useGetAllCollarsQuery,
  useLazyGetCollarByIdQuery,
  useAddCollarMutation,
  useUpdateCollarMutation,
  useDeleteCollarMutation,
} = collarApiSlice;
 