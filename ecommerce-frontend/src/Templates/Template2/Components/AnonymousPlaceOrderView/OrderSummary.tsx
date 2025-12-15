import { Flex, ScrollArea, Stack } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetAllCartWithIdQuery } from "Services/CartApiSlice";
import { addToProductCart } from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import SelectedAddress from "Templates/Template1/Components/Checkout/SelectedAddress";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import CartItems from "Templates/Template2/Components/AnonymousPlaceOrderView/CartItems";
import CartPriceDetails from "Templates/Template2/Components/AnonymousPlaceOrderView/CartPriceDetails";
import { Cart } from "Types/Cart";

type Props = {
  type: string;
};

const OrderSummary = ({ type }: Props) => {
  const { token } = useSelector((state: RootState) => state.login);

  const dispatch: AppDispatch = useDispatch();
  const cartList = useSelector((state: RootState) => state.cart.cartList);

  const selectedAddress = useSelector(
    (state: RootState) => state.customer.selectedAddress
  );
  const cartProductList = useSelector(
    (state: RootState) => state.cart.cartProductList
  );

  const [getCartItems, { isLoading: cartLoading }] =
    useLazyGetAllCartWithIdQuery();

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
              {/* {cartProductList?.products.map((item, i) => {
                const quantity = cartList.find(
                  (cartItem) => cartItem.productId === String(item.product.item)
                )?.quantity;

                return (
                  <CartItems
                    key={i}
                    item={item}
                    quantity={quantity ?? 1}
                    token={token}
                    showQuantitySelector={true}
                    showDeleteIcon={true}
                  />
                );
              })} */}
              {
                cartList.map((item, i) => {
                    const product = cartProductList?.products.find((i) => i.product.item === item.productId);
                    if(!product) return;
                    return (
                      <CartItems
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
            </>
          ) : (
            <ScrollArea h={{ base: 100, md: 300 }}>
              {/* {cartProductList?.products.map((item, i) => {
                const quantity = cartList.find(
                  (cartItem) => cartItem.productId === String(item.product.item)
                )?.quantity;

                return (
                  <CartItems
                    key={i}
                    item={item}
                    quantity={quantity ?? 1}
                    token={token}
                    showQuantitySelector={true}
                    showDeleteIcon={true}
                  />
                );
              })} */}
              {
                  cartList.map((item, i) => {
                      const product = cartProductList?.products.find((i) => i.product.item === item.productId);
                      if(!product) return;
                      return (
                        <CartItems
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
