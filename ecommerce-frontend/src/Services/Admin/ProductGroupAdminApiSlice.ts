import { ApiService } from "../ApiService";
import {
  ItemGroup,
  CreateItemGroupRequest,
  UpdateItemGroupRequest,
  GetItemGroupByIdRequest,
  GetItemGroupByNameRequest,
  DeleteItemGroupRequest,
} from "../../Types/Admin/AdminProductGroupType";

export const ProductGroupAdminApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    createItemGroup: builder.mutation<ItemGroup, CreateItemGroupRequest>({
      query: (body) => ({
        url: "/ItemGroups/create",
        method: "POST",
        params: { plant: body.plant },
        body,
      }),
      invalidatesTags: ["ItemGroup"],
    }),

    getAllItemGroups: builder.query<ItemGroup[], string>({
      query: (plant) => ({
        url: "/ItemGroups/getALl",
        method: "GET",
        params: { plant },
      }),
      providesTags: ["ItemGroup"],
    }),

    getItemGroupById: builder.query<ItemGroup, GetItemGroupByIdRequest>({
      query: ({ id, plant }) => ({
        url: "/ItemGroups/getById",
        method: "GET",
        params: { id, plant },
      }),
      providesTags: ["ItemGroup"],
    }),

    getItemGroupByName: builder.query<ItemGroup, GetItemGroupByNameRequest>({
      query: ({ itemGrp, plant }) => ({
        url: "/ItemGroups/getByItemGrpName",
        method: "GET",
        params: { itemGrp, plant },
      }),
      providesTags: ["ItemGroup"],
    }),

    updateItemGroup: builder.mutation<string, UpdateItemGroupRequest>({
      query: (body) => ({
        url: "/ItemGroups/update",
        method: "PUT",
        params: { plant: body.plant },
        body,
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: ["ItemGroup"],
    }),

    deleteItemGroup: builder.mutation<string, DeleteItemGroupRequest>({
      query: ({ id, plant }) => ({
        url: "/ItemGroups/delete",
        method: "DELETE",
        params: { id, plant },
        responseHandler: (response) => response.text(),
      }),
      invalidatesTags: ["ItemGroup"],
    }),
  }),
});

export const {
  useCreateItemGroupMutation,
  useGetAllItemGroupsQuery,
  useGetItemGroupByIdQuery,
  useGetItemGroupByNameQuery,
  useUpdateItemGroupMutation,
  useDeleteItemGroupMutation,
} = ProductGroupAdminApiSlice;