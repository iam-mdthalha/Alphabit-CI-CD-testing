export interface CheckPinCodeAvailability {
    delivery_codes: DeliveryCode[];
}

export interface DeliveryCode {
    postal_code: PostalCode;

}

export interface PostalCode {
    remarks: string;
    pin: number;
    country_code: string;
    state_code: string;
    cod: string;
    pre_paid: string;
    pickup: string;
    cash: string;
    repl: string;
    district: string;
    is_oda: string;
    sort_code: string;
    max_amount: number;
    max_weight: number;
    covid_zone: string;
    inc: string;
    center: Center[];
    city: string;
    sun_tat: boolean;
    protect_blacklist: boolean;
}

export interface Center {
    code: string;
    e: string;
    cn: string;
    s: string;
    u: string;
    ud: string;
    sort_code: string;
}

export interface CheckPinCodeAvailabilityRequest {
    pinCode: string;
    productType: string;
}