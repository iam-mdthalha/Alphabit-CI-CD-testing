import { ApiService } from "../ApiService";
import {
    ProductPromotion,
    AddProductPromotionPayload,
    UpdateProductPromotionPayload,
    DeleteProductPromotionParams,
    GetProductPromotionByIdParams,
    GetAllProductPromotionsParams,
} from "Types/Admin/AdminProductPromotionType";

export const ProductPromotionApiSlice = ApiService.enhanceEndpoints({
    addTagTypes: ["ProductPromotion"],
}).injectEndpoints({
    endpoints: (builder) => ({
        addProductPromotion: builder.mutation<ProductPromotion, AddProductPromotionPayload>({
            query: (payload) => ({
                url: "/ProductPromotion/addProductPromotion",
                method: "POST",
                body: payload,
                params: { plant: payload.promotionHdr.plant },
            }),
            invalidatesTags: ["ProductPromotion"],
        }),

        updateProductPromotion: builder.mutation<ProductPromotion, UpdateProductPromotionPayload>({
            query: (payload) => ({
                url: "/ProductPromotion/updateProductPromotion",
                method: "PUT",
                body: payload,
                params: { plant: payload.promotionHdr.plant },
            }),
            invalidatesTags: ["ProductPromotion"],
        }),

        deleteProductPromotion: builder.mutation<ProductPromotion, DeleteProductPromotionParams>({
            query: ({ id, plant }) => ({
                url: "/ProductPromotion/deleteProductPromotion",
                method: "DELETE",
                params: { id, plant },
            }),
            invalidatesTags: ["ProductPromotion"],
        }),

        getProductPromotionById: builder.query<ProductPromotion, GetProductPromotionByIdParams>({
            query: ({ id, plant }) => ({
                url: "/ProductPromotion/getProductPromotionById",
                method: "GET",
                params: { id, plant },
            }),
            providesTags: ["ProductPromotion"],
        }),

        getAllProductPromotions: builder.query<ProductPromotion[], GetAllProductPromotionsParams>({
            query: ({ plant, search }) => ({
                url: "/ProductPromotion/getAllProductPromotions",
                method: "GET",
                params: { plant, search },
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ promotionHdr: { id } }) => ({
                            type: "ProductPromotion" as const,
                            id,
                        })),
                            { type: "ProductPromotion", id: "LIST" },
            ]
                    : [{ type: "ProductPromotion", id: "LIST" }],
        }),
    }),
});

export const {
    useAddProductPromotionMutation,
    useUpdateProductPromotionMutation,
    useDeleteProductPromotionMutation,
    useGetProductPromotionByIdQuery,
    useGetAllProductPromotionsQuery,
    useLazyGetProductPromotionByIdQuery,
    useLazyGetAllProductPromotionsQuery,
} = ProductPromotionApiSlice;