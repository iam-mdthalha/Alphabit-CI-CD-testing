import SectionContentOptions from "Components/Admin/AdminSettings/Configuration/Section/SectionContentOptions";
import SectionDisplayOptions from "Components/Admin/AdminSettings/Configuration/Section/SectionDisplayOptions";
import SectionLayoutOptions from "Components/Admin/AdminSettings/Configuration/Section/SectionLayoutOptions";
import React, { useEffect, useState } from "react";

interface SectionConfigProps {
  // setHasChanges: (hasChanges: boolean) => void;
  // onConfigChange: (config: Partial<EcommerceConfigDto>) => void;
}

const SectionConfig: React.FC<SectionConfigProps> = (
  // { setHasChanges }
) => {
  const [sectionLayout, setSectionLayout] = useState("grid");
  const [sectionPadding, setSectionPadding] = useState("medium");
  const [imageCount, setImageCount] = useState(1);
  const [productOptions, setProductOptions] = useState({
    byProduct: true,
    byCategory: false,
    bySubCategory: false,
    byBrand: false,
    byModel: false,
  });
  const [productsView, setProductsView] = useState({
    grid: true,
    table: false,
  });
  const [sections, setSections] = useState([
    { id: "dashboard", name: "Dashboard", visible: true, order: 1 },
    { id: "analytics", name: "Analytics", visible: true, order: 2 },
    { id: "reports", name: "Reports", visible: true, order: 3 },
    { id: "settings", name: "Settings", visible: true, order: 4 },
    { id: "users", name: "User Management", visible: false, order: 5 },
    { id: "help", name: "Help Center", visible: true, order: 6 },
  ]);

  useEffect(() => {
    // setHasChanges(true);
  }, [sectionLayout, sectionPadding, imageCount, productOptions, productsView, sections]);

  const toggleSectionVisibility = (id: string) => {
    setSections(sections.map((section) =>
      section.id === id ? { ...section, visible: !section.visible } : section
    ));
    // setHasChanges(true);
  };

  const moveSection = (id: string, direction: "up" | "down") => {
    const sectionIndex = sections.findIndex((s) => s.id === id);
    if ((direction === "up" && sectionIndex === 0) || (direction === "down" && sectionIndex === sections.length - 1)) {
      return;
    }
    const newSections = [...sections];
    const targetIndex = direction === "up" ? sectionIndex - 1 : sectionIndex + 1;
    [newSections[sectionIndex].order, newSections[targetIndex].order] =
      [newSections[targetIndex].order, newSections[sectionIndex].order];
    newSections.sort((a, b) => a.order - b.order);
    setSections(newSections);
  };

  const toggleProductOption = (option: keyof typeof productOptions) => {
    setProductOptions({
      ...productOptions,
      [option]: !productOptions[option],
    });
    // setHasChanges(true);
  };

  const toggleProductsView = (view: string) => {
    setProductsView({
      grid: view === "grid",
      table: view === "table",
    });
  };

  return (
    <div className="font-gilroyRegular tracking-wider space-y-6">
      <div>
        <h3 className="text-sm font-medium">Section Configuration</h3>
        <p className="text-xs text-gray-500 mt-1">
          Manage what sections appear and their order
        </p>
      </div>
      <div className="space-y-4">
        <SectionLayoutOptions
          sectionLayout={sectionLayout}
          setSectionLayout={setSectionLayout}
          sectionPadding={sectionPadding}
          setSectionPadding={setSectionPadding}
        />
        <SectionDisplayOptions
          imageCount={imageCount}
          setImageCount={setImageCount}
          productsView={productsView}
          onToggleView={toggleProductsView}
        />
        <SectionContentOptions
          productOptions={productOptions}
          onToggleOption={toggleProductOption}
        />
      </div>
    </div>
  );
};

export default SectionConfig;
