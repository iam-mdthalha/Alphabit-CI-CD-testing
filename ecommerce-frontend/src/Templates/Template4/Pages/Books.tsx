import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
    useGetListOfProductsWithFilterbygroupQuery,
    useGetNewArrivalsQuery,
} from "Services/ProductApiSlice";
import { change } from "State/SortSlice/SortSlice";
import type { AppDispatch, RootState } from "State/store";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import FilterSidebar from "Templates/Template4/Components/Common/FilterSidebar";
import ProductCard from "Templates/Template4/Components/Common/ProductCard";
import SortDropdown from "Templates/Template4/Components/Common/SortDropdown";
import { handleSort } from "Utilities/SortHandler";

const Books: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [filterCategories, setFilterCategories] = useState<Record<string, string>>({});
  const dispatch: AppDispatch = useDispatch();
  const { value: sort } = useSelector((state: RootState) => state.sort);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState(1);
  const pageSize = 12;

  const hasOnlyPriceFilter =
    selectedFilters.price?.length! > 0 &&
    Object.keys(selectedFilters).every(
      (key) => key === "price" || (selectedFilters[key]?.length || 0) === 0
    );

  const { data: newCollectionProducts, isLoading: newCollectionLoading } =
    useGetNewArrivalsQuery(
      {
        pageSize,
        activePage,
      },
      { skip: Object.values(selectedFilters).some((arr) => arr.length > 0) }
    );

  const filterParams = {
    mode: "CRITERIA",
    page: activePage,
    productsCount: pageSize,
    ...filterCategories,
  };

  const { data: filteredProducts, isLoading: filteredLoading } =
    useGetListOfProductsWithFilterbygroupQuery(filterParams, {
      skip:
        Object.values(selectedFilters).every((arr) => arr.length === 0) ||
        hasOnlyPriceFilter,
    });

  const currentProducts = useMemo(() => {
    if (
      Object.values(selectedFilters).some((arr) => arr.length > 0) &&
      filteredProducts?.products
    ) {
      return handleSort(filteredProducts.products, sort);
    }

    if (!newCollectionProducts?.products) return [];

    let filtered = [...newCollectionProducts.products];

    if (filterCategories.fromprice && filterCategories.Toprice) {
      const minPrice = parseFloat(filterCategories.fromprice);
      const maxPrice = parseFloat(filterCategories.Toprice);
      filtered = filtered.filter(
        (p) =>
          p.product.ecomUnitPrice >= minPrice &&
          p.product.ecomUnitPrice <= maxPrice
      );
    }

    return handleSort(filtered, sort);
  }, [
    newCollectionProducts,
    filteredProducts,
    filterCategories,
    sort,
    selectedFilters,
  ]);

  const isLoading =
    Object.values(selectedFilters).some((arr) => arr.length > 0)
      ? filteredLoading
      : newCollectionLoading;

  const totalProducts = Object.values(selectedFilters).some((arr) => arr.length > 0)
    ? hasOnlyPriceFilter
      ? currentProducts.length
      : filteredProducts?.totalProducts || 0
    : newCollectionProducts?.totalProducts || 0;

  const paginate = (pageNumber: number) => {
    setSearchParams({ page: pageNumber.toString() });
    setActivePage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categorizeFilter = (filter: string, category: string) => {
    setFilterCategories((prev) => ({
      ...prev,
      [category]: filter,
    }));
  };

  const handleFilterChange = (
    filter: string,
    category: string,
    checked: boolean
  ) => {
    if (category === "price") {
      const priceMatch = filter.match(/Rs\. (\d+) - Rs\. (\d+)/);
      if (priceMatch) {
        const [, minPrice, maxPrice] = priceMatch;
        setFilterCategories((prev) => ({
          ...prev,
          fromprice: minPrice,
          Toprice: maxPrice,
        }));
        setSelectedFilters((prev) => {
          const currentPriceFilters = prev.price || [];
          const newFilters = checked
            ? [...currentPriceFilters, filter]
            : currentPriceFilters.filter((f) => f !== filter);
          return { ...prev, price: newFilters };
        });
      }
      return;
    }

    setSelectedFilters((prev) => {
      const currentCategoryFilters = prev[category] || [];
      const newCategoryFilters = checked
        ? [...currentCategoryFilters, filter]
        : currentCategoryFilters.filter((f) => f !== filter);
      return { ...prev, [category]: newCategoryFilters };
    });

    categorizeFilter(filter, category);
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Rs.")) {
      const newFilters = { ...filterCategories };
      delete newFilters.fromprice;
      delete newFilters.Toprice;
      setFilterCategories(newFilters);
      setSelectedFilters((prev) => ({ ...prev, price: [] }));
      return;
    }

    const categoryToRemove = Object.entries(filterCategories).find(
      ([, value]) => value === filter
    )?.[0];

    if (categoryToRemove) {
      const newFilters = { ...filterCategories };
      delete newFilters[categoryToRemove];
      setFilterCategories(newFilters);

      setSelectedFilters((prev) => {
        const prevCategoryFilters = prev[categoryToRemove] || [];
        return {
          ...prev,
          [categoryToRemove]: prevCategoryFilters.filter((f) => f !== filter),
        };
      });
    }
  };

  useEffect(() => {
    setActivePage(1);
  }, [selectedFilters]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="min-h-screen bg-vintageBg font-gilroyRegular tracking-wider">
      <div className="py-3 md:py-12 px-6 lg:px-24">
        <div className="md:hidden flex justify-between items-center mb-6 p-4 rounded-lg ">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 text-vintageText font-semibold"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h18M3 12h18M3 20h18"
              />
            </svg>
            Filters
          </button>
          <SortDropdown
            selectedSort={sort}
            onSortChange={(value) => dispatch(change(value))}
          />
        </div>

        {Object.values(selectedFilters).some((arr) => arr.length > 0) && (
          <div className="mb-6 bg-vintageBg bg-opacity-50 p-4 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-2">
              {Object.entries(selectedFilters).flatMap(([category, filters]) =>
                filters.map((filter) => (
                  <span
                    key={`${category}-${filter}`}
                    className="bg-vintageText bg-opacity-70 text-light px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {filter}
                    <button
                      onClick={() => removeFilter(filter)}
                      className="text-xs bg-light text-vintageText rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </span>
                ))
              )}

              <button
                onClick={() => {
                  setSelectedFilters({});
                  setFilterCategories({});
                }}
                className="text-sm text-vintageText ml-2"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          <div className="hidden md:block w-1/4 sticky top-20 self-start">
           <FilterSidebar
  selectedFilters={selectedFilters}
  onFilterChange={handleFilterChange}
  pageType="Category"
/>

          </div>

          <div className="flex-1">
            {totalProducts > 0 && (
              <div
                data-aos="fade-down"
                className="hidden md:flex justify-between items-center mb-6  bg-opacity-70 px-4 py-2 rounded-lg shadow-sm"
              >
                <span className="text-base text-vintageText">
                  Showing <strong>{(activePage - 1) * pageSize + 1}</strong> –{" "}
                  <strong>{Math.min(activePage * pageSize, totalProducts)}</strong>{" "}
                  of <strong>{totalProducts}</strong> results for{" "}
                  <strong
                    className="capitalize "
                    style={{ fontFamily: "'Melodrama', cursive" }}
                  >
                    Books
                  </strong>
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
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.product.id}
                    product={product}
                  />
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
                    onClick={() => activePage < totalPages && paginate(activePage + 1)}
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

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-vintageBg overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg sm:text-xl font-cardoBold text-vintageText">
                    Filters
                  </h2>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-vintageText text-xl p-1"
                  >
                    ✕
                  </button>
                </div>
               <FilterSidebar
  selectedFilters={selectedFilters}
  onFilterChange={handleFilterChange}
  pageType="Category"
/>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setSelectedFilters({});
                      setFilterCategories({});
                    }}
                    className="flex-1 bg-gray-200 text-vintageText py-3 rounded-md font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="flex-1 bg-vintageText text-white py-3 rounded-md font-medium"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
