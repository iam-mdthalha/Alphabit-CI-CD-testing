import { SecurityConfigDTO, SecurityConfigRequestDTO } from "Interface/Admin/Configuration/security-config.interface";
import { WebResponse } from "Interface/Common/http.interface";
import { ApiService } from "Services/ApiService";

export const SecurityConfigApiSlice = ApiService.injectEndpoints({
    endpoints: (builder) => ({
        getSecurityConfig: builder.query<WebResponse<SecurityConfigDTO>, void>({
            query: () => ({
                url: "/admin/security-config/",
                method: "GET",
                headers: {
                    origin: window.location.origin,
                },
            }),
            providesTags: ["SecurityConfig"],
        }),

        saveOrUpdateSecurityConfig: builder.mutation<
            WebResponse<number>,
            SecurityConfigRequestDTO
        >({
            query: (securityConfig) => ({
                url: "/admin/security-config/create-update",
                method: "POST",
                body: securityConfig,
                headers: {
                    origin: window.location.origin,
                },
            }),
            invalidatesTags: ["SecurityConfig"],
        })
    }),
});

export const {
    useGetSecurityConfigQuery,
    useSaveOrUpdateSecurityConfigMutation
} = SecurityConfigApiSlice;