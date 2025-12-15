import { ApiService } from "Services/ApiService";
import { PrdColorMst } from "Types/Admin/AdminColorType";

export const colorApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllColors: builder.query<
      PrdColorMst[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "PrdColor/getAll",
        params: { plant, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "PrdColor" as const, id })),
              { type: "PrdColor", id: "LIST" },
            ]
          : [{ type: "PrdColor", id: "LIST" }],
    }),
    getColorById: builder.query<PrdColorMst, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdColor/get/${id}`,
        params: { plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "PrdColor", id }],
    }),
    addColor: builder.mutation<
      PrdColorMst,
      { plant: string; data: PrdColorMst }
    >({
      query: ({ plant, data }) => ({
        url: `PrdColor/add?plant=${plant}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PrdColor", id: "LIST" }],
    }),
    updateColor: builder.mutation<
      PrdColorMst,
      { id: number; plant: string; data: Partial<PrdColorMst> }
    >({
      query: ({ id, plant, data }) => ({
        url: `PrdColor/update/${id}`,
        method: "PUT",
        params: { plant },
        body: data,
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdColor", id }],
    }),
    deleteColor: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `PrdColor/delete/${id}`,
        method: "DELETE",
        params: { plant },
        responseHandler: "text",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PrdColor", id }],
    }),
  }),
});

export const {
  useGetAllColorsQuery,
  useLazyGetColorByIdQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = colorApiSlice;
