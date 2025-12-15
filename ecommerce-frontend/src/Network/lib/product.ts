import { CartSave } from "Types/CartSave";
import axiosClient, { AxiosClientType } from "../apiClient";

// export function getAllProducts(category: string | null, activePage: number, pageSize: number): AxiosClientType {
//     if (category) {
//         return axiosClient.get(`/products?category=${category}&productsCount=${pageSize}&page=${activePage}`);
//     } else {
//         return axiosClient.get(`/products?productsCount=${pageSize}&page=${activePage}`);
//     }

// }


// export function getRelatedProducts(productId: string, category: string | null, subCategory: string | null, brand: string | null, dept: string | null): AxiosClientType {
//     return axiosClient.get(`/related-products?productId=${productId}&category=${category}&subcategory=${subCategory}&brand=${brand}&dept=${dept}`);
// }

// export function getProductsBySearch(searchValue: string, searchOffsetValue: string | null, pageSize: number, activePage: number): AxiosClientType {
//     if (searchOffsetValue === 'all' || searchOffsetValue === null) {
//         return axiosClient.get(`/products?search=${searchValue}&productsCount=${pageSize}&page=${activePage}`);
//     } else {
//         return axiosClient.get(`/products?search=${searchValue}&category=${searchOffsetValue}&productsCount=${pageSize}&page=${activePage}`);
//     }
// }

// export function getAllCategory(): AxiosClientType {
//     return axiosClient.get('/categories');
// }

export function getTotalProductsCount(searchValue: string | null): AxiosClientType {
    if (searchValue) {
        return axiosClient.get(`/total-products?search=${searchValue}`);
    } else {
        return axiosClient.get('/total-products');
    }

}


// export function getProductById(productId: string): AxiosClientType {
//     return axiosClient.get(`/product/${productId}`);
// }

// export function getProductByIds(productIds: Array<string>): AxiosClientType {
//     return axiosClient.post(`/products`, productIds, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
// }

// export async function getAvailableQuantity(productId: string): Promise<AxiosClientType> {
//     return await axiosClient.get(`/stock-quantity/${productId}`);
// }

export async function saveCartItems(cartList: Array<CartSave>): Promise<AxiosClientType> {
    return await axiosClient.post(`/cart`, cartList, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
