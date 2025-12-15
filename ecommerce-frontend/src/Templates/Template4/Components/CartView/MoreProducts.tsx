import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetListOfBookProductsWithFilterQuery } from "Services/ProductApiSlice";
import { change } from "State/SortSlice/SortSlice";
import { AppDispatch, RootState } from "State/store";
import ProductCard from "Templates/Template4/Components/Common/ProductCard";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { handleSort } from "Utilities/SortHandler";
import SortDropdown from "../Common/SortDropdown";

const MoreProducts = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const { data: productData, isLoading } =
    useGetListOfBookProductsWithFilterQuery({
      mode: "CRITERIA",
      page: 1,
      productsCount: 12,
    });

  const { value: sort } = useSelector((state: RootState) => state.sort);
  const dispatch: AppDispatch = useDispatch();
  const [currentProducts, setCurrentProducts] = useState<ProductMetaDTO[]>([]);

  useEffect(() => {
    const products = productData?.results.products ?? [];
    if (products.length > 0) {
      setCurrentProducts(handleSort([...products], sort));
    }
  }, [sort, productData]);

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
              You May Also Like
            </span>
          </span>
        </h2>

        <div className="flex items-center gap-4" data-aos="fade-left">
          <SortDropdown
            selectedSort={sort}
            onSortChange={(value) => dispatch(change(value))}
          />
          <Link
            to="/books-listing"
            onClick={() => window.scrollTo(0, 0)}
            className="bg-vintageText border-vintageBg rounded-xl font-medium text-white border px-4 py-1"
          >
            See all
          </Link>
        </div>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading books ...</p>
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No other books found</p>
          </div>
        ) : (
          <>
            <div className="lg:hidden flex gap-4 overflow-x-auto no-scrollbar px-1">
              {currentProducts.map((product: ProductMetaDTO) => (
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
              {currentProducts.map((product: ProductMetaDTO) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default MoreProducts;
