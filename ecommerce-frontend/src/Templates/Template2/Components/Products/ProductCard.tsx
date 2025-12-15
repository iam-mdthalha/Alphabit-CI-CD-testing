import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { ProductMetaDTO } from "Types/ProductMetaDTO";

interface ProductCardProps {
  product: ProductMetaDTO;
}

const PLANT = process.env.REACT_APP_PLANT;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [hoveredShirt, setHoveredShirt] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const numberOfDecimal =
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 0;

  const calculateDiscountedPrice = () => {
    const basePrice = product.product.ecomUnitPrice || 0;

    const byValuePromos = product.promotions?.filter(
      (p) => p.promotionBy === "ByValue"
    );

    if (!byValuePromos || byValuePromos.length === 0) return basePrice;

    const promo = byValuePromos[0];

    if (promo.promotionType === "%") {
      return basePrice - (basePrice * promo.promotion) / 100;
    }

    if (promo.promotionType === "INR") {
      return basePrice - promo.promotion;
    }

    return basePrice;
  };

  const discountedPrice = calculateDiscountedPrice();

  const getTagBgColor = (tag: string) => {
    switch (tag) {
      case "new arrival":
        return "#00008B";
      case "top selling":
        return "#20b2aa";
      // case "Hurry, Few Left":
      //   return "#800000";
      default:
        return "#000000";
    }
  };

  const tags = [];
  const quantityTags: string[] = [];

  if (product.product.isNewArrival) {
    tags.push("new arrival");
  }
  if (product.product.isTopSelling) {
    tags.push("top selling");
  }
  // if ((product.product.availqty || 0) <= 10) {
  //   quantityTags.push("Hurry, Few Left");
  // }

  if (imageError || !product.imagePath) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-50 rounded-lg">
        <Link
          to={`/${encodeURIComponent(product.product.item)}`}
          onClick={() => window.scrollTo(0, 0)}
          className="flex flex-col h-full w-full"
        >
          <div className="relative pt-[125%] mb-4 overflow-hidden group rounded-lg bg-gray-100 shadow-sm">
            <div
              className="absolute inset-0"
              onMouseEnter={() => setHoveredShirt(product.product.item)}
              onMouseLeave={() => setHoveredShirt(null)}
            >
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-sm font-medium text-gray-700">
                  No image available
                </h3>
              </div>

              <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute bottom-1 right-1 hidden md:flex flex-col items-end">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-[0.5rem] text-white uppercase px-2 py-1 mb-1 rounded-sm"
                    style={{ backgroundColor: getTagBgColor(tag) }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="absolute top-1 right-1 hidden md:flex flex-col items-end">
                {quantityTags.map((tag: any, index: any) => (
                  <span
                    key={index}
                    className="text-[0.5rem] text-white uppercase px-2 py-1 mb-1 rounded-sm"
                    style={{ backgroundColor: getTagBgColor(tag) }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {product.promotions?.length > 0 && (
                <div className="absolute top-1 left-1 flex flex-col items-start">
                  {product.promotions.map((promo, index) => (
                    <span
                      key={index}
                      className="bg-yellow-500 text-[0.5rem] text-white uppercase px-2 py-1 mb-1 shadow-sm rounded-sm"
                    >
                      {promo.promotionName}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-end items-center px-2">
            <h3 className="text-xs uppercase mb-1 text-center line-clamp-2">
              {product.product.itemDesc}
            </h3>

            {discountedPrice < (product.product.ecomUnitPrice || 0) ? (
              <div className="text-center mb-1">
                <p className="text-xs text-red-600 font-bold uppercase line-through">
                  Rs: {product.product.ecomUnitPrice?.toFixed(numberOfDecimal)}
                </p>
                <p className="text-xs text-green-700 font-bold uppercase">
                  Rs: {discountedPrice.toFixed(numberOfDecimal)}
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-600 uppercase font-bold text-center mb-1">
                Rs: {product.product.ecomUnitPrice?.toFixed(numberOfDecimal)}
              </p>
            )}
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Link
        to={`/${encodeURIComponent(product.product.item)}`}
        onClick={() => window.scrollTo(0, 0)}
        className="flex flex-col h-full"
      >
        <div className="relative pt-[125%] mb-4 overflow-hidden group rounded-lg bg-gray-50">
          <div
            className="absolute inset-0"
            onMouseEnter={() => setHoveredShirt(product.product.item)}
            onMouseLeave={() => setHoveredShirt(null)}
          >
            <img
              src={product.imagePath}
              alt={product.product.itemDesc}
              className="w-full h-full object-cover transition-all duration-300"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 right-0 hidden md:flex flex-col items-end">
              {tags.length > 0 &&
                tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-[.5rem] text-white uppercase px-2 py-1 mb-1"
                    style={{ backgroundColor: getTagBgColor(tag) }}
                  >
                    {tag}
                  </span>
                ))}
            </div>
            <div className="absolute top-1 right-0 hidden md:flex flex-col items-end">
              {quantityTags.length > 0 &&
                quantityTags.map((tag: any, index: any) => (
                  <span
                    key={index}
                    className="text-[.5rem] text-white uppercase px-2 py-1 mb-1"
                    style={{ backgroundColor: getTagBgColor(tag) }}
                  >
                    {tag}
                  </span>
                ))}
            </div>
            {product.promotions?.length > 0 && (
              <div className="absolute top-1 left-1 hidden md:flex flex-col items-start">
                {product.promotions.map((promo, index) => (
                  <span
                    key={index}
                    className="bg-yellow-500 text-[0.5rem] text-white uppercase px-2 py-1 mb-1 shadow"
                  >
                    {promo.promotionName}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-start">
          <h3 className="text-xs uppercase mb-1 text-center line-clamp-2">
            {product.product.itemDesc}
          </h3>
          {discountedPrice < (product.product.ecomUnitPrice || 0) ? (
            <div className="text-center mb-1">
              <p className="text-xs text-red-600 font-bold uppercase line-through">
                Rs: {product.product.ecomUnitPrice?.toFixed(numberOfDecimal)}
              </p>
              <p className="text-xs text-green-700 font-bold uppercase">
                Rs: {discountedPrice.toFixed(numberOfDecimal)}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-600 uppercase font-bold text-center mb-1">
              Rs: {product.product.ecomUnitPrice?.toFixed(numberOfDecimal)}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-1 mt-1 md:hidden">
            {tags.concat(quantityTags).map((tag: any, index: any) => (
              <span
                key={index}
                className="text-[0.45rem] text-white uppercase px-1 py-[0.15rem] rounded-sm"
                style={{ backgroundColor: getTagBgColor(tag) }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
