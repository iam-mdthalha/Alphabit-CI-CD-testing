import {
  AppClientAddAddress,
  AppClientGetCustomer,
} from "Constants/api.constant";
import { AppClientGetCustomerResponse } from "features/customer/interfaces/customer-api.interface";
import { setLoggedIn } from "State/StateEvents";
import { store } from "State/store";
import { CustomerAddress, CustomerAddressAPI } from "Types/CustomerAddress";
import { ApiService } from "./ApiService";

export const CustomerApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    customer: builder.query<AppClientGetCustomerResponse, void>({
      query: () => ({
        url: AppClientGetCustomer,
        method: "GET",
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
    }),
    addAddress: builder.mutation<CustomerAddressAPI, CustomerAddress>({
      query: (address) => ({
        url: AppClientAddAddress,
        method: "POST",
        body: {
          ...address,
        },
      }),
      // onQueryStarted: async (args, { queryFulfilled }) => {
      //     try {
      //         await queryFulfilled;
      //     } catch (err: any) {
      //         if (err.error.status === 401) {
      //             notifications.show({
      //                 id: 'token-expired',
      //                 withCloseButton: true,
      //                 autoClose: 5000,
      //                 title: "Token Expired",
      //                 message: 'Please Login',
      //                 loading: false,
      //             });
      //             localStorage.removeItem("cart");
      //             store.dispatch(setLoggedIn(false));
      //             console.error(err);
      //         }
      //     }
      // },
    }),
    getAllAddress: builder.query<any, null>({
      query: () => ({
        url: `/customer/address`,
        method: "GET",
      }),
      transformResponse: (res) => {
        return res;
      },
    }),
    getBillingAddress: builder.query<any, void>({
      query: () => ({
        url: `/customer/billing-address`,
        method: "GET",
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
    }),
    updateBillingAddress: builder.mutation<
      any,
      {
        addr1: string;
        addr2: string;
        addr3: string;
        addr4: string;
        country: string;
        customerName: string;
        email: string;
        mobileNumber: string;
        pinCode: string;
        state: string;
      }
    >({
      query: (customerBillingAddressDTO) => ({
        url: `/customer/billing-address`,
        method: "POST",
        body: customerBillingAddressDTO,
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
    }),

getCustomerLoyalty: builder.query<any, void>({
  query: () => ({
    url: "/loyalty-points/get-customer-loyalty",
    method: "GET",
    headers: {
      Origin: "origin", 
    },
  }),
  transformResponse: (res) => res,
}),

  }),

});

export const {
  useCustomerQuery,
  useLazyCustomerQuery,
  useAddAddressMutation,
  useGetAllAddressQuery,
  useGetBillingAddressQuery,
  useUpdateBillingAddressMutation,
  useGetCustomerLoyaltyQuery,
  useLazyGetCustomerLoyaltyQuery,
} = CustomerApiSlice;
