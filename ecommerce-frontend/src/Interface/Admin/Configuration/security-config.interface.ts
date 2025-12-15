export interface SecurityConfigDTO {
    id: number;
    twoFactorEnabled: boolean;
    twilioAccountSid: string;
    twilioAuthToken: string;
    twilioOutgoingSmsNumber: string;
}

export interface SecurityConfigRequestDTO {
    isTwoFactorEnabled: boolean;
    twilioAccountSid: string;
    twilioAuthToken: string;
    twilioOutgoingSmsNumber: string;
}