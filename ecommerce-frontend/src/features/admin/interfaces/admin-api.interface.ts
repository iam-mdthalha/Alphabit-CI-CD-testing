import { APIResponseType } from "_shared/interfaces/api.interface";
import { LoyaltyConfigDTO, SaveLoyaltyConfigDTO } from "./loyalty-config.interface";
import { SubClassAdminDTO, SubClassAdminRequestDTO } from "./subclass.interface";

//Request
export interface AppAdminSubClassRequest {
    id?: string;
    subClassAdminRequestDTO?: SubClassAdminRequestDTO;
}

export interface AppSaveLoyaltyConfigRequest {
    data: SaveLoyaltyConfigDTO;
}


//Response

export interface AppGetAllAdminSubClassesResponse extends APIResponseType{
    results: SubClassAdminDTO[];
}

export interface AppGetAdminSubClassByIdResponse extends APIResponseType {
    results: SubClassAdminDTO;
}

export interface AppSaveOrUpdateAdminSubClassResponse extends APIResponseType {
    results: number;
}

export interface AppSaveLoyaltyConfigResponse extends APIResponseType {
    results: number;
}

export interface AppGetLoyaltyConfigResponse extends APIResponseType {
    results: LoyaltyConfigDTO;
}