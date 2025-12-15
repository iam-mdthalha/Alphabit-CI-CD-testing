import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "State/store";
import { CustomerInfo } from "Types/CustomerInfo";

interface LoginState {
    userInfo: CustomerInfo | null;
    token: string | null;
}

const initialState: LoginState = {
    userInfo: null,
    token: localStorage.getItem('userToken') ? localStorage.getItem('userToken') : null,
}

const LoginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            // const { userToken } = action.payload;
            const { userInfo, userToken } = action.payload;
            state.userInfo = userInfo;
            state.token = userToken;
            if(state.token) {
                updateLocalStorage(state.token);
            }
            
        },
        logout: (state) => {
            state.userInfo = null;
            state.token = null;
            localStorage.removeItem('userToken');
            localStorage.removeItem('cart');
            localStorage.removeItem('isCartFetched');
        }
    },

});

export const { setCredentials, logout } = LoginSlice.actions;

export default LoginSlice.reducer;

const updateLocalStorage = (token: string) => {
    localStorage.setItem('userToken', token);
}

export const selectCurrentUser = (state: RootState) => state.login.userInfo;
export const selectCurrentToken = (state: RootState) => state.login.token;