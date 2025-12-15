export interface PrdSizeMst {
  id: number;
  prd_Size_Desc: string;
  crat?: string;
  crby?: string;
  isactive: string;
  plant: string;
  upat?: string;
  upby?: string;
}

export interface Size {
  id: number;
  prd_Size_Desc: string;
  isactive: string;
  crat?: string;
  crby?: string;
  plant?: string;
  upat?: string;
  upby?: string;
}
