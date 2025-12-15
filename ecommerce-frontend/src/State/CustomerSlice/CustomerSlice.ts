import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CustomerAddressAPI } from "Types/CustomerAddress";

interface CustomerState {
    selectedAddress: CustomerAddressAPI | null;
    selectedPaymentType: 'PREPAID' | 'CASH_ON_DELIVERY' | null;
}

const initialState: CustomerState = {
    selectedAddress: null,
    selectedPaymentType: null
}

const CustomerSlice = createSlice({
    name: 'customeraddress',
    initialState,
    reducers: {
        addSelectedAddress: (state, action: PayloadAction<CustomerAddressAPI>) => {
            state.selectedAddress = action.payload;
        },
        setSelectedPaymentType: (state, action: PayloadAction<'PREPAID' | 'CASH_ON_DELIVERY' | null>) => {
            state.selectedPaymentType = action.payload;
        }
    }

});

export const { addSelectedAddress, setSelectedPaymentType } = CustomerSlice.actions;

export default CustomerSlice.reducer;