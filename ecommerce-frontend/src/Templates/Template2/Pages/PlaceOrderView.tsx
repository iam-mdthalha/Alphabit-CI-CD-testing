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
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { CustomerDTO } from "Interface/Client/Customer/customer.interface";
import {
  PreProcessOrderRequest,
  SalesOrderPlacedResponse,
} from "Interface/Client/Order/order.interface";
import { CheckPinCodeAvailabilityRequest } from "Interface/Client/Shipment/pincode.interface";
import { CreateManifestationDTO } from "Interface/Client/Shipment/shipment.interface";
import { CreateShipmentRequestDTO } from "Interface/Client/Shipment/shipping.interface";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { useRemoveAllFromCartMutation } from "Services/CartApiSlice";
import { useLazyCustomerQuery } from "Services/CustomerApiSlice";
import {
  usePreProcessOrderMutation,
  useProcessOrderMutation,
  useSendOrderConfirmationMutation,
} from "Services/OrderProcessingApiSlice";
import {
  useCreateRzpPaymentMutation,
  useVerifyRzpPaymentMutation,
} from "Services/RazorPaymentApiSlice";
import {
  useCreateForwardShipmentMutation,
  useLazyCheckPinCodeAvailabilityQuery,
} from "Services/ShipmentApiSlice";
import { logout } from "State/AuthSlice/LoginSlice";
import { clearCart } from "State/CartSlice/CartSlice";
import { setSelectedPaymentType } from "State/CustomerSlice/CustomerSlice";
import { AppDispatch, RootState } from "State/store";
import DeliveryAddressStep from "Templates/Template2/Components/PlaceOrderView/DeliveryAddressStep";
import LoginStep from "Templates/Template2/Components/PlaceOrderView/LoginStep";
import MiniLogin from "Templates/Template2/Components/PlaceOrderView/MiniLogin";
import OrderSummaryStep from "Templates/Template2/Components/PlaceOrderView/OrderSummaryStep";
import {
  RazorPaymentResponseDTO,
  RzpTransactionDTO,
} from "Types/Order/rzp.interface";
import { ItemInfo, ProductOrderDTO } from "Types/ProductOrder";
import { useEffect, useState } from "react";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface StripeOrderResponse {
  status: string;
  paymentUrl: string;
}

const PLANT = process.env.REACT_APP_PLANT;

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
  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");

  const { height, width } = useViewportSize();
  const [removeAllCart] = useRemoveAllFromCartMutation();
  const paymentMethod = useSelector(
    (state: RootState) => state.customer.selectedPaymentType
  );
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState<
    "NOT_STARTED" | "PENDING" | "COMPLETED" | "FAILED"
  >("NOT_STARTED");

  const [order, setOrder] = useState<RazorPaymentResponseDTO | undefined>(
    undefined
  );
  const [isAnonymousOrder, setIsAnonymousOrder] = useState(false);
  const {
    error: razorpayError,
    isLoading: razorpayLoading,
    Razorpay,
  } = useRazorpay();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressTypeSelected, setIsAddressTypeSelected] = useState(() => {
    return selectedAddress ? true : false;
  });

  const [customer, { isLoading: isCustomerLoading }] = useLazyCustomerQuery();

  const [processOrder, { isLoading: processOrderLoading }] =
    useProcessOrderMutation();
  const [checkPinCodeAvailability, { isLoading: isPinCodeChecking }] =
    useLazyCheckPinCodeAvailabilityQuery();

  const [createRzpPayment, { isLoading: isRzpPaymentCreating }] =
    useCreateRzpPaymentMutation();
  const [verifyRzpPayment, { isLoading: isRzpPaymentVerifying }] =
    useVerifyRzpPaymentMutation();

  const [createShipment, { isLoading: isShipmentCreating }] =
    useCreateForwardShipmentMutation();

  const [preProcessOrder, { isLoading: isPreProcessingOrder }] =
    usePreProcessOrderMutation();

  const [sendOrderConfirmation, { isLoading: isSendingConfirmation }] =
    useSendOrderConfirmationMutation();

  const isProcessing =
    isLoading ||
    isPinCodeChecking ||
    isCustomerLoading ||
    isRzpPaymentCreating ||
    isRzpPaymentVerifying ||
    isShipmentCreating ||
    isPreProcessingOrder ||
    isSendingConfirmation ||
    processOrderLoading;

  useEffect(() => {
    if (cartList.length === 0 && orderStatus === "NOT_STARTED") {
      notifications.show({
        title: "Cart Empty",
        message: "Your cart is empty. Redirecting to products...",
        color: "yellow",
      });
      navigate("/top-sellers?page=1");
    }
  }, [cartList, navigate]);

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
        return isAddressTypeSelected
          ? "Please Choose Delivery Address"
          : "Please select address type (New or Existing)";
      }
      case 2: {
        return "Payment";
      }
      case 3: {
        return "Choose a Payment Method";
      }
    }
  };

  const placeOrder = async () => {
    setIsLoading(true);
    setOrderStatus("PENDING");
    let customerData: CustomerDTO | undefined;
    try {
      const response = await customer().unwrap();
      if (response.statusCode === 200) {
        customerData = response.results;
      }
    } catch (err: any) {
      console.error(err);
      notifications.show({
        title: "Error",
        message: "Customer Not Found",
        color: "red",
      });
      setOrderStatus("FAILED");
    }

    if (!customerData) {
      notifications.show({
        title: "Place Order Error",
        message: "There is no customer data found",
        color: "red",
      });
      setOrderStatus("FAILED");
      return;
    }

    if (isAnonymousOrder) {
      notifications.show({
        title: "Place Order Error",
        message:
          "Anonymous orders should be handled in the anonymous checkout page",
        color: "red",
      });
      setOrderStatus("FAILED");
      return;
    }

    //#region Opt Shipping API
    if (ecomConfig?.isShippingApiEnabled) {
      const pinCodeAvailability: CheckPinCodeAvailabilityRequest = {
        pinCode: selectedAddress?.pinCode ?? "",
        productType: "",
      };

      const checkPinCodeAvailabilityRes = await checkPinCodeAvailability(
        pinCodeAvailability
      ).unwrap();

      if (checkPinCodeAvailabilityRes.delivery_codes.length === 0) {
        notifications.show({
          title: "Place Order Error",
          message: "There is no shipment available for this location",
          color: "red",
        });
        setOrderStatus("FAILED");
        return;
      }
    }
    //#endregion

    if (!selectedAddress?.id) {
      notifications.show({
        title: "Error",
        message: "Please select a valid shipping address",
        color: "red",
      });
      setOrderStatus("FAILED");
      return;
    }

    if (
      !selectedAddress ||
      !token ||
      cartList.length === 0 ||
      !selectedPaymentType
    ) {
      console.error("Missing required order data:", {
        selectedAddress: !!selectedAddress,
        token: !!token,
        cartItems: cartList.length,
        paymentType: !!selectedPaymentType,
      });
      notifications.show({
        title: "Cannot Place Order",
        message: "Please complete all required steps",
        color: "red",
      });
      setOrderStatus("FAILED");
      return;
    }

    try {
      let totalPrice = 0.0;
      let totalQuantity = 0;
      const itemInfo: Array<ItemInfo> = cartList.map(
        (item: any, i: number) => ({
          item: item.productId,
          doLineNo: i + 1,
          ecomUnitPrice: item.ecomUnitPrice,
          quantityOr: item.quantity,
        })
      );

      for (let i = 0; i < cartList.length; i++) {
        totalPrice =
          totalPrice + cartList[i].ecomUnitPrice * cartList[i].quantity;
        totalQuantity = totalQuantity + cartList[i].quantity;
      }

      const doDetRemarks = cartList.map((item: any, i: number) => ({
        item: item.productId,
        doLineNo: i + 1,
        remarks: "",
      }));

      const preProcessOrderRequest: PreProcessOrderRequest = {
        shippingAddressId: selectedAddress.id,
        itemList: itemInfo,
        isShippingSameAsBilling: false,
      };

      const preProcessOrderResponse = await preProcessOrder(
        preProcessOrderRequest
      ).unwrap();

      if (selectedPaymentType === "PREPAID") {
        const razorPaymentResponseDTO: RazorPaymentResponseDTO =
          await createRzpPayment(preProcessOrderResponse).unwrap();

        const productOrder: ProductOrderDTO = {
          orderId: preProcessOrderResponse.orderId,
          orderDate: preProcessOrderResponse.orderDate,
          waybillNos: preProcessOrderResponse.waybillNos,
          rzpOrderId: razorPaymentResponseDTO.orderId,
          rzpStatus: razorPaymentResponseDTO.status,
          shippingAddressId: selectedAddress.id,
          itemList: itemInfo,
          remarks: doDetRemarks,
          batch: [{ doLineNo: 1, batch: "NOBATCH", location: "NONSTOCK" }],
          paymentType: selectedPaymentType,
          isShippingSameAsBilling: false,
        };

        var razorPayOptions: RazorpayOrderOptions = {
          key: razorPaymentResponseDTO.key,
          amount: razorPaymentResponseDTO.amount,
          currency: "INR",
          name: "Caaviar Mode",
          description: "Test Transaction",
          image: "https://picsum.photos/300",
          order_id: razorPaymentResponseDTO.orderId,
          handler: async (response: any) => {
            setIsLoading(true);
            if (response != null && response.razorpay_payment_id != null) {
              const rzpTransactionDTO: RzpTransactionDTO = {
                doNo: preProcessOrderResponse.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              };
              const result = await verifyRzpPayment(rzpTransactionDTO)
                .unwrap()
                .catch((error: any) => {
                  console.error("Verification error:", error);
                  setOrderStatus("FAILED");
                  throw error;
                });
              if (result) {
                productOrder["paymentId"] = response.razorpay_payment_id;
                const processOrderResponse: SalesOrderPlacedResponse =
                  await processOrder(productOrder).unwrap();

                if (processOrderResponse.status.toUpperCase() === "SUCCESS") {
                  //#region Opt Shipping API
                  if (ecomConfig?.isShippingApiEnabled) {
                    const createShipmentRequest: CreateShipmentRequestDTO = {
                      whTrackCustomer: {
                        name: selectedAddress.customerName,
                        phoneNumber: selectedAddress.mobileNumber,
                      },
                      doNo: razorPaymentResponseDTO.doNo,
                      shippingAddress:
                        razorPaymentResponseDTO.shippingAddressDTO,
                      waybillNos: razorPaymentResponseDTO.waybillNos,
                      orderDate: razorPaymentResponseDTO.orderDate,
                      itemList: itemInfo,
                      paymentType: "PREPAID",
                      totalAmount: totalPrice,
                      quantity: totalQuantity.toString(),
                    };

                    const shipmentManifest: CreateManifestationDTO =
                      await createShipment(createShipmentRequest).unwrap();
                  }
                  //#endregion
                  if (customerData?.email) {
                    const sendOrderEmailRes = await sendOrderConfirmation({
                      email: customerData?.email,
                      doNo: razorPaymentResponseDTO.doNo,
                    }).unwrap();
                  }

                  dispatch(clearCart());
                  await removeAllCart();
                  setOrderStatus("COMPLETED");

                  notifications.show({
                    title: "Order Successful",
                    message: "The payment and order is successful",
                    color: "green",
                  });
                  navigate(`/order-placed/${processOrderResponse.orderId}`);
                }
              } else {
                alert("Payment Failed");
                setOrderStatus("FAILED");
              }
            } else {
              alert("Payment Failed");
              setOrderStatus("FAILED");
            }
          },
          prefill: {
            name: customerData?.fullName,
            email: customerData?.email,
            contact: customerData?.mobileNo,
          },
          notes: "Caaviar Mode Razorpay Payment",
          theme: {
            color: "#3399cc",
          },
        };

        const rzp1 = new Razorpay(razorPayOptions);
        rzp1.open();
        rzp1.on("payment.failed", function (response) {
          notifications.show({
            title: `Payment Failed - Status Code ${response.error.code}`,
            message: `${response.error.reason} - ${response.error.metadata.payment_id}`,
            color: "red",
          });
          setOrderStatus("FAILED");
          navigate("/");
        });

        setOrder(razorPaymentResponseDTO);
      } else if (selectedPaymentType === "CASH_ON_DELIVERY") {
        const productOrder: ProductOrderDTO = {
          orderId: preProcessOrderResponse.orderId,
          orderDate: preProcessOrderResponse.orderDate,
          waybillNos: preProcessOrderResponse.waybillNos,
          rzpOrderId: "",
          rzpStatus: "",
          shippingAddressId: selectedAddress.id,
          itemList: itemInfo,
          remarks: doDetRemarks,
          batch: [{ doLineNo: 1, batch: "NOBATCH", location: "NONSTOCK" }],
          paymentType: selectedPaymentType,
          isShippingSameAsBilling: false,
        };

        const processOrderResponse: SalesOrderPlacedResponse =
          await processOrder(productOrder).unwrap();

        if (processOrderResponse.status.toUpperCase() === "SUCCESS") {
          //#region Opt Shipping API
          if (ecomConfig?.isShippingApiEnabled) {
            const createShipmentRequest: CreateShipmentRequestDTO = {
              whTrackCustomer: {
                name: selectedAddress.customerName,
                phoneNumber: selectedAddress.mobileNumber,
              },
              doNo: preProcessOrderResponse.orderId,
              shippingAddress: preProcessOrderResponse.shippingAddressDTO,
              waybillNos: preProcessOrderResponse.waybillNos,
              orderDate: preProcessOrderResponse.orderDate,
              itemList: itemInfo,
              paymentType: "CASH_ON_DELIVERY",
              totalAmount: totalPrice,
              quantity: "",
            };

            const shipmentManifest: CreateManifestationDTO =
              await createShipment(createShipmentRequest).unwrap();
          }
          //#endregion

          if (customerData.email) {
            const sendOrderEmailRes = await sendOrderConfirmation({
              email: customerData.email,
              doNo: preProcessOrderResponse.orderId,
            }).unwrap();
          }

          dispatch(clearCart());
          await removeAllCart();
          setOrderStatus("COMPLETED");

          notifications.show({
            title: "Order Successful",
            message: "The Cash On Delivery order has been placed successfully",
            color: "green",
          });
          navigate(`/order-placed/${processOrderResponse.orderId}`);
        }
      } else {
        notifications.show({
          title: "Order Failed",
          message: "Select a valid payment type",
          color: "red",
        });
        setOrderStatus("FAILED");
      }
    } catch (error: any) {
      console.error("Order failed:", error);
      notifications.show({
        title: "Order Failed",
        message: "There was an error processing your order",
        color: "red",
      });
      setOrderStatus("FAILED");

      if (error?.status === 401 || error?.originalStatus === 401) {
        dispatch(logout());
      }
    } finally {
      setIsLoading(false);
      dispatch(setSelectedPaymentType(null));
    }
  };

  if (isProcessing && active === 2) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-12 w-12 text-gray-800"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }
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
          color="var(--mantine-color-black)"
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
                <button
                  onClick={() => {
                    setIsAnonymousOrder(true);
                    navigate("/anonymous-checkout");
                  }}
                  className="uppercase tracking-widest bg-black text-white border border-black text-xs font-semibold px-8 py-4 transition-all duration-300 ease-in-out hover:bg-transparent hover:text-black relative overflow-hidden group"
                >
                  PROCEED TO ANONYMOUS CHECKOUT
                </button>

                <Divider my="xs" label="OR" labelPosition="center" />
                <MiniLogin next={nextStep} />
              </Stack>
              <LoginStep />
            </Flex>
          </Stepper.Step>
          <Stepper.Step
            label="Delivery Address"
            description="Choose To delivery"
          >
            <Paper w={"95%"} my={40} mx={30}>
              <DeliveryAddressStep
                next={nextStep}
                onAddressTypeSelected={setIsAddressTypeSelected}
              />
            </Paper>
          </Stepper.Step>
          <Stepper.Step
            label="Order Summary"
            description="Review Purchase Summary"
          >
            <OrderSummaryStep type="authenticated" />
          </Stepper.Step>
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

          {active !== 0 && (
            <Tooltip
              offset={{ mainAxis: 20, crossAxis: 0 }}
              hidden={Boolean(token) && Boolean(selectedAddress)}
              label={getTooltipStatement(active)}
            >
              <div className="relative">
                {isProcessing && (
                  <div className="absolute inset-0 flex justify-center items-center z-10">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                )}
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      if (active === 2) {
                        await placeOrder();
                      } else if (active === 3) {
                        navigate("/");
                      } else {
                        scrollTo({ y: 0 });
                        nextStep();
                      }
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className={`uppercase tracking-widest bg-black text-white border border-black text-xs font-semibold px-2 py-2 pl-5 pr-5 transition-all duration-300 ease-in-out hover:bg-transparent hover:text-black disabled:bg-gray-500 disabled:text-white relative overflow-hidden group ${
                    isProcessing ? "opacity-50" : ""
                  }`}
                  disabled={
                    isProcessing ||
                    (active === 1 && !isAddressTypeSelected) ||
                    (active === 2 && paymentMethod === null)
                  }
                >
                  {active === 2
                    ? `Pay `
                    : active === 3
                    ? "Go to Home"
                    : "Continue"}
                </button>
              </div>
            </Tooltip>
          )}
        </Group>
      </Paper>
    </Flex>
  );
};

export default PlaceOrderView;
