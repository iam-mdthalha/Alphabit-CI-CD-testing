

export interface ProductGarmentTypeDTO {
  id: number;
  size: string;
  fabric: string;
  collar: string;
  color: string;
  sleeve: string;
  occasion: string;
  pattern: string;
}

export interface Product {
  productCode: string;
  productName: string;
  productDescription: string[];
  category: string;
  subCategory: string;
  brand: string;
  cost: number;
  inventoryUom: string;
  isNewArrival: number;
  isTopSelling: number;
  maximumStkQty: number;
  minimumSellingPrice: number;
  minimumStkQty: number;
  mrp: number;
  purchaseUom: string;
  salesUom: string;
  sellingPrice: number;
  isActive: string;
}