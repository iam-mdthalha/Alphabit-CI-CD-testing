import { CheckPinCodeAvailability, CheckPinCodeAvailabilityRequest } from "Interface/Client/Shipment/pincode.interface";
import { RequestRefundResponse } from "Interface/Client/Shipment/refund.interface";
import { CancelManifestationDTO, CreateManifestationDTO } from "Interface/Client/Shipment/shipment.interface";
import { CancelShipmentRequestDTO, CreateShipmentRequestDTO } from "Interface/Client/Shipment/shipping.interface";
import { TrackShipmentDataResponse, TrackShipmentRequest } from "Interface/Client/Shipment/track-order.interface";
import { ResultsDTO } from "Types/ResultsDTO";
import { ApiService } from "./ApiService";

export const ShipmentApiSlice = ApiService.injectEndpoints({
    endpoints: (builder) => ({
        checkPinCodeAvailability: builder.query<CheckPinCodeAvailability, CheckPinCodeAvailabilityRequest>({
            query: ({ pinCode, productType }) => ({
                url: `/shipping/delhivery/check-pincode-availability?pinCode=${pinCode}&productType=${productType}`,
                method: 'GET'
            })
        }),
        createForwardShipment: builder.mutation<CreateManifestationDTO, CreateShipmentRequestDTO>({
            query: (createShipmentRequestDTO) => ({
                url: '/shipment/create?shipment=forward',
                method: 'POST',
                body: { ...createShipmentRequestDTO }
            }),
            transformResponse: (res: ResultsDTO) => {
                return res.results;
            }
        }),
        createReverseShipment: builder.mutation<CreateManifestationDTO, CreateShipmentRequestDTO>({
            query: (createShipmentRequestDTO) => ({
                url: '/shipment/create?shipment=reverse',
                method: 'POST',
                body: { ...createShipmentRequestDTO }
            }),
            transformResponse: (res: ResultsDTO) => {
                return res.results;
            }
        }),
        cancelShipment: builder.query<CancelManifestationDTO, CancelShipmentRequestDTO>({
            query: (cancelManifestationDTO) => ({
                url: `/shipment/cancel?waybillNo=${cancelManifestationDTO.waybillNo}`,
                method: 'GET'
            }),
            transformResponse: (res: ResultsDTO) => {
                return res.results;
            }
        }),
        trackOrder: builder.query<TrackShipmentDataResponse, TrackShipmentRequest>({
            query: (trackShipment) => ({
                url: `/shipping/delhivery/track-shipment?waybill=${trackShipment.waybill}&orderId=${trackShipment.orderId}`,
                method: 'GET'
            })
        }),
        requestRefundAllProducts: builder.query<RequestRefundResponse, { orderId: string }>({
            query: ({ orderId }) => ({
                url: `/shipment/request-refund?orderId=${orderId}&refundType=ALL`,
                method: 'GET'
            })
        }),
        requestRefundIndividualProduct: builder.query<RequestRefundResponse, { orderId: string, itemCode: string, waybillNo: string }>({
            query: ({ orderId, itemCode, waybillNo }) => ({
                url: `/shipment/request-refund?orderId=${orderId}&itemCode=${itemCode}&waybillNo=${waybillNo}&refundType=INDIVIDUAL`,
                method: 'GET'
            }),
            transformResponse: (res: ResultsDTO) => {
                return res.results;
            }
        })
    })
});

export const { useLazyCheckPinCodeAvailabilityQuery, useCreateForwardShipmentMutation, useCreateReverseShipmentMutation, useLazyCancelShipmentQuery, useLazyTrackOrderQuery, useLazyRequestRefundAllProductsQuery, useLazyRequestRefundIndividualProductQuery } = ShipmentApiSlice;