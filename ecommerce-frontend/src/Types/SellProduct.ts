export interface SellBookProductDTO {
  bookTitle: string;
  bookType: string;
  emailId: string;
  fullName: string;
  id?: number;
  image1: string;
  image2: string;
  isbn: string;
  mobileNumber: string;
  preferredStoreToSell: string;
}

export interface SellProductResponse {
  id?: number;
  message?: string;
  success?: boolean;
}
