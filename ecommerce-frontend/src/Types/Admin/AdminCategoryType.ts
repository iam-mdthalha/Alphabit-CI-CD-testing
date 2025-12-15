// export interface PrdCategoryMst {
//   id: number;
//   collar: string;
//   crat?: string;
//   crby?: string;
//   isactive: string;
//   plant: string;
//   upat?: string;
//   upby?: string;
// }

export interface CategoryAdminRequestDTO {
  categoryCode: string;
  categoryName: string;
  isActive: string;
}

export interface CategoryAdminDTO {
  id: number;
  categoryCode: string;
  categoryName: string;
  isActive: string;
  image: string;
  imagePath: string;
}

export interface Category {
  id: number;
  collar_description: string;
  isactive: string;
  crat?: string;
  crby?: string;
  plant?: string;
  upat?: string;
  upby?: string;
}
