import { ApiService } from "Services/ApiService";
import {
    CategoryAdminDTO,
    CategoryAdminRequestDTO,
} from "Types/Admin/AdminCategoryType";

import { ResultsDTO } from "Types/ResultsDTO";

export const CategoryAdminApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<CategoryAdminDTO[], void>({
      query: () => ({
        url: "/admin/categories",
        method: "GET",
      }),
      transformResponse: (res: ResultsDTO) => {
        return res.results;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ categoryCode }) => ({
                type: "PrdCategory" as const,
                id: categoryCode,
              })),
              { type: "PrdCategory", id: "LIST" },
            ]
          : [{ type: "PrdCategory", id: "LIST" }],
    }),

    getCategoryById: builder.query<CategoryAdminDTO, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/categories/${id}`,
      }),
      transformResponse: (res: ResultsDTO) => {
        return res.results;
      },
      providesTags: (result, error, { id }) => [{ type: "PrdCategory", id }],
    }),

    addCategory: builder.mutation<number, { data: CategoryAdminRequestDTO }>({
      query: ({ data }) => ({
        url: "/admin/categories/create",
        method: "POST",
        body: data,
      }),
      transformResponse: (res: ResultsDTO) => {
        return res.results;
      },
      invalidatesTags: (result, error) => [{ type: "PrdCategory", id: "LIST" }],
    }),

    updateCategory: builder.mutation<
      string,
      { id: number; data: Partial<CategoryAdminRequestDTO> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/categories/update/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (res: ResultsDTO) => {
        return res.results;
      },
      invalidatesTags: (result, error, { id }) => [{ type: "PrdCategory", id }],
    }),

    deleteCategory: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/categories/delete/${id}`,
        method: "DELETE",
      }),
      transformResponse: (res: ResultsDTO) => {
        return res.results;
      },
      invalidatesTags: (result, error, { id }) => [{ type: "PrdCategory", id }],
    }),

    uploadCategoryImage: builder.mutation<void, { id: number; image: File }>({
      query: ({ id, image }) => {
        const formData = new FormData();
        formData.append("image", image);
        return {
          url: `/admin/categories/upload/${id}`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      transformResponse: (res: ResultsDTO) => {
        return res.results;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "PrdCategory", id },
        { type: "PrdCategory", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useLazyGetCategoryByIdQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUploadCategoryImageMutation,
} = CategoryAdminApiSlice;
