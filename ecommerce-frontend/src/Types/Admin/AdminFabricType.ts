export interface PrdFabricMst {
  id: number;
  prd_fabric: string;
  crat?: string;
  crby?: string;
  isactive: string;
  plant: string;
  upat?: string;
  upby?: string;
}

export interface Fabric {
  id: number;
  prd_fabric: string;
  isactive: string;
  crat?: string;
  crby?: string;
  plant?: string;
  upat?: string;
  upby?: string;
}
