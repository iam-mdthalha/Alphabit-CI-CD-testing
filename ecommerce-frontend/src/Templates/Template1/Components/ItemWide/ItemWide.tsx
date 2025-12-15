import {
  Button,
  Card,
  Flex,
  Group,
  HoverCard,
  Image,
  NumberFormatter,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconInfoCircle, IconShoppingCart } from "@tabler/icons-react";
import newArrival from "Assets/new_arrival.png";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { getBaseCurrency } from "Utilities/CurrencyHandler";
import { getImage } from "Utilities/ImageConverter";
import classes from "./ItemWide.module.css";

import { notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateCustomerCartMutation } from "Services/CartApiSlice";
import { addToCart } from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import { CartSave } from "Types/CartSave";
import { calculatePromotions } from "Utilities/PromotionCalculator";

type Props = {
  item: ProductMetaDTO;
};

const ItemWide = ({ item }: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const [cardHover, setCardHover] = useState(false);
  const { userInfo, token } = useSelector((state: RootState) => state.login);
  const [updateCustomerCart, { isLoading: cartUpdateLoading }] =
    useUpdateCustomerCartMutation();
  const [discountPrice, setDiscountPrice] = useState(0);
  const [discountPer, setDiscountPer] = useState(0);
  const [isByValue, setIsByValue] = useState(false);

  useEffect(() => {
    let { discountPrice_, discountPer_, isByValue_ } = calculatePromotions(
      item.promotions,
      item.product.ecomUnitPrice
    );
    setDiscountPrice(discountPrice_);
    setDiscountPer(discountPer_);
    setIsByValue(isByValue_);
  }, []);

  return (
    <Card
      bg="white"
      mih={250}
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={
          cardHover ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
        }
        transition={{ duration: 0.2 }}
        style={{ position: "absolute", top: "20px", left: "120px" }}
      >
        <HoverCard
          width={280}
          position="top"
          withArrow
          openDelay={200}
          closeDelay={200}
          shadow="md"
        >
          <HoverCard.Target>
            <Button
              size="compact-sm"
              c="var(--mantine-color-secondary-filled)"
              radius="xl"
              variant="white"
              rightSection={<IconInfoCircle stroke={1.5} />}
            >
              View Offers
            </Button>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            {item.promotions && item.promotions.length > 0 ? (
              <div className={classes.offerDropdown}>
                {item.promotions.map((promotion, i) => {
                  if (i >= 3) {
                    return;
                  }
                  let startDate = new Date();
                  let endDateParts = promotion.endDate.split("/");

                  let day = parseInt(endDateParts[0], 10);
                  let month = parseInt(endDateParts[1], 10) - 1;
                  let year = parseInt(endDateParts[2], 10);

                  let endDate = new Date(year, month, day);
                  let timeDiff = endDate.getTime() - startDate.getTime();
                  let dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));
                  return (
                    <Paper key={i} component="div" withBorder p={5} my={5}>
                      <Group>
                        <Stack>
                          <Text fw={500} size="sm">
                            {promotion.promotionName} - Offer ends in{" "}
                            <span style={{ color: "red" }}>{dayDiff} days</span>
                          </Text>
                          <Text size="sm" lineClamp={3}>
                            {promotion.promotionDesc}
                          </Text>
                        </Stack>
                      </Group>
                    </Paper>
                  );
                })}
                <Button c="blue" variant="transparent">
                  Show more
                </Button>
              </div>
            ) : (
              <Text>There are no offers</Text>
            )}
          </HoverCard.Dropdown>
        </HoverCard>
      </motion.div>
      {item.product.isNewArrival ? (
        <Image
          w={100}
          src={newArrival}
          pos={"absolute"}
          top={30}
          left={-4}
          alt="New Arrival banner"
        />
      ) : (
        <></>
      )}
      <Flex>
        <Image style={{ width: "230px" }} src={getImage(item.imagePath)} />

        <div style={{ paddingInline: "20px" }}>
          <Flex direction="column" rowGap={5}>
            <Link
              to={`/${item.product.item}`}
              style={{ textDecoration: "none", color: "black" }}
              onClick={() => window.scrollTo(0, 0)}
            >
              <Text className={classes.title} size="xl" fw={500}>
                {item.product.itemDesc}
              </Text>
            </Link>
            <Text>{item.product.remark1}</Text>

            <Group align="end" gap={10}>
              {isByValue ? (
                <>
                  <NumberFormatter
                    decimalScale={2}
                    fixedDecimalScale={true}
                    prefix={
                      getBaseCurrency(item.product.baseCurrency) || undefined
                    }
                    className={classes.ecomUnitPrice}
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
                          getBaseCurrency(item.product.baseCurrency) ||
                          undefined
                        }
                        value={item.product.ecomUnitPrice}
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
                      getBaseCurrency(item.product.baseCurrency) || undefined
                    }
                    className={classes.ecomUnitPrice}
                    value={item.product.ecomUnitPrice}
                    thousandSeparator
                  />
                </>
              )}
            </Group>
            {item.product.stockQty > 0 ? (
              <Button
                w={150}
                my={10}
                bg={"var(--mantine-color-secondary-filled)"}
                radius={"xl"}
                onClick={async () => {
                  if (item) {
                    dispatch(
                      addToCart({
                        productId: item.product.item,
                        quantity: 1,
                        availableQuantity: item.product.stockQty,
                        ecomUnitPrice: Number(item.product.ecomUnitPrice),
                        discount: discountPrice,
                        size: ""
                      })
                    );
                    if (token) {
                      //make add to cart db usage
                      var cartDbData: CartSave[] = [];
                      cartDbData.push({
                        item: item.product.item,
                        quantity: 1,
                        size: ""
                      });
                      const updateCart = async (cartData: Array<CartSave>) => {
                        try {
                          let result = await updateCustomerCart(
                            cartData
                          ).unwrap();
                        } catch (err) {
                          console.error(err);
                        }
                      };
                      updateCart(cartDbData);
                    }
                    notifications.show({
                      message: `${item.product.itemDesc} is added to cart successfully`,
                    });
                  }
                }}
                leftSection={<IconShoppingCart size={20} />}
              >
                Add to Cart
              </Button>
            ) : (
              <Text c="red"> No more stocks left!</Text>
            )}
          </Flex>
        </div>
      </Flex>
    </Card>
  );
};

export default ItemWide;
