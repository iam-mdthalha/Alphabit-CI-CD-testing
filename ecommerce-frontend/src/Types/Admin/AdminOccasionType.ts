export interface PrdOccasionMst {
  id: number;
  prd_occasion_desc: string;
  crat?: string;
  crby?: string;
  isactive: string;
  plant: string;
  upat?: string;
  upby?: string;
}

export interface Occasion {
  id: number;
  prd_occasion_desc: string;
  isactive: string;
  crat?: string;
  crby?: string;
  plant?: string;
  upat?: string;
  upby?: string;
}
