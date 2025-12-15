import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomDarkButton from "../../../../Components/StyleComponent/CustomDarkButton";
import ProductCard from "Templates/Template2/Components/Products/ProductCard";
import { useGetTopSellingbygroupQuery } from "Services/ProductApiSlice";

const TopSellers = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { data: topSellingProducts, isLoading } = useGetTopSellingbygroupQuery({
    page: 1,
    productsCount: 20,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setItemsPerPage(4);
      else if (width >= 1024) setItemsPerPage(3);
      else if (width >= 768) setItemsPerPage(2);
      else setItemsPerPage(2);
      // else setItemsPerPage(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = topSellingProducts
    ? Math.ceil(topSellingProducts.products.length / itemsPerPage)
    : 0;

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleItems = topSellingProducts
    ? topSellingProducts.products.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    : [];

  const SkeletonProductCard = () => (
    <div className="animate-pulse bg-gray-200 p-4 rounded-lg">
      <div className="h-40 bg-gray-300 rounded-md mb-4"></div>
      <div className="h-4 bg-gray-400 rounded-md w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-400 rounded-md w-1/2"></div>
    </div>
  );

  if (isLoading) {
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      </>
    );
  }

  if (
    !isLoading &&
    (!topSellingProducts?.products || topSellingProducts.products.length === 0)
  ) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          No top sellers available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold uppercase mb-8 text-center">
        Top Sellers
      </h2>
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out">
            {visibleItems.map((product) => (
              <div
                key={product.product.id}
                className={`flex-shrink-0 px-4 ${
                  itemsPerPage === 1
                    ? ""
                    : itemsPerPage === 2
                    ? "w-1/2"
                    : itemsPerPage === 3
                    ? "w-1/2 lg:w-1/3"
                    : "w-1/2 lg:w-1/3 xl:w-1/4"
                }`}
              >
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <SkeletonProductCard key={i} />
                    ))}
                  </div>
                ) : (
                  <ProductCard product={product} />
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
          onClick={handlePrevPage}
          aria-label="Previous page"
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
            className="lucide lucide-chevron-left-icon lucide-chevron-left w-6 h-6"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
          onClick={handleNextPage}
          aria-label="Next page"
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
            className="lucide lucide-chevron-right-icon lucide-chevron-right w-6 h-6"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className="text-center mt-20">
        <Link to={`/top-sellers?page=1`} onClick={() => window.scrollTo(0, 0)}>
          <CustomDarkButton>View all Top Sellers</CustomDarkButton>
        </Link>
      </div>
    </div>
  );
};

export default TopSellers;
