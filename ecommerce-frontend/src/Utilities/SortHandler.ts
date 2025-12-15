import { ProductMetaDTO } from "Types/ProductMetaDTO";

export const handleSort = (
  products: Array<ProductMetaDTO>,
  sortType: string
) => {
  const sortedProducts = [...products];

  switch (sortType) {
    case "price-asc":
      return sortedProducts.sort(
        (a, b) => a.product.ecomUnitPrice - b.product.ecomUnitPrice
      );
    case "price-desc":
      return sortedProducts.sort(
        (a, b) => b.product.ecomUnitPrice - a.product.ecomUnitPrice
      );
    default:
      return sortedProducts.sort(
        (a, b) => a.product.ecomUnitPrice - b.product.ecomUnitPrice
      );
  }
};
