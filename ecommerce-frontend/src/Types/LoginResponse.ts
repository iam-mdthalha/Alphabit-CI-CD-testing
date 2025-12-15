export interface LoginResponse {
    status: boolean;
    result: {
        custNo: string;
        email: string;
        fullName: string;
        mobileNumber: string;
        token: string;
    }
}