import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { registerCustomer } from "Network/lib/auth";
import { CustomerRegistration } from "Types/CustomerRegistration";

interface RegisterState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: RegisterState = {
    loading: false,
    error: null,
    success: false
}

export const registerUser = createAsyncThunk(
    'auth/register',
    async (customerData: CustomerRegistration, thunkAPI) => {
            const response = await registerCustomer(customerData.fullName, customerData.email, customerData.mobileNumber, customerData.password)
                .then((data: any) => data.message).catch(err => thunkAPI.rejectWithValue(err.response.data));
            return response;
        } 
)


const RegisterSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeRegisterSuccessState: (state, action: PayloadAction<boolean>) => {
            state.success = action.payload;
        },
        changeRegisterErrorState: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase(registerUser.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
            state.error = null;
        })
        .addCase(registerUser.rejected, (state, action: any) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload || 'Failed to Register Customer';
        })
       
    }
})

export const { changeRegisterSuccessState, changeRegisterErrorState } = RegisterSlice.actions;

export default RegisterSlice.reducer;
