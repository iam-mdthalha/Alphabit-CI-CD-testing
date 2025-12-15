import {
  ActionIcon,
  Flex,
  Group,
  Image,
  NumberFormatter,
  Paper,
  Stack,
  Text,
  em,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  useRemoveItemFromCartMutation,
  useUpdateItemQuantityMutation,
} from "Services/CartApiSlice";
import {
  calculateDiscount,
  calculateSubTotal,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  removeFromProductCart,
  updateQuantity,
} from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import classes from "Templates/Template1/Components/CartItem/CartItem.module.css";
import QuantitySelector from "Templates/Template1/Components/QuantitySelector/QuantitySelector";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { getBaseCurrency } from "Utilities/CurrencyHandler";
import { calculatePromotions } from "Utilities/PromotionCalculator";

type Props = {
  cartProduct: ProductMetaDTO;
};

const CartItem = ({ cartProduct }: Props) => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const dispatch: AppDispatch = useDispatch();
  const quantity = useSelector((state: RootState) => state.cart.cartList).find(
    (item: any) => item.productId === cartProduct.product.item
  )?.quantity;
  const [removeItemFromCart, { isLoading }] = useRemoveItemFromCartMutation();
  const { userInfo, token } = useSelector((state: RootState) => state.login);
  const [updateCartItemQuantity, { isLoading: updateCartItemLoading }] =
    useUpdateItemQuantityMutation();
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discountPer, setDiscountPer] = useState(0);
  const [isByValue, setIsByValue] = useState(false);

  const cartItem = useSelector((state: RootState) => state.cart.cartList).find(
    (cartItem: any) => cartItem.productId === cartProduct.product.item
  );
  const size = cartItem?.size;

  const incrementQuantity = async () => {
    const availableQuantity = cartProduct.product.availqty;

    if (token) {
      try {
        const updateItemQuantity = async (productId: string, mode: string) => {
          let result = await updateCartItemQuantity({
            productId: productId,
            mode: mode,
            size: ""
          }).unwrap();

          if (result) {
            dispatch(
              updateQuantity({
                productId: cartProduct.product.item,
                quantity: Number(result),
                size: ""
              })
            );
            dispatch(calculateSubTotal());
            dispatch(calculateDiscount());
            notifications.show({
              id: "increment-cart-item",
              withCloseButton: true,
              autoClose: 3000,
              title: `${cartProduct.product.itemDesc} - Quantity is set to ${result}`,
              message: "",
              loading: false,
            });
          }
        };
        updateItemQuantity(cartProduct.product.item, "increment");
      } catch (err) {
        console.error(err);
      }
    } else {
      dispatch(
        increaseQuantity({
          productId: cartProduct.product.item,
          availableQuantity: availableQuantity || 0,
        })
      );
      dispatch(calculateSubTotal());
      dispatch(calculateDiscount());
    }
  };

  const decrementQuantity = () => {
    if (token) {
      try {
        const updateItemQuantity = async (productId: string, mode: string) => {
          let result = await updateCartItemQuantity({
            productId: productId,
            mode: mode,
            size: ""
          }).unwrap();
          if (result) {
            dispatch(
              updateQuantity({
                productId: cartProduct.product.item,
                quantity: Number(result),
                size: ""
              })
            );
            dispatch(calculateSubTotal());
            dispatch(calculateDiscount());
            notifications.show({
              id: "decrement-cart-item",
              withCloseButton: true,
              autoClose: 3000,
              title: `${cartProduct.product.itemDesc} - Quantity is set to ${result}`,
              message: "",
              loading: false,
            });
          }
        };
        updateItemQuantity(cartProduct.product.item, "decrement");
      } catch (err) {
        console.error(err);
      }
    } else {
      dispatch(decreaseQuantity(cartProduct.product.item));
      dispatch(calculateSubTotal());
      dispatch(calculateDiscount());
    }
  };

  useEffect(() => {
    if (cartProduct) {
      let { discountPrice_, discountPer_, isByValue_ } = calculatePromotions(
        cartProduct.promotions,
        cartProduct.product.ecomUnitPrice
      );
      setDiscountPrice(discountPrice_);
      setDiscountPer(discountPer_);
      setIsByValue(isByValue_);
    }
  }, []);

  return (
    <Flex direction="row">
      <Stack align="center" gap={0} flex="10%">
        {!cartProduct.imagePath ? (
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
          <Image
            w={isMobile ? "100px" : "120px"}
            h={isMobile ? "100px" : "120px"}
            src={cartProduct.imagePath || "/placeholder.jpg"}
            alt={cartProduct.product.itemDesc}
            
          />
        )}
        <div style={{ paddingBlock: "10px" }}>
          {quantity && (
            <QuantitySelector
              value={quantity}
              productQuantity={cartProduct.product.availqty || 0}
              increaseQuantity={incrementQuantity}
              decreaseQuantity={decrementQuantity}
            />
          )}
        </div>
      </Stack>
      <Paper px={"20px"} flex="85%">
        <Flex direction="column" rowGap={5}>
          <Link
            to={`/${cartProduct.product.item}`}
            style={{ textDecoration: "none", color: "black" }}
            onClick={() => window.scrollTo(0, 0)}
          >
            <Text className={classes.title} size="lg" fw={500}>
              {cartProduct.product.itemDesc}
            </Text>
          </Link>

          <Group align="end" gap={10}>
            {isByValue ? (
              <>
                <NumberFormatter
                  decimalScale={2}
                  fixedDecimalScale={true}
                  prefix={
                    getBaseCurrency(cartProduct.product.baseCurrency) ||
                    undefined
                  }
                  className={classes.price}
                  value={discountPrice}
                  thousandSeparator
                />

                <Group gap={5}>
                  <Text size="sm" c="dimmed" td={"line-through"} fw={400}>
                    Price{" "}
                    <NumberFormatter
                      decimalScale={2}
                      fixedDecimalScale={true}
                      color="dimmed"
                      prefix={
                        getBaseCurrency(cartProduct.product.baseCurrency) ||
                        undefined
                      }
                      value={cartProduct.product.ecomUnitPrice}
                      thousandSeparator
                    />
                  </Text>
                  <Text
                    size="sm"
                    c="var(--mantine-color-secondary-filled)"
                    fw={400}
                  >
                    ({discountPer}% off)
                  </Text>
                </Group>
              </>
            ) : (
              <>
                <NumberFormatter
                  decimalScale={2}
                  fixedDecimalScale={true}
                  prefix={
                    getBaseCurrency(cartProduct.product.baseCurrency) ||
                    undefined
                  }
                  className={classes.price}
                  value={cartProduct.product.ecomUnitPrice}
                  thousandSeparator
                />
              </>
            )}
          </Group>
        </Flex>
      </Paper>
      <ActionIcon
        flex="5%"
        variant="subtle"
        color="var(--mantine-color-dimmed)"
        onClick={() => {
          dispatch(
            removeFromCart({ productId: cartProduct.product.item, size })
          );
          dispatch(removeFromProductCart(cartProduct.product.item));
          dispatch(calculateSubTotal());
          dispatch(calculateDiscount());
          if (token) {
            const removeItemFromCartExecutor = async (productId: string) => {
              try {
                let result = await removeItemFromCart(productId).unwrap();
                notifications.show({
                  id: "remove-cart-item",
                  withCloseButton: true,
                  autoClose: 3000,
                  title: `${result.item} Removed From The Cart Successfully`,
                  message: "",
                  loading: false,
                });
              } catch (err) {
                console.error(err);
              }
            };
            removeItemFromCartExecutor(cartProduct.product.item);
          }
        }}
      >
        <IconX />
      </ActionIcon>
    </Flex>
  );
};

export default CartItem;
