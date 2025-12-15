import { Link } from "react-router-dom";
import { ProductGarmentTypeDTO } from "Types/Admin/AdminProductType";
import { ProductDTO } from "Types/ProductDTO";
import { Promotion } from "Types/ProductMetaDTO";

// type ProductCardProps = {
//     item: string,
//     label: string,
//     image: string,
//     name: string,
//     price: string,
//     oldPrice: string,
//     isBestSeller: boolean,
//     variants: string[]
// }

type ProductCardProps = {
  product: ProductDTO;
  imagePath: string;
  promotions: Promotion[];
  productgarmenttype: ProductGarmentTypeDTO[];
};

const ProductCard = ({
  product,
  imagePath,
  promotions,
  productgarmenttype,
}: ProductCardProps) => {
  return (
    <Link
      to={`/${product.item}`}
      onClick={() => window.scrollTo(0, 0)}
      className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-4 mb-8"
    >
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition">
        <div className="relative">
          {product.isNewArrival ? (
            <div className="absolute top-2 left-2 bg-red-700 text-white text-xs px-2 py-1 z-10 rounded">
              New Arrival
            </div>
          ) : <></>}
          <img
            width="auto"
            height="auto"
            src={imagePath ?? undefined}
            className="w-full h-96 object-contain bg-gray-100"
          />
        </div>
        <div className="p-4">
          {product.isTopSelling == 1 && (
            <div className="text-xs text-gray-500 uppercase mb-1">
              Best Seller
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-800 mb-1">
            {product.itemDesc}
          </h3>
          <div className="flex space-x-2 mb-2">
            {product.mrp && (
              <span className="line-through text-gray-400 text-sm">
                ${product.mrp}
              </span>
            )}
            <span className="text-red-600 font-semibold text-sm">
              ${product.sellingPrice}
            </span>
          </div>
          <div className="flex gap-1 mt-2">
            {[
              "/template3/Products/Shoe1/shoe1_1.webp",
              "/template3/Products/Shoe1/shoe1_2.avif",
              "/template3/Products/Shoe1/shoe1_3.avif",
            ].map((src, idx) => (
              <img
                width="auto"
                height="auto"
                key={idx}
                src={src}
                alt="variant"
                className="w-10 h-10 object-cover border rounded"
              />
            ))}
            <button className="text-sm text-gray-500">+</button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
