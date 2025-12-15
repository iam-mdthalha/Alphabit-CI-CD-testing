import { ApiService } from "Services/ApiService";
import { LocType, GetAllLocTypesParams } from "Types/Admin/AdminLocType";

export const LocTypeApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllLocTypes: builder.query<LocType[], GetAllLocTypesParams>({
      query: (params) => ({
        url: "LocType/getAll",
        params,
      }),
      providesTags: ["LocType"],
    }),
  }),
});

export const { useGetAllLocTypesQuery } = LocTypeApiSlice;
