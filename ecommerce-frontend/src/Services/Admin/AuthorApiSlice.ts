import { ApiService } from "Services/ApiService";
import { Author } from "Types/Admin/AdminAuthorType";

export const authorApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllAuthors: builder.query<
      Author[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "author/all",
        params: { plant, ...(search && { search }) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Author" as const, id })),
              { type: "Author", id: "LIST" },
            ]
          : [{ type: "Author", id: "LIST" }],
    }),
    getAuthorById: builder.query<Author, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: "author",
        params: { id, plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "Author", id }],
    }),
    addAuthor: builder.mutation<
      Author,
      { plant: string; data: { author: string; crBy: string; isActive: string } }
    >({
      query: ({ plant, data }) => ({
        url: `author/add`,
        method: "POST",
        params: { plant },
        body: data,
      }),
      invalidatesTags: [{ type: "Author", id: "LIST" }],
    }),
    updateAuthor: builder.mutation<
      Author,
      { 
        id: number; 
        plant: string; 
        data: { author: string; isActive: string; upBy: string } 
      }
    >({
      query: ({ id, plant, data }) => ({
        url: `author/update`,
        method: "PUT",
        params: { id, plant },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Author", id }],
    }),
    deleteAuthor: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `author/delete`,
        method: "DELETE",
        params: { id, plant },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Author", id }],
    }),
  }),
});

export const {
  useGetAllAuthorsQuery,
  useLazyGetAuthorByIdQuery,
  useAddAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
} = authorApiSlice;