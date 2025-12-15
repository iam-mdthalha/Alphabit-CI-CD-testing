import axiosClient, { AxiosClientType } from "Network/apiClient";

export function getAllBanners(): AxiosClientType {
    return axiosClient.get('/banners');
}