import {
  Divider,
  Group,
  NumberFormatter,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  calculateDiscount,
  calculateSubTotal,
} from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import { Cart } from "Types/Cart";
import { getBaseCurrency } from "Utilities/CurrencyHandler";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";

type Props = {
  cartItems: Array<Cart>;
};

const PLANT = process.env.REACT_APP_PLANT;

const CartPriceDetails = () => {
  const dispatch: AppDispatch = useDispatch();
  const { cartSubTotal, cartDiscount } = useSelector(
    (state: RootState) => state.cart
  );
  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const numberOfDecimal =
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 2;

  useEffect(() => {
    dispatch(calculateSubTotal());
    dispatch(calculateDiscount());
  }, [cartSubTotal, cartDiscount]);

  return (
    <>
      <div>
        <Paper
          py={20}
          miw={350}
          px={20}
          bg="white"
          component="div"
          style={{ boxShadow: "0px 1px 13px -10px rgba(0,0,0,0.75)" }}
        >
          <Stack>
            <Title order={5} c="var(--mantine-color-dimmed)">
              PRICE DETAILS
            </Title>
            <Divider w={"100%"} />
            <Stack>
              <Group justify="space-between">
                <Text size="md">Subtotal</Text>
                <NumberFormatter
                  decimalScale={numberOfDecimal}
                  fixedDecimalScale={true}
                  prefix={getBaseCurrency("INR") || undefined}
                  value={cartSubTotal}
                  thousandSeparator
                />
              </Group>
              <Group justify="space-between">
                <Text size="md">Discount</Text>
                <NumberFormatter
                  decimalScale={numberOfDecimal}
                  fixedDecimalScale={true}
                  prefix={`${getBaseCurrency("INR") || undefined}`}
                  value={Math.abs(cartSubTotal - cartDiscount)}
                  thousandSeparator
                />
              </Group>
              <Group justify="space-between">
                <Text size="md">Shipping Cost</Text>
                <Text size="md">FREE</Text>
              </Group>
              {/* <Group justify="space-between">
                                <Text size="md">Delivery Charges</Text>
                                <Text size="md">10</Text>
                            </Group> */}
            </Stack>
            <Divider w={"100%"} />
            <Group justify="space-between">
              <Text size="lg" fw={500}>
                Total Amount
              </Text>
              <NumberFormatter
                decimalScale={numberOfDecimal}
                fixedDecimalScale={true}
                style={{
                  fontSize: "var(--mantine-font-size-lg)",
                  fontWeight: 500,
                }}
                prefix={getBaseCurrency("INR") || undefined}
                value={cartDiscount}
                thousandSeparator
              />
            </Group>
          </Stack>
        </Paper>
      </div>
    </>
  );
};

export default CartPriceDetails;
