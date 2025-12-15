import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiService } from "Services/ApiService";
import { EcommerceConfigDto } from "Types/Admin/Settings/Configuration/AdminCofigurationType";

export const ConfigurationApiSlice = ApiService.injectEndpoints({
    endpoints: (builder) => ({
        getConfigurationByPlant: builder.query<EcommerceConfigDto, string>({
            query: (plant) => ({
                url: `ecomconfig/getbyplant/${plant}`,
                

            }),
            providesTags: [{ type: "Configuration", id: "LIST" }],
        }),
        updateConfiguration: builder.mutation<void, EcommerceConfigDto>({
            query: (config) => ({
                url: `ecomconfig/addorupdate`,
                method: "POST",
                body: config,
            }),
            invalidatesTags: [{ type: "Configuration", id: "LIST" }],
        }),
    }),
});

export const {
    useGetConfigurationByPlantQuery,
    useUpdateConfigurationMutation
} = ConfigurationApiSlice;