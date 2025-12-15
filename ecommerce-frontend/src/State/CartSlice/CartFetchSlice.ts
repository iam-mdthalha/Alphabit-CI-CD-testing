import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { saveCartItems } from "Network/lib/product"
import { CartSave } from "Types/CartSave"
import { ProductMetaDTO } from "Types/ProductMetaDTO"

interface CartFetchState {
    data: Array<ProductMetaDTO>,
    loading: boolean,
    error: string | null
}

const initialState: CartFetchState = {
    data: [],
    loading: false,
    error: null
}


export const updateCartDb = createAsyncThunk(
    "cartfetch/updateCartDb",
    async(cartList: Array<CartSave>, thunkAPI) => {
        const response = await saveCartItems(cartList)
            .then((data: any) => data.message)
            .catch((err: any) => thunkAPI.rejectWithValue(err.response.data));
        return response;
    }
);

const CartFetchSlice = createSlice({
    name: "cartfetch",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateCartDb.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartDb.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
            })
            .addCase(updateCartDb.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to Save data";
            })
    }
});


export default CartFetchSlice.reducer;