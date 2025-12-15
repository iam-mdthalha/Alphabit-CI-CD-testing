import { ApiService } from "Services/ApiService";
import { PrdSleeveMst } from "Types/Admin/AdminSleeveType";

export const sleeveApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllSleeves: builder.query<
      PrdSleeveMst[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "PrdSleeve/getAll",
        params: { plant, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PrdSleeve" as const, id })),
              { type: "PrdSleeve", id: "LIST" },
            ]
          : [{ type: "PrdSleeve", id: "LIST" }],
    }),
    getSleeveById: builder.query<PrdSleeveMst, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdSleeve/get/${id}`,
        params: { plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "PrdSleeve", id }],
    }),
    addSleeve: builder.mutation<
      PrdSleeveMst,
      { plant: string; data: PrdSleeveMst }
    >({
      query: ({ plant, data }) => ({
        url: `PrdSleeve/add?plant=${plant}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PrdSleeve", id: "LIST" }],
    }),
    updateSleeve: builder.mutation<
      PrdSleeveMst,
      { id: number; plant: string; data: Partial<PrdSleeveMst> }
    >({
      query: ({ id, plant, data }) => ({
        url: `PrdSleeve/update/${id}`,
        method: "PUT",
        params: { plant },
        body: data,
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdSleeve", id }],
    }),
    deleteSleeve: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdSleeve/delete/${id}`,
        method: "DELETE",
        params: { plant },
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdSleeve", id }],
    }),
  }),
});

export const {
  useGetAllSleevesQuery,
  useLazyGetSleeveByIdQuery,
  useAddSleeveMutation,
  useUpdateSleeveMutation,
  useDeleteSleeveMutation,
} = sleeveApiSlice;
