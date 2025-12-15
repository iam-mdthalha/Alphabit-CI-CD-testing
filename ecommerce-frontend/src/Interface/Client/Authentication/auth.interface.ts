// export interface LoginRequest {
//     authenticationId: string;
//     password: string;
//     loginType: string;
//     otp: string;
// }

export interface LoginRequest {
    authenticationId: string;
    password: string;
    loginType: string;
}

export interface AuthenticationResponse {
    token: string;
    plant: string;
    ecomconfig: any;
}

export interface OTPSendResponseDTO {
    mobileNo: string
    otpStatus: string;
    message: string;
    isRegistered: boolean;
}

export interface OTPSendRequestDTO {
    userName: string;
    phoneNumber: string;
}

export interface PreLoginRequest {
    authenticationId: string;
    anonymous: boolean;
}

export interface PreAuthResponse {
    validCredentials: boolean;
}

export interface LoginWithPasswordRequest {
    authenticationId: string;
    password: string;
    loginType: string;
}

export interface LoginWithOTPRequest {
    authenticationId: string;
    otp: string;
}

// Password Reset Interfaces - Updated to match actual API responses
export interface ForgotPasswordEmailRequest {
    email: string;
}

export interface ForgotPasswordEmailResponse {
    message: string;
}

export interface ResetPasswordVerifyOtpRequest {
    email: string;
    otp: string;
}

export interface ResetPasswordVerifyOtpResponse {
    message: string;
}

export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
}

export interface ResetPasswordResponse {
    message: string;
}