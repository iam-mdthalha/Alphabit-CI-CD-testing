import { Promotion } from "./ProductMetaDTO";

export interface Cart {
  productId: string; 
  quantity: number;
  availableQuantity: number;
  ecomUnitPrice: number;
  discount: number;
  size: string;
}

export interface CartResponse {
  productId: string; 
  quantity: number;
  availableQuantity: number;
  price: number;
  promotions: Array<Promotion>;
  size: string;
}
