export interface Language {
  id: number;
  language: string;
  isActive: string;
  crBy: string;
  upBy: string;
  createdAt?: string;
  updatedAt?: string;
  plant?: string;
}

export interface LanguageReqDTO {
  language: string;
  crBy: string;
  isActive: string;
}

export interface LanguageUpdateReqDTO {
  language: string;
  isActive: string;
  upBy: string;
}
