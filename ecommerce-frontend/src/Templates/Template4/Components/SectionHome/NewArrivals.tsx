import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetNewArrivalsQuery } from "Services/ProductApiSlice";
import { change } from "State/SortSlice/SortSlice";
import { AppDispatch, RootState } from "State/store";
import ProductCard from "Templates/Template4/Components/Common/ProductCard";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { handleSort } from "Utilities/SortHandler";
import SortDropdown from "../Common/SortDropdown";

const NewArrivals: React.FC = () => {
  const [activePage, setActivePage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const pageSize = 50;

  const { data: newCollectionProducts, isLoading } = useGetNewArrivalsQuery(
    {
      pageSize: pageSize,
      activePage: activePage,
    },
    {
      skip: selectedFilters.length > 0,
    }
  );

  const { value: sort } = useSelector((state: RootState) => state.sort);
  const dispatch: AppDispatch = useDispatch();
  const [currentProducts, setCurrentProducts] = useState<ProductMetaDTO[]>([]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 4;
  const totalProducts = newCollectionProducts?.products.length || 0;
  const totalSlides = Math.ceil(totalProducts / itemsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (newCollectionProducts) {
      setCurrentProducts(handleSort(newCollectionProducts.products, sort));
    }
  }, [sort, newCollectionProducts]);

  const startIndex = currentSlide * itemsPerPage;
  const displayedProducts =
    newCollectionProducts?.products.slice(
      startIndex,
      startIndex + itemsPerPage
    ) || [];

  useEffect(() => {
    dispatch(change("price-asc"));
  }, [dispatch]);

  return (
    <div className="font-gilroyRegular leading-wider bg-vintageBg py-3 md:py-12 px-6 lg:px-24 relative overflow-hidden">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-center flex-wrap gap-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-vintageText capitalize relative flex-1"
          data-aos="fade-right"
        >
          <span className="relative z-10 font-yellowBg tracking-wider font-melodramaRegular">
            <span className="whitespace-normal break-words">
              New Arrival available on Moore Market
            </span>
          </span>
        </h2>

        <div className="flex items-center gap-4" data-aos="fade-left">
          <SortDropdown
            selectedSort={sort}
            onSortChange={(value) => dispatch(change(value))}
          />
          <Link
            to="/new-collections"
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
            <div
              key={product.product.item}
              className="flex-shrink-0 w-48"
              // className="flex-shrink-0 w-64"
            >
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

export default NewArrivals;
