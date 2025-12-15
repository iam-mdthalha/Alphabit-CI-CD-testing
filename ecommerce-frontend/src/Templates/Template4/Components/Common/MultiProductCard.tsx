import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { ProductMetaDTO } from "Types/ProductMetaDTO";

interface MultiProductCardProps {
  product: ProductMetaDTO;
}

const PLANT = process.env.REACT_APP_PLANT;

const MultiProductCard: React.FC<MultiProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const numberOfDecimal =
    ecomConfig && ecomConfig.numberOfDecimal != null
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

  return (
    <div className="font-gilroyRegular leading-wider h-full flex flex-col overflow-hidden group border border-yellow-600 border-opacity-50 p-2 md:p-4 rounded-xl md:rounded-2xl shadow-md"  data-aos="zoom-in">
      <Link
        to={`/${encodeURIComponent(product.product.item)}`}
        onClick={() => window.scrollTo(0, 0)}
        className="flex flex-col h-full"
      >
        <div className="">
          {imageError || !product.imagePath ? (
            <div className="w-full h-48 flex items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-500">No Image</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <div>
                <img
                  src={product.imagePath}
                  alt={product.product.itemDesc}
                  className="w-full h-48 object-cover rounded-xl"
                  onError={() => setImageError(true)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <div>
                  <img
                    src={product.imagePath}
                    alt={product.product.itemDesc}
                    className="w-full h-24 object-cover rounded-xl"
                    onError={() => setImageError(true)}
                  />
                </div>
                <div>
                  <img
                    src={product.imagePath}
                    alt={product.product.itemDesc}
                    className="w-full h-24 object-cover rounded-xl"
                    onError={() => setImageError(true)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 justify-between p-2">
          <div className="flex flex-col gap-2 my-2 md:my-4">
            <p className="text-sm text-gray-700 font-medium capitalize flex gap-1 items-center">
              <span className="bg-vintageText text-light rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-truck-icon lucide-truck"
                >
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <path d="M15 18H9" />
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                  <circle cx="17" cy="18" r="2" />
                  <circle cx="7" cy="18" r="2" />
                </svg>
              </span>
              <span>Free Shipping over Rs:2500</span>
            </p>

            <p className="text-sm text-gray-700 font-medium capitalize flex gap-1 items-center">
              <span className="bg-vintageText text-light rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-indian-rupee-icon lucide-indian-rupee"
                >
                  <path d="M6 3h12" />
                  <path d="M6 8h12" />
                  <path d="m6 13 8.5 8" />
                  <path d="M6 13h3" />
                  <path d="M9 13c6.667 0 6.667-10 0-10" />
                </svg>
              </span>
              <span>Additional Rs:1000 off over Ra:5000</span>
            </p>
          </div>
          <div className="flex items-center justify-between gap-2">
            {imageError || !product.imagePath ? (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full">
                <span className="text-xs text-gray-500">No Image</span>
              </div>
            ) : (
              <img
                src={product.imagePath}
                alt={product.product.itemDesc}
                className="w-20 h-20 object-cover rounded-full"
                onError={() => setImageError(true)}
              />
            )}
            <div className="flex flex-col gap-1">
              <Link
                to="/author/sarah-johnson"
                className="text-sm md:text-base underline text-vintageText hover:text-gray-700"
              >
                bookdragoncrys
              </Link>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#d9b903ff"
                  className="lucide lucide-star-icon lucide-star"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#d9b903ff"
                  className="lucide lucide-star-icon lucide-star"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#d9b903ff"
                  className="lucide lucide-star-icon lucide-star"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#d9b903ff"
                  className="lucide lucide-star-icon lucide-star"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="#d9b903ff"
                  className="lucide lucide-star-icon lucide-star"
                >
                  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                </svg>
                <span>(100)</span>
              </p>
            </div>
            <div className="flex justify-center items-center">
              <Link
                to=""
                className="bg-vintageText text-xs lg:text-sm px-4 md:px-8 py-2 rounded-xl text-vintageBg hover:bg-opacity-90 font-semibold tracking-wider capitalize"
              >
                Full
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MultiProductCard;
