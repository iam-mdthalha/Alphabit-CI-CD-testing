import { Flex, Paper, Stack, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { countries } from "Constants/Country";
import { states } from "Constants/State";
import {
  PreProcessAnonymousOrderRequest,
  SalesOrderPlacedResponse,
} from "Interface/Client/Order/order.interface";
import { CheckPinCodeAvailabilityRequest } from "Interface/Client/Shipment/pincode.interface";
import { CreateManifestationDTO } from "Interface/Client/Shipment/shipment.interface";
import { CreateShipmentRequestDTO } from "Interface/Client/Shipment/shipping.interface";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { useRemoveAllFromCartMutation } from "Services/CartApiSlice";
import {
  usePreProcessAnonymousOrderMutation,
  useProcessAnonymousOrderMutation,
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
import { clearCart } from "State/CartSlice/CartSlice";
import { setSelectedPaymentType } from "State/CustomerSlice/CustomerSlice";
import { AppDispatch, RootState } from "State/store";
import OrderSummary from "Templates/Template2/Components/AnonymousPlaceOrderView/OrderSummary";
import {
  RazorPaymentResponseDTO,
  RzpTransactionDTO,
} from "Types/Order/rzp.interface";
import {
  AnonymousProductOrder,
  Batch,
  DoDetRemarks,
  ItemInfo,
} from "Types/ProductOrder";
import { useEffect, useRef, useState } from "react";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { paymentMethods } from "../Components/PlaceOrderView/OrderSummaryStep";

type AnonymousOrderProp = {
  customerName: string;
  mobileNumber: string;
  email: string;
  addr1: string;
  addr2: string;
  addr3: string;
  addr4?: string;
  state: string;
  pinCode: string;
  country: string;
};

const PLANT = process.env.REACT_APP_PLANT;

const CustomSelect: React.FC<{
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}> = ({
  id,
  label,
  value,
  options,
  onChange,
  required = false,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    } else {
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={selectRef}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && "*"}
      </label>
      <div
        id={id}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
          if (e.key === "Escape") {
            setIsOpen(false);
            setSearchTerm("");
          }
        }}
      >
        {value || (
          <span className="text-gray-400">
            {placeholder || `Select ${label.toLowerCase()}`}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsOpen(false);
                  setSearchTerm("");
                }
              }}
            />
          </div>

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  value === option ? "bg-blue-100" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

const CustomInput: React.FC<{
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  showCharCount?: boolean;
}> = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  maxLength,
  error,
  showCharCount = false,
}) => {
  return (
    <div className="relative">
      <div className="flex justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && "*"}
        </label>
        {showCharCount && maxLength && (
          <div className="text-right text-xs text-gray-400 mb-1">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const AnonymousPlaceOrderView = () => {
  const dispatch: AppDispatch = useDispatch();
  const { cartList } = useSelector((state: RootState) => state.cart);
  const [processOrder, { isLoading: processOrderLoading }] =
    useProcessAnonymousOrderMutation();
  const navigate = useNavigate();
  const [verifyRzpPayment] = useVerifyRzpPaymentMutation();
  const {
    error: razorpayError,
    isLoading: razorpayLoading,
    Razorpay,
  } = useRazorpay();
  const paymentMethod = useSelector(
    (state: RootState) => state.customer.selectedPaymentType
  );
  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");

  useEffect(() => {
    if (razorpayError) {
      console.error("Razorpay error:", razorpayError);
      notifications.show({
        title: "Payment System Error",
        message: "Payment system is not available. Please try again later.",
        color: "red",
      });
    }
  }, [razorpayError]);

  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [checkPinCodeAvailability] = useLazyCheckPinCodeAvailabilityQuery();
  const [preProcessAnonymousOrder] = usePreProcessAnonymousOrderMutation();
  const [createRzpPayment] = useCreateRzpPaymentMutation();
  const [createShipment] = useCreateForwardShipmentMutation();
  const [removeAllCart] = useRemoveAllFromCartMutation();

  const [sendOrderConfirmation] = useSendOrderConfirmationMutation();

  const [orderStatus, setOrderStatus] = useState<
    "NOT_STARTED" | "PENDING" | "COMPLETED" | "FAILED"
  >("NOT_STARTED");

  const [formData, setFormData] = useState({
    customerName: "",
    mobileNumber: "",
    email: "",
    addr1: "",
    addr2: "",
    addr3: "",
    addr4: "",
    state: "",
    pinCode: "",
    country: "",
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.customerName) {
      errors.customerName = "Name is required";
    } else if (formData.customerName.length > 50) {
      errors.customerName = "Name cannot exceed 50 characters";
    }

    if (!formData.mobileNumber) {
      errors.mobileNumber = "Mobile Number is required";
    } else if (formData.mobileNumber.length > 10) {
      errors.mobileNumber = "Mobile Number cannot exceed 10 characters";
    } else if (!/^\d{10,20}$/.test(formData.mobileNumber)) {
      errors.mobileNumber = "Invalid Mobile Number";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (formData.email.length > 30) {
      errors.email = "Email cannot exceed 30 characters";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      errors.email = "Invalid Email";
    }

    if (!formData.addr1) {
      errors.addr1 = "Address is required";
    } else if (formData.addr1.length > 50) {
      errors.addr1 = "Address cannot exceed 50 characters";
    }

    if (!formData.addr2) {
      errors.addr2 = "City/District/Town is required";
    } else if (formData.addr2.length > 50) {
      errors.addr2 = "City/District/Town cannot exceed 50 characters";
    }

    if (!formData.addr3) {
      errors.addr3 = "Locality is required";
    } else if (formData.addr3.length > 50) {
      errors.addr3 = "Locality cannot exceed 50 characters";
    }

    if (!formData.state) {
      errors.state = "State is required";
    } else if (formData.state.length > 50) {
      errors.state = "State cannot exceed 50 characters";
    }

    if (!formData.pinCode) {
      errors.pinCode = "Pincode is required";
    } else if (formData.pinCode.length > 8) {
      errors.pinCode = "Pincode cannot exceed 8 characters";
    }

    if (!formData.country) {
      errors.country = "Country is required";
    } else if (formData.country.length > 50) {
      errors.country = "Country cannot exceed 50 characters";
    }

    if (formData.addr4 && formData.addr4.length > 50) {
      errors.addr4 = "Landmarks cannot exceed 50 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

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

  const placeOrder = async () => {
    setOrderStatus("PENDING");
    if (!validateForm()) {
      notifications.show({
        title: "Invalid Form Data",
        message: "Please complete all required fields for the address details",
        color: "red",
      });
      setOrderStatus("FAILED");
      return;
    }

    setIsLoading(true);
    try {
      if (!cartList || cartList.length === 0) {
        notifications.show({
          title: "Empty Cart",
          message: "Please add items to your cart before placing an order",
          color: "red",
        });
        setOrderStatus("FAILED");
        return;
      }

      //#region Opt Shipping API
      if (ecomConfig?.isShippingApiEnabled) {
        const pinCodeAvailability: CheckPinCodeAvailabilityRequest = {
          pinCode: formData.pinCode ?? "",
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
      //#endregion

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
            customerName: formData.customerName,
            mobileNumber: formData.mobileNumber,
            email: formData.email,
            addr1: formData.addr1,
            addr2: formData.addr2,
            addr3: formData.addr3,
            addr4: formData.addr4,
            state: formData.state,
            pinCode: formData.pinCode,
            country: formData.country,
            itemList: itemInfo,
            isShippingSameAsBilling: false,
          };

        const preProcessAnonymousOrderResponse = await preProcessAnonymousOrder(
          preProcessAnonymousOrderRequest
        ).unwrap();

        const batch: Array<Batch> = [
          {
            doLineNo: 1,
            batch: "NOBATCH",
            location: "NONSTOCK",
          },
        ];

        if (paymentMethod === "PREPAID") {
          const razorPaymentResponseDTO: RazorPaymentResponseDTO =
            await createRzpPayment(preProcessAnonymousOrderResponse).unwrap();

          const anonymousOrder: AnonymousProductOrder = {
            ...formData,
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
            name: "Caaviar Mode", //your business name
            description: "Test Transaction",
            image: "https://picsum.photos/300",
            order_id: razorPaymentResponseDTO.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
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
                      await processOrder(anonymousOrder).unwrap();
                    if (
                      processOrderResponse.status.toUpperCase() === "SUCCESS"
                    ) {
                      //#region Opt Shipping API
                      if (ecomConfig?.isShippingApiEnabled) {
                        const createShipmentRequest: CreateShipmentRequestDTO =
                          {
                            whTrackCustomer: {
                              name: formData.customerName,
                              phoneNumber: formData.mobileNumber,
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

                      if (formData.email) {
                        const sendOrderEmailRes = await sendOrderConfirmation({
                          email: formData.email,
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
                console.error("Payment handler error:", error);
                notifications.show({
                  title: "Payment Error",
                  message:
                    error?.data?.message ||
                    "An error occurred during payment processing",
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
            notes: "Razorpay Payment",
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
              navigate("/");
            });
          } catch (error: any) {
            console.error("Razorpay instance creation error:", error);
            notifications.show({
              title: "Payment System Error",
              message:
                "Payment system is not available. Please try again later.",
              color: "red",
            });
            setOrderStatus("FAILED");
          }
        } else if (paymentMethod === "CASH_ON_DELIVERY") {
          const anonymousOrder: AnonymousProductOrder = {
            ...formData,
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
            await processOrder(anonymousOrder).unwrap();
          if (processOrderResponse.status.toUpperCase() === "SUCCESS") {
            //#region Opt Shipping API
            if (ecomConfig?.isShippingApiEnabled) {
              const createShipmentRequest: CreateShipmentRequestDTO = {
                whTrackCustomer: {
                  name: formData.customerName,
                  phoneNumber: formData.mobileNumber,
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
              const shipmentManifest: CreateManifestationDTO =
                await createShipment(createShipmentRequest).unwrap();
            }
            //#endregion

            if (formData.email) {
              const sendOrderEmailRes = await sendOrderConfirmation({
                email: formData.email,
                doNo: preProcessAnonymousOrderResponse.orderId,
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
            message: "No items in cart or invalid order data",
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

  const handlePaymentMethodChange = (value: "PREPAID" | "CASH_ON_DELIVERY") => {
    dispatch(setSelectedPaymentType(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder();
  };

  return (
    <Flex justify={"center"} pos={"relative"}>
      {/* Full Page Loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex justify-center items-center">
          <div className="flex justify-center items-center h-[30vh] md:h-screen">
            <svg
              className="animate-spin h-8 w-8 text-gray-300"
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
                strokeWidth="1.5"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M12 2a10 10 0 00-10 10h4a6 6 0 0112 0h4a10 10 0 00-10-10z"
              />
            </svg>
          </div>
        </div>
      )}

      <Flex
        w={{ base: "100%", md: "70%" }}
        direction={{ base: "column", md: "row" }}
      >
        <Paper
          w={{ base: "100%", md: "55%" }}
          component="div"
          bg={"var(--mantine-color-white)"}
          my={20}
          px={20}
          py={30}
        >
          <Title
            ta={"center"}
            c="var(--mantine-color-dimmed)"
            order={4}
            my={20}
          >
            Anonymous Checkout
          </Title>
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack w="100%">
              <Flex direction="row" gap={20}>
                <div className="w-1/2">
                  <CustomInput
                    id="customerName"
                    label="Customer Name"
                    value={formData.customerName}
                    onChange={(value) =>
                      handleInputChange("customerName", value)
                    }
                    required
                    placeholder="Enter customer name (max 50 chars)"
                    maxLength={50}
                    error={formErrors.customerName}
                    showCharCount={true}
                  />
                </div>
                <div className="w-1/2">
                  <CustomInput
                    id="mobileNumber"
                    label="Mobile Number"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(value) =>
                      handleInputChange("mobileNumber", value)
                    }
                    required
                    placeholder="Enter mobile number (max 10 chars)"
                    maxLength={10}
                    error={formErrors.mobileNumber}
                    showCharCount={true}
                  />
                </div>
              </Flex>
              <Flex direction="row" gap={20}>
                <div className="w-1/2">
                  <CustomInput
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(value) => handleInputChange("email", value)}
                    required
                    placeholder="Enter email (max 30 chars)"
                    maxLength={30}
                    error={formErrors.email}
                    showCharCount={true}
                  />
                </div>
                <div className="w-1/2">
                  <CustomInput
                    id="addr1"
                    label="Address Line 1"
                    value={formData.addr1}
                    onChange={(value) => handleInputChange("addr1", value)}
                    required
                    placeholder="Enter address line 1 (max 50 chars)"
                    maxLength={50}
                    error={formErrors.addr1}
                    showCharCount={true}
                  />
                </div>
              </Flex>
              <Flex direction="row" gap={20}>
                <div className="w-1/2">
                  <CustomInput
                    id="addr2"
                    label="Address Line 2"
                    value={formData.addr2}
                    onChange={(value) => handleInputChange("addr2", value)}
                    required
                    placeholder="Enter address line 2 (max 50 chars)"
                    maxLength={50}
                    error={formErrors.addr2}
                    showCharCount={true}
                  />
                </div>
                <div className="w-1/2">
                  <CustomInput
                    id="addr3"
                    label="City/District/Town"
                    value={formData.addr3}
                    onChange={(value) => handleInputChange("addr3", value)}
                    required
                    placeholder="Enter city/district/town (max 50 chars)"
                    maxLength={50}
                    error={formErrors.addr3}
                    showCharCount={true}
                  />
                </div>
              </Flex>
              <Flex direction="row" gap={20}>
                <div className="w-1/2">
                  <CustomSelect
                    id="state"
                    label="State"
                    value={formData.state}
                    options={states}
                    onChange={(value) => handleInputChange("state", value)}
                    required
                    placeholder="Select state"
                  />
                  {formErrors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.state}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <CustomInput
                    id="pinCode"
                    label="Pin Code"
                    value={formData.pinCode}
                    onChange={(value) => handleInputChange("pinCode", value)}
                    required
                    placeholder="Enter pin code (max 8 chars)"
                    maxLength={8}
                    error={formErrors.pinCode}
                    showCharCount={true}
                  />
                </div>
              </Flex>
              <Flex direction="row" gap={20} align="center">
                <div className="w-1/2">
                  <CustomSelect
                    id="country"
                    label="Country"
                    value={formData.country}
                    options={countries}
                    onChange={(value) => handleInputChange("country", value)}
                    required
                    placeholder="Select country"
                  />
                  {formErrors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.country}
                    </p>
                  )}
                </div>
                <div className="w-1/2">
                  <CustomInput
                    id="addr4"
                    label="Landmarks"
                    value={formData.addr4}
                    onChange={(value) => handleInputChange("addr4", value)}
                    placeholder="Enter landmarks (max 50 chars)"
                    maxLength={50}
                    error={formErrors.addr4}
                    showCharCount={true}
                  />
                </div>
              </Flex>
              <div className="bg-white shadow-md rounded-lg p-4 mt-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Choose Payment Method
                </h3>
                {paymentMethods.map((d) => {
                  return (
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-gray-800 transition">
                      <input
                        type="radio"
                        name="payment"
                        className="form-radio text-gray-900"
                        onChange={() => handlePaymentMethodChange(d.value)}
                      />
                      <span className="text-gray-700 font-semibold">
                        {d.label}
                      </span>
                      {d.subLabel && (
                        <span className="text-xs">{d.subLabel}</span>
                      )}
                    </label>
                  );
                })}
              </div>
              <button
                disabled={isLoading && paymentMethod === null}
                type="submit"
                className={`uppercase tracking-widest bg-black text-white border border-black text-xs font-semibold px-4 py-4 w-1/2 transition-all duration-300 ease-in-out hover:bg-transparent hover:text-black relative overflow-hidden group ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Pay
              </button>
            </Stack>
          </form>
        </Paper>
        <Paper
          w={{ base: "100%", md: "35%" }}
          component="div"
          bg={"var(--mantine-color-white)"}
          my={20}
          px={20}
          py={30}
        >
          <OrderSummary type="anonymous" />
        </Paper>
      </Flex>
    </Flex>
  );
};

export default AnonymousPlaceOrderView;
