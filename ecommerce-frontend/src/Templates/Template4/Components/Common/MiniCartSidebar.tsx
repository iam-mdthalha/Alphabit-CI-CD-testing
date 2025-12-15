import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "State/store";
import CartItemCard from "Templates/Template4/Components/Common/CartItemCard";
import { NumberFormatter } from "@mantine/core";
import { getBaseCurrency } from "Utilities/CurrencyHandler";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

import {
  setRewardApplied,
  clearReward,
  addToProductCart,
  calculateDiscount,
  calculateSubTotal,
} from "State/CartSlice/CartSlice";

import { useLazyGetAllCartWithIdQuery } from "Services/CartApiSlice";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";

interface MiniCartSidebarProps {
  open: boolean;
  onClose: () => void;
}

const PLANT = process.env.REACT_APP_PLANT;

const USER_REWARD_POINTS = 1165;
const REWARD_POINT_TO_RUPEE = 0.01;
const USER_REWARD_VALUE = parseFloat(
  (USER_REWARD_POINTS * REWARD_POINT_TO_RUPEE).toFixed(2)
);

const MiniCartSidebar: React.FC<MiniCartSidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [fetchMiniCartProducts] = useLazyGetAllCartWithIdQuery();

  const {
    cartList = [],
    cartProductList,
    cartSubTotal = 0,
    cartDiscount = 0,
    rewardApplied = false,
    rewardValue = 0,
  } = useSelector((state: RootState) => state.cart);

  const token = useSelector((state: RootState) => state.login.token);

  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const numberOfDecimal =
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 0;

  const products = cartProductList?.products || [];


  useEffect(() => {
    if (open && window.innerWidth < 768) {
      onClose();
      navigate("/cart");
    }
  }, [open, navigate, onClose]);

  useEffect(() => {
    if (!cartList || cartList.length === 0) return;

    const ids = cartList.map((c: any) => c.productId);

    fetchMiniCartProducts({ cartItems: ids })
      .unwrap()
      .then((res) => {
        if (res) dispatch(addToProductCart(res));
      })
      .catch((err) => console.error("MiniCart fetch failed", err));
  }, [cartList, dispatch, fetchMiniCartProducts]);

  useEffect(() => {
    dispatch(calculateSubTotal());
    dispatch(calculateDiscount());
  }, [cartList, dispatch]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const rewardSavings = rewardApplied ? rewardValue : 0;
  const finalTotal = cartDiscount - rewardSavings;
  const bagDiscountValue = Math.abs(cartSubTotal - cartDiscount);

  const goToCart = () => {
    onClose();
    navigate("/cart");
  };

  const goToCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const applyReward = () => {
    dispatch(
      setRewardApplied({
        applied: true,
        value: USER_REWARD_VALUE,
      })
    );
    notifications.show({
      title: "Reward Applied",
      message: `Applied ${USER_REWARD_POINTS} points (₹${USER_REWARD_VALUE})`,
      color: "green",
    });
  };

  const removeReward = () => {
    dispatch(clearReward());
    notifications.show({
      title: "Reward Removed",
      message: "Reward points removed",
      color: "yellow",
    });
  };

  if (!open) return null;

  const itemCount = cartList?.reduce(
    (total: number, item: any) => total + (item.quantity || 0),
    0
  );

  
  if (window.innerWidth < 768) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
        onClick={onClose}
      />

      <aside
        data-aos="fade-left"
        className="
          fixed top-0 right-0 
          h-full 
          w-[400px] 
          max-w-md  
          bg-vintageBg text-vintageText 
          shadow-2xl z-[1000] 
          flex flex-col 
          transition-all duration-300 ease-in-out "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-vintageBorder shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-semibold text-vintageText hover:opacity-90 transition"
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
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Continue Shopping</span>
          </button>

          <button
            onClick={goToCart}
            className="
              bg-yellow-500 text-vintageBg 
              py-2 px-4 rounded-lg 
              font-semibold flex items-center gap-2 
              shadow-md hover:bg-opacity-90 transition
            "
          >
            <span>Cart</span>

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
            >
              <polyline points="5 12 5 5 12 5" />
              <polyline points="19 12 19 19 12 19" />
              <line x1="5" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>

        {/* EMPTY STATE */}
        {cartList.length === 0 && (
          <div className="flex-1 flex items-center justify-center px-4 py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-vintageText mb-2">
                📚 Your cart is empty
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Add books to your bag and they’ll appear here.
              </p>

              <button
                onClick={() => {
                  onClose();
                  navigate("/");
                }}
                className="mt-2 bg-vintageText text-vintageBg px-4 py-2 rounded"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* CART ITEMS */}
        {cartList.length > 0 && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide hide-scrollbar">
              {/* Reward Card */}
              <div className="p-3 bg-vintageBg rounded-lg border border-vintageBorder flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold">
                    {USER_REWARD_POINTS} Reward Points
                  </p>
                  <p className="text-[11px] text-gray-600">
                    (₹{USER_REWARD_VALUE} value)
                  </p>

                  {rewardApplied && (
                    <p className="text-green-700 text-xs mt-1">Applied ✓</p>
                  )}
                </div>

                {!rewardApplied ? (
                  <button
                    onClick={applyReward}
                    className="bg-[#2f6d3f] text-white px-3 py-1 rounded text-sm"
                  >
                    Apply
                  </button>
                ) : (
                  <button
                    onClick={removeReward}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              {!token ? (
                <div className="border border-vintageBorder rounded-md p-4 bg-vintageBg/60">
                  <p className="text-sm font-semibold mb-2">
                    Get Started & Grab the Best Offers!
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      navigate("/login");
                    }}
                    className="w-full rounded-sm px-4 py-2 font-semibold text-light bg-vintageText 
                    hover:bg-opacity-90 active:bg-opacity-80 transition-colors border border-vintageText border-opacity-50 shadow-md"
                  >
                    Sign In / Sign Up
                  </button>
                </div>
              ) : (
                <div className="border border-vintageBorder rounded-md p-4 bg-vintageBg/60">
                  <Link
                    to="/wishlist"
                    onClick={onClose}
                    className="w-full block text-center rounded-sm px-4 py-2 font-semibold 
                    text-vintageBg bg-vintageText hover:bg-opacity-90 shadow-md transition"
                  >
                    View Wishlist
                  </Link>
                </div>
              )}

              {/* ITEMS */}
              {cartList.map((item: any) => {
                const product = products.find(
                  (p: any) => p.product.item === item.productId
                );
                if (!product) return null;

                return (
                  <CartItemCard
                    key={`${item.productId}-${item.size || "default"}`}
                    item={product}
                    quantity={item.quantity}
                    token={token}
                    showQuantitySelector={true}
                    showDeleteIcon={true}
                  />
                );
              })}

              {/* PRICE DETAILS */}
              <div className="border-t border-vintageBorder pt-4">
                <h3 className="text-lg font-semibold mb-3">
                  Price Details{" "}
                  {itemCount > 0 && (
                    <span className="text-sm text-gray-700">
                      ({itemCount} {itemCount === 1 ? "Book" : "Books"})
                    </span>
                  )}
                </h3>

                <div className="flex justify-between text-sm mb-2">
                  <span>Bag MRP</span>
                  <NumberFormatter
                    decimalScale={numberOfDecimal}
                    fixedDecimalScale
                    prefix={getBaseCurrency("INR") || undefined}
                    value={cartSubTotal}
                    thousandSeparator
                  />
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span>Bag Discount</span>
                  <span className="text-green-700">
                    -
                    <NumberFormatter
                      decimalScale={numberOfDecimal}
                      fixedDecimalScale
                      prefix={getBaseCurrency("INR") || undefined}
                      value={bagDiscountValue}
                      thousandSeparator
                    />
                  </span>
                </div>

                {rewardApplied && (
                  <div className="flex justify-between text-sm mb-2">
                    <span>Reward Savings</span>
                    <span className="text-green-700">
                      -
                      <NumberFormatter
                        decimalScale={numberOfDecimal}
                        fixedDecimalScale
                        prefix={getBaseCurrency("INR") || undefined}
                        value={rewardSavings}
                        thousandSeparator
                      />
                    </span>
                  </div>
                )}

                <div className="border-t border-vintageBorder my-3" />

                <div className="flex justify-between font-semibold text-base">
                  <span>You Pay</span>
                  <span>₹{finalTotal.toFixed(numberOfDecimal)}</span>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-vintageBorder bg-vintageBg shrink-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-vintageText">
                    ₹{finalTotal.toFixed(numberOfDecimal)}
                  </span>
                  <span className="text-xs text-gray-700">Grand Total</span>
                </div>

                <button
                  onClick={goToCheckout}
                  className="bg-vintageText text-vintageBg py-3 px-6 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:bg-opacity-90 transition"
                >
                  <span>Checkout</span>

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
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default MiniCartSidebar;
