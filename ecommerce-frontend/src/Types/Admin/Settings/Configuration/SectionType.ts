export interface SectionItem {
    id: string;
    name: string;
    visible: boolean;
    order: number;
    description: string;
    buttonText: string;
  }
  
  export interface ProductOptions {
    byProduct: boolean;
    byCategory: boolean;
    bySubCategory: boolean;
    byBrand: boolean;
    byModel: boolean;
  }
  
  export interface ProductsView {
    grid: boolean;
    table: boolean;
  }