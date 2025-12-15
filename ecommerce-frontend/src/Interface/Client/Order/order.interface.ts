import { ItemInfo } from "Types/ProductOrder";
import { ShippingAddressDTO } from "../Shipment/shipping.interface";

export interface SalesOrderPlacedResponse {
  plant: string;
  status: string;
  orderId: string;
  orderDate: string;
}

export interface OrderPlacedDTO {
  plant: string;
  orderId: string;
  orderDate: string;
  deliveryAddress: string;
  waybillNos: Array<string>;
  totalPrice: number;
  shippingAddressDTO: ShippingAddressDTO;
}

export interface PreProcessOrderRequest {
  shippingAddressId: number;
  itemList: Array<ItemInfo>;
  isShippingSameAsBilling: boolean;
}

export interface PreProcessAnonymousOrderRequest {
  customerName: string;
  mobileNumber: string;
  email: string;
  addr1: string;
  addr2: string;
  addr3: string;
  addr4?: string;
  state: string;
  pinCode: string;
  country: string;
  itemList: Array<ItemInfo>;
  isShippingSameAsBilling: boolean;
}
