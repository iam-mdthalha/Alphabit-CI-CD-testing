import { ApiService } from "./ApiService";

interface GetAllGlossaryArgs {
  plant: string;
  search?: string;
}

interface GetGlossaryByIdArgs {
  id: number;
  plant: string;
}

interface DeleteGlossaryArgs {
  id: number;
  plant: string;
}

export const GlossaryApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllGlossary: builder.query<any, GetAllGlossaryArgs>({
      query: ({ plant, search }) => ({
        url: "/Glossary/getAll",
        method: "GET",
        params: {
          plant,
          ...(search ? { search } : {}),
        },
      }),
      transformResponse: (response) => response,
    }),

    getGlossaryById: builder.query<any, GetGlossaryByIdArgs>({
      query: ({ id, plant }) => ({
        url: "/Glossary/getById", 
        method: "GET",
        params: { id, plant },
      }),
      transformResponse: (response) => response,
    }),

    createGlossary: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/Glossary/create",
        method: "POST",
        body: formData,
      }),
    }),

    updateGlossary: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/Glossary/update",
        method: "PUT",
        body: formData,
      }),
    }),

    deleteGlossary: builder.mutation<any, DeleteGlossaryArgs>({
      query: ({ id, plant }) => ({
        url: "/Glossary/delete",
        method: "DELETE",
        params: { id, plant },
      }),
    }),
  }),
});

export const {
  useGetAllGlossaryQuery,
  useLazyGetAllGlossaryQuery,
  useGetGlossaryByIdQuery,
  useCreateGlossaryMutation,
  useUpdateGlossaryMutation,
  useDeleteGlossaryMutation,
} = GlossaryApiSlice;
