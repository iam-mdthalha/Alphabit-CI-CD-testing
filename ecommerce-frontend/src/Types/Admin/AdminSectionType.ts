export interface SectionAdminDTO {
  id: number;
  name: string;
  description: string;
  ctaText: string;
  catalogCount: number;
  productsList: string[];
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
}

export interface SectionAdminRequestDTO {
  ctaText: string;
  description: string;
  imageCount: number;
  name: string;
  productList: string[];
}
