import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EcommerceConfigDto } from "Types/Admin/Settings/Configuration/AdminCofigurationType";

interface ConfigurationState {
    config: EcommerceConfigDto;
    hasChanges: boolean;
}

const initialState: ConfigurationState = {
    config: {
        id: 0,
        plant: "",
        isAutoProcessOrders: 0,
        isStockCheck: 0,
        isLowStockNotifications: 0,
        isLowStockThreshold: 5,
        onlinePayment: 0,
        isWhatsapp: 0,
        whatsappNumber: "",
        defaultInquiryMessage: "I'm interested in your product. Can you provide more information?",
        numberOfDecimal: "2",
        isModel: 0,
        isSize: 0,
        isSleeve: 0,
        isColor: 0,
        isFabric: 0,
        isOccasion: 0,
        isCollar: 0,
        isPattern: 0,
        crAt: "",
        crBy: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        snapchat: "",
        tiktok: "",
        twitter: "",
        youtube: "",
        plntDesc: "",
        upAt: "",
        upBy: "",
        // New fields
        isBroadcastEnabled: false,
        broadcastMessage: "",
        allow_LTAVAILINVQTY: 0,
        location: "",
        prvsales_PERIOD: 30,
        show_MINAVAILINVQTY: 0,
        show_PRVSALES: 0,
        isLoyaltyPointsEnabled: false,
        loyaltyExpireDays: 0,
        fast2SmsApiKey: "",
        delhiveryApiKey: "",
        whatsappBusinessApiKey: "",
        isShippingApiEnabled: true,
        isWhatsappBusinessApiEnabled: true
    },
    hasChanges: false
};

const configurationSlice = createSlice({
    name: "configuration",
    initialState,
    reducers: {
        setConfig: (state, action: PayloadAction<EcommerceConfigDto>) => {
            state.config = action.payload;
        },
        updateConfig: (state, action: PayloadAction<Partial<EcommerceConfigDto>>) => {
            state.config = { ...state.config, ...action.payload };
            state.hasChanges = true;
        },
        setHasChanges: (state, action: PayloadAction<boolean>) => {
            state.hasChanges = action.payload;
        },
        resetChanges: (state) => {
            state.hasChanges = false;
        }
    }
});

export const { setConfig, updateConfig, setHasChanges, resetChanges } = configurationSlice.actions;
export default configurationSlice.reducer;