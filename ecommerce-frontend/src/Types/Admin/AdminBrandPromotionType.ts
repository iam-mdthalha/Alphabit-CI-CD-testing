export interface BrandPromotionDet {
  plant: string;
  id: number;
  lnNo: number;
  hdrId: number;
  buyProductBrandId: string;
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

export interface BrandPromotionHdr {
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

export interface BrandPromotionDto {
  brandPromotionHdr: BrandPromotionHdr;
  brandPromotionDet: BrandPromotionDet[];
}

export interface TableBrandPromotion {
  id: number;
  outlet: string;
  promotion: string;
  promotion_description: string;
  start_date_or_time: string;
  end_date_or_time: string;
  isActive: string;
  originalData: BrandPromotionDto;
}

export interface AddBrandPromotionPayload {
  brandPromotionHdr: {
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
  brandPromotionDet: {
    buyProductBrandId: string;
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
}

export interface UpdateBrandPromotionPayload extends AddBrandPromotionPayload {}

export interface DeleteBrandPromotionParams {
  id: number;
  plant: string;
}

export interface GetBrandPromotionByIdParams {
  id: number;
  plant: string;
}

export interface GetAllBrandPromotionsParams {
  plant: string;
  search?: string;
}
