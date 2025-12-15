export interface WishlistItemDTO {
  itemId: number;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
}

export interface WishlistResponseDTO {
  items: WishlistItemDTO[];
}
