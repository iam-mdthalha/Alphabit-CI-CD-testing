import { ShippingAddressDTO } from "Interface/Client/Shipment/shipping.interface";

export interface RazorPaymentResponseDTO {
    orderId: string;
    currency: string;
    amount: number;
    status: string;
    key: string;
    doNo: string;
    shippingAddressDTO: ShippingAddressDTO;
    waybillNos: Array<string>;
    orderDate: string;
}

export interface RzpTransactionDTO {
    doNo: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export interface RzpRefundDTO {
    amount: number;
    notes: Array<String>;
    orderId: string;
    itemCode: string;
    paymentId: string;
}
