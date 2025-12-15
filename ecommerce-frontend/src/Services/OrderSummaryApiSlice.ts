import { notifications } from "@mantine/notifications";
import { AppClientGetOrderSummary } from "Constants/api.constant";
import { AppClientGetOrderSummaryRequest, AppClientGetOrderSummaryResponse } from "features/order-summary/interfaces/order-summary-api.interface";
import { setLoggedIn } from "State/StateEvents";
import { store } from "State/store";
import { ApiService } from "./ApiService";

export const OrderSummaryApiSlice = ApiService.injectEndpoints({
    endpoints: builder => ({
        getOrderSummary: builder.query<AppClientGetOrderSummaryResponse, AppClientGetOrderSummaryRequest>({
            query: ({ custCode, plant, search }) => ({
                url: AppClientGetOrderSummary,
                method: 'GET',
                params: {
                    custCode,
                    plant,
                    ...(search && { search })
                }
            }),
            onQueryStarted: async (args, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (err: any) {
                    console.error('Order Summary Error:', err);
                    if (err.error.status === 401) {
                        notifications.show({
                            id: 'token-expired',
                            withCloseButton: true,
                            autoClose: 5000,
                            title: "Session Expired",
                            message: 'Please login again',
                            color: 'red',
                        });
                        localStorage.removeItem("cart");
                        store.dispatch(setLoggedIn(false));
                    } else {
                        notifications.show({
                            title: "Failed to load orders",
                            message: 'Could not fetch your order history',
                            color: 'red',
                        });
                    }
                }
            },
            transformResponse: (response: any) => {
                return response;
            }
        }),
        trackAnonymousOrder: builder.query({
            query: ({ orderId }: { orderId: string }) => ({
                url: `/OrderSummary/track-order/${orderId}`,
                method: "GET"
            })
        })
    })
});

export const { useGetOrderSummaryQuery, useLazyGetOrderSummaryQuery, useLazyTrackAnonymousOrderQuery } = OrderSummaryApiSlice;