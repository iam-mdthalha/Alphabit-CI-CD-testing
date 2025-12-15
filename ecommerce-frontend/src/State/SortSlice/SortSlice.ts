import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface SortState {
    value: string;
}

const initialState: SortState = {
    value: 'Price - Low to High',
}

const SortSlice = createSlice({
    name: "sort",
    initialState: initialState,
    reducers: {
        change: (state, action: PayloadAction<string>) => {
            state.value = action.payload;
        }
    }
});

export default SortSlice.reducer;

export const { change } = SortSlice.actions;