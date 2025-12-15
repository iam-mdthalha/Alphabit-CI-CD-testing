// Types/Admin/AdminHistoryType.ts

export interface AdminHistory {
  id: number;
  plant: string;
  year: number;
  title: string;
  description1?: string;
  description2?: string;
  description3?: string;
  imageUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AdminHistoryDTO {
  id?: number; // optional for create, required for update
  plant: string;
  year: number;
  title: string;
  description1?: string;
  description2?: string;
  description3?: string;
}
