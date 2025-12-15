import { AuthResponse } from "Interface/Client/Authentication/google-auth.interface";
import { ApiService } from "Services/ApiService";

export const GoogleAuthApiSlice = ApiService.injectEndpoints({
    endpoints: (builder) => ({
        googleLogin: builder.mutation<AuthResponse, { token: string }>({
            query: ({ token }) => ({
                url: '/auth/google',
                method: 'POST',
                body: { token }
            }),
        })
    })
});

export const { useGoogleLoginMutation } = GoogleAuthApiSlice;