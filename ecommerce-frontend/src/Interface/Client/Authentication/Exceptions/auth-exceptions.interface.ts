export interface InvalidCredentialsException {
    validCredentials: boolean;
    message: string;
    statusCode: number;
}