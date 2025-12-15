import { ProductMetaDTO } from "Types/ProductMetaDTO";

export interface CartProduct {
    product: ProductMetaDTO,
    quantity: number
}