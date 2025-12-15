export interface BookItem {
  id: number;
  title: string;
  author?: string;
  condition: string;
  price: number;
  originalPrice: number;
  discount: string;
  savings: number;
  shipping: string;
  replacement: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  discount: number;
  description: string;
  expiry: string;
}