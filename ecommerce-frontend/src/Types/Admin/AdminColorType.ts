export interface PrdColorMst {
  id: number;
  prd_color_desc: string;
  crat?: string;
  crby?: string;
  isactive: string;
  plant: string;
  upat?: string;
  upby?: string;
}

export interface Color {
  id: number;
  prd_color_desc: string;
  isactive: string;
  crat?: string;
  crby?: string;
  plant?: string;
  upat?: string;
  upby?: string;
}
