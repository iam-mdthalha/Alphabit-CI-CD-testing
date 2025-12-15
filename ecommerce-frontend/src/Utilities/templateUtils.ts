import { Templates } from "Enums/Templates";

export const getBrandName = (template: Templates): string => {
  switch (template) {
    case Templates.TEMP1: return "ShopIt";
    case Templates.TEMP2: return "CAVIAAR MODE";
    case Templates.TEMP3: return "TMAR";
    case Templates.TEMP4: return "Moore Market";
    default: return "Shop";
  }
};