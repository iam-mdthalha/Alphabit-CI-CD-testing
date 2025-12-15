import { notifications } from "@mantine/notifications";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  updateQuantity
} from "State/CartSlice/CartSlice";
import { RootState } from "State/store";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
interface CartItemProps {
  item: ProductMetaDTO;
  quantity: number;
  token: string | null;
  showQuantitySelector: boolean;
  showDeleteIcon: boolean;
  size: string;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  quantity: initialQuantity,
  token,
  showQuantitySelector,
  showDeleteIcon,
  size
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
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 0;

  const cartList = useSelector((state: RootState) => state.cart.cartList);
  const cartItem = cartList.find(
    (cartItem: any) => cartItem.productId === String(item.product.item)
  );

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

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
      updateQuantity({ productId: item.product.item, quantity: newQuantity, size: size })
    );

    if (token) {
      try {
        await updateCartItemQuantity({
          productId: encodeURIComponent(item.product.item),
          mode: "increment",
          size: size
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
        updateQuantity({ productId: item.product.item, quantity: newQuantity, size: size })
      );

      if (token) {
        try {
          await updateCartItemQuantity({
            productId: encodeURIComponent(item.product.item),
            mode: "decrement",
            size: size,
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
    const removedQuantity = quantity;
    const removedSize = size;

    if (token) {
      try {
        const res = await deleteCartItem({
          productid: removedProductId,
          size: removedSize
        }).unwrap();
        if (res) {
          dispatch(
            removeFromCart({ productId: removedProductId, size: removedSize })
          );
          dispatch(removeFromProductCart(removedProductId));
        }
      } catch (err: any) {
        if (err.status === 404) {
          dispatch(
            removeFromCart({ productId: removedProductId, size: removedSize })
          );
          dispatch(removeFromProductCart(removedProductId));
        }
      }
    } else {
      dispatch(
        removeFromCart({ productId: removedProductId, size: removedSize })
      );
      dispatch(removeFromProductCart(removedProductId));
    }

    notifications.show({
      id: `remove-${removedProductId}`,
      title: "Item Removed",
      message: (
        <div className="flex items-center justify-between gap-4">
          <span>{item.product.itemDesc} removed from cart.</span>
          {/* <button
            className="text-blue-600 font-semibold hover:underline"
            onClick={() => {
              const restoredCart: Cart = {
                productId: removedProductId,
                quantity: removedQuantity,
                size: removedSize,
                ecomUnitPrice: item.product.ecomUnitPrice || 0,
                discount: 0,
                availableQuantity: item.product.availqty || 0,
              };

              dispatch(addToCart(restoredCart));

              dispatch(
                addToProductCart({
                  products: [item],
                  totalProducts: 1,
                })
              );

              dispatch(calculateSubTotal());
              dispatch(calculateDiscount());

              notifications.update({
                id: `remove-${removedProductId}`,
                title: "Undo Successful",
                message: `${item.product.itemDesc} restored to cart.`,
                color: "green",
                autoClose: 3000,
              });
            }}
          >
            Undo
          </button> */}
        </div>
      ),
      color: "red",
      autoClose: 5000,
      withCloseButton: true,
    });
  };

  const calculateDiscountedPrice = () => {
    const basePrice = item.product.ecomUnitPrice || 0;

    const byValuePromos = item.promotions?.filter(
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
    const basePrice = item.product.ecomUnitPrice || 0;

    const byValuePromos = item.promotions?.filter(
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

  return (
    <div className="flex flex-col border-[1px] my-2 p-4 rounded-sm">
      <div className="flex items-center mb-4">
        {!item.imagePath ? (
          <div className="flex items-center justify-center w-20 h-20 mr-4 bg-gray-200 rounded-lg">
            <div className="text-center p-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
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
            </div>
          </div>
        ) : (
          <img
            width="auto"
            height="auto"
            src={item.imagePath || "/placeholder.jpg"}
            alt={item.product.itemDesc}
            className="w-24 h-24 object-cover rounded-md mr-4"
          />
        )}
        <div className="w-full">
          <h3 className="text-sm uppercase mb-1">
            {item.product.itemDesc.length > 40
              ? `${item.product.itemDesc.substring(0, 40)}...`
              : item.product.itemDesc}
          </h3>
          {discountedPrice < (item.product.ecomUnitPrice || 0) ? (
            <div className="text-start mb-1 flex space-x-2">
              <p className="text-xs text-red-600 font-bold uppercase line-through">
                Rs: {item.product.ecomUnitPrice?.toFixed(numberOfDecimal)}
              </p>
              <p className="text-xs text-green-700 font-bold uppercase">
                Rs: {discountedPrice.toFixed(numberOfDecimal)}
              </p>
              {discountedPercentage !== 0 && (
                <p className="text-xs text-green-700 font-bold uppercase">
                  ({discountedPercentage.toFixed(numberOfDecimal)} % Offer)
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-600 uppercase font-bold text-start">
              Rs: {item.product.ecomUnitPrice?.toFixed(numberOfDecimal)}
            </p>
          )}
          {size && (
            <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
              Size:{" "}
              <span className="text-xs text-gray-800 uppercase font-normal">
                {size}
              </span>
            </p>
          )}
          {showQuantitySelector ? (
            <div className="mb-4">
              <div className="flex items-center border rounded w-24">
                <button
                  className="px-2 py-1 border-r bg-gray-100"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="flex-1 text-center">{quantity}</span>
                <button
                  className="px-2 py-1 border-l bg-gray-100"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-600 uppercase mt-1">
              Quantity: {quantity}
            </p>
          )}
        </div>
        {showDeleteIcon && (
          <button
            onClick={removeItem}
            className="text-red-500 hover:text-red-700 mt-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash2-icon lucide-trash-2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CartItem;
