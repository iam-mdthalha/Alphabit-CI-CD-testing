import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductFilterState {
  selectedFilters: string[];
}

const initialState: ProductFilterState = {
  selectedFilters: [],
};

const productFilterSlice = createSlice({
  name: "productFilter",
  initialState,
  reducers: {
    addFilter: (state, action: PayloadAction<string>) => {
      if (!state.selectedFilters.includes(action.payload)) {
        state.selectedFilters.push(action.payload);
      }
    },
    removeFilter: (state, action: PayloadAction<string>) => {
      state.selectedFilters = state.selectedFilters.filter(
        (filter) => filter !== action.payload
      );
    },
    resetFilters: (state) => {
      state.selectedFilters = [];
    },
  },
});

export const { addFilter, removeFilter, resetFilters } = productFilterSlice.actions;
export default productFilterSlice.reducer;
