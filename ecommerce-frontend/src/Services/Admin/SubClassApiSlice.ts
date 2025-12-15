import { ApiService } from "Services/ApiService";
import {
  SubClassAdminRequestDTO,
  SubClassMstDTO,
  UpdatedSubClass,
} from "Types/Admin/AdminSubClassType";
import { ResultsDTO } from "Types/ResultsDTO";

export const subClassApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSubClasses: builder.query<{ results: SubClassMstDTO[] }, void>({
      query: () => ({
        url: "admin/sub-class/",
        method: "GET",
      }),
      providesTags: [{ type: "SubClass", id: "LIST" }],
    }),

    getSubClassById: builder.query<
      { results: SubClassMstDTO; message: string; statusCode: number },
      string
    >({
      query: (id) => ({
        url: `admin/sub-class/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "SubClass", id }],
    }),

    createSubClass: builder.mutation<ResultsDTO, SubClassAdminRequestDTO>({
      query: (data) => ({
        url: "admin/sub-class/create",
        method: "POST",
        body: data,
      }),
      transformResponse: (res: any) => {
        return res;
      },
      invalidatesTags: (result, error) => [{ type: "SubClass", id: "List" }],
    }),

    updateSubClass: builder.mutation<
      ResultsDTO,
      { id: string; data: Partial<UpdatedSubClass> }
    >({
      query: ({ id, data }) => ({
        url: `admin/sub-class/update/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "SubClass", id },
        { type: "SubClass", id: "LIST" },
      ],
    }),

    deleteSubClass: builder.mutation<ResultsDTO, string>({
      query: (id) => ({
        url: `admin/sub-class/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error) => [{ type: "SubClass" }],
    }),
  }),
});

export const {
  useGetAdminSubClassesQuery,
  useGetSubClassByIdQuery,
  useCreateSubClassMutation,
  useUpdateSubClassMutation,
  useDeleteSubClassMutation,
} = subClassApiSlice;
