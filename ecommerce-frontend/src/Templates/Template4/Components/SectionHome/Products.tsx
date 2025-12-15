import CircleLoader from "Components/Common/CircleLoader";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useGetAllAdminProductsQuery } from "Services/Admin/ProductAdminApiSlice";
import { change } from "State/SortSlice/SortSlice";
import { AppDispatch, RootState } from "State/store";
import ProductCard from "Templates/Template4/Components/Common/ProductCard";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { handleSort } from "Utilities/SortHandler";
import SortDropdown from "../Common/SortDropdown";


const Products: React.FC = () => {
  const pageSize = 15;
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: productsData, isLoading } = useGetAllAdminProductsQuery({
    category: "",
    subCategory: "",
    brand: "",
    activePage: 1,
    pageSize,
  });
  const { value: sort } = useSelector((state: RootState) => state.sort);
  const dispatch: AppDispatch = useDispatch();
  const [activePage, setActivePage] = useState(1);

  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 4;
  const totalProducts = productsData?.totalProducts || 0;
  const totalSlides = Math.ceil(totalProducts / itemsPerPage);
  const [currentProducts, setCurrentProducts] = useState<ProductMetaDTO[]>([]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const startIndex = currentSlide * itemsPerPage;
  const displayedProducts =
    productsData?.products.slice(startIndex, startIndex + itemsPerPage) || [];

  useEffect(() => {
    if(productsData) {
      setCurrentProducts(handleSort(productsData.products, sort));
    }
  }, [sort, productsData]);
  
    useEffect(() => {
      dispatch(change("price-asc"));
    }, [dispatch]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  const paginate = (pageNumber: number) => {
    setSearchParams({ page: pageNumber.toString() });
    setActivePage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  console.log("Total Products : ", totalProducts);
  console.log("Page Size : ", pageSize);
  console.log("Total Pages : ", totalPages);

  return (
    // <div className="font-gilroyRegular leading-wider bg-vintageBg py-3 md:py-12 px-6 lg:px-24 relative overflow-hidden">
    //   <div className="mb-12 flex justify-between items-center flex-wrap gap-4">
    //     <h2 className="text-3xl md:text-4xl font-bold text-vintageText capitalize relative flex-1" data-aos="fade-right">
    //       <span className="relative z-10 font-yellowBg tracking-wider font-melodramaRegular">
    //         <span className="whitespace-normal break-words">All Products</span>
    //       </span>
    //     </h2>

    //     <div className="flex items-center gap-4" data-aos="fade-left">
    //       <SortDropdown
    //         selectedSort={sort}
    //         onSortChange={(value) => dispatch(change(value))}
    //       />
    //       <Link
    //         to="/books"
    //         onClick={() => window.scrollTo(0, 0)}
    //         className="bg-vintageText border-vintageBg rounded-xl font-medium text-white border px-4 py-1"
    //       >
    //         See all
    //       </Link>

    //       <button
    //         onClick={prevSlide}
    //         className="text-vintageText hover:bg-vintageBg hover:drop-shadow-[0_0_8px_rgba(0,150,255,0.1)] transition-shadow text-2xl border rounded-full border-vintageBorder hidden md:flex justify-center items-center"
    //         aria-label="Previous"
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           width="24"
    //           height="24"
    //           viewBox="0 0 24 24"
    //           fill="none"
    //           stroke="currentColor"
    //           strokeWidth="2"
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           className="lucide lucide-chevron-left-icon lucide-chevron-left"
    //         >
    //           <path d="m15 18-6-6 6-6" />
    //         </svg>
    //       </button>
    //       <button
    //         onClick={nextSlide}
    //         className="text-vintageText hover:bg-vintageBg hover:drop-shadow-[0_0_8px_rgba(0,150,255,0.1)] transition-shadow text-2xl border rounded-full border-vintageBorder hidden md:flex justify-center items-center"
    //         aria-label="Next"
    //       >
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           width="24"
    //           height="24"
    //           viewBox="0 0 24 24"
    //           fill="none"
    //           stroke="currentColor"
    //           strokeWidth="2"
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           className="lucide lucide-chevron-right-icon lucide-chevron-right"
    //         >
    //           <path d="m9 18 6-6-6-6" />
    //         </svg>
    //       </button>
    //     </div>
    //   </div>

    //   <div className="relative">
    //     <div className="lg:hidden flex gap-4 overflow-x-auto no-scrollbar px-1">
    //       {currentProducts?.map((product: ProductMetaDTO) => (
    //         <div key={product.product.item} className="flex-shrink-0 w-32">
    //           <ProductCard
    //             product={{
    //               product: product.product,
    //               imagePath: product.imagePath,
    //               promotions: product.promotions,
    //               productgarmenttype: product.productgarmenttype,
    //             }}
    //           />
    //         </div>
    //       ))}
    //     </div>

    //     <div className="hidden lg:flex gap-4 overflow-x-auto no-scrollbar px-1">
    //       {currentProducts?.map((product: ProductMetaDTO) => (
    //         <div
    //           key={product.product.item}
    //           className="flex-shrink-0 w-48"
    //           // className="flex-shrink-0 w-64"
    //         >
    //           <div className="h-full">
    //             <ProductCard
    //               product={{
    //                 product: product.product,
    //                 imagePath: product.imagePath,
    //                 promotions: product.promotions,
    //                 productgarmenttype: product.productgarmenttype,
    //               }}
    //             />
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>

    

    <div className="font-gilroyRegular leading-wider bg-vintageBg py-3 md:py-12 px-6 lg:px-56 relative overflow-hidden">
      <div className="flex flex-col">
        {totalProducts > 0 && (
          <div
            data-aos="fade-down"
            className="hidden md:flex justify-between items-center mb-6 bg-opacity-70 px-4 py-2 rounded-lg shadow-sm"
          >
            <span className="text-base text-vintageText">
              Showing <strong>{(activePage - 1) * pageSize + 1}</strong> -{" "}
              <strong>
                {Math.min(activePage * pageSize, totalProducts)}
              </strong>{" "}
              of <strong>{totalProducts}</strong> results for{" "}
              <strong className="capitalize">Books</strong>
            </span>
            <SortDropdown
              selectedSort={sort}
              onSortChange={(value) => dispatch(change(value))}
            />
          </div>
        )}

        {isLoading ? (
          <div className="w-full h-96 flex justify-center items-center">
            <CircleLoader />
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="text-center py-8 text-vintageText">
            No Products Available
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.product.id} product={product} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => activePage > 1 && paginate(activePage - 1)}
                disabled={activePage === 1}
                className="px-3 py-2 border border-vintageText border-opacity-50 rounded-md text-vintageText hover:bg-vintageText hover:text-white disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-2 border rounded-md ${
                    activePage === i + 1
                      ? "border-vintageText bg-vintageText text-white"
                      : "border-vintageText border-opacity-50 text-vintageText hover:bg-vintageText hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  activePage < totalPages && paginate(activePage + 1)
                }
                disabled={activePage === totalPages}
                className="px-3 py-2 border border-vintageText border-opacity-50 rounded-md text-vintageText hover:bg-vintageText hover:text-white disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
