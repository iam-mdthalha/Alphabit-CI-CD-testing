import { ApiService } from "Services/ApiService";
import {
  AppDeleteAdminSubClass,
  AppGetAdminSubClassById,
  AppGetAllAdminSubClasses,
  AppGetLoyaltyConfig,
  AppSaveAdminSubClass,
  AppSaveLoyaltyConfig,
  AppUpdateAdminSubClass,
} from "./constants/admin-api.constant";
import {
  AppAdminSubClassRequest,
  AppGetAdminSubClassByIdResponse,
  AppGetAllAdminSubClassesResponse,
  AppGetLoyaltyConfigResponse,
  AppSaveLoyaltyConfigRequest,
  AppSaveLoyaltyConfigResponse,
  AppSaveOrUpdateAdminSubClassResponse,
} from "./interfaces/admin-api.interface";

export const AdminApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdminSubClasses: builder.query<
      AppGetAllAdminSubClassesResponse,
      void
    >({
      query: () => ({
        url: AppGetAllAdminSubClasses,
        method: "GET",
      }),
    }),

    getAdminSubClassById: builder.query<
      AppGetAdminSubClassByIdResponse,
      AppAdminSubClassRequest
    >({
      query: ({ id }) => ({
        url: AppGetAdminSubClassById.replace(":id", id ?? ""),
        method: "GET",
      }),
    }),

    saveSubClass: builder.mutation<
      AppSaveOrUpdateAdminSubClassResponse,
      AppAdminSubClassRequest
    >({
      query: ({ subClassAdminRequestDTO }) => ({
        url: AppSaveAdminSubClass,
        method: "POST",
        body: subClassAdminRequestDTO,
      }),
    }),

    updateSubCategory: builder.mutation<
      AppSaveOrUpdateAdminSubClassResponse,
      AppAdminSubClassRequest
    >({
      query: ({ id, subClassAdminRequestDTO }) => ({
        url: AppUpdateAdminSubClass.replace(":id", id ?? ""),
        method: "PUT",
        body: subClassAdminRequestDTO,
      }),
    }),

    deleteSubCategory: builder.mutation<void, AppAdminSubClassRequest>({
      query: ({ id }) => ({
        url: AppDeleteAdminSubClass.replace(":id", id ?? ""),
        method: "DELETE",
      }),
    }),

    saveLoyaltyConfig: builder.mutation<AppSaveLoyaltyConfigResponse, AppSaveLoyaltyConfigRequest>({
      query: (data) => ({
        url: AppSaveLoyaltyConfig,
        method: "POST",
        body: data.data
      })
    }),

    getLoyaltyConfig: builder.query<AppGetLoyaltyConfigResponse, void>({
      query: () => ({
        url: AppGetLoyaltyConfig,
        method: "GET"
      })
    })
  }),
});

export const { 
  useGetAllAdminSubClassesQuery, 
  useGetAdminSubClassByIdQuery, 
  useSaveSubClassMutation, 
  useUpdateSubCategoryMutation, 
  useDeleteSubCategoryMutation,
  useSaveLoyaltyConfigMutation,
  useGetLoyaltyConfigQuery
} = AdminApiSlice;