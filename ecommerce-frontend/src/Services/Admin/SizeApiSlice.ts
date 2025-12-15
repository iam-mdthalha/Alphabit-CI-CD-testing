import { ApiService } from "Services/ApiService";
import { PrdSizeMst } from "Types/Admin/AdminSizeType";

export const sizeApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllSizes: builder.query<
      PrdSizeMst[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "PrdSize/allPrdSize",
        params: { plant, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PrdSize" as const, id })),
              { type: "PrdSize", id: "LIST" },
            ]
          : [{ type: "PrdSize", id: "LIST" }],
    }),
    getSizeById: builder.query<PrdSizeMst, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdSize/${id}`,
        params: { plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "PrdSize", id }],
    }),
    addSize: builder.mutation<
      PrdSizeMst,
      { plant: string; data: PrdSizeMst }
    >({
      query: ({ plant, data }) => ({
        url: `PrdSize/addPrdSize?plant=${plant}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PrdSize", id: "LIST" }],
    }),
    updateSize: builder.mutation<
      PrdSizeMst,
      { id: number; plant: string; data: Partial<PrdSizeMst> }
    >({
      query: ({ id, plant, data }) => ({
        url: `PrdSize/updatePrdSize/${id}`,
        method: "PUT",
        params: { plant },
        body: data,
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdSize", id }],
    }),
    deleteSize: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdSize/deletePrdSize/${id}`,
        method: "DELETE",
        params: { plant },
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdSize", id }],
    }),
  }),
});

export const {
  useGetAllSizesQuery,
  useLazyGetSizeByIdQuery,
  useAddSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
} = sizeApiSlice;
