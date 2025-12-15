import { APIResponseType } from "_shared/interfaces/api.interface";
import { OrderSummaryDTO } from "Interface/Client/Order/order-summary.interface";

export interface AppClientGetOrderSummaryRequest {
    custCode: string;
    plant: string;
    search?:string;
}


export interface AppClientGetOrderSummaryResponse extends APIResponseType{
    results: Array<OrderSummaryDTO>;
}