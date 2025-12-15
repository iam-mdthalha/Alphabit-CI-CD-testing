import { ApiService } from "../ApiService";
import {
  BrandPromotionDto,
  AddBrandPromotionPayload,
  UpdateBrandPromotionPayload,
  DeleteBrandPromotionParams,
  GetBrandPromotionByIdParams,
  GetAllBrandPromotionsParams,
} from "Types/Admin/AdminBrandPromotionType";

export const BrandPromotionApiSlice = ApiService.enhanceEndpoints({
  addTagTypes: ["BrandPromotion"],
}).injectEndpoints({
  endpoints: (builder) => ({
    addBrandPromotion: builder.mutation<
      BrandPromotionDto,
      AddBrandPromotionPayload
    >({
      query: (payload) => ({
        url: "/BrandPromotion/addBrandPromotion",
        method: "POST",
        body: payload,
        params: { plant: payload.brandPromotionHdr.plant },
      }),
      invalidatesTags: ["BrandPromotion"],
    }),

    updateBrandPromotion: builder.mutation<
      BrandPromotionDto,
      UpdateBrandPromotionPayload
    >({
      query: (payload) => ({
        url: "/BrandPromotion/updateBrandPromotion",
        method: "PUT",
        body: payload,
        params: { plant: payload.brandPromotionHdr.plant },
      }),
      invalidatesTags: ["BrandPromotion"],
    }),

    deleteBrandPromotion: builder.mutation<
      BrandPromotionDto,
      DeleteBrandPromotionParams
    >({
      query: ({ id, plant }) => ({
        url: "/BrandPromotion/deleteBrandPromotion",
        method: "DELETE",
        params: { id, plant },
      }),
      invalidatesTags: ["BrandPromotion"],
    }),

    getBrandPromotionById: builder.query<
      BrandPromotionDto,
      GetBrandPromotionByIdParams
    >({
      query: ({ id, plant }) => ({
        url: "/BrandPromotion/getBrandPromotionById",
        method: "GET",
        params: { id, plant },
      }),
      providesTags: ["BrandPromotion"],
    }),

    getAllBrandPromotions: builder.query<
      BrandPromotionDto[],
      GetAllBrandPromotionsParams
    >({
      query: ({ plant, search }) => ({
        url: "/BrandPromotion/getAllBrandPromotions",
        method: "GET",
        params: { plant, search },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ brandPromotionHdr: { id } }) => ({
                type: "BrandPromotion" as const,
                id,
              })),
              { type: "BrandPromotion", id: "LIST" },
            ]
          : [{ type: "BrandPromotion", id: "LIST" }],
    }),
  }),
});

export const {
  useAddBrandPromotionMutation,
  useUpdateBrandPromotionMutation,
  useDeleteBrandPromotionMutation,
  useGetBrandPromotionByIdQuery,
  useGetAllBrandPromotionsQuery,
  useLazyGetBrandPromotionByIdQuery,
  useLazyGetAllBrandPromotionsQuery,
} = BrandPromotionApiSlice;
