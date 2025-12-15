import { LoginRequest } from "Interface/Client/Authentication/auth.interface";
import { ApiService } from "Services/ApiService";
import { ResultsDTO } from "Types/ResultsDTO";

export const AdminAuthApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<ResultsDTO, Partial<LoginRequest>>({
      query: (credentials) => ({
        url: "/auth/login-with-password",
        method: "POST",
        body: {
          ...credentials,
          loginType: "adminlogin", 
        },
      }),
    }),
  }),
});

export const { useAdminLoginMutation } = AdminAuthApiSlice;
