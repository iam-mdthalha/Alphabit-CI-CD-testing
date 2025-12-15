import { ApiService } from "Services/ApiService";
import { SubCategoryAdminDTO, SubCategoryAdminRequestDTO } from "Types/Admin/AdminSubCategoryType";
import { ResultsDTO } from "Types/ResultsDTO";

export const subCategoryApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubCategories: builder.query<SubCategoryAdminDTO[], void>({
      query: () => ({
        url: "/admin/sub-categories/",
        method: 'GET'
      }),
      transformResponse: (res: ResultsDTO) => {
        return res.results;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ subCategoryCode }) => ({
                type: "PrdSubCategory" as const,
                id: subCategoryCode,
              })),
              { type: "PrdSubCategory", id: "LIST" },
            ]
          : [{ type: "PrdSubCategory", id: "LIST" }],
    }),

    getSubCategoryById: builder.query<
      SubCategoryAdminDTO,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/admin/sub-categories/${id}`,
      }),
      transformResponse: (res: ResultsDTO) => {
        return res.results;
      },
      providesTags: (result, error, { id }) => [{ type: "PrdSubCategory", id }],
    }),

    addSubCategory: builder.mutation<
      string,
      { data: SubCategoryAdminDTO }
    >({
      query: ({ data }) => ({
        url: "/admin/sub-categories/create",
        method: "POST",
        body: data,
      }),
      transformResponse: (res: ResultsDTO) => {
        return res.results;
      },
      invalidatesTags: [{ type: "PrdSubCategory", id: "LIST" }],
    }),

    updateSubCategory: builder.mutation<
      string,
      { id: string; data: Partial<SubCategoryAdminRequestDTO> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/sub-categories/update/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (res: ResultsDTO) => {
        return res.results;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "PrdSubCategory", id },
      ],
    }),

    deleteSubCategory: builder.mutation<void, { id: string; }>({
      query: ({ id }) => ({
        url: `/admin/sub-categories/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PrdSubCategory", id },
      ],
    }),
  }),
});

export const {
  useGetAllSubCategoriesQuery,
  useLazyGetSubCategoryByIdQuery,
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApiSlice;
