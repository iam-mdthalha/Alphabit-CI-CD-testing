import { CustomerDTO } from "../Customer/customer.interface";


export interface AuthResponse {
    token: string;
    user: CustomerDTO;
    message: string;
}