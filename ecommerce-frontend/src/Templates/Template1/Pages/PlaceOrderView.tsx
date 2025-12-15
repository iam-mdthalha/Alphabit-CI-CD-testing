import {
  Button,
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  Stepper,
  Tooltip,
  rem,
} from "@mantine/core";
import { useViewportSize, useWindowScroll } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";
import { useRemoveAllFromCartMutation } from "Services/CartApiSlice";
import { useProcessOrderMutation } from "Services/OrderProcessingApiSlice";
import { AppDispatch, RootState } from "State/store";
import DeliveryAddressTab from "Templates/Template1/Components/Checkout/DeliveryAddressTab";
import LoginInsights from "Templates/Template1/Components/Checkout/LoginInsights";
import MiniLoginTab from "Templates/Template1/Components/Checkout/MiniLoginTab";
import OrderSummary from "Templates/Template1/Components/Checkout/OrderSummary";
import {
  Batch,
  DoDetRemarks,
  ItemInfo,
  ProductOrderDTO,
} from "Types/ProductOrder";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PlaceOrderView = () => {
  const { userInfo, token } = useSelector((state: RootState) => state.login);
  const dispatch: AppDispatch = useDispatch();
  const [active, setActive] = useState(token ? 1 : 0);
  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [scroll, scrollTo] = useWindowScroll();
  const { selectedAddress, selectedPaymentType } = useSelector(
    (state: RootState) => state.customer
  );
  const { cartList } = useSelector((state: RootState) => state.cart);
  const [processOrder, { isLoading: processOrderLoading }] =
    useProcessOrderMutation();
  const { height, width } = useViewportSize();
  const [order, setOrder] = useState(undefined); //temp
  const [removeAllCart] = useRemoveAllFromCartMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && active === 0) {
      setActive(1);
    }
  }, [token]);

  const getTooltipStatement = (active: number) => {
    switch (active) {
      case 0: {
        return "Please Login First";
      }
      case 1: {
        return "Please Choose Delivery Address";
      }
      case 3: {
        return "Choose a Payment method";
      }
    }
  };

  const placeOrder = () => {
    if (
      selectedAddress &&
      token &&
      cartList.length > 0 &&
      selectedPaymentType
    ) {
      var itemInfo: Array<ItemInfo> = [];
      var doDetRemarks: Array<DoDetRemarks> = [];
      var batch: Array<Batch> = [
        {
          doLineNo: 1,
          batch: "NOBATCH",
          location: "NONSTOCK",
        },
      ];

      cartList.map((item, i) => {
        itemInfo.push({
          item: item.productId,
          doLineNo: i + 1,
          ecomUnitPrice: item.ecomUnitPrice,
          quantityOr: item.quantity,
        });

        doDetRemarks.push({
          item: item.productId,
          doLineNo: i + 1,
          remarks: "",
        });
      });

      var productOrder: ProductOrderDTO = {
        orderId: "",
        orderDate: "",
        waybillNos: [],
        rzpOrderId: "",
        rzpStatus: "",
        shippingAddressId: selectedAddress.id,
        itemList: itemInfo,
        remarks: doDetRemarks,
        batch: batch,
        paymentType: selectedPaymentType,
        isShippingSameAsBilling: false,
      };
      const processOrderFunc = async (productOrder: ProductOrderDTO) => {
        try {
          const result = await processOrder(productOrder).unwrap();

          if (result) {
            // setOrder(result);
            // setActive((active) => active + 1);
            // window.location.href = result.paymentUrl;
            // dispatch(clearCart());
            // const removeItemFromCartExecutor = async () => {
            //     try {
            //         let result = await removeAllCart({}).unwrap();
            //     } catch (err) {
            //         console.error(err);
            //     }
            // }
            // removeItemFromCartExecutor();
          }
        } catch (err) {
          console.error(err);
        }
      };
      processOrderFunc(productOrder);
    }
  };

  return (
    <Flex justify={"center"} pos={"relative"}>
      <Paper
        component="div"
        w={{ base: "90vw", lg: "70vw" }}
        bg={"var(--mantine-color-white)"}
        style={{ boxShadow: "var(--mantine-shadow-lg)" }}
        my={20}
        px={20}
        py={30}
      >
        <Stepper
          color="var(--mantine-color-secondary-filled)"
          active={active}
          size="sm"
          completedIcon={
            <IconCheck style={{ width: rem(18), height: rem(18) }} />
          }
        >
          <Stepper.Step label="Login" description="Login To your Account">
            <Flex
              w={"100%"}
              justify="center"
              align="center"
              direction={{ base: "column", md: "row" }}
              gap={{ base: 100, md: 150 }}
              py={{ base: 30, md: 100 }}
              px={{ base: 5, md: 30 }}
            >
              <Stack>
                <Button
                  size="md"
                  radius="xs"
                  variant="light"
                  color="var(--mantine-color-secondary-filled)"
                  onClick={() => {
                    navigate("/anonymous-checkout");
                  }}
                >
                  PROCEED TO ANONYMOUS CHECKOUT
                </Button>

                <Divider my="xs" label="OR" labelPosition="center" />
                <MiniLoginTab next={nextStep} />
              </Stack>
              <LoginInsights />
            </Flex>
          </Stepper.Step>
          <Stepper.Step
            label="Delivery Address"
            description="Choose To delivery"
          >
            <Paper w={"95%"} my={40} mx={30}>
              <DeliveryAddressTab next={nextStep} />
            </Paper>
          </Stepper.Step>
          <Stepper.Step
            label="Order Summary"
            description="Review Purchase Summary"
          >
            <OrderSummary type="authenticated" />
          </Stepper.Step>
          {/* <Stepper.Step label="Payment Options" description="Choose Payment Method">
                          <Paper w={'95%'} my={40} mx={30}>
                              <PaymentView value={setPaymentType_} />
                          </Paper>
                          
                      </Stepper.Step> */}
        </Stepper>

        <Group justify="center" mt="xl">
          {active !== 0 &&
            active !== 4 &&
            (active !== 0 || !token) &&
            (active !== 1 || !token) && (
              <Button radius={0} variant="default" onClick={prevStep}>
                Back
              </Button>
            )}
          <Tooltip
            offset={{ mainAxis: 20, crossAxis: 0 }}
            hidden={Boolean(token) && Boolean(selectedAddress)}
            label={getTooltipStatement(active)}
          >
            <Button
              radius={0}
              color="var(--mantine-color-secondary-filled)"
              disabled={!token || !selectedAddress}
              onClick={() => {
                if (active === 2) {
                  placeOrder();
                } else if (active === 3) {
                  navigate("/");
                } else {
                  scrollTo({ y: 0 });
                  nextStep();
                }
              }}
            >
              {active === 2 ? `Pay ` : active === 3 ? "Go to Home" : "Continue"}
            </Button>
          </Tooltip>
        </Group>
      </Paper>
    </Flex>
  );
};

export default PlaceOrderView;
