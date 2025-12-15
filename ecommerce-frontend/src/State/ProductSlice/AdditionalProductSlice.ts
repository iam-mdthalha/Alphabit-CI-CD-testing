import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AdditionalProductState {
    includedProducts: Array<{productId: number, quantity: number}>
}


const initialState: AdditionalProductState = {
    includedProducts: []
}

const AdditionalProductSlice = createSlice({
    name: "additionalproduct",
    initialState,
    reducers: {
        includeProduct: (state, action: PayloadAction<{ productId: number, quantity: number }>) => {
            state.includedProducts.push(action.payload);
        },
        unIncludeProduct: (state, action: PayloadAction<number>) => {
            state.includedProducts = state.includedProducts.filter((includedProduct) => {
                return includedProduct.productId !== action.payload
            })
        }
    }
});

export const { includeProduct, unIncludeProduct } = AdditionalProductSlice.actions;

export default AdditionalProductSlice.reducer;