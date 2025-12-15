import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "State/store";

interface AdminLoginState {
    adminInfo: any | null;
    adminToken: string | null;
    isAdminLoggedIn: boolean;
}

const initialState: AdminLoginState = {
    adminInfo: null,
    adminToken: localStorage.getItem('adminToken') ? localStorage.getItem('adminToken') : null,
    isAdminLoggedIn: localStorage.getItem('adminToken') ? true : false,
}

const AdminLoginSlice = createSlice({
    name: 'adminlogin',
    initialState,
    reducers: {
        setAdminCredentials: (state, action) => {
            const { adminInfo, adminToken } = action.payload;
            state.adminInfo = adminInfo;
            state.adminToken = adminToken;
            state.isAdminLoggedIn = true;
            if (state.adminToken) {
                localStorage.setItem('adminToken', state.adminToken);
            }
        },
        adminLogout: (state) => {
            state.adminInfo = null;
            state.adminToken = null;
            state.isAdminLoggedIn = false;
            localStorage.removeItem('adminToken');
        }
    },
});

export const { setAdminCredentials, adminLogout } = AdminLoginSlice.actions;
export default AdminLoginSlice.reducer;

export const selectCurrentAdmin = (state: RootState) => state.adminlogin.adminInfo;
export const selectCurrentAdminToken = (state: RootState) => state.adminlogin.adminToken;
export const selectIsAdminLoggedIn = (state: RootState) => state.adminlogin.isAdminLoggedIn; 