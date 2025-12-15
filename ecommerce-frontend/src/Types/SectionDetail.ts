import { ProductPackerDTO } from "./ProductPackerDTO";

export interface SectionDetail {
    sectionId: number;
    sectionName: string;
    sectionDesc: string;
    sectionProducts: ProductPackerDTO;
}