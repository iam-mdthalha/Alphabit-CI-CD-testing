import CustomDarkButton from "Components/StyleComponent/CustomDarkButton";
import type React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLazyGetAllCartWithIdQuery } from "Services/CartApiSlice";
import {
  addToProductCart,
  calculateDiscount,
  calculateSubTotal,
} from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import CartItem from "Templates/Template2/Components/CartView/CartItem";
import OrderSummary from "Templates/Template2/Components/CartView/OrderSummary";
import { Cart } from "Types/Cart";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CartView: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const cartList = useSelector((state: RootState) => state.cart.cartList);

  const { cartSubTotal, cartDiscount } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(calculateSubTotal());
    dispatch(calculateDiscount());
  }, [cartSubTotal, cartList]);

  const [getCartItems, { isLoading: cartLoading }] =
    useLazyGetAllCartWithIdQuery();

  const { token } = useSelector((state: RootState) => state.login);
  const cartProductList = useSelector(
    (state: RootState) => state.cart.cartProductList
  );

  const getCartItemsApi = async (cartListIds: Array<string>) => {
    const response = await getCartItems({ cartItems: cartListIds }).unwrap();
    if (response) {
      dispatch(addToProductCart(response));
    }
  };

  useEffect(() => {
    if (cartList.length > 0) {
      getCartItemsApi(cartList.map((item: Cart) => item.productId));
    }
  }, [cartList]);

  if (cartLoading) {
    return <div className="w-full h-screen justify-center items-center"><CircleLoader /></div>
  }

  if (!cartProductList?.products || cartProductList.products.length === 0) {
    return (
      <div className="min-h-screen font-montserrat tracking-widest uppercase flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/new-collections">
            <CustomDarkButton>Continue Shopping</CustomDarkButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-montserrat tracking-widest py-8 bg-gray-50">
      <div className="w-[90vw] container mx-auto">
        <h1 className="text-sm md:text-2xl font-bold uppercase text-center border-b pb-8 mb-12">
          Your Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/5">
            {/* {cartProductList?.products.map((item, i) => {
              console.log("cartProductList");
              console.log(item)
              const cartItem = cartList.find(
                (cartItem) => cartItem.productId === String(item.product.item)
              );
              const quantity = cartItem?.quantity ?? 1;
              const size = cartItem?.size || "";

              return (
                <CartItem
                  key={i}
                  item={item}
                  quantity={quantity ?? 1}
                  token={token}
                  showQuantitySelector={true}
                  showDeleteIcon={true}
                  size={size}
                />
              );
            })} */}
            {
              cartList.map((item, i) => {
                  const product = cartProductList.products.find((i) => i.product.item === item.productId);
                  if(!product) return;
                  return (
                    <CartItem
                      key={i}
                      item={product}
                      quantity={item.quantity ?? 1}
                      token={token}
                      showQuantitySelector={true}
                      showDeleteIcon={true}
                      size={item.size}
                    />
                );
              })
            }
          </div>
          <div className="lg:w-2/5 text-sm">
            <OrderSummary showCheckoutButton={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
