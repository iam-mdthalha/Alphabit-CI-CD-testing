import React from "react";

interface ProductSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    itemDesc: string;
    ecomUnitPrice?: number;
    imagePath?: string;
  };
  discountedPrice: number;
  numberOfDecimal: number;
  author?: string;
}

const ProductSummaryModal: React.FC<ProductSummaryModalProps> = ({
  isOpen,
  onClose,
  product,
  discountedPrice,
  numberOfDecimal,
  author = "Unknown Author",
}) => {
  if (!isOpen) return null;

  const bookSummary = `The book Atomic Habits by James Clear explores the power of small changes in our habits to bring about significant transformations in our lives. Clear provides practical strategies and insights to help readers understand how habits shape their identity and how they can leverage this knowledge to build good habits and break bad ones. By focusing on the process of habit formation and embracing the concept of atomic habits (small changes that compound over time), individuals can achieve remarkable results and lead a more fulfilling and purposeful life.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div className="relative bg-vintageBg rounded-lg shadow-lg w-[90vw] md:w-[70vw] max-h-[80vh] overflow-y-auto border-2 border-vintageBorder vintage-modal no-scrollbar">
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-800"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-800"></div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-amber-900 hover:text-amber-700 transition-colors z-10"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="order-2 md:order-1 flex-1 p-6">
            <h1 className="text-2xl md:text-4xl font-bold text-vintageText mb-4">Summary</h1>
            <p className="text-lg text-black font-medium text-justify my-2">
              The book offers practical advice and insights for navigating the
              challenges of running a startup or leading a company Ben Horowitz
              shares his own experiences and lessons learned providing a candid
              look at the hard things that leaders often face He discusses
              decision making management dealing with tough situations and the
              realities of entrepreneurship The book is a valuable resource for
              anyone interested in the realities of business leadership and the
              resilience required to overcome obstacles.
            </p>
          </div>
          <div className="order-1 md:order-2 md:w-1/3 flex-shrink-0">
            <img
              src={process.env.PUBLIC_URL + "/template4/summary.jpg"}
              alt="Summary Img"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSummaryModal;
