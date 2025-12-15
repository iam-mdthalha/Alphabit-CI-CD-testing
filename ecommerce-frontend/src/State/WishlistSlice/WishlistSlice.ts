import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ProductMetaDTO } from "Types/ProductMetaDTO";

export interface WishlistItem {
  product: ProductMetaDTO;
}

interface WishlistState {
  items: WishlistItem[];
}

const STORAGE_KEY = "wishlist_items";

const loadWishlist = (): WishlistItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const persist = (items: WishlistItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const initialState: WishlistState = {
  items: loadWishlist(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const id = String(action.payload.product.product.id);
      const exists = state.items.some((i) => String(i.product.product.id) === id);
      if (!exists) {
        state.items.push(action.payload);
        persist(state.items);
      }
    },

    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => String(i.product.product.id) !== action.payload);
      persist(state.items);
    },

    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const id = String(action.payload.product.product.id);
      const exists = state.items.some((i) => String(i.product.product.id) === id);
      if (exists) {
        state.items = state.items.filter((i) => String(i.product.product.id) !== id);
      } else {
        state.items.push(action.payload);
      }
      persist(state.items);
    },

    clearWishlist(state) {
      state.items = [];
      persist([]);
    },

    setWishlist(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
      persist(action.payload);
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  setWishlist,
} = wishlistSlice.actions;


export const addWishlistItem = addToWishlist;
export const removeWishlistItem = removeFromWishlist;

export const selectWishlistItems = (s: RootState) => s.wishlist.items;
export const selectWishlistCount = (s: RootState) => s.wishlist.items.length;

export default wishlistSlice.reducer;
