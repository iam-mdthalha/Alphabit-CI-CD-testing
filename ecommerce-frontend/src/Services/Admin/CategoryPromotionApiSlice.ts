import { ApiService } from "../ApiService";
import {
  CategoryPromotion,
  AddCategoryPromotionPayload,
  UpdateCategoryPromotionPayload,
  DeleteCategoryPromotionParams,
  GetCategoryPromotionByIdParams,
  GetAllCategoryPromotionsParams,
} from "Types/Admin/AdminCategoryPromotionType";

export const CategoryPromotionApiSlice = ApiService.enhanceEndpoints({
  addTagTypes: ["CategoryPromotion"],
}).injectEndpoints({
  endpoints: (builder) => ({
    addCategoryPromotion: builder.mutation<
      CategoryPromotion,
      AddCategoryPromotionPayload
    >({
      query: (payload) => ({
        url: "/CategoryPromotion/addCategoryPromotion",
        method: "POST",
        body: payload,
        params: { plant: payload.categoryPromotionHdr.plant },
      }),
      invalidatesTags: ["CategoryPromotion"],
    }),

    updateCategoryPromotion: builder.mutation<
      CategoryPromotion,
      UpdateCategoryPromotionPayload
    >({
      query: (payload) => ({
        url: "/CategoryPromotion/updateCategoryPromotion",
        method: "PUT",
        body: payload,
        params: { plant: payload.categoryPromotionHdr.plant },
      }),
      invalidatesTags: ["CategoryPromotion"],
    }),

    deleteCategoryPromotion: builder.mutation<
      CategoryPromotion,
      DeleteCategoryPromotionParams
    >({
      query: ({ id, plant }) => ({
        url: "/CategoryPromotion/deleteCategoryPromotion",
        method: "DELETE",
        params: { id, plant },
      }),
      invalidatesTags: ["CategoryPromotion"],
    }),

    getCategoryPromotionById: builder.query<
      CategoryPromotion,
      GetCategoryPromotionByIdParams
    >({
      query: ({ id, plant }) => ({
        url: "/CategoryPromotion/getCategoryPromotionById",
        method: "GET",
        params: { id, plant },
      }),
      providesTags: ["CategoryPromotion"],
    }),

    getAllCategoryPromotions: builder.query<
      CategoryPromotion[],
      GetAllCategoryPromotionsParams
    >({
      query: ({ plant, search }) => ({
        url: "/CategoryPromotion/getAllCategoryPromotions",
        method: "GET",
        params: { plant, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ categoryPromotionHdr: { id } }) => ({
                type: "CategoryPromotion" as const,
                id,
              })),
              { type: "CategoryPromotion", id: "LIST" },
            ]
          : [{ type: "CategoryPromotion", id: "LIST" }],
    }),
  }),
});

export const {
  useAddCategoryPromotionMutation,
  useUpdateCategoryPromotionMutation,
  useDeleteCategoryPromotionMutation,
  useGetCategoryPromotionByIdQuery,
  useGetAllCategoryPromotionsQuery,
  useLazyGetCategoryPromotionByIdQuery,
  useLazyGetAllCategoryPromotionsQuery,
} = CategoryPromotionApiSlice;
