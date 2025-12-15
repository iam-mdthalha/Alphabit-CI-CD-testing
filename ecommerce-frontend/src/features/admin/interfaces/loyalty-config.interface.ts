export interface SaveLoyaltyConfigDTO {
    title: string;
    description?: string;
    byPriceEnabled: boolean;
    byPriceScheduled: boolean;
    loyaltyByPrices?: Array<SaveLoyaltyByPrice>;
    byProductEnabled: boolean;
    byProductScheduled: boolean;
    loyaltyByProducts?: Array<SaveLoyaltyByProduct>;
    redeemPoints: number;
    redeemPrice: number;
    returnPoints: number;
    returnPrice: number;
    pointsUponRegister: boolean;
    uponRegisterPoints?: number;
}

export interface SaveLoyaltyByPrice {
    price?: number;
    points?: number;
    fromDate?: Date;
    toDate?: Date;
}

export interface SaveLoyaltyByProduct {
    item?: string;
    points?: number;
    fromDate?: Date;
    toDate?: Date;
}

export interface LoyaltyConfigDTO {
    id: number;
    plant: string;
    title: string;
    description?: string;
    byPriceEnabled: boolean;
    byPriceScheduled: boolean;
    loyaltyByPrices?: Array<LoyaltyByPrice>;
    byProductEnabled: boolean;
    byProductScheduled: boolean;
    loyaltyByProducts?: Array<LoyaltyByProduct>;
    redeemPoints: number;
    redeemPrice: number;
    returnPoints: number;
    returnPrice: number;
    pointsUponRegister: boolean;
    uponRegisterPoints?: number;
}

export interface LoyaltyByPrice {
    id: number;
    price?: number;
    points?: number;
    fromDate?: Date;
    toDate?: Date;
}

export interface LoyaltyByProduct {
    id: number;
    item?: string;
    points?: number;
    fromDate?: Date;
    toDate?: Date;
}