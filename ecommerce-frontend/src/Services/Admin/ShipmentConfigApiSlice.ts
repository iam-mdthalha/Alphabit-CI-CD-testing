import { PickupLocationSettingDTO } from "Interface/Admin/Configuration/shipment-config.interface";
import { ResultsDTO } from "Types/ResultsDTO";
import { ApiService } from "../ApiService";

export const ShipmentConfigApiSlice = ApiService.injectEndpoints({
    endpoints: (builder) => ({
        savePickupLocation: builder.mutation<ResultsDTO, PickupLocationSettingDTO>({
            query: (pickupLocationSettingDTO) => ({
                url: `/admin/pickup-location-config/create`,
                method: 'POST',
                body: { ...pickupLocationSettingDTO } 
            })
        }),
        getPickupLocations: builder.query<Array<PickupLocationSettingDTO>, void>({
            query: () => ({
                url: `/admin/pickup-location-config/`,
                method: 'GET'
            }),
            transformResponse: (res: ResultsDTO) => {
                return res.results;
            }
        }),
    })
});

export const { useGetPickupLocationsQuery, useSavePickupLocationMutation } = ShipmentConfigApiSlice;