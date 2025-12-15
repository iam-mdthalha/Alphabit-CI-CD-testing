import { ApiService } from "Services/ApiService";
import { Language } from "Types/Admin/AdminLanguageType";

export const languageApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllLanguages: builder.query<
      Language[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "language/all",
        params: { plant, ...(search && { search }) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Language" as const, id })),
              { type: "Language", id: "LIST" },
            ]
          : [{ type: "Language", id: "LIST" }],
    }),
    getLanguageById: builder.query<Language, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: "language",
        params: { id, plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "Language", id }],
    }),
    addLanguage: builder.mutation<
      Language,
      { plant: string; data: { language: string; crBy: string; isActive: string } }
    >({
      query: ({ plant, data }) => ({
        url: `language/add`,
        method: "POST",
        params: { plant },
        body: data,
      }),
      invalidatesTags: [{ type: "Language", id: "LIST" }],
    }),
    updateLanguage: builder.mutation<
      Language,
      { 
        id: number; 
        plant: string; 
        data: { language: string; isActive: string; upBy: string } 
      }
    >({
      query: ({ id, plant, data }) => ({
        url: `language/update`,
        method: "PUT",
        params: { id, plant },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Language", id }],
    }),
    deleteLanguage: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `language/delete`,
        method: "DELETE",
        params: { id, plant },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Language", id }],
    }),
  }),
});

export const {
  useGetAllLanguagesQuery,
  useLazyGetLanguageByIdQuery,
  useAddLanguageMutation,
  useUpdateLanguageMutation,
  useDeleteLanguageMutation,
} = languageApiSlice;