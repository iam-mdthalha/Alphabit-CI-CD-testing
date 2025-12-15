import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllBanners } from "Network/lib/banner";
import { Banner } from "Types/Banner";


interface BannerState {
    data: Array<Banner>,
    loading: boolean,
    error: string | null
}

const initialState: BannerState = {
    data: [],
    loading: false,
    error: null
}

export const fetchBanners = createAsyncThunk<Array<Banner>, void>(
    'banners/fetchBanners',
    async (): Promise<Array<Banner>> => {
        const response = await getAllBanners()
                                .then((data:any) => data.data.results as Array<Banner>);
        return response;
    } 
);

const BannerSlice = createSlice({
    name: "banners",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBanners.fulfilled, (state, action: PayloadAction<Array<Banner>>) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to Fetch data"
            });
    }
});

export default BannerSlice.reducer;