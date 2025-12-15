export interface Author {
  id: number;
  author: string;
  isActive: string;
  crBy: string;
  upBy: string;
  createdAt?: string;
  updatedAt?: string;
  plant?: string;
}

export interface AuthorReqDTO {
  author: string;
  crBy: string;
  isActive: string;
}

export interface AuthorUpdateReqDTO {
  author: string;
  isActive: string;
  upBy: string;
}
