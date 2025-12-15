import { SellBookProductDTO, SellProductResponse } from "Types/SellProduct";
import { ApiService } from "./ApiService";

export const SellProductApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    createSellItem: builder.mutation<SellProductResponse, SellBookProductDTO>({
      query: (sellBookProductDTO) => ({
        url: `/sell-product/save`,
        method: "POST",
        headers: {
          origin: window.location.origin,
        },
        body: sellBookProductDTO,
      }),
    }),
    uploadSellItemImages: builder.mutation<any, { id: number; images: File[] }>(
      {
        query: ({ id, images }) => {
          const formData = new FormData();
          images.forEach((image) => {
            formData.append("images", image);
          });

          return {
            url: `/sell-product/upload-images/${id}`,
            method: "POST",
            headers: {
              origin: window.location.origin,
            },
            body: formData,
          };
        },
      }
    ),
  }),
});

export const { useCreateSellItemMutation, useUploadSellItemImagesMutation } =
  SellProductApiSlice;
