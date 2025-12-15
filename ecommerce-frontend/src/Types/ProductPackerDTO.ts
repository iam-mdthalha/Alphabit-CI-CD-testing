import { ProductMetaDTO } from "./ProductMetaDTO";

export interface ProductPackerDTO {
    products: Array<ProductMetaDTO>;
    totalProducts: number
}

export interface ProductFilterParams {
    brand?: string;
    category?: string;
    Collar?: string;
    Color?: string;
    department?: string;
    Fabric?: string;
    fromprice?: number;
    items?: string[];
    mode: 'CRITERIA' | 'ITEM_GROUP';
    Occasion?: string;
    page: number;
    Pattern?: string;
    productsCount: number;
    search?: string;
    Sleeve?: string;
    subCategory?: string;
    Toprice?: number;
  }