

export interface ItemInfo {
    item: string;
    doLineNo: number;
    ecomUnitPrice: number;
    quantityOr: number;
}

export interface Batch {
    doLineNo: number;
    batch: string;
    location: string;
}

export interface DoDetRemarks {
    item: string;
    doLineNo: number;
    remarks: string;
}

export interface ProductOrderDTO {
    orderId: string;
    orderDate: string;
    waybillNos: Array<string>;
    rzpOrderId: string;
    rzpStatus: string;
    shippingAddressId: number;
    itemList: Array<ItemInfo>;
    remarks: Array<DoDetRemarks>;
    batch: Array<Batch>;
    paymentType: string;
    paymentId?: string;
    isShippingSameAsBilling: boolean;
     loyaltyRedeemedDTO?: {
        redeemedStatus: boolean;
        pointsRedeemed: number;
        totalPoints: number;
    };
}

export interface AnonymousProductOrder {
    orderId: string;
    orderDate: string;
    waybillNos: Array<string>;
    rzpOrderId: string;
    rzpStatus: string;
    customerName: string;
    mobileNumber: string;
    email: string;
    addr1: string; //ADDR1 - address
    addr2: string; //ADDR2 - city / District / Town
    addr3: string; //ADDR3 - Locality
    addr4?: string; //ADDR4 - Landmark
    state: string; //STATE
    pinCode: string; //ZIP
    country: string; //COUNTRY
    itemList: Array<ItemInfo>;
    remarks: Array<DoDetRemarks>;
    batch: Array<Batch>;
    paymentType: "PREPAID" | "CASH_ON_DELIVERY";
    paymentId?: string;
    isShippingSameAsBilling: boolean;
    loyaltyRedeemedDTO?: {
        redeemedStatus: boolean;
        pointsRedeemed: number;
        totalPoints: number;
    };
}