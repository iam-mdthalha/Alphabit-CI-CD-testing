import { Flex, ScrollArea, Stack } from "@mantine/core";
import { useLazyGetAllCartWithIdQuery } from "Services/CartApiSlice";
import { addToProductCart } from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import CartItems from "Templates/Template1/Components/CartItems/CartItems";
import CartPriceDetails from "Templates/Template1/Components/CartPriceDetails/CartPriceDetails";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import { Cart } from "Types/Cart";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectedAddress from "./SelectedAddress";

type Props = {
  type: string;
};

const OrderSummary = ({ type }: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const cartList = useSelector((state: RootState) => state.cart.cartList);

  const selectedAddress = useSelector(
    (state: RootState) => state.customer.selectedAddress
  );
  const cartProductList = useSelector(
    (state: RootState) => state.cart.cartProductList
  );

  const [getCartItems, { isLoading: cartLoading }] = useLazyGetAllCartWithIdQuery();



  const getCartItemsApi = async (cartListIds: Array<string>) => {
    const response = await getCartItems({ cartItems: cartListIds }).unwrap();
    if (response) {
      dispatch(addToProductCart(response));
    }
  };

  useEffect(() => {
    if(cartList.length > 0) {
      getCartItemsApi(cartList.map((item: Cart) => item.productId));
    }
  }, [cartList]);
  



  return (
    <>
      {cartLoading ? (
        <CircleLoader />
      ) : (
        <Flex
          w={"100%"}
          direction={{
            base: "column",
            md: type === "authenticated" ? "row" : "column",
          }}
          mt={20}
          gap={30}
        >
          {type == "authenticated" ? (
            <>
              {cartProductList && (
                <CartItems
                  cartItems={cartProductList.products}
                  type="checkout"
                />
              )}
            </>
          ) : (
            <ScrollArea h={{ base: 100, md: 300 }}>
              {cartProductList && (
                <CartItems
                  cartItems={cartProductList.products}
                  type="checkout"
                />
              )}
            </ScrollArea>
          )}
          <Stack>
            <CartPriceDetails />
            {type == "authenticated" && selectedAddress && (
              <div>
                <SelectedAddress selectedAddress={selectedAddress} />
              </div>
            )}
          </Stack>
        </Flex>
      )}
    </>
  );
};

export default OrderSummary;
