import React from "react";
import { ProductDTO } from "Types/ProductDTO";

interface OverviewSectionProps {
  productData?: ProductDTO;
  detailDesc?: string;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({
  productData,
  detailDesc,
}) => {
  // Priority order for content:
  // 1. productData.itemDesc (from ProductDTO)
  // 2. detailDesc prop (fallback from API)
  // 3. Default message if both are empty

  const getContent = () => {
    if (productData?.itemDesc && productData.itemDesc.trim().length > 0) {
      return productData.itemDesc;
    }

    if (detailDesc && detailDesc.trim().length > 0) {
      return detailDesc;
    }

    return null;
  };

  const content = getContent();

  return (
    <section className="w-full max-w-3xl">
      <h2 className="text-3xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-3">
        Overview & Description
      </h2>

      {content ? (
        <p className="text-sm md:text-lg text-justify text-black whitespace-pre-line leading-relaxed">
          {content}
        </p>
      ) : (
        <div className="text-center py-8 bg-vintageBg/30 rounded-lg">
          <p className="text-gray-500 text-lg">
            No description available for this product
          </p>
        </div>
      )}
    </section>
  );
};

export default OverviewSection;
