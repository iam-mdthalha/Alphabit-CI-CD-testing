import React from "react";
import { ProductDTO } from "Types/ProductDTO";

interface ProductDetailsSectionProps {
  productData?: ProductDTO;
}

interface DetailRowProps {
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div className="flex items-center gap-4">
    <span className="bg-vintageBg-100 text-vintageText-600 rounded-full p-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M12 5l7 7-7 7"
        />
      </svg>
    </span>
    <span className="text-lg">
      {label} <span className="font-bold">- {value}</span>
    </span>
  </div>
);

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({ productData }) => {
  const detailFields = [
    { label: productData?.labelPara1, value: productData?.parameter1 },
    { label: productData?.labelPara2, value: productData?.parameter2 },
    { label: productData?.labelPara3, value: productData?.parameter3 },
    { label: productData?.labelPara4, value: productData?.parameter4 },
    { label: productData?.labelPara5, value: productData?.parameter5 },
    { label: productData?.labelPara6, value: productData?.parameter6 },
    { label: productData?.labelPara7, value: productData?.parameter7 },
    { label: productData?.labelPara8, value: productData?.parameter8 },
  ];

  const validDetails = detailFields
    .filter(field => field.label || field.value)
    .map(field => ({
      label: field.label || "Unknown Label",
      value: field.value || "N/A"
    }));

  const hasDetails = validDetails.length > 0;

  return (
    <div className="bg-vintageBg/70 rounded-xl shadow p-6 w-full max-w-3xl">
      <h2 className="text-3xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-6">
        Product Details
      </h2>
      
      {hasDetails ? (
        <div className="space-y-5 text-black-700">
          {validDetails.map((detail, index) => (
            <DetailRow 
              key={index}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No product details available</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsSection;