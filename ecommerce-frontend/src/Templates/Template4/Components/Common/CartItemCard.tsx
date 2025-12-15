import { NumberFormatter } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { CheckCircle, Minus, Plus, RotateCcw, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import {
  useDeleteCartItemMutation,
  useUpdateItemQuantityMutation,
} from "Services/CartApiSlice";
import {
  calculateDiscount,
  calculateSubTotal,
  removeFromCart,
  removeFromProductCart,
  updateQuantity,
} from "State/CartSlice/CartSlice";
import { RootState } from "State/store";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { getBaseCurrency } from "Utilities/CurrencyHandler";

interface CartItemCardProps {
  item: ProductMetaDTO;
  quantity: number;
  token: string | null;
  showQuantitySelector: boolean;
  showDeleteIcon: boolean;
}

const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  quantity: initialQuantity,
  token,
  showQuantitySelector,
  showDeleteIcon,
}) => {
  const dispatch = useDispatch();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [updateCartItemQuantity] = useUpdateItemQuantityMutation();
  const PLANT = process.env.REACT_APP_PLANT;

  const [quantity, setQuantity] = useState(initialQuantity);
  const [isQuantityExceeded, setIsQuantityExceeded] = useState(false);

  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const availqty = item.product.availqty || 0;
  const allowLTAVAILINVQTY = ecomConfig?.allow_LTAVAILINVQTY || 0;

  const numberOfDecimal =
    ecomConfig?.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 0;

  const cartList = useSelector((state: RootState) => state.cart.cartList);

  
  const cartItem = cartList.find(
    (cartItem: any) => cartItem.productId === String(item.product.item)
  );
  const actualSize = cartItem?.size || ""; 

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const id = item.product.item;
  const title = item.product.itemDesc;
  const author = item.product.author || "";
  const image = item.imagePath;

 
  const increaseQuantity = async () => {
    const newQuantity = quantity + 1;

    if (allowLTAVAILINVQTY === 0 && newQuantity > availqty) {
      notifications.show({
        title: "Quantity exceeded",
        message: `You cannot add more than ${availqty} items to cart`,
        color: "red",
      });
      setIsQuantityExceeded(true);
      return;
    }

    setQuantity(newQuantity);
    setIsQuantityExceeded(false);

    dispatch(
      updateQuantity({
        productId: item.product.item,
        quantity: newQuantity,
        size: actualSize, 
      })
    );

    if (token) {
      try {
        await updateCartItemQuantity({
          productId: encodeURIComponent(item.product.item),
          mode: "increment",
          size: actualSize, 
        }).unwrap();
      } catch (err) {
        console.error("Failed to update quantity:", err);
      }
    }

    dispatch(calculateSubTotal());
    dispatch(calculateDiscount());
  };

 
  const decreaseQuantity = async () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setIsQuantityExceeded(false);

      dispatch(
        updateQuantity({
          productId: item.product.item,
          quantity: newQuantity,
          size: actualSize,
        })
      );

      if (token) {
        try {
          await updateCartItemQuantity({
            productId: encodeURIComponent(item.product.item),
            mode: "decrement",
            size: actualSize, 
          }).unwrap();
        } catch (err) {
          console.error("Failed to decrement quantity:", err);
        }
      }

      dispatch(calculateSubTotal());
      dispatch(calculateDiscount());
    }
  };


  const removeItem = async () => {
    const removedProductId = item.product.item;

    if (token) {
      try {
        const res = await deleteCartItem({
          productid: removedProductId,
          size: actualSize, 
        }).unwrap();

        if (res) {
          dispatch(removeFromCart({ productId: removedProductId, size: actualSize }));
          dispatch(removeFromProductCart(removedProductId));
        }
      } catch (err: any) {
        dispatch(removeFromCart({ productId: removedProductId, size: actualSize }));
        dispatch(removeFromProductCart(removedProductId));
      }
    } else {
      dispatch(removeFromCart({ productId: removedProductId, size: actualSize }));
      dispatch(removeFromProductCart(removedProductId));
    }

    notifications.show({
      id: `remove-${removedProductId}`,
      title: "Item Removed",
      message: `${item.product.itemDesc} removed from cart.`,
      color: "red",
      autoClose: 5000,
      withCloseButton: true,
    });
  };

  return (
    <div
      key={`${item.product.item}`}
      className="border-b border-vintageBorder pb-4 mb-6 last:border-b-0 last:mb-0"
    >
      <div className="flex gap-3 lg:gap-4">
        <Link to={`/${id}`} className="flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-16 h-20 lg:w-20 lg:h-28 object-cover rounded border border-vintageBorder"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2 gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-base lg:text-xl font-bold text-vintageText capitalize font-melodramaRegular tracking-widest leading-tight mb-1 truncate">
                {title}
              </h3>
              {author && (
                <p className="text-xs lg:text-base text-justify text-gray-600 truncate">
                  {author}
                </p>
              )}
            </div>
            {showDeleteIcon && (
              <button
                onClick={removeItem}
                className="flex-shrink-0 text-dark hover:text-vintageText p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            {showQuantitySelector && (
              <div className="flex items-center gap-2">
                <span className="text-xs lg:text-base text-dark">Qty:</span>
                <div className="flex items-center border border-vintageBorder rounded">
                  <button
                    onClick={decreaseQuantity}
                    className="p-1 lg:p-2 hover:bg-vintageBg transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-2 py-1 text-xs lg:text-sm min-w-[30px] lg:min-w-[40px] text-center border-x border-vintageBorder">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="p-1 lg:p-2 hover:bg-vintageBg transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            )}
            {!showQuantitySelector && (
              <div className="flex items-center gap-2">
                <span className="text-xs lg:text-base text-dark">
                  Qty: {quantity}
                </span>
              </div>
            )}
          </div>

         
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {(() => {
              const calculateDiscountedPrice = () => {
                const basePrice = item.product.ecomUnitPrice || 0;
                const promotions = item.promotions || [];

                const byValuePromos = promotions.filter(
                  (p: any) => p.promotionBy === "ByValue"
                );

                if (!byValuePromos || byValuePromos.length === 0)
                  return basePrice;

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
                const basePrice = item.product.ecomUnitPrice || 0;
                const promotions = item.promotions || [];

                const byValuePromos = promotions.filter(
                  (p: any) => p.promotionBy === "ByValue"
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
              const basePrice = item.product.ecomUnitPrice || 0;

              if (discountedPrice < basePrice) {
                return (
                  <>
                    <NumberFormatter
                      decimalScale={numberOfDecimal}
                      fixedDecimalScale
                      prefix={getBaseCurrency("INR") || undefined}
                      value={discountedPrice}
                      thousandSeparator
                      className="text-base lg:text-xl font-semibold text-vintageText"
                    />
                    <NumberFormatter
                      decimalScale={numberOfDecimal}
                      fixedDecimalScale
                      prefix={getBaseCurrency("INR") || undefined}
                      value={basePrice}
                      thousandSeparator
                      className="text-xs lg:text-lg text-dark line-through"
                    />
                    {discountedPercentage !== 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded-full">
                        -{discountedPercentage.toFixed(0)}% OFF
                      </span>
                    )}
                  </>
                );
              } else {
                return (
                  <NumberFormatter
                    decimalScale={numberOfDecimal}
                    fixedDecimalScale
                    prefix={getBaseCurrency("INR") || undefined}
                    value={basePrice}
                    thousandSeparator
                    className="text-base lg:text-xl font-semibold text-vintageText"
                  />
                );
              }
            })()}
          </div>

          {/* <span className="text-xs lg:text-sm text-green-600">
            You save{" "}
            <NumberFormatter
              decimalScale={numberOfDecimal}
              fixedDecimalScale
              prefix={getBaseCurrency("INR") || undefined}
              value=""
              thousandSeparator
            />
          </span> */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#326638] pt-2 text-xs lg:text-sm text-dark leading-snug">
            <div className="flex items-center gap-2 text-gray-700">
              {/* <CheckCircle className="text-vintageText w-3 h-3 lg:w-4 lg:h-4" /> */}
              {/* <span>Ships within 24 hours</span> */}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              {/* <RotateCcw className="text-vintageText w-3 h-3 lg:w-4 lg:h-4" /> */}
              {/* <span>7 days replacement</span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
