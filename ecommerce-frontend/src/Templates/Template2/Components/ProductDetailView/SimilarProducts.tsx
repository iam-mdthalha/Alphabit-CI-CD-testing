import { useMediaQuery } from "@mantine/hooks";
import { ResponsiveSize } from "Constants/ResponsiveSize";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetRelatedProductsbygroupQuery } from "Services/ProductApiSlice";
import { AppDispatch } from "State/store";
import ProductCard from "Templates/Template2/Components/Products/ProductCard";
import { ProductGarmentTypeDTO } from "Types/Admin/AdminProductType";
import { ProductDTO } from "Types/ProductDTO";
import { Promotion } from "Types/ProductMetaDTO";

type Props = {
  productRef: {
    product: ProductDTO;
    imagePath: string;
    promotions: Array<Promotion>;
    productgarmenttype?: Array<ProductGarmentTypeDTO>;
  };
};

// const similarProducts = [
//   {
//     id: 2,
//     name: "rewa blue with white printed amsler linen cotton shirt",
//     price: 2190.0,
//     image: "/template2/SectionHome/best_seller_shirt2.webp",
//     image_zoom: "/template2/SectionHome/best_seller_shirt_zoom2.jpg",
//     tags: ["selling fast"],
//   },
//   {
//     id: 3,
//     name: "opsin blue with white printed amsler linen cotton shirt",
//     price: 2190.0,
//     image: "/template2/SectionHome/best_seller_shirt3.webp",
//     image_zoom: "/template2/SectionHome/best_seller_shirt_zoom3.webp",
//     tags: ["new arrival", "selling fast"],
//   },
//   {
//     id: 4,
//     name: "rewa green with white printed amsler linen cotton shirt",
//     price: 2190.0,
//     image: "/template2/SectionHome/best_seller_shirt4.webp",
//     image_zoom: "/template2/SectionHome/best_seller_shirt_zoom4.webp",
//     tags: [],
//   },
//   {
//     id: 5,
//     name: "opsin green with white printed amsler linen cotton shirt",
//     price: 2190.0,
//     image: "/template2/SectionHome/best_seller_shirt5.jpg",
//     image_zoom: "/template2/SectionHome/best_seller_shirt_zoom5.webp",
//     tags: ["new arrival"],
//   },
// ];

const SimilarProducts = ({ productRef }: Props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [hoveredShirt, setHoveredShirt] = useState<number | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const isMobile = useMediaQuery(`(max-width: ${ResponsiveSize.mobile})`);
  // const {data: relatedProducts, loading: relatedProductsLoading, error: relatedProductsError} = useSelector((state: RootState) => state.relatedproduct);
  const { data: relatedProducts, isLoading: relatedProductsLoading } =
    useGetRelatedProductsbygroupQuery({
      productId: decodeURIComponent(productRef.product.item),
      category: productRef.product.category,
      brand: productRef.product.brand,
      department: "",
      subCategory: productRef.product.subCategory,
    });

  useEffect(() => {
    // dispatch(fetchRelatedProducts({
    //     productId: productRef.product.item,
    //     category: productRef.product.category,
    //     subCategory: productRef.product.subcategory,
    //     brand: productRef.product.brand,
    //     dept: null}));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setItemsPerPage(4);
      else if (width >= 1024) setItemsPerPage(3);
      else if (width >= 768) setItemsPerPage(2);
      else setItemsPerPage(2);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const totalPages = Math.ceil(similarProducts.length / itemsPerPage);

  const totalPages = relatedProducts?.products
    ? Math.ceil(relatedProducts.products.length / itemsPerPage)
    : 0;

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // const visibleItems = similarProducts.slice(
  //   currentPage * itemsPerPage,
  //   (currentPage + 1) * itemsPerPage
  // );

  // const getTagBgColor = (tag: string) => {
  //   switch (tag) {
  //     case "new arrival":
  //       return "#00008B";
  //     case "selling fast":
  //       return "#20b2aa";
  //     default:
  //       return "#000000";
  //   }
  // };

  const relatedItems = relatedProducts?.products ?? [];

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold uppercase mb-8 text-center">
        Similar Products
      </h2>

      {relatedProductsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 p-4 rounded-lg h-full"
            >
              <div className="aspect-square bg-gray-200 rounded-md mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-md w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded-md w-1/3"></div>
            </div>
          ))}
        </div>
      ) : relatedItems.length === 0 ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-gray-500 text-lg">No similar products found.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out">
              {relatedItems
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((product, i) => (
                  <div
                    key={i}
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
                    <ProductCard product={product} />
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
              className="lucide lucide-chevron-left w-6 h-6"
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
              className="lucide lucide-chevron-right w-6 h-6"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default SimilarProducts;
