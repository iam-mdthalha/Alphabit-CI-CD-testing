import { ApiService } from "Services/ApiService";
import { PrdBrandMst } from "Types/Admin/AdminBrandType";

export const brandApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query<
      PrdBrandMst[],
      { plant: string }
    >({
      query: ({ plant }) => ({
        url: "Prod_Brand_Mst-GetAll",
        params: { plant },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PrdBrand" as const, id })),
              { type: "PrdBrand", id: "LIST" },
            ]
          : [{ type: "PrdBrand", id: "LIST" }],
    }),
    getBrandById: builder.query<PrdBrandMst, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `Prod_Brand_Mst-GetById/${id}`,
        params: { plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "PrdBrand", id }],
    }),
    addBrand: builder.mutation<
      PrdBrandMst,
      { plant: string; data: PrdBrandMst }
    >({
      query: ({ plant, data }) => ({
        url: `create-Prod_Brand_Mst?plant=${plant}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PrdBrand", id: "LIST" }],
    }),
    updateBrand: builder.mutation<
      PrdBrandMst,
      { id: number; plant: string; data: Partial<PrdBrandMst> }
    >({
      query: ({ id, plant, data }) => ({
        url: `update-Prod_Brand_Mst/${id}`,
        method: "PUT",
        params: { plant },
        body: data,
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdBrand", id }],
    }),
    deleteBrand: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `delete-Prod_Brand_Mst/${id}`,
        method: "DELETE",
        params: { plant },
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdBrand", id }],
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useLazyGetBrandByIdQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApiSlice;
