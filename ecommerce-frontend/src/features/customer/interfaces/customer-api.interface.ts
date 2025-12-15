import { APIResponseType } from "_shared/interfaces/api.interface";
import { CustomerDTO } from "Interface/Client/Customer/customer.interface";

export interface AppClientGetCustomerResponse extends APIResponseType{
    results: CustomerDTO;
}