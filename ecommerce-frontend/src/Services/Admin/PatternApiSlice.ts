import { ApiService } from "Services/ApiService";
import { PrdPatternMst } from "Types/Admin/AdminPatternType";

export const patternApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllPatterns: builder.query<
      PrdPatternMst[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "PrdPattern/getAllPatterns",
        params: { plant, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PrdPattern" as const, id })),
              { type: "PrdPattern", id: "LIST" },
            ]
          : [{ type: "PrdPattern", id: "LIST" }],
    }),
    getPatternById: builder.query<PrdPatternMst, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdPattern/getPattern/${id}`,
        params: { plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "PrdPattern", id }],
    }),
    addPattern: builder.mutation<
      PrdPatternMst,
      { plant: string; data: PrdPatternMst }
    >({
      query: ({ plant, data }) => ({
        url: `PrdPattern/addPattern?plant=${plant}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PrdPattern", id: "LIST" }],
    }),
    updatePattern: builder.mutation<
      PrdPatternMst,
      { id: number; plant: string; data: Partial<PrdPatternMst> }
    >({
      query: ({ id, plant, data }) => ({
        url: `PrdPattern/updatePattern/${id}`,
        method: "PUT",
        params: { plant },
        body: data,
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdPattern", id }],
    }),
    deletePattern: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdPattern/deleteFabric/${id}`,
        method: "DELETE",
        params: { plant },
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdPattern", id }],
    }),
  }),
});

export const {
  useGetAllPatternsQuery,
  useLazyGetPatternByIdQuery,
  useAddPatternMutation,
  useUpdatePatternMutation,
  useDeletePatternMutation,
} = patternApiSlice;
