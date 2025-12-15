import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { ApiService } from "Services/ApiService";
import adminLoginReducer from "State/Admin/AuthSlice/AdminLoginSlice";
import loginReducer from "State/AuthSlice/LoginSlice";
import registerReducer from "State/AuthSlice/RegisterSlice";
import bannerReducer from "State/BannerSlice/BannerSlice";
import cartFetchReducer from "State/CartSlice/CartFetchSlice";
import cartReducer from "State/CartSlice/CartSlice";
import customerReducer from "State/CustomerSlice/CustomerSlice";
import productFilterReducer from "State/ProductFilterSlice/ProductFilterSlice";
import additionalProductReducer from "State/ProductSlice/AdditionalProductSlice";
import productDetailReducer from "State/ProductSlice/ProductDetailSlice";
import sortReducer from "State/SortSlice/SortSlice";
import stateEventsReducer from "State/StateEvents";
import templateReducer from "State/TemplateSlice/TemplateSlice";
// import { encryptTransform } from 'redux-persist-transform-encrypt';
import configurationReducer from "State/Admin/AdminSettings/ConfigurationSlice";
import wishlistReducer from "State/WishlistSlice/WishlistSlice";


const persistSecretKey =
  "0ba7ab72e259f6cb5917830e129de18ad621c0a2424932369c398052a0caf93fc6d5b4126dbf74172dbfd98a4b1daf2d03726820d3d7b4968416519d0a0a3c3a";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // transforms: [
  //     encryptTransform({
  //         secretKey: persistSecretKey,
  //         onError: (error: any) => {
  //             console.error(error);
  //         }
  //     }),
  // ],
};

const persitedStateEventsReducer = persistReducer(
  persistConfig,
  stateEventsReducer
);

export const store = configureStore({
  reducer: {
    banners: bannerReducer,
    sort: sortReducer,
    productdetail: productDetailReducer,
    additionalproduct: additionalProductReducer,
    cart: cartReducer,
    cartfetch: cartFetchReducer,
    register: registerReducer,
    login: loginReducer,
    customer: customerReducer,
    stateevents: persitedStateEventsReducer,
    template: templateReducer,
    productFilter: productFilterReducer,
    [ApiService.reducerPath]: ApiService.reducer,
    adminlogin: adminLoginReducer,
    configuration: configurationReducer,
    wishlist: wishlistReducer

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
       
      },
    }).concat(ApiService.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
