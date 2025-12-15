import { ProductGarmentTypeDTO } from "Types/Admin/AdminProductType";
import { ProductMetaDTO } from "Types/ProductMetaDTO";

export interface ProductDetailDTO {
  productWrapper: ProductMetaDTO;
  categoryWrapper: {
    id: string;
    category: string;
  };
  subCategoryWrapper: {
    id: string;
    subCategory: string;
  };
  brandWrapper: {
    id: string;
    brand: string;
  };
//   subClassWrapper: {
//     subClassCode: string;
//     subClassName: string;
//   };
  additionalProducts: Array<ProductMetaDTO>;
  detailDesc: Array<string>;
  imagePaths: Array<string>;
  productGarmentTypeDTO: ProductGarmentTypeDTO;
}
