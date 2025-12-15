export interface WhatsAppTrackingDTO {
    customer: WHTrackCustomer;
    orderId: string;
    order: WHTrackOrder[];
    tracking: WHTracking;
}

export interface WHTrackCustomer {
    name: string;
    phoneNumber: string;
}

export interface WHTrackOrder {
    id: string;
    item: string;
    quantity: number;
    price: number;
    additionalNotes: string;
}

export interface WHTracking {
    status: string;
    eta: string;
    trackingUrl: string;
}