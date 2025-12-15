import { notifications } from "@mantine/notifications";
import { OrderPlacedDTO, PreProcessAnonymousOrderRequest, PreProcessOrderRequest, SalesOrderPlacedResponse } from "Interface/Client/Order/order.interface";
import { setLoggedIn } from "State/StateEvents";
import { store } from "State/store";
import { AnonymousProductOrder, ProductOrderDTO } from "Types/ProductOrder";
import { ResultsDTO } from "Types/ResultsDTO";
import { ApiService } from "./ApiService";

export const OrderProcessingApiSlice = ApiService.injectEndpoints({
    endpoints: builder => ({
        preProcessOrder: builder.mutation<OrderPlacedDTO, PreProcessOrderRequest>({
            query: (preProcessOrderRequest) => ({
                url: '/sales-order/pre-process-order',
                method: 'POST',
                body: {
                    ...preProcessOrderRequest
                }
            }),
            transformResponse: (res: ResultsDTO) => {
                return res.results;
            }
        }),
        preProcessAnonymousOrder: builder.mutation<OrderPlacedDTO, PreProcessAnonymousOrderRequest>({
            query: (preProcessAnonymousOrderRequest) => ({
                url: '/sales-order/pre-process-anonymous-order',
                method: 'POST',
                body: {
                    ...preProcessAnonymousOrderRequest
                }
            }),
            transformResponse: (res: ResultsDTO) => {
                return res.results;
            }
        }),
        processOrder: builder.mutation<SalesOrderPlacedResponse, ProductOrderDTO>({
            query: (productOrder) => ({
                url: '/sales-order/create-sales-order',
                method: 'POST',
                body: {
                    ...productOrder
                }
            }),
            onQueryStarted: async (args, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (err: any) {
                    if (err.error.status === 401) {
                        // notifications.show({
                        //     id: 'token-expired',
                        //     withCloseButton: true,
                        //     autoClose: 5000,
                        //     // title: "Token Expired",
                        //     message: '',
                        //     // message: 'Please Login',
                        //     loading: false,
                        // });
                        localStorage.removeItem("cart");
                        store.dispatch(setLoggedIn(false));
                    }
                }
            },
            transformResponse: (res: ResultsDTO) => {
                return res.results;
            }
        }),
        processAnonymousOrder: builder.mutation<SalesOrderPlacedResponse, AnonymousProductOrder>({
            query: (anonymousProductOrder) => ({
                url: '/sales-order/create-anonymous-sales-order',
                method: 'POST',
                body: {
                    ...anonymousProductOrder
                }
            }),
            onQueryStarted: async (args, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (err: any) {
                    if (err.error.status === 401) {
                        notifications.show({
                            id: 'token-expired',
                            withCloseButton: true,
                            autoClose: 10,
                            // autoClose: 5000,
                            // title: "Token Expired",
                            // message: 'Please Login',
                            message: '',
                            loading: false,
                        });
                        localStorage.removeItem("cart");
                        store.dispatch(setLoggedIn(false));
                    }
                }
            },
            transformResponse: (res: ResultsDTO) => {
                return res.results;
            }
        }),
        sendOrderConfirmation: builder.mutation<ResultsDTO, { email: string, doNo: string }>({
            query: ({ email, doNo }) => ({
                url: '/email/send-order-confirmation',
                method: 'POST',
                body: {
                    email, doNo
                }
            }),
        })
    })
});

export const {
    useProcessOrderMutation,
    useProcessAnonymousOrderMutation,
    usePreProcessOrderMutation,
    usePreProcessAnonymousOrderMutation,
    useSendOrderConfirmationMutation
} = OrderProcessingApiSlice;