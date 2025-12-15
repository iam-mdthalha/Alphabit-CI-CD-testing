import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import {
  useGetListOfProductsWithFilterbygroupQuery,
  useGetListOfProductsbygroupQuery,
} from "Services/ProductApiSlice";
import { change } from "State/SortSlice/SortSlice";
import type { AppDispatch, RootState } from "State/store";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import FilterSidebar from "Templates/Template2/Components/Products/FilterSidebar";
import ProductCard from "Templates/Template2/Components/Products/ProductCard";
import SortDropdown from "Templates/Template2/Components/Products/SortDropdown";
import { handleSort } from "Utilities/SortHandler";

const ShopCategoryView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filterCategories, setFilterCategories] = useState<
    Record<string, string>
  >({});
  const dispatch: AppDispatch = useDispatch();
  const { value: sort } = useSelector((state: RootState) => state.sort);
  const [activePage, setActivePage] = useState(1);
  const pageSize = 12;

  const { data: products, isLoading: productsLoading } =
    useGetListOfProductsbygroupQuery(
      {
        category: category ? category : undefined,
        page: activePage,
        productsCount: pageSize,
        mode: "CRITERIA",
      },
      {
        skip: selectedFilters.length > 0,
      }
    );

  const filterParams = {
    mode: "CRITERIA",
    page: activePage,
    productsCount: pageSize,
    category: category ? category : undefined,
    ...filterCategories,
  };

  const { data: filteredProducts, isLoading: filteredLoading } =
    useGetListOfProductsWithFilterbygroupQuery(filterParams, {
      skip: selectedFilters.length === 0,
    });

  const currentProducts =
    selectedFilters.length > 0
      ? filteredProducts
        ? handleSort(filteredProducts.products, sort)
        : []
      : products
      ? handleSort(products.products, sort)
      : [];

  const isLoading =
    selectedFilters.length > 0 ? filteredLoading : productsLoading;
  const totalProducts =
    selectedFilters.length > 0
      ? filteredProducts?.totalProducts || 0
      : products?.totalProducts || 0;

  const paginate = (pageNumber: number) => {
    setSearchParams({ page: pageNumber.toString() });
    setActivePage(pageNumber);
  };

  const categorizeFilter = (filter: string, category: string) => {
    setFilterCategories((prev) => ({
      ...prev,
      [category]: filter,
    }));
  };

  const handleFilterChange = (filter: string, category: string) => {
    if (category === "Price") {
      const priceMatch = filter.match(/Rs\. (\d+) - Rs\. (\d+)/);
      if (priceMatch) {
        const [_, minPrice, maxPrice] = priceMatch;

        setFilterCategories((prev) => ({
          ...prev,
          fromprice: minPrice,
          Toprice: maxPrice,
        }));

        setSelectedFilters((prev) => {
          const newFilters = prev.filter((f) => !f.startsWith("Rs."));
          return [...newFilters, filter];
        });
      }
      return;
    }

    const existingFilterFromCategory = Object.entries(filterCategories).find(
      ([cat, _]) => cat === category
    );

    if (
      existingFilterFromCategory &&
      existingFilterFromCategory[1] === filter
    ) {
      setSelectedFilters((prev) => prev.filter((f) => f !== filter));

      const newFilterCategories = { ...filterCategories };
      delete newFilterCategories[category];
      setFilterCategories(newFilterCategories);
    } else if (existingFilterFromCategory) {
      setSelectedFilters((prev) => [
        ...prev.filter((f) => f !== existingFilterFromCategory[1]),
        filter,
      ]);
      setFilterCategories((prev) => ({
        ...prev,
        [category]: filter,
      }));
    } else {
      setSelectedFilters((prev) => [...prev, filter]);
      categorizeFilter(filter, category);
    }
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== filter));

    const categoryToRemove = Object.entries(filterCategories).find(
      ([_, value]) => value === filter
    )?.[0];

    if (filter.startsWith("Rs.")) {
      const newFilterCategories = { ...filterCategories };
      delete newFilterCategories.fromprice;
      delete newFilterCategories.Toprice;
      setFilterCategories(newFilterCategories);
      return;
    }

    if (categoryToRemove) {
      const newFilterCategories = { ...filterCategories };
      delete newFilterCategories[categoryToRemove];
      setFilterCategories(newFilterCategories);
    }
  };

  const totalPages = Math.ceil(totalProducts / 10);

  return (
    <div className="min-h-screen font-montserrat tracking-widest container w-full mx-auto px-4 py-8 bg-gray-50">
      <div className="flex justify-end items-center mb-4 md:hidden">
        <SortDropdown
          value={sort}
          onChange={(value) => dispatch(change(value))}
        />
        <button
          className="ml-4 px-4 py-2 bg-gray-200 rounded"
          onClick={() => setIsSidebarOpen(true)}
        >
          FILTER
        </button>
      </div>

      <div className="hidden md:flex justify-end mb-4">
        <SortDropdown
          value={sort}
          onChange={(value) => dispatch(change(value))}
        />
      </div>

      <div className="md:flex relative">
        <div className="hidden md:block md:w-1/4 lg:w-1/5 pr-4 pt-2 sticky top-20 h-[80vh] overflow-y-auto hide-scrollbar">
          <FilterSidebar
            onFilterChange={handleFilterChange}
            selectedFilters={selectedFilters}
          />
        </div>

        <div className="md:w-3/4 lg:w-4/5">
          {selectedFilters.some(Boolean) && (
            <div className="sticky top-0 bg-gray-50 z-10 py-4 mb-4">
              <div className="flex flex-wrap justify-center gap-2">
                {selectedFilters.map((filter) => (
                  <div
                    key={filter}
                    className="bg-black text-white px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {filter}
                    <button
                      onClick={() => removeFilter(filter)}
                      className="ml-2 bg-white text-xs text-black rounded-full w-4 h-4 flex justify-center items-center"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="w-full h-screen justify-center items-center"><CircleLoader /></div>
          ) : currentProducts.length === 0 ? (
            <div className="text-center py-8">No Products Available</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentProducts.map((product) => (
                <ProductCard key={product.product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  paginate(i + 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`mx-1 px-3 py-1 border ${
                  activePage === i + 1 ? "bg-gray-200" : "bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-4/5 bg-white">
            <FilterSidebar
              onClose={() => setIsSidebarOpen(false)}
              onFilterChange={handleFilterChange}
              selectedFilters={selectedFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopCategoryView;
