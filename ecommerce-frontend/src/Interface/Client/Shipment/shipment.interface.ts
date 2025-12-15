export interface CreateManifestationDTO {
    cash_pickups: number;
    cash_pickups_count: number;
    cod_count: number;
    package_count: number;
    packages: PackageInfo[];
    pickups_count: number;
    prepaid_count: number;
    replacement_count: number;
    success: boolean;
    upload_wbn: string;
}

export interface PackageInfo {
    client: string;
    cod_amount: number;
    payment: string;
    refnum: string;
    remarks: string[];
    serviceable: boolean;
    sort_code: string;
    status: string;
    waybill: string;
}

export interface CancelManifestationDTO {
    order_id: string;
    remark: string;
    status: boolean;
    waybill: string;
}