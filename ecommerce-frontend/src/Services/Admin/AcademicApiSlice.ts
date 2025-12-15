import { ApiService } from "Services/ApiService";
import { Academic } from "Types/Admin/AdminAcademicType";

export const academicApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllAcademics: builder.query<
      Academic[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "academic/all",
        params: { plant, ...(search && { search }) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Academic" as const, id })),
              { type: "Academic", id: "LIST" },
            ]
          : [{ type: "Academic", id: "LIST" }],
    }),
    getAcademicById: builder.query<Academic, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: "academic",
        params: { id, plant },
      }),
      providesTags: (result, error, { id }) => [{ type: "Academic", id }],
    }),
    addAcademic: builder.mutation<
      Academic,
      { plant: string; data: { academic: string; crBy: string; isActive: string } }
    >({
      query: ({ plant, data }) => ({
        url: `academic/add`,
        method: "POST",
        params: { plant },
        body: data,
      }),
      invalidatesTags: [{ type: "Academic", id: "LIST" }],
    }),
    updateAcademic: builder.mutation<
      Academic,
      { 
        id: number; 
        plant: string; 
        data: { academic: string; isActive: string; upBy: string } 
      }
    >({
      query: ({ id, plant, data }) => ({
        url: `academic/update`,
        method: "PUT",
        params: { id, plant },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Academic", id }],
    }),
    deleteAcademic: builder.mutation<void, { id: number; plant: string }>({
      query: ({ id, plant }) => ({
        url: `academic/delete`,
        method: "DELETE",
        params: { id, plant },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Academic", id }],
    }),
  }),
});

export const {
  useGetAllAcademicsQuery,
  useLazyGetAcademicByIdQuery,
  useAddAcademicMutation,
  useUpdateAcademicMutation,
  useDeleteAcademicMutation,
} = academicApiSlice;