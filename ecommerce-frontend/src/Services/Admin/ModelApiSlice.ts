import { ApiService } from "Services/ApiService";
import { PrdModelMst } from "Types/Admin/AdminModelType" ;

export const modelApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllModels: builder.query<
      PrdModelMst[],
      { plant: string }
    >({
      query: ({ plant }) => ({
        url: "Prod_Model-GetAll",
        params: { plant },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PrdModel" as const, id })),
              { type: "PrdModel", id: "LIST" },
            ]
          : [{ type: "PrdModel", id: "LIST" }],
    }),
    getModelById: builder.query<PrdModelMst, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `Prod_Model-GetById/${id}`,
        params: { plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "PrdModel", id }],
    }),
    addModel: builder.mutation<
      PrdModelMst,
      { plant: string; data: PrdModelMst }
    >({
      query: ({ plant, data }) => ({
        url: `create-Prod_model?plant=${plant}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PrdModel", id: "LIST" }],
    }),
    updateModel: builder.mutation<
      PrdModelMst,
      { id: number; plant: string; data: Partial<PrdModelMst> }
    >({
      query: ({ id, plant, data }) => ({
        url: `update-Prod_Model/${id}`,
        method: "PUT",
        params: { plant },
        body: data,
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdModel", id }],
    }),
    deleteModel: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `delete-Prod_Model/${id}`,
        method: "DELETE",
        params: { plant },
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdModel", id }],
    }),
  }),
});

export const {
  useGetAllModelsQuery,
  useLazyGetModelByIdQuery,
  useAddModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
} = modelApiSlice;
