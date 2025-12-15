export interface Academic {
  id: number;
  academic: string;
  isActive: string;
  crBy: string;
  upBy: string;
  createdAt?: string;
  updatedAt?: string;
  plant?: string;
}

export interface AcademicReqDTO {
  academic: string;
  crBy: string;
  isActive: string;
}

export interface AcademicUpdateReqDTO {
  academic: string;
  isActive: string;
  upBy: string;
}
