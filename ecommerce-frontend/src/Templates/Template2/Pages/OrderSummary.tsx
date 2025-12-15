import { Alert, Pagination, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { AppClientGetOrderSummaryRequest, AppClientGetOrderSummaryResponse } from "features/order-summary/interfaces/order-summary-api.interface";
import { CustomerDTO } from "Interface/Client/Customer/customer.interface";
import { OrderSummaryDTO } from "Interface/Client/Order/order-summary.interface";
import {
  CancelManifestationDTO,
  CreateManifestationDTO,
} from "Interface/Client/Shipment/shipment.interface";
import {
  CancelShipmentRequestDTO,
  CreateShipmentRequestDTO,
} from "Interface/Client/Shipment/shipping.interface";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { useLazyCustomerQuery } from "Services/CustomerApiSlice";
import { useLazyGetOrderSummaryQuery } from "Services/OrderSummaryApiSlice";
import {
  useGetListOfProductsQuery,
  useLazyGetProductImageQuery,
} from "Services/ProductApiSlice";
import {
  useRzpInstantRefundMutation,
  useRzpNormalRefundMutation,
} from "Services/RazorPaymentApiSlice";
import {
  useCreateReverseShipmentMutation,
  useLazyCancelShipmentQuery,
  useLazyRequestRefundIndividualProductQuery,
} from "Services/ShipmentApiSlice";
import { RootState } from "State/store";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import OrderItem from "Templates/Template2/Pages/OrderItem";
import { RzpRefundDTO } from "Types/Order/rzp.interface";
import { ItemInfo } from "Types/ProductOrder";
import InvoicePopover from "../Components/OrderSummary/InvoicePopover";

interface ProductData {
  imageUrl: string;
  itemDesc: string;
  sellingPrice: number;
}

interface Product {
  productId: string;
  imageUrl: string;
  description: string;
  name: string;
  price: number;
}

interface ProductMap {
  [key: string]: ProductData;
}

const PLANT = process.env.REACT_APP_PLANT;
const PAGE_SIZE_OPTIONS = [5, 10, 15];

const getErrorMessage = (error: any) => {
  if (typeof error === "string") return error;
  if ("status" in error && "data" in error) {
    const data = error.data as any;
    return data?.message || JSON.stringify(data);
  }
  if ("message" in error) return error.message;
  return "Unknown error";
};

const OrderSummary = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state: RootState) => state.stateevents);
  const { token } = useSelector((state: RootState) => state.login);
  const [pageSize, setPageSize] = useState<number>(5);
  const [activePage, setActivePage] = useState<number>(1);
  const [productDataMap, setProductDataMap] = useState<ProductMap>({});
  const [
    orderSummary,
    {
      isLoading: isOrderSummaryLoading,
      error: orderSummaryError,
      isFetching: orderSummaryFetching,
    },
  ] = useLazyGetOrderSummaryQuery();
  const [
    customer,
    {
      isLoading: isCustomerLoading,
      error: customerError,
      isFetching: customerFetching,
    },
  ] = useLazyCustomerQuery();
  const [orderSummaryData, setOrderSummaryData] = useState<OrderSummaryDTO[]>(
    []
  );
  const [customerData, setCustomerData] = useState<CustomerDTO>();
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
  const [refundOrder, setRefundOrder] = useState<OrderSummaryDTO>();
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [getProductImage] = useLazyGetProductImageQuery();
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [isRefundLoading, setIsRefundLoading] = useState<boolean>(false);
  const calledRef = useRef(false);

  const [requestRefundIndividual] =
    useLazyRequestRefundIndividualProductQuery();

  const [rzpNormalRefund] = useRzpNormalRefundMutation();
  const [rzpInstantRefund] = useRzpInstantRefundMutation();

  const [createShipment, { isLoading: isShipmentCreating }] =
    useCreateReverseShipmentMutation();

  const [cancelShipment, { isLoading: isShipmentCancelling }] =
    useLazyCancelShipmentQuery();

  const getOrderSummaryApi = async (customerNo: string) => {
    try {
      const orderSummaryDataReq: AppClientGetOrderSummaryRequest = {
        custCode: customerNo,
        plant: PLANT,
        search: "",
      };
      const response: AppClientGetOrderSummaryResponse = await orderSummary(
        orderSummaryDataReq
      ).unwrap();
      if (response.statusCode === 200) {
        setOrderSummaryData(response.results);
      }
    } catch (err: any) {
      console.error(err);
      notifications.show({
        title: "Error",
        message: err,
        color: "red",
      });
    }
  };

  const fetchImage = async (imagePath: string): Promise<string> => {
    if (!imagePath || imagePath === "placeholder") {
      return "placeholder";
    }

    try {
      const { data: imageUrl } = await getProductImage(imagePath);
      return imageUrl || "placeholder";
    } catch (e) {
      console.error("Error loading image:", imagePath, e);
      return "placeholder";
    }
  };

  useEffect(() => {
    if (refundOrder?.orderSummaryDet) {
      refundOrder.orderSummaryDet.forEach((det) => {
        fetchImage(det.imageUrl).then((url) => {
          setImageMap((prev) => ({ ...prev, [det.imageUrl]: url }));
        });
      });
    }
  }, [refundOrder]);

  const getCustomerApi = async () => {
    try {
      const response = await customer().unwrap();
      if (response.statusCode === 200) {
        setCustomerData(response.results);
        getOrderSummaryApi(response.results?.customerNo);
      }
    } catch (err: any) {
      notifications.show({
        title: err.data.results.message,
        message: "Please Login to access this page.",
        color: "red",
      });
    }
  };

  useEffect(() => {
    if (!calledRef.current) {
      calledRef.current = true;
      getCustomerApi();
    }
  }, []);

  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const numberOfDecimal =
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 2;

  const productIds = Array.from(
    new Set(
      orderSummaryData.flatMap(
        (order: OrderSummaryDTO) =>
          order.orderSummaryDet?.map((det) => det.item) || []
      )
    )
  ).filter(Boolean) as string[];

  const { data: productDetails } = useGetListOfProductsQuery(
    {
      category: "",
      pageSize: 100,
      activePage: 1,
      items: productIds,
    },
    { skip: productIds.length === 0 }
  );

  useEffect(() => {
    if (productDetails?.products) {
      const newProductDataMap: ProductMap = {};

      productDetails.products.forEach((productMeta) => {
        const product = productMeta.product;
        if (product?.item) {
          newProductDataMap[product.item] = {
            imageUrl:
              productMeta.imagePath || "https://via.placeholder.com/200",
            itemDesc: product.itemDesc || product.item,
            sellingPrice: product.ecomUnitPrice || product.sellingPrice || 0,
          };
        }
      });
      setProductDataMap(newProductDataMap);
    }
  }, [productDetails]);

  const totalItems = orderSummaryData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedData = orderSummaryData.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  useEffect(() => {
    setActivePage(1);
  }, [pageSize]);

  const handleProductClick = (itemId: string) => {
    navigate(`/${encodeURIComponent(itemId)}`);
  };

  if (!token || !isLoggedIn) {
    navigate("/");
  }

  if (isCustomerLoading || isOrderSummaryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircleLoader />
        {/* <p className="ml-4">Loading your orders...</p> */}
      </div>
    );
  }

  if (customerError || orderSummaryError) {
    const error = customerError || orderSummaryError;
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert color="red" title="Error" className="max-w-md">
          <div className="flex flex-col justify-center items-center">
            <p>Failed to load orders: {getErrorMessage(error)}</p>

            <button
              onClick={async () => {
                if (customerError) {
                  getCustomerApi();
                }
              }}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </Alert>
      </div>
    );
  }


  const generateInvoice = (doNo: string, invoiceType: string) => {
    navigate(`/invoice-preview/${doNo}?type=${invoiceType}`);
  };

  const handleOrderRequestRefund = async () => {
    if (refundOrder) {
      try {
        setIsRefundModalOpen(false);
        setIsRefundLoading(false);
        for (let det of refundOrder?.orderSummaryDet) {
          const initialRequestRefundResponse = await requestRefundIndividual({
            orderId: refundOrder.orderSummaryHdr.doNo,
            itemCode: det.item,
            waybillNo: det.waybillNo,
          }).unwrap();
          if (
            initialRequestRefundResponse.orderStatus.includes("Delivered") ||
            initialRequestRefundResponse.orderStatus.includes("Dispatched")
          ) {
            const itemInfo: ItemInfo = {
              item: det.item,
              doLineNo: 0,
              ecomUnitPrice: det.ecomUnitPrice,
              quantityOr: det.quantityOr,
            };
            let totalQuantity = det.quantityOr;
            const createShipmentRequest: CreateShipmentRequestDTO = {
              whTrackCustomer: null,
              doNo: initialRequestRefundResponse.doNo,
              shippingAddress: initialRequestRefundResponse.shippingAddress,
              waybillNos: initialRequestRefundResponse.waybillNos,
              orderDate: initialRequestRefundResponse.orderDate,
              itemList: [itemInfo],
              paymentType: null,
              totalAmount: initialRequestRefundResponse.totalPrice,
              quantity: totalQuantity.toString(),
            };
            const shipmentManifest: CreateManifestationDTO =
              await createShipment(createShipmentRequest).unwrap();
            if (shipmentManifest.success) {
              const rzpRefundDTO: RzpRefundDTO = {
                amount: det.ecomUnitPrice,
                notes: [],
                orderId: initialRequestRefundResponse.doNo,
                itemCode: det.item,
                paymentId: initialRequestRefundResponse.paymentId,
              };
              const rzpResponse = await rzpNormalRefund(rzpRefundDTO);
              if (rzpResponse.data?.results) {
                notifications.show({
                  title: "Success",
                  message: "Refund Request Submitted Successfully",
                  color: "green",
                });
              }
            }
          } else {
            const cancelShipmentRequest: CancelShipmentRequestDTO = {
              waybillNo: det.waybillNo,
            };
            const cancelShipmentManifest: CancelManifestationDTO =
              await cancelShipment(cancelShipmentRequest).unwrap();
            if (cancelShipmentManifest.status) {
              const rzpRefundDTO: RzpRefundDTO = {
                amount: det.ecomUnitPrice,
                notes: [],
                orderId: initialRequestRefundResponse.doNo,
                itemCode: det.item,
                paymentId: initialRequestRefundResponse.paymentId,
              };
              const rzpResponse = await rzpInstantRefund(rzpRefundDTO);
              if (rzpResponse.data?.results) {
                notifications.show({
                  title: "Success",
                  message: "Refund Request Submitted Successfully",
                  color: "green",
                });
              }
            }
          }
        }
        setIsRefundLoading(false);
      } catch (e: any) {
        setIsRefundLoading(false);
        console.error(e);
        notifications.show({
          title: "Error",
          message: e,
          color: "red",
        });
      }
    }
  };

  return (
    <div className="font-montserrat min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {isRefundModalOpen && (
        <div
          id="modalOverlay"
          className="fixed inset-0 bg-gray-900 opacity-50 z-40"
        ></div>
      )}
      {isRefundModalOpen && (
        <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
          <div className="relative p-4 w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm">
              <button
                type="button"
                onClick={() => setIsRefundModalOpen(false)}
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                data-modal-hide="popup-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500">
                  Are you sure you want to refund this complete order?
                </h3>
                <div className="flex flex-col m-4 gap-y-4">
                  {refundOrder?.orderSummaryDet.map((det) => {
                 
                    return (
                      <div
                        key={det.item}
                        className="flex items-start cursor-pointer border border-gray-200 p-4"
                      >
                        <div className="flex-shrink-0 h-fit w-fit cursor-pointer">
                          
                          <img
                            className="h-20 w-20 object-contain"
                            src={det.imageUrl}
                            alt="Product"
                          />
                        </div>

                        <div className="ml-4 text-start">
                          <div className="w-full flex justify-between">
                            <p
                              onClick={() => handleProductClick(det.item)}
                              className="font-medium text-lg text-gray-900"
                            >
                              {det.itemDescription}
                            </p>
                          </div>

                          <p className="text-sm  font-medium my-1">
                            Price: Rs{" "}
                            {det.ecomUnitPrice.toFixed(numberOfDecimal)}
                          </p>
                          <p className="text-sm">Quantity: {det.quantityOr}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={handleOrderRequestRefund}
                  type="button"
                  className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-none text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Yes, I'm sure
                </button>
                <button
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-none border border-gray-200 hover:bg-gray-100 hover:text-gray-800 focus:z-10 focus:ring-4 focus:ring-gray-100"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Your Orders
        </h1>

        {orderSummaryData.length > 0 ? (
          <>
            <div className="space-y-6">
              {paginatedData.map((order: OrderSummaryDTO) => (
                <div
                  key={order.orderSummaryHdr.doNo}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="bg-gray-100 border-b border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
                        <div>
                          <p className="text-xs text-gray-500">ORDER PLACED</p>
                          <p className="font-medium">
                            {order.orderSummaryHdr.orderDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">TOTAL</p>
                          <p className="font-medium">
                            Rs.{" "}
                            {order.orderSummaryHdr.totalAmount.toFixed(
                              numberOfDecimal
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">SHIP TO</p>
                          <p className="font-medium">
                            {order.orderSummaryHdr.customerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            ORDER # {order.orderSummaryHdr.doNo}
                          </p>
                          <div className="flex space-x-2 mt-1">
                            {/* <button className="text-blue-600 hover:text-blue-800 text-sm">View order details</button> */}
                            {/* when click invoice, let user open it and download it */}
                            <InvoicePopover
                              generateInvoice={() =>
                                generateInvoice(
                                  order.orderSummaryHdr.doNo,
                                  "basic"
                                )
                              }
                              generateProformaInvoice={() =>
                                generateInvoice(
                                  order.orderSummaryHdr.doNo,
                                  "proforma"
                                )
                              }
                              isProformaInvoiceAvailable={
                                order.hasProformaInvoice
                              }
                              isInvoiceAvailable={order.hasInvoice}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="sm:text-right">
                            <button
                              onClick={() => {
                                setIsRefundModalOpen(true);
                                setRefundOrder(order);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-xs flex gap-1 items-center justify-end"
                            >
                              <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                              </svg>
                              <span>Request Order Refund</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.orderSummaryDet.map((det, index) => (
                    <OrderItem
                      key={index}
                      det={det}
                      orderId={order.orderSummaryHdr.doNo}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <span className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(activePage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(activePage * pageSize, totalItems)}
                  </span>{" "}
                  of <span className="font-medium">{totalItems}</span> orders
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Select
                  data={PAGE_SIZE_OPTIONS.map((size) => ({
                    value: size.toString(),
                    label: `${size} per page`,
                  }))}
                  value={pageSize.toString()}
                  onChange={(value) => setPageSize(Number(value))}
                  className="w-32"
                  size="sm"
                />
                <Pagination
                  value={activePage}
                  onChange={setActivePage}
                  total={totalPages}
                  radius="sm"
                  size="sm"
                />
              </div>
            </div>
          </>
        ) : orderSummaryFetching || customerFetching ? (
          <CircleLoader />
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-xl">You haven't placed any orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
