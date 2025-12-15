import { notifications } from "@mantine/notifications";
import { setLoggedIn } from "State/StateEvents";
import { store } from "State/store";
import { InvoiceRequest } from "Types/Order/invoice.interface";
import { ResultsDTO } from "Types/ResultsDTO";
import { ApiService } from "./ApiService";

export const InvoiceApiSlice = ApiService.injectEndpoints({
    endpoints: builder => ({
        getProformaInvoice: builder.query<ResultsDTO, InvoiceRequest>({
            query: (invoiceRequest: InvoiceRequest) => ({
                url: `/order-invoice/proforma-invoice/${invoiceRequest.doNo}`,
                method: 'GET'
            }),
            onQueryStarted: async (args, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (err: any) {
                    console.error('Proforma Invoice Error:', err);
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
                            title: "Failed to load proforma invoice",
                            message: 'Could not fetch your proforma invoice',
                            color: 'red',
                        });
                    }
                }
            },
            transformResponse: (response: any) => {
                return response;
            }
        }),
        getInvoice: builder.query<ResultsDTO, InvoiceRequest>({
            query: (invoiceRequest: InvoiceRequest) => ({
                url: `/order-invoice/invoice/${invoiceRequest.doNo}`,
                method: 'GET'
            }),
            onQueryStarted: async (args, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (err: any) {
                    console.error('Invoice Error:', err);
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
                            title: "Failed to load invoice",
                            message: 'Could not fetch your invoice',
                            color: 'red',
                        });
                    }
                }
            },
            transformResponse: (response: any) => {
                return response;
            }
        }),
        checkProformaInvoiceAvailable: builder.query<ResultsDTO, InvoiceRequest>({
            query: (invoiceRequest: InvoiceRequest) => ({
                url: `/order-invoice/check-proforma-invoice-available/${invoiceRequest.doNo}`,
                method: 'GET'
            }),
            onQueryStarted: async (args, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (err: any) {
                    console.error('Proforma Invoice Availability Error:', err);
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
                            title: "Failed to load proforma invoice availability",
                            message: 'Could not fetch your request',
                            color: 'red',
                        });
                    }
                }
            },
            transformResponse: (response: any) => {
                return response;
            }
        }),
        checkInvoiceAvailable: builder.query<ResultsDTO, InvoiceRequest>({
            query: (invoiceRequest: InvoiceRequest) => ({
                url: `/order-invoice/check-invoice-available/${invoiceRequest.doNo}`,
                method: 'GET'
            }),
            onQueryStarted: async (args, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch (err: any) {
                    console.error('Invoice Availability Error:', err);
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
                            title: "Failed to load invoice availability",
                            message: 'Could not fetch your request',
                            color: 'red',
                        });
                    }
                }
            },
            transformResponse: (response: any) => {
                return response;
            }
        })
    })
});

export const {
    useGetProformaInvoiceQuery,
    useGetInvoiceQuery,
    useCheckInvoiceAvailableQuery,
    useCheckProformaInvoiceAvailableQuery
} = InvoiceApiSlice;