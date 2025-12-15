import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Cart } from "Types/Cart";
import { ProductPackerDTO } from "Types/ProductPackerDTO";

interface CartState {
  cartList: Array<Cart>;
  cartCount: number;
  cartProductList: ProductPackerDTO | null;
  cartSubTotal: number;
  cartDiscount: number;

  //  NEW FIELDS
  rewardApplied: boolean;
  rewardValue: number;
}

const storedCart = localStorage.getItem("cart");

const initialState: CartState = {
  cartList: storedCart ? JSON.parse(storedCart) : [],
  cartCount: 0,
  cartProductList: null,
  cartSubTotal: 0,
  cartDiscount: 0,

  
  rewardApplied: false,
  rewardValue: 0,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Cart | Array<Cart>>) => {
      const payloadArray = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      payloadArray.forEach((item) => {
        let index = state.cartList.findIndex(
          (cartItem) =>
            cartItem.productId === item.productId && cartItem.size === item.size
        );
        if (index === -1) {
          state.cartList.push(item);
          index = state.cartList.indexOf(item);
        } else {
          state.cartList[index].quantity += item.quantity;
        }
      });

      updateLocalStorage(state.cartList);
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; size?: string }>
    ) => {
      state.cartList = state.cartList.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.size === action.payload.size
          )
      );
      updateLocalStorage(state.cartList);
    },

    removeFromCartWithSync: (
      state,
      action: PayloadAction<{ productId: string; size?: string }>
    ) => {
      state.cartList = state.cartList.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.size === action.payload.size
          )
      );
      updateLocalStorage(state.cartList);
    },

    setCartCount: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload;
    },

    increaseQuantity: (
      state,
      action: PayloadAction<{ productId: string; availableQuantity: number }>
    ) => {
      const index = state.cartList.findIndex(
        (cartItem) => cartItem.productId === action.payload.productId
      );

      if (
        action.payload.availableQuantity - 1 >
        state.cartList[index].quantity
      ) {
        state.cartList[index].quantity += 1;
        updateLocalStorage(state.cartList);
      }
    },

    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const index = state.cartList.findIndex(
        (cartItem) => cartItem.productId === action.payload
      );
      state.cartList[index].quantity -= 1;
      updateLocalStorage(state.cartList);
    },

    calculateSubTotal: (state) => {
      let sum = 0;
      state.cartList.forEach((item) => {
        sum += item.ecomUnitPrice * item.quantity;
      });
      state.cartSubTotal = sum;
    },

    calculateDiscount: (state) => {
      let sum = 0;
      state.cartList.forEach((item) => {
        sum += item.discount * item.quantity;
      });
      state.cartDiscount = sum;
    },

    clearCart: (state) => {
      state.cartList = [];
      localStorage.removeItem("cart");
      localStorage.removeItem("isCartFetched");
    },

    putToCart: (state, action: PayloadAction<Cart | Array<Cart>>) => {
      const payloadArray = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      state.cartList = payloadArray;
      updateLocalStorage(state.cartList);
    },

    appendToCart: (state, action: PayloadAction<Cart | Array<Cart>>) => {
      const payloadArray = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      const storedCart = localStorage.getItem("cart");
      let currentCart: Array<Cart> = storedCart ? JSON.parse(storedCart) : [];

      payloadArray.forEach((item) => {
        const existing = currentCart.find(
          (c) => c.productId === item.productId
        );
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          currentCart.push(item);
        }
      });
      state.cartList = currentCart;
      updateLocalStorage(currentCart);
    },

    addToProductCart: (state, action: PayloadAction<ProductPackerDTO>) => {
      state.cartProductList = action.payload;
    },

    removeFromProductCart: (state, action: PayloadAction<string>) => {
      if (state.cartProductList && state.cartProductList.products.length > 0) {
        state.cartProductList.products = state.cartProductList.products.filter(
          (item) => item.product.item !== action.payload
        );
      }
    },

    updateQuantity: (state, action) => {
      const { productId, size, quantity } = action.payload;
      const index = state.cartList.findIndex(
        (cartItem) =>
          cartItem.productId === productId && cartItem.size === size
      );

      state.cartList[index].quantity = quantity;
      updateLocalStorage(state.cartList);
    },

    
    setRewardApplied: (
      state,
      action: PayloadAction<{ applied: boolean; value: number }>
    ) => {
      state.rewardApplied = action.payload.applied;
      state.rewardValue = action.payload.value;
    },

    clearReward: (state) => {
      state.rewardApplied = false;
      state.rewardValue = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  removeFromCartWithSync,
  setCartCount,
  increaseQuantity,
  decreaseQuantity,
  calculateSubTotal,
  calculateDiscount,
  clearCart,
  putToCart,
  appendToCart,
  addToProductCart,
  removeFromProductCart,
  updateQuantity,

  
  setRewardApplied,
  clearReward,
} = CartSlice.actions;

export default CartSlice.reducer;

const updateLocalStorage = (cartList: Array<Cart> | string) => {
  localStorage.setItem("cart", JSON.stringify(cartList));
};
