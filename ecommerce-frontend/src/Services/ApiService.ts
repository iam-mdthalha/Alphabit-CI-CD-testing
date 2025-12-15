import {
  BaseQueryApi,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "State/store";

const baseQuery = fetchBaseQuery({
  // Mobile Testing
  // // baseUrl: 'http://192.168.1.39:9071/api/',

  //  baseUrl: 'http://localhost:9071/api/',

  // textilestore, if REACT_APP_PLANT=C2...
  // mooremarket
  baseUrl: "https://api-fmworker-ind.u-clo.com/AlphabitEcommerce.0.1/api/",

  // caviaarmode, if REACT_APP_PLANT=C7...
  // baseUrl: "https://api-ind-ecommerce.u-clo.com/AlphabitEcommerce.0.1/api/",

  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).login.token;
    if (
      token &&
      !endpoint.includes("login") &&
      !endpoint.includes("register") &&
      !endpoint.includes("getAllCartWithId") &&
      !endpoint.includes("getTopSellers")
    ) {
      headers.set("authorization", `Bearer ${token}`);
      return headers;
    } else {
      return headers;
    }
  },
});

const baseQueryWithReAuth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {}
) => {
  let result = await baseQuery(args, api, extraOptions);

  // if (result.error?.status === 403 || result.error?.status === 500) {
  //   api.dispatch(logout());
  //   window.location.reload();
  // }

  return result;
};

export const ApiService = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
    "Banner",
    "Section",
    "Dashboard",
    "PrdProduct",
    "PrdProductGroup",
    "PrdSubCategory",
    "PrdCategory",
    "PrdBrand",
    "PrdModel",
    "PrdClass",
    "PrdType",
    "Collars",
    "PrdColor",
    "PrdFabric",
    "PrdOccasion",
    "PrdPattern",
    "PrdSize",
    "PrdSleeve",
    "Configuration",
    "Payment",
    "SecurityConfig",
    "ItemGroup",
    "BrandPromotion",
    "CategoryPromotion",
    "ProductPromotion",
    "LocType",
    "Author",
    "Academic",
    "Language",
    "Merchandise",
    "SubClass",
    "Wishlist",
    "Event",
    "EventRegistration",
    "Glossary",
    "History",
  ],
  endpoints: (builder) => ({}),
});

export { baseQueryWithReAuth };

