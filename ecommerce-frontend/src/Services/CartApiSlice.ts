
import { AppClientRemoveAllCartItems } from "Constants/api.constant";
import { AppClientRemoveAllCartItemsResponse } from "features/cart/interfaces/cart-api.interface";
import { CartSave } from "Types/CartSave";
import { ProductPackerDTO } from "Types/ProductPackerDTO";
import { ApiService } from "./ApiService";

export const CartApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllCartWithId: builder.query<ProductPackerDTO, { cartItems: Array<string> }>({
      query: ({ cartItems }) => ({
        url: `/products?page=1&productsCount=1&mode=item_group&items=${cartItems}`,
        method: "GET",
      }),
      transformResponse: (response: any) => {
        return response;
      },
    }),
    getCustomerCart: builder.query<any, void>({
      query: () => ({
        url: `/cart`,
        method: "GET",
      }),
    }),
    updateCustomerCart: builder.mutation<any, Array<CartSave>>({
      query: (cartList) => ({
        url: "/cart",
        method: "POST",
        body: cartList,
      }),
    }),
    removeItemFromCart: builder.mutation<any, string>({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: "DELETE",
      }),
    }),
    removeAllFromCart: builder.mutation<AppClientRemoveAllCartItemsResponse, void>({
      query: () => ({
        url: AppClientRemoveAllCartItems,
        method: "DELETE",
      }),
    }),
    updateItemQuantity: builder.mutation<
      any,
      { productId: string; mode: string; size: string; }
    >({
      query: ({ productId, mode, size }) => ({
        url: `/cart?productId=${productId}&mode=${mode}&size=${size}`,
        method: "PUT",
      }),
      transformErrorResponse: (err) => {
        console.error(err);
      }
    }),
    deleteCartItem: builder.mutation<any, { productid: string; size: string; }>({
      query: ({ productid, size }) => ({
        url: `/cart/removeCartItem?productId=${productid}&size=${size}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useLazyGetAllCartWithIdQuery,
  useGetCustomerCartQuery,
  useLazyGetCustomerCartQuery,
  useUpdateCustomerCartMutation,
  useRemoveItemFromCartMutation,
  useRemoveAllFromCartMutation,
  useUpdateItemQuantityMutation,
  useDeleteCartItemMutation,
} = CartApiSlice;
