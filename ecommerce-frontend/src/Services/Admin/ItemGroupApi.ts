import { ApiService } from "../ApiService";

interface ItemGroup {
  plant: string;
  itemGroupName: string;
  crAt: string;
  crBy: string;
  upAt: string;
  upBy: string;
  id: number;
}

export const itemGroupApi = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllItemGroups: builder.query<ItemGroup[], void>({
      query: () => ({
        url: `ItemGroups/getALl?plant=${process.env.REACT_APP_PLANT}`,
        method: "GET",
      }),
      providesTags: ["ItemGroup"],
    }),
  }),
});

export const { useGetAllItemGroupsQuery } = itemGroupApi;
