import { ApiService } from "Services/ApiService";
import { PrdFabricMst } from "Types/Admin/AdminFabricType";

export const fabricApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllFabrics: builder.query<
      PrdFabricMst[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "PrdFabric/getAllFabrics",
        params: { plant, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PrdFabric" as const, id })),
              { type: "PrdFabric", id: "LIST" },
            ]
          : [{ type: "PrdFabric", id: "LIST" }],
    }),
    getFabricById: builder.query<PrdFabricMst, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdFabric/getFabric/${id}`,
        params: { plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "PrdFabric", id }],
    }),
    addFabric: builder.mutation<
      PrdFabricMst,
      { plant: string; data: PrdFabricMst }
    >({
      query: ({ plant, data }) => ({
        url: `PrdFabric/addFabric?plant=${plant}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PrdFabric", id: "LIST" }],
    }),
    updateFabric: builder.mutation<
      PrdFabricMst,
      { id: number; plant: string; data: Partial<PrdFabricMst> }
    >({
      query: ({ id, plant, data }) => ({
        url: `PrdFabric/updateFabric/${id}`,
        method: "PUT",
        params: { plant },
        body: data,
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdFabric", id }],
    }),
    deleteFabric: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdFabric/deleteFabric/${id}`,
        method: "DELETE",
        params: { plant },
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdFabric", id }],
    }),
  }),
});

export const {
  useGetAllFabricsQuery,
  useLazyGetFabricByIdQuery,
  useAddFabricMutation,
  useUpdateFabricMutation,
  useDeleteFabricMutation,
} = fabricApiSlice;
