import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetTopSellingbygroupQuery } from "Services/ProductApiSlice";
import { change } from "State/SortSlice/SortSlice";
import { AppDispatch, RootState } from "State/store";
import ProductCard from "Templates/Template4/Components/Common/ProductCard";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { handleSort } from "Utilities/SortHandler";
import SortDropdown from "../Common/SortDropdown";

const BestSellers: React.FC = () => {
  const pageSize = 50;
  const { data: topSellingProducts, isLoading } = useGetTopSellingbygroupQuery({
    page: 1,
    productsCount: pageSize,
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 4;
  const totalProducts = topSellingProducts?.products?.length || 0;
  const totalSlides = Math.ceil(totalProducts / itemsPerPage);

  const { value: sort } = useSelector((state: RootState) => state.sort);
  const dispatch: AppDispatch = useDispatch();
  const [currentProducts, setCurrentProducts] = useState<ProductMetaDTO[]>([]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const startIndex = currentSlide * itemsPerPage;
  const displayedProducts =
    topSellingProducts?.products?.slice(
      startIndex,
      startIndex + itemsPerPage
    ) || [];

  useEffect(() => {
    if (topSellingProducts) {
      setCurrentProducts(handleSort(topSellingProducts.products, sort));
    }
  }, [sort, topSellingProducts]);

  useEffect(() => {
    dispatch(change("price-asc"));
  }, [dispatch]);

  const SkeletonProductCard = () => (
    <div className="animate-pulse bg-gray-200 p-4 rounded-lg h-full">
      <div className="h-40 bg-gray-300 rounded-md mb-4"></div>
      <div className="h-4 bg-gray-400 rounded-md w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-400 rounded-md w-1/2"></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="font-gilroyRegular leading-wider bg-vintageBg py-3 md:py-12 px-6 lg:px-24 relative overflow-hidden">
        <div className="mb-12 flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-vintageText capitalize relative flex-1">
            <span className="relative z-10 font-yellowBg tracking-wider font-melodramaRegular">
              <span className="whitespace-normal break-words">
                Today's BestSellers
              </span>
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (
    !isLoading &&
    (!topSellingProducts?.products || topSellingProducts.products.length === 0)
  ) {
    return (
      <div className="font-gilroyRegular leading-wider bg-vintageBg py-3 md:py-12 px-6 lg:px-24 relative overflow-hidden text-center min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          No best sellers available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="font-gilroyRegular leading-wider bg-vintageBg py-3 md:py-12 px-6 lg:px-24 relative overflow-hidden">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center flex-wrap gap-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-vintageText capitalize relative flex-1"
          data-aos="fade-right"
        >
          <span className="relative z-10 font-yellowBg tracking-wider font-melodramaRegular">
            <span className="whitespace-normal break-words">
              Today's BestSellers
            </span>
          </span>
        </h2>

        <div className="flex items-center gap-4" data-aos="fade-left">
          <SortDropdown
            selectedSort={sort}
            onSortChange={(value) => dispatch(change(value))}
          />
          <Link
            to="/top-sellers?page=1"
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
          {currentProducts?.map((product: ProductMetaDTO) => (
            <div key={product.product.item} className="flex-shrink-0 w-32">
              <ProductCard
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

        <div className="hidden lg:flex gap-4 overflow-x-auto no-scrollbar px-1">
          {currentProducts?.map((product: ProductMetaDTO) => (
            <div key={product.product.item} className="flex-shrink-0 w-48">
              <div className="h-full">
                <ProductCard
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

export default BestSellers;
