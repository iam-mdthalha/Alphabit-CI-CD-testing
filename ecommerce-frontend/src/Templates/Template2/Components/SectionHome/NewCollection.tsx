import CustomDarkButton from "Components/StyleComponent/CustomDarkButton";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetNewArrivalsQuery } from "Services/ProductApiSlice";
import ProductCard from "Templates/Template2/Components/Products/ProductCard";

const NewCollectionView = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { data: newArrivalProducts, isLoading } = useGetNewArrivalsQuery({
    pageSize: 20,
    activePage: 1,
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

  const totalPages = newArrivalProducts
    ? Math.ceil(newArrivalProducts.products.length / itemsPerPage)
    : 0;

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleItems = newArrivalProducts
    ? newArrivalProducts.products.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    : [];

  const SkeletonProductCard = () => (
    <div className="animate-pulse bg-gray-100 p-4 rounded-lg h-full">
      <div className="aspect-square bg-gray-200 rounded-md mb-4"></div>
      <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
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
    (!newArrivalProducts?.products || newArrivalProducts.products.length === 0)
  ) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          No new arrivals available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold uppercase mb-8 text-center">
        New Collection
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
        <Link to={`/new-collections`} onClick={() => window.scrollTo(0, 0)}>
          <CustomDarkButton>View all new collections</CustomDarkButton>
        </Link>
      </div>
    </div>
  );
};

export default NewCollectionView;
