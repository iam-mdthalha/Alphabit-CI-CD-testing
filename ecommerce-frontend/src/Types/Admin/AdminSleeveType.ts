export interface PrdSleeveMst {
  id: number;
  prd_sleeve: string;
  crat?: string;
  crby?: string;
  isactive: string;
  plant: string;
  upat?: string;
  upby?: string;
}

export interface Sleeve {
  id: number;
  prd_sleeve: string;
  isactive: string;
  crat?: string;
  crby?: string;
  plant?: string;
  upat?: string;
  upby?: string;
}
