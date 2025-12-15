import { OrderPlacedDTO } from "Interface/Client/Order/order.interface";
import { setLoggedIn } from "State/StateEvents";
import { store } from "State/store";
import { RazorPaymentResponseDTO, RzpRefundDTO, RzpTransactionDTO } from "Types/Order/rzp.interface";
import { ResultsDTO } from "Types/ResultsDTO";
import { ApiService } from "./ApiService";

export const RazorPaymentApiSlice = ApiService.injectEndpoints({
    endpoints: builder => ({
        createRzpPayment: builder.mutation<RazorPaymentResponseDTO, OrderPlacedDTO>({
            query: (orderPlacedDTO) => ({
                url: '/rzp/payment/create',
                method: 'POST',
                body: {
                    ...orderPlacedDTO
                }
            }),
            transformResponse: (res: ResultsDTO) => {
                return res.results;
            }
        }),
        verifyRzpPayment: builder.mutation<ResultsDTO, RzpTransactionDTO>({
            query: (rzpTransactionDTO) => ({
                url: '/rzp/payment/verify',
                method: 'POST',
                body: {
                    ...rzpTransactionDTO
                }
            }),
            onQueryStarted: async (args, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (err: any) {
                    if (err.error.status === 401) {
                        
                        localStorage.removeItem("cart");
                        store.dispatch(setLoggedIn(false));
                    }
                }
            },
            transformResponse: (response: ResultsDTO) => {
                return response.results;
            }
        }),
        rzpNormalRefund: builder.mutation<ResultsDTO, RzpRefundDTO>({
            query: (rzpRefundDTO) => ({
                url: '/rzp/payment/normal-refund',
                method: 'POST',
                body: {
                    ...rzpRefundDTO
                }
            })
        }),
        rzpInstantRefund: builder.mutation<ResultsDTO, RzpRefundDTO>({
            query: (rzpRefundDTO) => ({
                url: '/rzp/payment/instant-refund',
                method: 'POST',
                body: {
                    ...rzpRefundDTO
                }
            })
        })
      
    })
});

export const {
    useCreateRzpPaymentMutation,
    useVerifyRzpPaymentMutation,
    useRzpNormalRefundMutation,
    useRzpInstantRefundMutation
} = RazorPaymentApiSlice;