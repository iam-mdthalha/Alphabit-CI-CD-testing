import { ApiService } from "Services/ApiService";
import {
  SectionAdminDTO,
  SectionAdminRequestDTO,
} from "Types/Admin/AdminSectionType";
import { ResultsDTO } from "Types/ResultsDTO";

export const sectionApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllSections: builder.query<SectionAdminDTO[], void>({
      query: () => ({
        url: "/admin/sections",
        method: "GET",
      }),
      transformResponse: (response: ResultsDTO) => {
        return response.results as SectionAdminDTO[];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ name }) => ({
                type: "Section" as const,
                id: name,
              })),
              { type: "Section", id: "LIST" },
            ]
          : [{ type: "Section", id: "LIST" }],
    }),

    getSectionById: builder.query<SectionAdminDTO, number>({
      query: (id) => ({
        url: `/admin/sections/${id}`,
        method: "GET",
      }),
      transformResponse: (response: ResultsDTO) => {
        return response.results as SectionAdminDTO;
      },
      providesTags: (result, error, id) => [{ type: "Section", id }],
    }),

    createSection: builder.mutation<number, SectionAdminRequestDTO>({
      query: (data) => ({
        url: "/admin/sections/create",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ResultsDTO) => {
        return response.results as number;
      },
      invalidatesTags: [{ type: "Section", id: "LIST" }],
    }),

    updateSection: builder.mutation<
      number,
      { id: number; data: SectionAdminRequestDTO }
    >({
      query: ({ id, data }) => ({
        url: `/admin/sections/update/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ResultsDTO) => {
        return response.results as number;
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Section", id }],
    }),

    deleteSection: builder.mutation<number, number>({
      query: (id) => ({
        url: `/admin/sections/delete/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ResultsDTO) => {
        return response.results as number;
      },
      invalidatesTags: (result, error, id) => [{ type: "Section", id }],
    }),

    uploadSectionImages: builder.mutation<void, { id: number; images: File[] }>(
      {
        query: ({ id, images }) => {
          const formData = new FormData();
          images.forEach((image) => {
            formData.append("images", image);
          });
          return {
            url: `/admin/sections/upload/${id}`,
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: (result, error, { id }) => [{ type: "Section", id }],
      }
    ),
  }),
});

export const {
  useGetAllSectionsQuery,
  useGetSectionByIdQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useUploadSectionImagesMutation,
} = sectionApiSlice;
