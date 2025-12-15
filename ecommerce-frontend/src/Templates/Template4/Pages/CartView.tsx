import { notifications } from "@mantine/notifications";
import AOS from "aos";
import "aos/dist/aos.css";
import CircleLoader from "Components/Common/CircleLoader";
import { ArrowLeft, Gift, Truck } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  useDeleteCartItemMutation,
  useLazyGetAllCartWithIdQuery,
} from "Services/CartApiSlice";

import {
  addToProductCart,
  calculateDiscount,
  calculateSubTotal,
  removeFromCart,
  removeFromProductCart,
  setRewardApplied,
  clearReward,
} from "State/CartSlice/CartSlice";

import { AppDispatch, RootState } from "State/store";

import CartItemCard from "../Components/Common/CartItemCard";
import PriceDetails from "Templates/Template4/Components/PlaceOrderView/PriceDetails";
import MoreProducts from "Templates/Template4/Components/CartView/MoreProducts";
import { Cart } from "Types/Cart";

const USER_REWARD_POINTS = 1165;
const REWARD_POINT_TO_RUPEE = 0.01;
const USER_REWARD_VALUE = parseFloat(
  (USER_REWARD_POINTS * REWARD_POINT_TO_RUPEE).toFixed(2)
);

const CartView = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [deleteCartItem] = useDeleteCartItemMutation();
  const [getCartItems, { isLoading: cartLoading }] =
    useLazyGetAllCartWithIdQuery();

  const {
    cartList,
    cartProductList,
    cartSubTotal,
    rewardApplied,
    rewardValue,
  } = useSelector((state: RootState) => state.cart);

  const { token } = useSelector((state: RootState) => state.login);

  const totalQuantity = cartList.reduce((t, i) => t + i.quantity, 0);

  const hasItems =
    cartList.length > 0 && Boolean(cartProductList?.products?.length);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    dispatch(calculateSubTotal());
    dispatch(calculateDiscount());
  }, [cartList, dispatch]);

  const fetchCartProducts = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    try {
      const response = await getCartItems({ cartItems: ids }).unwrap();
      if (response) dispatch(addToProductCart(response));
    } catch (err) {
      console.error("Failed to fetch cart products", err);
    }
  };

  useEffect(() => {
    if (cartList.length > 0) {
      fetchCartProducts(cartList.map((c: Cart) => c.productId));
    }
  }, [cartList]);

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-vintageBg flex items-center justify-center">
        <CircleLoader />
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="min-h-screen bg-vintageBg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-vintageText mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-vintageText text-vintageBg px-6 py-2 rounded"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const bagDiscountValue = parseFloat((cartSubTotal * 0.05).toFixed(2));
  const rewardSavings = rewardApplied ? rewardValue : 0;

  let finalPay = parseFloat(
    (cartSubTotal - bagDiscountValue - rewardSavings).toFixed(2)
  );

  const handleApplyReward = () => {
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

  const handleRemoveReward = () => {
    dispatch(clearReward());
    notifications.show({
      title: "Reward Removed",
      message: "Reward points removed from this order",
      color: "yellow",
    });
  };

  const handleDeleteItem = async (payload: {
    productId: string;
    size?: string;
  }) => {
    try {
      if (token) {
        const res = await deleteCartItem({
          productid: payload.productId,
          size: payload.size ?? "",
        }).unwrap();
        // server returned success
        if (res) {
          dispatch(removeFromCart(payload));
          dispatch(removeFromProductCart(payload.productId));
        }
      } else {
        dispatch(removeFromCart(payload));
        dispatch(removeFromProductCart(payload.productId));
      }

      notifications.show({
        id: `remove-${payload.productId}`,
        title: "Item Removed",
        message: "Book removed from cart.",
        color: "red",
      });
    } catch {
      // fallback: remove locally
      dispatch(removeFromCart(payload));
      dispatch(removeFromProductCart(payload.productId));
      notifications.show({
        id: `remove-${payload.productId}`,
        title: "Item Removed",
        message: "Book removed from cart (local fallback).",
        color: "red",
      });
    }
  };

  const products = cartProductList!.products;

  return (
    <div className="min-h-screen bg-vintageBg py-4">
      <div className="lg:hidden bg-vintageBg border-b border-vintageBorder p-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-vintageBg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl lg:text-3xl xl:text-4xl text-vintageText font-melodramaRegular tracking-wider font-bold">
            Shopping Cart({totalQuantity})
          </h1>
        </div>
      </div>

      <div className="hidden lg:block mb-6 text-center">
        <h1 className="text-2xl lg:text-3xl xl:text-4xl text-vintageText font-melodramaRegular tracking-wider font-bold">
          Shopping Cart ({totalQuantity})
        </h1>
      </div>

      <div className="container mx-auto px-6 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-vintageBg border-2 border-vintageBorder rounded-lg p-4">
              {cartList.map((item, idx) => {
                const product = products.find(
                  (p: any) => p.product.item === item.productId
                );
                if (!product) return null;

                return (
                  <div key={idx}>
                    <CartItemCard
                      item={product}
                      quantity={item.quantity}
                      token={token}
                      showQuantitySelector={true}
                      showDeleteIcon={true}
                    />
                  </div>
                );
              })}

              <div className="mt-4 pt-3 border-t border-vintageBorder flex justify-between items-center text-sm">
                {/* <button className="flex items-center gap-2">
                  <Gift size={16} />
                  Apply Coupon
                </button> */}

                <div className="flex items-center gap-2"></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="bg-vintageBg p-4 border-2 border-vintageBorder rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold text-vintageText">
                  {USER_REWARD_POINTS} Reward Points{" "}
                  <span className="text-gray-600">
                    ({`₹${USER_REWARD_VALUE}`})
                  </span>
                </p>
              </div>

              {!rewardApplied ? (
                <button
                  className="bg-[#2f6d3f] text-white px-3 py-1 rounded text-sm"
                  onClick={handleApplyReward}
                >
                  Apply
                </button>
              ) : (
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  onClick={handleRemoveReward}
                >
                  Remove
                </button>
              )}
            </div>

            <PriceDetails
              subtotal={cartSubTotal}
              bagDiscount={bagDiscountValue}
              rewardApplied={rewardApplied}
              rewardValue={rewardApplied ? rewardValue : 0}
            />

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-[#1f6140] text-white py-3 rounded font-semibold"
            >
              Continue to Checkout
            </button>

            <button
              onClick={() => navigate("/books-listing")}
              className="w-full bg-[#b46b09] text-vintageBg py-3 rounded font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <MoreProducts />
      </div>
    </div>
  );
};

export default CartView;
