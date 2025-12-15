export interface CategoryPromotionDet {
  plant: string;
  id: number;
  lnNo: number;
  hdrId: number;
  buyProductClassId: string;
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

export interface CategoryPromotionHdr {
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

export interface CategoryPromotion {
  categoryPromotionHdr: CategoryPromotionHdr;
  categoryPromotionDet: CategoryPromotionDet[];
}

export interface AddCategoryPromotionPayload {
  categoryPromotionDet: {
    buyProductClassId: string;
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
  categoryPromotionHdr: {
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

export interface UpdateCategoryPromotionPayload
  extends AddCategoryPromotionPayload {}

export interface DeleteCategoryPromotionParams {
  id: number;
  plant: string;
}

export interface GetCategoryPromotionByIdParams {
  id: number;
  plant: string;
}

export interface GetAllCategoryPromotionsParams {
  plant: string;
  search?: string;
}
