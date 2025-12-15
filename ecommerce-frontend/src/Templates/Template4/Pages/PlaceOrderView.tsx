import { notifications } from "@mantine/notifications";
import { CustomerDTO } from "Interface/Client/Customer/customer.interface";
import {
  OrderPlacedDTO,
  PreProcessAnonymousOrderRequest,
  PreProcessOrderRequest,
  SalesOrderPlacedResponse,
} from "Interface/Client/Order/order.interface";
import { CheckPinCodeAvailabilityRequest } from "Interface/Client/Shipment/pincode.interface";
import { CreateManifestationDTO } from "Interface/Client/Shipment/shipment.interface";
import { CreateShipmentRequestDTO } from "Interface/Client/Shipment/shipping.interface";
import React, { useEffect, useRef, useState } from "react";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import {
  useLazyGetAllCartWithIdQuery,
  useRemoveAllFromCartMutation,
} from "Services/CartApiSlice";
import {
  useGetAllAddressQuery,
  useGetCustomerLoyaltyQuery,
  useLazyCustomerQuery,
} from "Services/CustomerApiSlice";
import {
  usePreProcessAnonymousOrderMutation,
  usePreProcessOrderMutation,
  useProcessAnonymousOrderMutation,
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
import { logout, setCredentials } from "State/AuthSlice/LoginSlice";
import {
  addToProductCart,
  calculateDiscount,
  calculateSubTotal,
  clearCart,
} from "State/CartSlice/CartSlice";
import { setSelectedPaymentType } from "State/CustomerSlice/CustomerSlice";
import { setLoggedIn } from "State/StateEvents";
import { AppDispatch, RootState } from "State/store";
import AddressForm from "Templates/Template4/Components/PlaceOrderView/AddressForm";
import EmptyCartRedirect from "Templates/Template4/Components/PlaceOrderView/EmptyCartRedirect";
import GuestAddressForm from "Templates/Template4/Components/PlaceOrderView/GuestAddressForm";
import OrderItemsList from "Templates/Template4/Components/PlaceOrderView/OrderItemsList";
import PaymentMethod from "Templates/Template4/Components/PlaceOrderView/PaymentMethod";
import PaymentProcessing from "Templates/Template4/Components/PlaceOrderView/PaymentProcessing";
import PhoneVerification from "Templates/Template4/Components/PlaceOrderView/PhoneVerification";
import PriceDetails from "Templates/Template4/Components/PlaceOrderView/PriceDetails";
import StepIndicator from "Templates/Template4/Components/PlaceOrderView/StepIndicator";
import { Cart } from "Types/Cart";
import { CustomerAddressAPI } from "Types/CustomerAddress";
import {
  RazorPaymentResponseDTO,
  RzpTransactionDTO,
} from "Types/Order/rzp.interface";
import {
  AnonymousProductOrder,
  Batch,
  DoDetRemarks,
  ItemInfo,
  ProductOrderDTO,
} from "Types/ProductOrder";

interface PlaceOrderViewProps {
  selectedCoupon: any;
  onPaymentSuccess: (orderId: string) => void;
}

const PLANT = process.env.REACT_APP_PLANT;
const GUEST_VERIFICATION_KEY = "guest_verified_phone";

const PlaceOrderView: React.FC<PlaceOrderViewProps> = ({
  selectedCoupon,
  onPaymentSuccess,
}) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [removeAllCart] = useRemoveAllFromCartMutation();
  const [orderJustCompleted, setOrderJustCompleted] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const cartList = useSelector((state: RootState) => state.cart.cartList);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState<string>("");
  const [processingPaymentId, setProcessingPaymentId] = useState<string>("");

  const suppressEmptyCartRef = useRef(false);

  const cartProductList = useSelector(
    (state: RootState) => state.cart.cartProductList
  );

  const [getCartItems, { isLoading: cartLoading }] =
    useLazyGetAllCartWithIdQuery();
  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");

  const fetchCartProducts = async (cartListIds: Array<string>) => {
    const response = await getCartItems({ cartItems: cartListIds }).unwrap();
    if (response) {
      dispatch(addToProductCart(response));
    }
  };

  useEffect(() => {
    if (cartList.length > 0) {
      fetchCartProducts(cartList.map((c: Cart) => c.productId));
    }
  }, [cartList]);

  const [order, setOrder] = useState<RazorPaymentResponseDTO | undefined>(
    undefined
  );

  const { cartSubTotal, cartDiscount } = useSelector(
    (state: RootState) => state.cart
  );
  const { userInfo, token } = useSelector((state: RootState) => state.login);
  const { selectedAddress, selectedPaymentType } = useSelector(
    (state: RootState) => state.customer
  );

  const rewardApplied = useSelector((s: RootState) => s.cart.rewardApplied);
  const rewardValue = useSelector((s: RootState) => s.cart.rewardValue);

  /** ⭐ Loyalty Points API */
const { data: loyaltyInfo } = useGetCustomerLoyaltyQuery(undefined, {
  skip: !token, // only for logged-in users
});

/** ⭐ Extract loyalty fields safely */
const currentPoints = loyaltyInfo?.results?.currentPoints ?? 0;
const redeemPrice = loyaltyInfo?.results?.redeemPrice ?? 0;
const redeemPoints = loyaltyInfo?.results?.redeemPoints ?? 1;

/** ⭐ Determine points redeemed in this order */
const pointsRedeemedThisOrder = rewardApplied ? currentPoints : 0;

/** ⭐ UI-only calculation (DO NOT SEND TO BACKEND) */
const loyaltyPriceValue =
  pointsRedeemedThisOrder > 0 && redeemPoints > 0
    ? (redeemPrice / redeemPoints) * pointsRedeemedThisOrder
    : 0;


  useEffect(() => {
    dispatch(calculateSubTotal());
    dispatch(calculateDiscount());
  }, [cartList, dispatch]);

  const isLoggedIn = !!token;
  const isGuestVerified =
    sessionStorage.getItem(GUEST_VERIFICATION_KEY) === "true";
  const isUserVerified = isLoggedIn || isGuestVerified;
  const hasItems = cartList.length > 0;

  const [currentStep, setCurrentStep] = useState(isUserVerified ? 1 : 0);
  const [isPhoneVerified, setIsPhoneVerified] = useState(isUserVerified);
  const [verifiedPhoneNo, setVerifiedPhoneNo] = useState<string>("");
  const [userAddress, setUserAddress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({
    phone: false,
    address: false,
    summary: false,
    payment: false,
  });

  const [orderStatus, setOrderStatus] = useState<
    "NOT_STARTED" | "PENDING" | "COMPLETED" | "FAILED"
  >("NOT_STARTED");

  const [customer, { isLoading: isCustomerLoading }] = useLazyCustomerQuery();

  const [processAuthOrder, { isLoading: processAuthOrderLoading }] =
    useProcessOrderMutation();
  const [processAnonymousOrder, { isLoading: processAnonymousOrderLoading }] =
    useProcessAnonymousOrderMutation();
  const [preProcessAnonymousOrder] = usePreProcessAnonymousOrderMutation();
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

  const [sameAsBilling, setSameAsBilling] = useState(false);

  const {
    error: razorpayError,
    isLoading: razorpayLoading,
    Razorpay,
  } = useRazorpay();

  const [isProcessing, setIsProcessing] = useState<boolean>(
    isLoading ||
      isPinCodeChecking ||
      isCustomerLoading ||
      isRzpPaymentCreating ||
      isRzpPaymentVerifying ||
      isShipmentCreating ||
      isPreProcessingOrder ||
      isSendingConfirmation ||
      processAuthOrderLoading ||
      processAnonymousOrderLoading
  );

  const { data: existingAddresses, isLoading: isAddressLoading } =
    useGetAllAddressQuery(null, {
      skip: !token,
    });

  const steps = [
    { id: 0, title: "Phone Verification", completed: completedSteps.phone },
    { id: 1, title: "Delivery Address", completed: completedSteps.address },
    { id: 2, title: "Order Summary", completed: completedSteps.summary },
    { id: 3, title: "Payment", completed: completedSteps.payment },
  ];

  useEffect(() => {
    if (currentStep === 1)
      setCompletedSteps((prev) => ({ ...prev, phone: true }));
    if (currentStep === 2)
      setCompletedSteps((prev) => ({ ...prev, address: true }));
    if (currentStep === 3)
      setCompletedSteps((prev) => ({ ...prev, summary: true }));
  }, [currentStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const handlePhoneVerified = (phoneNo: string) => {
    if (!isLoggedIn) {
      sessionStorage.setItem(GUEST_VERIFICATION_KEY, "true");
    }

    setIsPhoneVerified(true);
    setVerifiedPhoneNo(phoneNo);
    setCurrentStep(1);
  };

  const handleAddressSubmit = (
    address: CustomerAddressAPI,
    sameAsBilling: boolean = false
  ) => {
    setUserAddress(address);
    setSameAsBilling(sameAsBilling);
    setCurrentStep(2);
  };

  const handlePaymentSelect = (
    method: "PREPAID" | "CASH_ON_DELIVERY" | null
  ) => {
    dispatch(setSelectedPaymentType(method));
    setCurrentStep(3);
  };

  //#region Logged In Place Order
  const placeOrder = async () => {
    if (isPlacingOrder) return;

    console.log("=== PLACE ORDER DEBUG ===");
    console.log("selectedAddress:", selectedAddress);
    console.log("selectedAddress.id:", selectedAddress?.id);
    console.log("sameAsBilling:", sameAsBilling);
    console.log("token:", !!token);
    console.log("cartList.length:", cartList.length);
    console.log("selectedPaymentType:", selectedPaymentType);
    console.log("========================");

    setIsPlacingOrder(true);
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

    if (!selectedAddress?.id && !sameAsBilling) {
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
        isShippingSameAsBilling: sameAsBilling,
      };

      const preProcessOrderResponse = await preProcessOrder(
        preProcessOrderRequest
      ).unwrap();

      if (selectedPaymentType === "PREPAID") {
        const razorPaymentResponseDTO: RazorPaymentResponseDTO =
          await createRzpPayment(preProcessOrderResponse).unwrap();

        console.log("=== BEFORE CREATING PRODUCT ORDER ===");
        console.log("sameAsBilling:", sameAsBilling);
        console.log("selectedAddress:", selectedAddress);

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
          isShippingSameAsBilling: sameAsBilling,
          loyaltyRedeemedDTO: {
          redeemedStatus: rewardApplied,
          pointsRedeemed: pointsRedeemedThisOrder,
          totalPoints: currentPoints,
        },

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
            setIsPaymentProcessing(true);
            setProcessingOrderId(preProcessOrderResponse.orderId);
            setProcessingPaymentId(response.razorpay_payment_id);

            try {
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
                    await processAuthOrder(productOrder).unwrap();

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

                    suppressEmptyCartRef.current = true;
                    dispatch(clearCart());
                    await removeAllCart();
                    setOrderStatus("COMPLETED");
                    setOrderJustCompleted(true);

                    setTimeout(() => {
                      suppressEmptyCartRef.current = false;
                    }, 5000);

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
            } catch (error: any) {
              console.error("Payment processing error:", error);
              notifications.show({
                title: "Payment Processing Failed",
                message: "There was an issue processing your payment",
                color: "red",
              });
              setCurrentStep(3);
            } finally {
              setIsPaymentProcessing(false);
              setIsLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              if (!isPaymentProcessing) {
                notifications.show({
                  title: "Payment Cancelled",
                  message: "You cancelled the payment process",
                  color: "yellow",
                });
              }
            },
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
        });

        setOrder(razorPaymentResponseDTO);
      } else if (selectedPaymentType === "CASH_ON_DELIVERY") {
        console.log("=== CREATING COD ORDER ===");
        console.log("sameAsBilling:", sameAsBilling);

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
          isShippingSameAsBilling: sameAsBilling,
        };

        const processOrderResponse: SalesOrderPlacedResponse =
          await processAuthOrder(productOrder).unwrap();

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

          suppressEmptyCartRef.current = true;
          dispatch(clearCart());
          await removeAllCart();
          setOrderStatus("COMPLETED");
          setOrderJustCompleted(true);

          setTimeout(() => {
            suppressEmptyCartRef.current = false;
          }, 5000);

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
      setIsPlacingOrder(false);
      setIsLoading(false);
      dispatch(setSelectedPaymentType(null));
    }
  };
  //#endregion

  const anonymousPlaceOrder = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    setOrderStatus("PENDING");

    if (!selectedAddress) {
      notifications.show({
        title: "Invalid Form Data",
        message: "Please complete all required fields for the address details",
        color: "red",
      });
      return;
    }
    if (!selectedAddress.email) {
      notifications.show({
        title: "Invalid Form Data",
        message: "Please complete all required fields for the address details",
        color: "red",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (!cartList || cartList.length === 0) {
        notifications.show({
          title: "Empty Cart",
          message: "Please add books to your cart before placing an order",
          color: "red",
        });
        setOrderStatus("FAILED");
        return;
      }

      if (ecomConfig?.isShippingApiEnabled) {
        const pinCodeAvailability: CheckPinCodeAvailabilityRequest = {
          pinCode: selectedAddress.pinCode ?? "",
          productType: "",
        };

        const checkPinCodeAvailabilityRes = await checkPinCodeAvailability(
          pinCodeAvailability
        ).unwrap();

        if (checkPinCodeAvailabilityRes.delivery_codes.length === 0) {
          notifications.show({
            title: "Error",
            message: "There is no shipment available for this location",
            color: "red",
          });
          setOrderStatus("FAILED");
          return;
        }
      }

      if (cartList.length > 0) {
        let totalPrice = 0.0;
        let totalQuantity = 0;
        const itemInfo: Array<ItemInfo> = cartList.map((item, i) => ({
          item: item.productId,
          doLineNo: i + 1,
          ecomUnitPrice: item.ecomUnitPrice,
          quantityOr: item.quantity,
          promotions: [],
        }));

        for (let i = 0; i < cartList.length; i++) {
          totalPrice =
            totalPrice + cartList[i].ecomUnitPrice * cartList[i].quantity;
          totalQuantity = totalQuantity + cartList[i].quantity;
        }

        const doDetRemarks: Array<DoDetRemarks> = cartList.map((item, i) => ({
          item: item.productId,
          doLineNo: i + 1,
          remarks: "",
        }));

        const preProcessAnonymousOrderRequest: PreProcessAnonymousOrderRequest =
          {
            customerName: selectedAddress.customerName,
            mobileNumber: selectedAddress.mobileNumber,
            email: selectedAddress.email,
            addr1: selectedAddress.addr1,
            addr2: selectedAddress.addr2,
            addr3: selectedAddress.addr3,
            addr4: selectedAddress.addr4,
            state: selectedAddress.state,
            pinCode: selectedAddress.pinCode,
            country: selectedAddress.country,
            itemList: itemInfo,
            isShippingSameAsBilling: false,
          };

        const preProcessAnonymousOrderResponse: OrderPlacedDTO =
          await preProcessAnonymousOrder(
            preProcessAnonymousOrderRequest
          ).unwrap();

        const batch: Array<Batch> = [
          {
            doLineNo: 1,
            batch: "NOBATCH",
            location: "NONSTOCK",
          },
        ];

        if (selectedPaymentType === "PREPAID") {
          const razorPaymentResponseDTO: RazorPaymentResponseDTO =
            await createRzpPayment(preProcessAnonymousOrderResponse).unwrap();

          const anonymousOrder: AnonymousProductOrder = {
            ...selectedAddress,
            orderId: preProcessAnonymousOrderResponse.orderId,
            orderDate: preProcessAnonymousOrderResponse.orderDate,
            waybillNos: preProcessAnonymousOrderResponse.waybillNos,
            rzpOrderId: razorPaymentResponseDTO.orderId,
            rzpStatus: razorPaymentResponseDTO.status,
            itemList: itemInfo,
            remarks: doDetRemarks,
            batch: batch,
            paymentType: "PREPAID",
            isShippingSameAsBilling: false,
            loyaltyRedeemedDTO: {
            redeemedStatus: rewardApplied,
            pointsRedeemed: pointsRedeemedThisOrder,
            totalPoints: currentPoints,
},

          };

          if (!Razorpay) {
            notifications.show({
              title: "Payment System Error",
              message:
                "Payment system is not available. Please try again later.",
              color: "red",
            });
            setOrderStatus("FAILED");
            return;
          }

          var razorPayOptions: RazorpayOrderOptions = {
            key: razorPaymentResponseDTO.key,
            amount: razorPaymentResponseDTO.amount,
            currency: "INR",
            name: "Caaviar Mode",
            description: "Test Transaction",
            image: "https://picsum.photos/300",
            order_id: razorPaymentResponseDTO.orderId,
            handler: async (response: any) => {
              try {
                setIsLoading(true);
                if (response != null && response.razorpay_payment_id != null) {
                  const rzpTransactionDTO: RzpTransactionDTO = {
                    doNo: preProcessAnonymousOrderResponse.orderId,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                  };
                  const result = await verifyRzpPayment(rzpTransactionDTO)
                    .unwrap()
                    .catch((error: any) => {
                      console.error("Verification error:", error);
                      notifications.show({
                        title: "Payment Verification Failed",
                        message:
                          error?.data?.message || "Payment verification failed",
                        color: "red",
                      });
                      setOrderStatus("FAILED");
                      throw error;
                    });
                  if (result) {
                    anonymousOrder["paymentId"] = response.razorpay_payment_id;
                    const processOrderResponse: SalesOrderPlacedResponse =
                      await processAnonymousOrder(anonymousOrder).unwrap();
                    if (
                      processOrderResponse.status.toUpperCase() === "SUCCESS"
                    ) {
                      //#region Opt Shipping API
                      if (ecomConfig?.isShippingApiEnabled) {
                        const createShipmentRequest: CreateShipmentRequestDTO =
                          {
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
                        await createShipment(createShipmentRequest).unwrap();
                      }

                      if (selectedAddress.email) {
                        await sendOrderConfirmation({
                          email: selectedAddress.email,
                          doNo: razorPaymentResponseDTO.doNo,
                        }).unwrap();
                      }

                      suppressEmptyCartRef.current = true;
                      dispatch(clearCart());
                      await removeAllCart();
                      setOrderStatus("COMPLETED");

                      setTimeout(() => {
                        suppressEmptyCartRef.current = false;
                      }, 5000);

                      notifications.show({
                        title: "Order Successful",
                        message: "The payment and order is successful",
                        color: "green",
                      });
                      navigate(`/order-placed/${processOrderResponse.orderId}`);
                    }
                  } else {
                    notifications.show({
                      title: "Payment Failed",
                      message: "Payment verification failed",
                      color: "red",
                    });
                    setOrderStatus("FAILED");
                  }
                } else {
                  notifications.show({
                    title: "Payment Failed",
                    message: "Payment was not completed",
                    color: "red",
                  });
                  setOrderStatus("FAILED");
                }
              } catch (error: any) {
                console.error("Place order error:", error);
                notifications.show({
                  title: "Order Error",
                  message: error?.data?.message || "Failed to process order",
                  color: "red",
                });
                setOrderStatus("FAILED");
              } finally {
                setIsLoading(false);
              }
            },
            prefill: {
              name: anonymousOrder.customerName,
              email: anonymousOrder.email,
              contact: anonymousOrder.mobileNumber,
            },
            notes: "Caaviar Mode Razorpay Payment",
            theme: {
              color: "#3399cc",
            },
          };

          try {
            const rzp1 = new Razorpay(razorPayOptions);
            rzp1.open();
            rzp1.on("payment.failed", function (response) {
              notifications.show({
                title: `Payment Failed - Status Code ${response.error.code}`,
                message: `${response.error.reason} - ${response.error.metadata.payment_id}`,
                color: "red",
              });
              setOrderStatus("FAILED");
              setIsPlacingOrder(false);
              setIsPaymentProcessing(false);
              setIsProcessing(false);
            });
          } catch (error: any) {
            notifications.show({
              title: "Payment System Error",
              message:
                "Payment system is not available. Please try again later.",
              color: "red",
            });
            setOrderStatus("FAILED");
          }
        } else if (selectedPaymentType === "CASH_ON_DELIVERY") {
          const anonymousOrder: AnonymousProductOrder = {
            ...selectedAddress,
            orderId: preProcessAnonymousOrderResponse.orderId,
            orderDate: preProcessAnonymousOrderResponse.orderDate,
            waybillNos: preProcessAnonymousOrderResponse.waybillNos,
            rzpOrderId: "",
            rzpStatus: "",
            itemList: itemInfo,
            remarks: doDetRemarks,
            batch: batch,
            paymentType: "CASH_ON_DELIVERY",
            isShippingSameAsBilling: false,
          };

          const processOrderResponse: SalesOrderPlacedResponse =
            await processAnonymousOrder(anonymousOrder).unwrap();
          if (processOrderResponse.status.toUpperCase() === "SUCCESS") {
            if (ecomConfig?.isShippingApiEnabled) {
              const createShipmentRequest: CreateShipmentRequestDTO = {
                whTrackCustomer: {
                  name: selectedAddress.customerName,
                  phoneNumber: selectedAddress.mobileNumber,
                },
                doNo: preProcessAnonymousOrderResponse.orderId,
                shippingAddress:
                  preProcessAnonymousOrderResponse.shippingAddressDTO,
                waybillNos: preProcessAnonymousOrderResponse.waybillNos,
                orderDate: preProcessAnonymousOrderResponse.orderDate,
                itemList: itemInfo,
                paymentType: "PREPAID",
                totalAmount: totalPrice,
                quantity: totalQuantity.toString(),
              };
              await createShipment(createShipmentRequest).unwrap();
            }

            if (selectedAddress.email) {
              await sendOrderConfirmation({
                email: selectedAddress.email,
                doNo: preProcessAnonymousOrderResponse.orderId,
              }).unwrap();
            }

            suppressEmptyCartRef.current = true;
            dispatch(clearCart());
            await removeAllCart();
            setOrderStatus("COMPLETED");
            setOrderJustCompleted(true);
            sessionStorage.setItem(GUEST_VERIFICATION_KEY, "false");
            dispatch(setCredentials({ userToken: null }));
            dispatch(setLoggedIn(false));

            setTimeout(() => {
              suppressEmptyCartRef.current = false;
            }, 5000);

            notifications.show({
              title: "Order Successful",
              message: "The payment and order is successful",
              color: "green",
            });
            navigate(`/order-placed/${processOrderResponse.orderId}`);
          } else {
            notifications.show({
              title: "Order Failed",
              message: "Select a valid payment type",
              color: "red",
            });
            setOrderStatus("FAILED");
          }
        } else {
          notifications.show({
            title: "Error",
            message: "No books in cart or invalid order data",
            color: "red",
          });
          setOrderStatus("FAILED");
        }
      }
    } catch (error: any) {
      console.error("Place order error:", error);
      notifications.show({
        title: "Order Error",
        message: error?.data?.message || "Failed to process order",
        color: "red",
      });
      setOrderStatus("FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      orderJustCompleted ||
      isProcessing ||
      orderStatus === "COMPLETED" ||
      suppressEmptyCartRef.current
    ) {
      return;
    }

    if (!hasItems) {
      notifications.show({
        title: "Empty Cart",
        message: "Your cart is empty. Please add books before checkout.",
        color: "red",
        withCloseButton: true,
        autoClose: 5000,
        onClose: () => navigate("/"),
      });

      const timer = setTimeout(() => {
        navigate("/");
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [hasItems, navigate, orderJustCompleted, isProcessing, orderStatus]);

  useEffect(() => {
    return () => {
      setOrderJustCompleted(false);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isPaymentProcessing) {
        event.preventDefault();
        event.returnValue =
          "Your payment is being processed. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isPaymentProcessing]);

  if (!hasItems) return <EmptyCartRedirect />;

  const couponDiscount = selectedCoupon ? selectedCoupon.discount : 0;

  const renderCurrentStep = () => {
    if (isPaymentProcessing) {
      return (
        <PaymentProcessing
          orderId={processingOrderId}
          paymentId={processingPaymentId}
        />
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <PhoneVerification
            onVerified={handlePhoneVerified}
            isVerified={isPhoneVerified || isUserVerified}
            isLoggedIn={isLoggedIn}
            isGuestVerified={isGuestVerified}
          />
        );
      case 1:
        return isLoggedIn ? (
          <AddressForm
            onSubmit={(address, sameAsBilling) =>
              handleAddressSubmit(address, sameAsBilling)
            }
            savedAddress={userAddress}
            existingAddresses={existingAddresses || []}
            isAddressLoading={isAddressLoading}
          />
        ) : (
          <GuestAddressForm
            onSubmit={handleAddressSubmit}
            savedAddress={userAddress}
            phoneNo={verifiedPhoneNo}
          />
        );
      case 2:
        return (
          <OrderItemsList
            cartList={cartList}
            cartProductList={cartProductList}
            onContinue={() => handlePaymentSelect(null)}
          />
        );
      case 3:
        return (
          <PaymentMethod
            selectedMethod={selectedPaymentType}
            onSelectMethod={handlePaymentSelect}
            onPayment={isLoggedIn ? placeOrder : anonymousPlaceOrder}
            isLoading={isPlacingOrder || isProcessing}
            rewardApplied={rewardApplied}
            rewardValue={rewardApplied ? rewardValue : 0}
          />
        );
      default:
        return (
          <PhoneVerification
            onVerified={handlePhoneVerified}
            isVerified={isPhoneVerified || isUserVerified}
            isLoggedIn={isLoggedIn}
            isGuestVerified={isGuestVerified}
          />
        );
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-vintageBg flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const bagDiscountValue = parseFloat((cartSubTotal * 0.05).toFixed(2));
  const rewardSavings = rewardApplied ? rewardValue : 0;
  const finalTotal = cartSubTotal - bagDiscountValue - rewardSavings;

  return (
    <div className="min-h-screen bg-vintageBg py-4">
      <div className="lg:hidden bg-vintageBg border-b border-vintageBorder p-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-vintageBg transition-colors"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-vintageText">Checkout</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 xl:px-24 pt-4 lg:pt-6">
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-vintageBg rounded-lg shadow-sm border-2 border-vintageBorder">
              <div className="p-4 lg:p-6">{renderCurrentStep()}</div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 lg:top-6 space-y-4">
              <PriceDetails
                subtotal={cartSubTotal}
                bagDiscount={bagDiscountValue}
                rewardApplied={rewardApplied}
                rewardValue={rewardApplied ? rewardValue : 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderView;
