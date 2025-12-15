import { ForgotPasswordEmailRequest, ForgotPasswordEmailResponse, LoginWithOTPRequest, LoginWithPasswordRequest, OTPSendResponseDTO, PreLoginRequest, ResetPasswordRequest, ResetPasswordResponse, ResetPasswordVerifyOtpRequest, ResetPasswordVerifyOtpResponse } from "Interface/Client/Authentication/auth.interface";

import { ApiService } from "Services/ApiService";
import { ResultsDTO } from "Types/ResultsDTO";

export const AuthApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (customerData) => ({
        url: "/auth/register",
        method: "POST",
        body: {
          ...customerData,
        },
      }),
    }),
    preRegister: builder.mutation<ResultsDTO, any>({
      query: (customerData) => ({
        url: "/auth/pre-register",
        method: "POST",
        body: {
          ...customerData,
        },
      }),
      transformErrorResponse: (err) => {
        return err.data;
      }
    }),
    loginWithPassword: builder.mutation<ResultsDTO, Partial<LoginWithPasswordRequest>>({
      query: (credentials) => ({
        url: "/auth/login-with-password",
        method: "POST",
        body: {
          ...credentials,
          loginType: "user",
        },
      }),
    }),
    loginWithOTP: builder.mutation<ResultsDTO, LoginWithOTPRequest>({
      query: (credentials) => ({
        url: "/auth/login-with-otp",
        method: "POST",
        body: {
          ...credentials
        },
      }),
      transformErrorResponse: (err) => {
        return err.data;
      }
    }),
    preOtpLogin: builder.mutation<ResultsDTO, PreLoginRequest>({
      query: (credentials) => ({
        url: "/auth/pre-otp-login",
        method: "POST",
        body: {
          ...credentials
        },
      })
    }),
    sendTwilioOtp: builder.mutation<OTPSendResponseDTO, string>({
      query: (authenticationId: string) => ({
        url: `/auth/twilio/otp/send-otp?authenticationId=${authenticationId}`,
        method: 'POST'
      })
    }),
    registerSendTwilioOtp: builder.mutation<OTPSendResponseDTO, string>({
      query: (mobileNo: string) => ({
        url: `/auth/twilio/otp/register-send-otp?mobileNo=${mobileNo}`,
        method: 'POST'
      }),
    }),
    sendFast2SmsOtp: builder.mutation<OTPSendResponseDTO, string>({
      query: (authenticationId: string) => ({
        url: `/auth/fast2sms/otp/send-otp?authenticationId=${authenticationId}`,
        method: 'POST'
      })
    }),

    registerSendFast2SmsOtp: builder.mutation<OTPSendResponseDTO, string>({
      query: (mobileNo: string) => ({
        url: `/auth/fast2sms/otp/register-send-otp?mobileNo=${mobileNo}`,
        method: 'POST'
      })
    }),
    
    
    validateFast2SmsOtp: builder.mutation<ResultsDTO, { otp: string; username: string }>({
      query: (validateOTPDTO) => ({
        url: "/auth/fast2sms/otp/validate-otp",
        method: "POST",
        body: validateOTPDTO,
        headers: {
          origin: window.location.origin,
        },
      }),
      transformErrorResponse: (err) => {
        return err.data;
      }
    }),
    
    
    forgotPasswordEmailOtp: builder.mutation<ForgotPasswordEmailResponse, ForgotPasswordEmailRequest>({
      query: (request) => ({
        url: "/auth/forgot-pw-mail-otp",
        method: "POST",
        body: request,
        responseHandler: "text",
      }),
      transformResponse: (response: string) => {
        return { message: response };
      },
    }),
    resetPasswordVerifyOtp: builder.mutation<ResetPasswordVerifyOtpResponse, ResetPasswordVerifyOtpRequest>({
      query: (request) => ({
        url: "/auth/reset-password-verify-otp",
        method: "POST",
        body: request,
        responseHandler: "text",
      }),
      transformResponse: (response: string) => {
        return { message: response };
      },
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (request) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: request,
        responseHandler: "text",
      }),
      transformResponse: (response: string) => {
        return { message: response };
      },
    }),
  }),
});

export const { 
  useRegisterMutation, 
  useLoginWithPasswordMutation, 
  useLoginWithOTPMutation, 
  usePreOtpLoginMutation,
  usePreRegisterMutation,
  useSendFast2SmsOtpMutation, 
  useRegisterSendFast2SmsOtpMutation,
  useValidateFast2SmsOtpMutation, 
  useForgotPasswordEmailOtpMutation,
  useResetPasswordVerifyOtpMutation,
  useResetPasswordMutation
} = AuthApiSlice;