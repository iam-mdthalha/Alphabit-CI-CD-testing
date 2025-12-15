import { Flex } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetAllCartWithIdQuery } from "Services/CartApiSlice";
import { addToProductCart } from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import CartItems from "Templates/Template1/Components/CartItems/CartItems";
import CartPriceDetails from "Templates/Template1/Components/CartPriceDetails/CartPriceDetails";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import { Cart } from "Types/Cart";

const CartView = () => {
  const dispatch: AppDispatch = useDispatch();
  const cartList = useSelector((state: RootState) => state.cart.cartList);
  const cartListIds: Array<string> = cartList.map((item: Cart) => item.productId);
  const [getCartItems, { isLoading: cartLoading }] = useLazyGetAllCartWithIdQuery();
  // const { userInfo, token } = useSelector((state: RootState) => state.login);
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
    if(cartListIds.length > 0) {
      getCartItemsApi(cartListIds);
    }
  }, [cartListIds]);


  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {cartLoading ? (
        <CircleLoader />
      ) : (
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify={"center"}
          w={{ base: "90%", sm: "60%" }}
          gap={20}
          my={100}
        >
          {cartProductList && (
            <CartItems cartItems={cartProductList.products} type="cart" />
          )}
          <CartPriceDetails />
        </Flex>
      )}
    </div>
  );
};
export default CartView;
