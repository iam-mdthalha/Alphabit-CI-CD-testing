import { APIResponseType } from "_shared/interfaces/api.interface";
import { CartDTO } from "Interface/Client/Cart/cart.interface";

export interface AppClientRemoveAllCartItemsResponse extends APIResponseType {
    results: CartDTO;
}