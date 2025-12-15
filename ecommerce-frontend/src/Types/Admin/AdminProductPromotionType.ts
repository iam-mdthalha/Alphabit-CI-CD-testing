export interface PromotionDet {
  plant: string;
  id: number;
  lnNo: number;
  hdrId: number;
  buyItem: string;
  buyQty: number;
  getItem: string;
  getQty: number;
  promotionType: string;
  promotion: number;
  limitOfUsage: number;
  usageUsed: number;
  crAt: string;
  crBy: string;
  upAt: string;
  upBy: string;
}

export interface PromotionHdr {
  plant: string;
  id: number;
  promotionName: string;
  promotionDesc: string;
  customerTypeId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  notes: string;
  byValue: number;
  isActive: string;
  outlet: string;
  crAt: string;
  crBy: string;
  upAt: string;
  upBy: string;
}

export interface ProductPromotion {
  promotionHdr: PromotionHdr;
  promotionDet: PromotionDet[];
}

export interface AddProductPromotionPayload {
  promotionDet: {
    buyItem: string;
    buyQty: number;
    crAt?: string;
    crBy?: string;
    getItem: string;
    getQty: number;
    hdrId?: number;
    id?: number;
    limitOfUsage: number;
    lnNo: number;
    plant: string;
    promotion: number;
    promotionType: string;
    upAt?: string;
    upBy?: string;
    usageUsed?: number;
  }[];
  promotionHdr: {
    byValue: number;
    crAt?: string;
    crBy?: string;
    customerTypeId: string;
    endDate: string;
    endTime: string;
    id?: number;
    isActive: string;
    notes: string;
    outlet: string;
    plant: string;
    promotionDesc: string;
    promotionName: string;
    startDate: string;
    startTime: string;
    upAt?: string;
    upBy?: string;
  };
}

export interface UpdateProductPromotionPayload extends AddProductPromotionPayload { }

export interface DeleteProductPromotionParams {
  id: number;
  plant: string;
}

export interface GetProductPromotionByIdParams {
  id: number;
  plant: string;
}

export interface GetAllProductPromotionsParams {
  plant: string;
  search?: string;
}