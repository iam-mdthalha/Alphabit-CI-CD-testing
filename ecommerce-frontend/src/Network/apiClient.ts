import axios from "axios";

const axiosClient = axios.create({
    // baseURL: 'http://localhost:9071/api',
    baseURL: 'https://api-ind-ecommerce.u-clo.com/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});



axiosClient.interceptors.request.use(async (req) => {
    return req;
}, (err) => {
    console.error(err);
    return Promise.reject(err);
});

axiosClient.interceptors.response.use((res) => {
    return res;
}, (err) => {

    return Promise.reject(err);
});


export default axiosClient;
export type AxiosClientType = ReturnType<typeof axiosClient>;