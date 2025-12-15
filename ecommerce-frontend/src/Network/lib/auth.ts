import axiosClient, { AxiosClientType } from "Network/apiClient";

export function registerCustomer(fullName: string, email: string, mobileNumber: string, password: string): AxiosClientType {
    const customerData = {
        fullName, email, mobileNumber, password
    }
    return axiosClient.post('/auth/register', customerData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function loginCustomer(authenticationId: string, password: string): AxiosClientType {
    const customerData = {
        authenticationId, password
    }

    return axiosClient.post('/auth/login', customerData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getCurrentUser(headers: any): AxiosClientType {
    return axiosClient.get('/customer', {headers});
}

