
type VisibilityRules = {
  [storeType: string]: {
    hideMenuItems?: string[];
    hideSubMenuItems?: {
      [menuItem: string]: string[];
    };
  };
};

export const menuVisibilityRules: VisibilityRules = {
  book: {
    hideMenuItems: ["Sections"],
    hideSubMenuItems: {
      Product: [
        // "Sub Category",
        "Brand",
        "Model",
        "Size",
        "Sleeve",
        "Color",
        "Fabric",
        "Occasion",
        "Collar",
        "Pattern",
      ],
    },
  },
  shoe: {
    hideMenuItems: ["Author", "Academic", "Language", "Merchandise"],
    hideSubMenuItems: {
      Product: [
        "Brand",
        "Model",
        "Size",
        "Sleeve",
        "Color",
        "Fabric",
        "Occasion",
        "Collar",
        "Pattern",
      ],
    },
  },
  textile: {
    hideMenuItems: ["Author", "Academic", "Language", "Merchandise"],
    hideSubMenuItems: {},
  },
};
