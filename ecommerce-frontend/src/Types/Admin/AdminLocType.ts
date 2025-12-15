export interface LocType {
  plant: string;
  locTypeId: string;
  locTypeDesc: string;
  crAt: string | null;
  crBy: string | null;
  upAt: string | null;
  upBy: string | null;
  isActive: boolean | null;
}

export interface GetAllLocTypesParams {
  plant: string;
}
