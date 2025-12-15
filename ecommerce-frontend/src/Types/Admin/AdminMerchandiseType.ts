export interface Merchandise {
  id: number;
  merchandise: string;
  isActive: string;
  crBy: string;
  upBy: string;
  createdAt?: string;
  updatedAt?: string;
  plant?: string;
}

export interface MerchandiseReqDTO {
  merchandise: string;
  crBy: string;
  isActive: string;
}

export interface MerchandiseUpdateReqDTO {
  merchandise: string;
  isActive: string;
  upBy: string;
}
