import { ProductGarmentTypeDTO } from "Types/Admin/AdminProductType";
import { ProductDTO } from "./ProductDTO";

export interface ProductMetaDTO {
  product: ProductDTO;
  imagePath: string;
  promotions: Array<Promotion>;
  productgarmenttype: Array<ProductGarmentTypeDTO>;
}

export interface Promotion {
  promotionId: number;
  promotionName: string;
  promotionDesc: string;
  promotionBy: string;
  buyQty: number;
  getItem: string;
  getQty: number;
  promotionType: string;
  promotion: number;
  limitOfUsage: number;
  startDate: string;
  endDate: string;
}