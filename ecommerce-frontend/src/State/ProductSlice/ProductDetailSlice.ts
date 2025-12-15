import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProductDetailDTO } from "Types/ProductDetailDTO";


interface ProductDetailState {
    data: ProductDetailDTO | null,
};

const initialState: ProductDetailState = {
    data: null,
}


const ProductDetailSlice = createSlice({
    name: "productdetail",
    initialState: initialState,
    reducers: {
        addProductDetail: (state, action: PayloadAction<ProductDetailDTO>) => {
            state.data = action.payload;
        }
    },
    
});

export const { addProductDetail } = ProductDetailSlice.actions;

export default ProductDetailSlice.reducer;