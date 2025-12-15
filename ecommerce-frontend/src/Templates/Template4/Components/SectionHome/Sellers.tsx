import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllAdminProductsQuery } from "Services/Admin/ProductAdminApiSlice";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import MultiProductCard from "Templates/Template4/Components/Common/MultiProductCard";

const Sellers: React.FC = () => {
  const pageSize = 50;
  const { data: productsData, isLoading } = useGetAllAdminProductsQuery({
    category: "",
    subCategory: "",
    brand: "",
    activePage: 1,
    pageSize,
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 4;
  const totalProducts = productsData?.products.length || 0;
  const totalSlides = Math.ceil(totalProducts / itemsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const startIndex = currentSlide * itemsPerPage;
  const displayedProducts =
    productsData?.products.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <div className="font-gilroyRegular leading-wider bg-vintageBg py-3 md:py-12 px-6 lg:px-24 relative overflow-hidden">
      <div className="mb-12 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl md:text-4xl font-bold text-vintageText capitalize relative flex-1" data-aos="fade-right">
          <span className="relative z-10 font-yellowBg tracking-wider font-melodramaRegular">
            <span className="whitespace-normal break-words">
              Get Rs:100 or more off from these sellers
            </span>
          </span>
        </h2>

        <div className="flex items-center gap-4" data-aos="fade-left">
          <Link
            to="/sell-with-us"
            onClick={() => window.scrollTo(0, 0)}
            className="bg-vintageText border-vintageBg rounded-xl font-medium text-white border px-4 py-1"
          >
            See all
          </Link>

          <button
            onClick={prevSlide}
            className="text-vintageText hover:bg-vintageBg hover:drop-shadow-[0_0_8px_rgba(0,150,255,0.1)] transition-shadow text-2xl border rounded-full border-vintageBorder hidden md:flex justify-center items-center"
            aria-label="Previous"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-left-icon lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="text-vintageText hover:bg-vintageBg hover:drop-shadow-[0_0_8px_rgba(0,150,255,0.1)] transition-shadow text-2xl border rounded-full border-vintageBorder hidden md:flex justify-center items-center"
            aria-label="Next"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-right-icon lucide-chevron-right"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="lg:hidden flex gap-4 overflow-x-auto no-scrollbar px-1">
          {productsData?.products.map((product: ProductMetaDTO) => (
            <div key={product.product.item} className="flex-shrink-0 w-90">
              <MultiProductCard
                product={{
                  product: product.product,
                  imagePath: product.imagePath,
                  promotions: product.promotions,
                  productgarmenttype: product.productgarmenttype,
                }}
              />
            </div>
          ))}
        </div>

        <div className="hidden lg:flex gap-4 overflow-x-auto no-scrollbar p-1">
          {productsData?.products.map((product: ProductMetaDTO) => (
            <div
              key={product.product.item}
              className="flex-shrink-0 w-90"
              // className="flex-shrink-0 w-64"
            >
              <div className="h-full">
                <MultiProductCard
                  product={{
                    product: product.product,
                    imagePath: product.imagePath,
                    promotions: product.promotions,
                    productgarmenttype: product.productgarmenttype,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sellers;
