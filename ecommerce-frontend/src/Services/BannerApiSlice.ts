import { BannerDTO } from "Interface/Client/Banners/Banner.interface";
import { ApiService } from "Services/ApiService";
import { ResultsDTO } from "Types/ResultsDTO";

export const BannerApiSlice = ApiService.injectEndpoints({
    endpoints: builder => ({
        getListOfBanners: builder.query<Array<BannerDTO>, void>({
            query: () => ({
                url: `/banners`,
                method: 'GET'
            }),
            transformResponse: (response: ResultsDTO) => {
                return response.results as Array<BannerDTO>;
            }
        })
    })
});

export const {
    useGetListOfBannersQuery
} = BannerApiSlice;
