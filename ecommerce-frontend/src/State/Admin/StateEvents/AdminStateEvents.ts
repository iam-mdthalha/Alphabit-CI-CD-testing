import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AdminStateEventsState {
    isAdminLoggedIn: boolean;
}

const initialState: AdminStateEventsState = {
    isAdminLoggedIn: false,
}

export const AdminStateEvents = createSlice({
    name: "adminstateevents",
    initialState,
    reducers: {
        setAdminLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isAdminLoggedIn = action.payload
        }
    }
});

export const { setAdminLoggedIn } = AdminStateEvents.actions;
export default AdminStateEvents.reducer;