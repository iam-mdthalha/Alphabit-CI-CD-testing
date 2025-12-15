import { YesOrNo } from "Enums/YesOrNo";

export interface SubClassAdminDTO {
    id: number;
    subClassCode: string;
    subClassName: string;
    categoryCode: string;
    isActive: boolean;
}

export interface SubClassAdminRequestDTO {
    subClassCode: string;
    subClassName: string;
    categoryCode: string;
    isActive: YesOrNo;
}