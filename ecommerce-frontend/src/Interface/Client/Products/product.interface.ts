import { ProductGarmentTypeDTO } from "Types/Admin/AdminProductType";
import { ProductDTO } from "Types/ProductDTO";
import { Promotion } from "Types/ProductMetaDTO";

export interface ProductEcomDetailDTO {
  allColors: Array<{ data: string }>;
  allImageList: Array<{
    color: string;
    imagePath: string;
    item: string;
  }>;
  allSize: {
    data: string;
    productId: string | null;
    availQty: number;
  }[];
  allSleeve: Array<{ data: string }>;
  availableColors: Array<{ data: string }>;
  availableSize: Array<{ data: string; productId: string; availQty: number }>;
  availableSleeve: Array<{ data: string }>;
  ecomDescription: string;
  labelPara1: string;
  labelPara2: string;
  labelPara3: string;
  labelPara4: string;
  labelPara5: string;
  labelPara6: string;
  labelPara7: string;
  labelPara8: string;
  parameter1: string;
  parameter2: string;
  parameter3: string;
  parameter4: string;
  parameter5: string;
  parameter6: string;
  parameter7: string;
  parameter8: string;
  productDetail: {
    additionalProducts: Array<{
      imagePath: string;
      product: ProductDTO;
      promotions: Promotion[];
    }>;
    brandWrapper: {
      brand: string;
      id: string;
    };
    categoryWrapper: {
      categoryCode: string;
      categoryName: string;
    };
    detailDesc: string[];
    imagePaths: string[];
    imagesLnNo: number[];
    productGarmentTypeDTO: ProductGarmentTypeDTO;
    productWrapper: {
      imagePath: string;
      product: ProductDTO;
      promotions: Promotion[];
    };
    subCategoryWrapper: {
      id: string;
      subCategory: string;
    };
  };
  productId: string;
}
