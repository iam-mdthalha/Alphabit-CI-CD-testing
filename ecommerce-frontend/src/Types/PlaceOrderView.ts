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

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  addressType: "home" | "work" | "other";
  isDefault?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
}
