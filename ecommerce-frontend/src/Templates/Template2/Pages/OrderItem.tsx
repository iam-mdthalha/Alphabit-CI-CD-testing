import { notifications } from "@mantine/notifications";
import { OrderSummaryDetDTO } from "Interface/Client/Order/order-summary.interface";
import {
  CancelManifestationDTO,
  CreateManifestationDTO,
} from "Interface/Client/Shipment/shipment.interface";
import {
  CancelShipmentRequestDTO,
  CreateShipmentRequestDTO,
} from "Interface/Client/Shipment/shipping.interface";
import { TrackShipmentRequest } from "Interface/Client/Shipment/track-order.interface";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import {
  useRzpInstantRefundMutation,
  useRzpNormalRefundMutation,
} from "Services/RazorPaymentApiSlice";
import {
  useCreateReverseShipmentMutation,
  useLazyCancelShipmentQuery,
  useLazyRequestRefundIndividualProductQuery,
  useLazyTrackOrderQuery,
} from "Services/ShipmentApiSlice";
import { RzpRefundDTO } from "Types/Order/rzp.interface";
import { ItemInfo } from "Types/ProductOrder";

interface OrderItemProps {
  orderId: string;
  det: OrderSummaryDetDTO;
}

const PLANT = process.env.REACT_APP_PLANT;

const OrderItem = ({ orderId, det }: OrderItemProps) => {
  const navigate = useNavigate();
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
  const [isRefundLoading, setIsRefundLoading] = useState<boolean>(false);
  // const { data: individualProductResponse } = useGetProductByIdQuery(
  //   { productId: det.item },
  //   { skip: !det.item }
  // );

  // const { data: listOfProductsResponse, isLoading: isListLoading } =
  //   useGetListOfProductsQuery(
  //     {
  //       category: "",
  //       pageSize: 10,
  //       activePage: 1,
  //       items: [det.item],
  //     },
  //     { skip: !!individualProductResponse }
  //   );

  // const isLoading = !individualProductResponse && isListLoading;

  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const numberOfDecimal =
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 0;

  const [trackOrderRequest] = useLazyTrackOrderQuery();

  const [trackingData, setTrackingData] = useState<any | null>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  const [requestRefundIndividual] =
    useLazyRequestRefundIndividualProductQuery();

  const [rzpNormalRefund] = useRzpNormalRefundMutation();
  const [rzpInstantRefund] = useRzpInstantRefundMutation();

  const [createShipment, { isLoading: isShipmentCreating }] =
    useCreateReverseShipmentMutation();

  const [cancelShipment, { isLoading: isShipmentCancelling }] =
    useLazyCancelShipmentQuery();

  const handleProductClick = (itemId: string) => {
    navigate(`/${encodeURIComponent(itemId)}`);
  };


  // let imagePath = "placeholder";

  // if (individualProductResponse) {
  //   imagePath = individualProductResponse.imagePaths?.[0] || "placeholder";
  // } else if (listOfProductsResponse?.products) {
  //   const specificProduct = listOfProductsResponse.products.find(
  //     (product) => product.product.item === det.item
  //   );
  //   imagePath = specificProduct?.imagePath || "placeholder";
  // }

  useEffect(() => {
    const fetchTracking = async () => {
      if (!det.waybillNo) return;
      setLoadingTracking(true);
      try {
        const payload: TrackShipmentRequest = {
          waybill: det.waybillNo,
          orderId: "",
        };
        const { data } = await trackOrderRequest(payload);
        setTrackingData(data?.ShipmentData?.[0]?.Shipment || null);
      } catch (error) {
        console.error("Error tracking order:", error);
      } finally {
        setLoadingTracking(false);
      }
    };
    fetchTracking();
  }, [det.waybillNo, trackOrderRequest]);

  // if (isLoading) {
  //   return (
  //     <div className="border-b border-gray-200 p-4 sm:p-6 animate-pulse">
  //       <div className="flex items-start">
  //         <div className="flex-shrink-0 h-24 w-24 sm:h-32 sm:w-32 bg-gray-200 rounded-lg"></div>
  //         <div className="ml-4 flex-1">
  //           <div className="w-full flex justify-between">
  //             <div className="h-6 bg-gray-200 rounded w-3/4"></div>
  //             <div className="h-6 bg-gray-200 rounded w-1/4"></div>
  //           </div>
  //           <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
  //           <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
  //           <div className="mt-2 bg-gray-50 p-3 rounded-md shadow-sm border">
  //             <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
  //             <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
  //             <div className="h-3 bg-gray-200 rounded w-full"></div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  const handleRequestRefund = async () => {
    try {
      setIsRefundModalOpen(false);
      setIsRefundLoading(false);
      const initialRequestRefundResponse = await requestRefundIndividual({
        orderId: orderId,
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
        const shipmentManifest: CreateManifestationDTO = await createShipment(
          createShipmentRequest
        ).unwrap();
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
      setIsRefundLoading(false);
    } catch (e) {
      setIsRefundLoading(false);
      console.error(e);
    }
  };

  return (
    <div className="border-b border-gray-200 p-4 sm:p-6">
      {isRefundModalOpen && (
        <div
          id="modalOverlay"
          className="fixed inset-0 bg-gray-900 opacity-50 z-40"
        ></div>
      )}
      {isRefundModalOpen && (
        <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
          <div className="relative p-4 w-full max-w-md max-h-full">
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
                  Are you sure you want to refund {det.itemDescription}?
                </h3>
                <button
                  onClick={handleRequestRefund}
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
      {isRefundLoading ? (
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
      ) : (
        <div className="flex items-start cursor-pointer">
          <div className="flex-shrink-0 h-24 w-24 sm:h-32 sm:w-32 cursor-pointer">
            {/* {imagePath === "placeholder" ? (
              <div className="flex items-center justify-center w-20 h-20 mr-4 bg-gray-200 rounded-lg">
                <div className="text-center p-2">
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
            ) : ( */}
              <img
                className="h-full w-full object-contain"
                src={det.imageUrl}
                alt="Product"
              />
            {/* )} */}
          </div>
          <div className="ml-4 flex-1">
            <div className="w-full flex justify-between">
              <p
                onClick={() => handleProductClick(det.item)}
                className="font-medium text-lg text-gray-900"
              >
                {det?.itemDescription}
              </p>
              {!det.refundInitiated && (
                <div className="sm:text-right">
                  <button
                    onClick={() => setIsRefundModalOpen(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex gap-1 items-center justify-end"
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
                    <span>Request Refund</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm font-medium my-1">
              Price: Rs {det.ecomUnitPrice.toFixed(numberOfDecimal)}
            </p>
            <p className="text-sm">Quantity: {det.quantityOr}</p>

            <div className="mt-2 bg-gray-50 p-3 rounded-md shadow-sm border text-sm">
              {loadingTracking ? (
                <p className="text-gray-500">Tracking shipment...</p>
              ) : trackingData &&
                trackingData?.Status.Status !== "Not Picked" ? (
                <>
                  <p className="text-gray-800 font-semibold">
                    Shipment Status:
                  </p>
                  <p className="text-gray-700">
                    • {trackingData?.Status?.Status}
                  </p>
                  <p className="text-gray-500">
                    {trackingData?.Status?.StatusLocation} –{" "}
                    {new Date(
                      trackingData?.Status?.StatusDateTime
                    ).toLocaleString()}
                  </p>
                </>
              ) : trackingData &&
                trackingData?.Status?.Status === "Not Picked" ? (
                <>
                  <p className="text-gray-800 font-semibold">
                    Shipment Status:
                  </p>
                  <p className="text-gray-700">• Shipment Cancelled</p>
                </>
              ) : (
                <p className="text-gray-400">Preparing for Shipment.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItem;
