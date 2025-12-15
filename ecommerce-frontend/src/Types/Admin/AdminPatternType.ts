export interface PrdPatternMst {
  id: number;
  prd_pattern_desc: string;
  crat?: string;
  crby?: string;
  isactive: string;
  plant: string;
  upat?: string;
  upby?: string;
}

export interface Pattern {
  id: number;
  prd_pattern_desc: string;
  isactive: string;
  crat?: string;
  crby?: string;
  plant?: string;
  upat?: string;
  upby?: string;
}
