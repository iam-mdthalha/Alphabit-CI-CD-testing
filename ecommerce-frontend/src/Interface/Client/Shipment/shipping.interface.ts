import { ItemInfo } from "Types/ProductOrder";
import { WHTrackCustomer } from "../Order/whatsapp-track.interface";

export interface ShippingAddressDTO {
    first_name: string;
    address1: string;
    phone: string;
    city: string;
    zip: string;
    province: string;
    country: string;
    last_name: string;
    address2: string;
    address3: string;
    address4: string;
    company: string;
    latitude: string;
    longitude: string;
    state: string;
    name: string;
    country_code: string;
    province_code: string;
}

export interface CreateShipmentRequestDTO {
    whTrackCustomer: WHTrackCustomer | null;
    itemList: Array<ItemInfo>;
    doNo: string;
    shippingAddress: ShippingAddressDTO;
    waybillNos: Array<string>;
    orderDate: string;
    paymentType: "PREPAID" | "CASH_ON_DELIVERY" | null;
    totalAmount: number;
    quantity: string;
}

export interface CancelShipmentRequestDTO{ 
    waybillNo: string;
}