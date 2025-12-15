import { ApiService } from "Services/ApiService";

export const WishlistApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({

    /** GET WISHLIST */
    getWishlist: builder.query<any, { page?: number; productsCount?: number } | void>({
      query: (arg) => {
        const { page = 1, productsCount = 100 } = arg || {};
        return {
          url: `/wishlist/`,
          method: "GET",
          params: { page, productsCount },
          headers: { origin: window.location.origin },
        };
      },
      providesTags: ["Wishlist"],
    }),

    /** ADD TO WISHLIST  */
    addToWishlist: builder.mutation<any, string>({
      query: (item: string) => ({
        url: `/wishlist/save`,
        method: "POST",
        params: {
          item: String(item), 
        },
        headers: { origin: window.location.origin },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    /** REMOVE FROM WISHLIST  */
    removeFromWishlist: builder.mutation<any, string>({
      query: (item: string) => ({
        url: `/wishlist/remove`,
        method: "DELETE",
        params: {
          item: String(item),  
        },
        headers: { origin: window.location.origin },
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = WishlistApiSlice;
