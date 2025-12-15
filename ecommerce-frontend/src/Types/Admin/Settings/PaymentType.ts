export interface PaymentConfigRequestDTO {
    accessTokenId: string;
    clientId: string;
    email: string;
    environment: string;
    gatewayProvider: string;
    secretId: string;
    isActive?: string;
}

export interface PaymentConfigEditRequestDTO extends PaymentConfigRequestDTO {
    id: number;
    isActive: string;
}

export interface PaymentConfigResponseWrapper {
    results: PaymentConfigResponseDTO;
    message: string;
    statusCode: number;
}

export interface PaymentConfigResponseDTO {
    id: number;
    accessTokenId: string;
    clientId: string;
    email: string;
    environment: number;
    gatewayProvider: string;
    secretId: string;
    createdDate: string;
    updatedDate: string;
    isActive: number;
}

interface PaymentFormData {
    gatewayProvider: string;
    email: string;
    accessTokenId: string;
    clientId: string;
    secretId: string;
    environment: string;
    isActive: string;
}