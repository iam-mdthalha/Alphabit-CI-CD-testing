import { ApiService } from "Services/ApiService";
import {
    PaymentConfigEditRequestDTO,
    PaymentConfigRequestDTO,
    PaymentConfigResponseWrapper,
} from "Types/Admin/Settings/PaymentType";

export const AdminPaymentApiSlice = ApiService.injectEndpoints({
    endpoints: (builder) => ({
        getPaymentConfig: builder.query<PaymentConfigResponseWrapper, void>({
            query: () => ({
                url: "/admin/payment-config",
                method: "GET",
                headers: {
                    origin: window.location.origin,
                },
            }),
            providesTags: ["Payment"],
        }),

        savePaymentConfig: builder.mutation<
            PaymentConfigResponseWrapper,
            PaymentConfigRequestDTO
        >({
            query: (paymentConfig) => ({
                url: "/admin/payment-config/create",
                method: "POST",
                body: paymentConfig,
                headers: {
                    origin: window.location.origin,
                },
            }),
            invalidatesTags: ["Payment"],
        }),

        updatePaymentConfig: builder.mutation<
            PaymentConfigResponseWrapper,
            PaymentConfigEditRequestDTO
        >({
            query: (paymentConfig) => ({
                url: "/admin/payment-config/update",
                method: "PUT",
                body: paymentConfig,
                headers: {
                    origin: window.location.origin,
                },
            }),
            invalidatesTags: ["Payment"],
        }),
    }),
});

export const {
    useGetPaymentConfigQuery,
    useSavePaymentConfigMutation,
    useUpdatePaymentConfigMutation,
} = AdminPaymentApiSlice;