import classes from "Templates/Template1/Components/Item/Item.module.css";
import { useEffect, useState } from "react";
// import './Item.css';

import {
  Button,
  Card,
  Group,
  HoverCard,
  Image,
  NumberFormatter,
  Paper,
  Stack,
  Text,
  em,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { getBaseCurrency } from "Utilities/CurrencyHandler";
import { getImage } from "Utilities/ImageConverter";
import { calculatePromotions } from "Utilities/PromotionCalculator";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type Props = {
  item: ProductMetaDTO;
  withBorder: boolean;
};

const Item = ({ item, withBorder }: Props) => {
  const [cardHover, setCardHover] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
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
      w={isMobile ? "190px" : "260px"}
      radius={0}
      withBorder={withBorder}
      className={classes.item}
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={
          cardHover ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
        }
        transition={{ duration: 0.2 }}
        style={{ position: "absolute", top: "10px", right: "25px" }}
      >
        <HoverCard
          width={280}
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
                {item.promotions.map((promotion: any, i: number) => {
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

      <Link to={`/${item.product.item}`} onClick={() => window.scrollTo(0, 0)}> 
        <Card.Section>
          <Image
            w={isMobile ? "190px" : "240px"}
            h={isMobile ? "190px" : "240px"}
            src={getImage(item.imagePath)}
            alt=""
          />
        </Card.Section>
      </Link>

      <Card.Section px={15} mt={20} mb={5}>
        <Link
          to={`/${item.product.item}`}
          style={{ textDecoration: "none", color: "black" }}
          onClick={() => window.scrollTo(0, 0)}
        >
          <Text className={classes.title} size="md" fw={500}>
            {item.product.itemDesc.length > 50
              ? `${item.product.itemDesc.substring(0, 50)}...`
              : item.product.itemDesc}
          </Text>
        </Link>
        <Group align="end" gap={10}>
          {isByValue ? (
            <>
              <NumberFormatter
                decimalScale={2}
                fixedDecimalScale={true}
                prefix={getBaseCurrency(item.product.baseCurrency) || undefined}
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
                      getBaseCurrency(item.product.baseCurrency) || undefined
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
                prefix={getBaseCurrency(item.product.baseCurrency) || undefined}
                className={classes.price}
                value={item.product.ecomUnitPrice}
                thousandSeparator
              />
            </>
          )}
        </Group>
        {(item.product.availqty || 0) < 10 && (item.product.availqty || 0) > 0 && (
          <Text size="sm" fw={500} c="red">
            Only few left!
          </Text>
        )}
      </Card.Section>
    </Card>
  );
};
export default Item;
