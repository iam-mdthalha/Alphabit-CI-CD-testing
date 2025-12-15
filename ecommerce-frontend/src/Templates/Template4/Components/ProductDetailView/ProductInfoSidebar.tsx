import { notifications } from "@mantine/notifications";
import { ProductEcomDetailDTO } from "Interface/Client/Products/product.interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavigateFunction } from "react-router-dom";
import { useUpdateCustomerCartMutation } from "Services/CartApiSlice";
import { addToCart } from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import { EcommerceConfigDto } from "Types/Admin/Settings/Configuration/AdminCofigurationType";
import { ProductDTO } from "Types/ProductDTO";
import { Promotion } from "Types/ProductMetaDTO";

interface ProductInfoSidebarProps {
  productTitle: string;
  author: string;
  isbn?: string;
  price: number;
  originalPrice: number;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  navigate: NavigateFunction;
  dispatch: AppDispatch;
  productData: ProductDTO;
  ecomProductDetail: ProductEcomDetailDTO;
  ecomConfig?: EcommerceConfigDto;
  isOutOfStock: boolean;
  promotions: Promotion[];
}

const ProductInfoSidebar: React.FC<ProductInfoSidebarProps> = ({
  productTitle,
  author,
  isbn,
  price,
  originalPrice,
  quantity,
  setQuantity,
  navigate,
  dispatch,
  productData,
  ecomProductDetail,
  ecomConfig,
  isOutOfStock,
  promotions,
}) => {
  console.log("Product Data : ", productData);
  console.log("Promotions : ", promotions);
  const { token } = useSelector((state: RootState) => state.login);
  const [updateCustomerCart] = useUpdateCustomerCartMutation();
  const [isQuantityExceeded, setIsQuantityExceeded] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const availqty = productData?.availqty || 0;
  const allowLTAVAILINVQTY = ecomConfig?.allow_LTAVAILINVQTY || 0;

  const numberOfDecimal =
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 0;

  useEffect(() => {
    if (allowLTAVAILINVQTY === 0 && quantity > availqty) {
      setIsQuantityExceeded(true);
    } else {
      setIsQuantityExceeded(false);
    }
  }, [quantity, availqty, allowLTAVAILINVQTY]);

  //#region Handle Add To Cart
  const handleAddToCart = async () => {
    if (!productData || isOutOfStock || isQuantityExceeded) return;

    try {
      const payload = {
        item: productData.item,
        quantity,
        size: "",
      };

      if (token) {
        await updateCustomerCart([payload]).unwrap();
      }

      console.log({
        productId: productData.item,
        quantity,
        availableQuantity: productData.availqty || 0,
        ecomUnitPrice: Number(productData.ecomUnitPrice),
        discount: discountedPrice,
        size: "",
      });

      dispatch(
        addToCart({
          productId: productData.item,
          quantity,
          availableQuantity: productData.availqty || 0,
          ecomUnitPrice: Number(productData.ecomUnitPrice),
          discount: discountedPrice,
          size: "",
        })
      );

      notifications.show({
        message: `${productTitle} added to cart successfully`,
        color: "green",
      });
    } catch (err: any) {
      if (err.status === 409) {
        notifications.show({
          title: "Quantity exceeded",
          message: `You cannot add more than ${availqty} items to cart`,
          color: "red",
        });
      } else {
        console.error("Failed to update cart:", err);
        notifications.show({
          title: "Error",
          message: "Something went wrong while adding to cart",
          color: "red",
        });
      }
    }
  };
  //#endregion

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    if (allowLTAVAILINVQTY === 0 && newQuantity > availqty) {
      notifications.show({
        title: "Quantity exceeded",
        message: `You cannot add more than ${availqty} items to cart`,
        color: "red",
      });
      setIsQuantityExceeded(true);
    } else {
      setQuantity(newQuantity);
      setIsQuantityExceeded(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setIsQuantityExceeded(false);
    }
  };

  const calculateDiscountedPrice = () => {
    const basePrice = productData.ecomUnitPrice || 0;

    const byValuePromos = promotions?.filter(
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

  const calculateDiscountedPercentage = () => {
    const basePrice = productData.ecomUnitPrice || 0;

    const byValuePromos = promotions?.filter(
      (p) => p.promotionBy === "ByValue"
    );

    if (!byValuePromos || byValuePromos.length === 0) return 0;

    const promo = byValuePromos[0];

    if (promo.promotionType === "%") {
      return promo.promotion;
    }

    if (promo.promotionType === "INR") {
      const promoPrice: number = basePrice - promo.promotion;
      return ((basePrice - promoPrice) / basePrice) * 100;
    }

    return 0;
  };

  const discountedPrice = calculateDiscountedPrice();
  const discountedPercentage = calculateDiscountedPercentage();

  const handleSummaryClick = () => {
    setIsSummaryModalOpen(true);
  };

  const closeSummaryModal = () => {
    setIsSummaryModalOpen(false);
  };

  return (
    <>
      <div className="md:w-[50%] w-full flex flex-col items-start pt-2">
        <div className="sticky top-4 lg:top-6 w-full space-y-8">
          <div className="bg-vintageBg/80 rounded-lg shadow p-6 w-full">
            <h1 className="text-3xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-3 leading-tight">
              {productTitle}
            </h1>
            <p className="text-sm md:text-lg text-justify text-gray-700 mb-1">
              by{" "}
              <span className="font-semibold text-vintageText">{author}</span>
            </p>
            {isbn && (
              <p className="text-xs md:text-sm text-gray-700 mb-3">
                <span className="font-semibold text-vintageText">ISBN:</span>{" "}
                {isbn}
              </p>
            )}

            {/* Quantity selector – same for desktop & mobile */}
            <div className="flex items-center justify-start gap-3 mb-6 w-full max-w-xs">
              <label className="text-vintageText font-semibold">
                Quantity:
              </label>
              <div className="flex items-center border border-green-600 rounded-lg overflow-hidden">
                <button
                  className="w-10 h-10 text-xl text-vintageText hover:bg-vintageText hover:bg-opacity-10 transition disabled:opacity-50"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>

                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-14 h-10 text-center text-lg font-semibold text-vintageText border-x border-green-600 bg-transparent focus:outline-none select-none cursor-default"
                />

                <button
                  className="w-10 h-10 text-xl text-vintageText hover:bg-vintageText hover:bg-opacity-10 transition"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* DESKTOP: price + add to cart + summary (unchanged) */}
            <div className="hidden md:block">
              {discountedPrice < (productData.ecomUnitPrice || 0) ? (
                <div className="text-start mb-1 flex items-center space-x-2">
                  <p className="text-3xl font-extrabold text-vintageText uppercase">
                    ₹{discountedPrice.toFixed(numberOfDecimal)}
                  </p>
                  <p className="text-xl text-red-600 font-extrabold uppercase line-through">
                    ₹{productData.ecomUnitPrice?.toFixed(numberOfDecimal)}
                  </p>
                  {discountedPercentage !== 0 && (
                    <span className="text-sm bg-green-100 text-green-800 px-1 py-0.5 rounded">
                      ({discountedPercentage.toFixed(0)}% Offer)
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-3xl font-extrabold text-vintageText text-start mb-1">
                  ₹{productData.ecomUnitPrice?.toFixed(numberOfDecimal)}
                </p>
              )}

              <p className="text-gray-600 text-xs font-medium mb-2">
                (Inclusive of all taxes)
              </p>

              {promotions?.length > 0 && (
                <div className="relative mb-2">
                  <div className="flex gap-1 flex-wrap">
                    {promotions.map((promo: Promotion, index) => (
                      <span
                        key={index}
                        className="bg-yellow-500 text-[0.5rem] text-white uppercase px-2 py-1 shadow-sm rounded-sm"
                      >
                        {promo.promotionName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isOutOfStock ? (
                <p className="text-red-600 text-sm font-medium mb-4">
                  Out of stock
                </p>
              ) : (
                productData?.availqty !== undefined &&
                productData?.minimumAvailableInventoryQuantity !== undefined &&
                productData.availqty > 0 &&
                productData.availqty <=
                  productData.minimumAvailableInventoryQuantity && (
                  <p className="text-red-600 text-sm font-medium mb-4">
                    Only {productData.availqty} left in stock
                  </p>
                )
              )}

              <div>
                <p className="text-green-600 text-sm font-medium mb-4">
                  Get your order in 2-3 days across Tamil Nadu, and 5-7 days for
                  other states.
                </p>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-lg mb-8">
                <button
                  className={`w-full py-4 rounded-lg font-semibold uppercase transition-colors ${
                    isOutOfStock || isQuantityExceeded
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-vintageText text-vintageBg hover:bg-opacity-90"
                  }`}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isQuantityExceeded}
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  className="w-full bg-vintageBg text-vintageText border border-vintageText py-4 rounded-lg font-semibold uppercase hover:bg-vintageText hover:bg-opacity-10 transition-colors"
                  onClick={handleSummaryClick}
                >
                  Summary
                </button>
              </div>
            </div>

            {/* MOBILE: Summary button only (Add to Cart + price are in bottom bar) */}
            <div className="md:hidden mt-4 mb-2">
              <button
                className="w-full bg-vintageBg text-vintageText border border-vintageText py-3 rounded-lg font-semibold uppercase hover:bg-vintageText hover:bg-opacity-10 transition-colors"
                onClick={handleSummaryClick}
              >
                Summary
              </button>
            </div>

            {/* (Commented extra sections kept untouched) */}
            {/* <div className="mt-6">
              ...
            </div> */}
          </div>
        </div>
      </div>

      {/* MOBILE FIXED BOTTOM BAR: Price + Add to Cart */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-vintageBg border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        <div className="max-w-[480px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Price block */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
              Price
            </span>
            {discountedPrice < (productData.ecomUnitPrice || 0) ? (
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-extrabold text-vintageText">
                  ₹{discountedPrice.toFixed(numberOfDecimal)}
                </span>
                <span className="text-xs text-red-600 line-through">
                  ₹{productData.ecomUnitPrice?.toFixed(numberOfDecimal)}
                </span>
                {discountedPercentage !== 0 && (
                  <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                    {discountedPercentage.toFixed(0)}% OFF
                  </span>
                )}
              </div>
            ) : (
              <span className="text-lg font-extrabold text-vintageText">
                ₹{productData.ecomUnitPrice?.toFixed(numberOfDecimal)}
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm font-semibold uppercase tracking-wide shadow-md ${
              isOutOfStock || isQuantityExceeded
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-vintageText text-vintageBg active:scale-[0.98] transition-transform"
            }`}
            onClick={handleAddToCart}
            disabled={isOutOfStock || isQuantityExceeded}
          >
            {isOutOfStock ? "Out of Stock" : "Cart"}
            {!isOutOfStock && (
              <span className="text-lg leading-none translate-y-[1px]">
                ➜
              </span>
            )}
          </button>
        </div>
      </div>

      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-vintageBg rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-vintageText">
                Product Summary
              </h2>
              <button
                onClick={closeSummaryModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x-icon lucide-x text-gray-600 hover:text-gray-800"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {productData.remarkTwo ? (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {productData.remarkTwo}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    No summary available for this product.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200 bg-vintageBg bg-opacity-90">
              <button
                onClick={closeSummaryModal}
                className="px-6 py-2 bg-vintageText text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductInfoSidebar;
