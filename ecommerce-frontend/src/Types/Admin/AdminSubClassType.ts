export interface SubClassMstDTO {
  plant: string;
  id: number;
  subClassCode: string;
  subClassName: string;
  categoryCode: string;
  isActive: string | boolean;
}

export interface SubClassAdminRequestDTO {
  subClassCode: string;
  subClassName: string;
  categoryCode: string;
  isActive: string;
}

export interface UpdatedSubClass {
  id: number;
  subClassCode: string;
  subClassName: string;
  categoryCode: string;
  isActive: string | boolean;
  plant: string;
  crAt: string;
  crBy: string;
  upAt: string;
  upBy: string;
}
