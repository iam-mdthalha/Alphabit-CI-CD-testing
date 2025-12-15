import { ShippingAddressDTO } from "./shipping.interface";

export interface RequestRefundResponse {
    doNo: string;
    shippingAddress: ShippingAddressDTO;
    waybillNos: Array<string>;
    orderDate: string;
    totalPrice: number;
    orderStatus: string;
    paymentId: string;
}
