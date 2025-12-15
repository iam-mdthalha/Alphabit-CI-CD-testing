export interface OrderSummaryDTO {
    orderSummaryHdr: OrderSummaryHdrDTO;
    orderSummaryDet: Array<OrderSummaryDetDTO>;
    hasProformaInvoice: boolean;
    hasInvoice: boolean;
}

export interface OrderSummaryHdrDTO {
    id: number;
    doNo: string;
    orderDate: string;
    totalAmount: number;
    customerName: string;
}

export interface OrderSummaryDetDTO {
    id: number;
    item: string;
    itemDescription: string;
    ecomUnitPrice: number;
    quantityOr: number;
    waybillNo: string;
    refundInitiated: boolean;
    refunded: boolean;
    cancelled: boolean;
    imageUrl: string;
}

