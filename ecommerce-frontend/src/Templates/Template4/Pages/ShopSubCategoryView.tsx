import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useLocation, useParams } from "react-router-dom";
import {
  useGetListOfBookProductsQuery,
  useGetListOfBookProductsWithFilterQuery,
} from "Services/ProductApiSlice";
import { useGetAdminSubClassesQuery } from "Services/Admin/SubClassApiSlice";
import { change } from "State/SortSlice/SortSlice";
import type { AppDispatch, RootState } from "State/store";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import ProductCard from "Templates/Template4/Components/Common/ProductCard";
import FilterSidebar from "Templates/Template4/Components/Common/FilterSidebar";
import SortDropdown from "Templates/Template4/Components/Common/SortDropdown";
import { handleSort } from "Utilities/SortHandler";
import { BookOpen, User, Percent, TrendingUp, Sparkles } from "lucide-react";

interface ProductResponse {
  results?: {
    products: any[];
    totalProducts: number;
  };
  products?: any[];
  totalProducts?: number;
}

const parsePriceRange = (
  priceRange: string
): { fromprice: number; Toprice: number } | null => {
  const match = priceRange.match(/Rs\. (\d+) - Rs\. (\d+)/);
  if (match) {
    const [, minPrice, maxPrice] = match;
    return { fromprice: parseFloat(minPrice), Toprice: parseFloat(maxPrice) };
  }

  if (priceRange.includes("above")) {
    const minPriceMatch = priceRange.match(/Rs\. (\d+) above/);
    if (minPriceMatch) {
      const minPrice = parseFloat(minPriceMatch[1]);
      return { fromprice: minPrice, Toprice: 1000000 };
    }
  }

  return null;
};

const ShopSubCategoryView: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const location = useLocation();
  const { category, subcategory, author } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const { value: sort } = useSelector((state: RootState) => state.sort);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState(1);
  const pageSize = 12;

  const selectedFiltersArray = useMemo(() => {
    const filters: string[] = [];
    Object.entries(selectedFilters).forEach(([category, values]) => {
      filters.push(...values);
    });
    return filters;
  }, [selectedFilters]);

  const hasFilters = selectedFiltersArray.length > 0;
  const hasNonPriceFilters = Object.entries(selectedFilters).some(
    ([key, sel]) => key !== "price" && sel.length > 0
  );

  const { data: subClassesData } = useGetAdminSubClassesQuery();

  const getResultsInfo = () => {
    const getSubClassName = (code: string) => {
      if (!subClassesData?.results) return code;
      const subClass = subClassesData.results.find(
        (sub) => sub.subClassCode === code
      );
      return subClass?.subClassName || code;
    };

    if (author) {
      return {
        label: `Author: ${author.replace("-", " ")}`,
        category: author,
        subClass: "",
        icon: <User className="w-5 h-5 text-vintageText" />,
      };
    }
    if (category && subcategory) {
      const subClassName = getSubClassName(subcategory);
      return {
        label: `${subClassName} (${category.replace(/-/g, " ")})`,
        category: category,
        subClass: subcategory,
        icon: <BookOpen className="w-5 h-5 text-vintageText" />,
      };
    }
    if (category) {
      return {
        label: category,
        category: category,
        subClass: "",
        icon: <BookOpen className="w-5 h-5 text-vintageText" />,
      };
    }
    if (location.pathname.includes("/offers")) {
      return {
        label: "Offers",
        category: "",
        subClass: "",
        icon: <Percent className="w-5 h-5 text-vintageText" />,
      };
    }
    if (location.pathname.includes("/top-sellers")) {
      return {
        label: "Top Sellers",
        category: "",
        subClass: "",
        icon: <TrendingUp className="w-5 h-5 text-vintageText" />,
      };
    }
    return {
      label: "Book Products",
      category: "",
      subClass: "",
      icon: <Sparkles className="w-5 h-5 text-vintageText" />,
    };
  };

  const {
    label: resultsLabel,
    category: categoryParam,
    subClass: subClassParam,
  } = getResultsInfo();

  const filterParams = useMemo(() => {
    const params: any = {
      mode: "CRITERIA",
      page: activePage,
      productsCount: pageSize,
    };

    if (categoryParam) {
      params.category = categoryParam;
    }
    if (subClassParam) {
      params.subClass = subClassParam;
    }

    Object.entries(selectedFilters).forEach(([key, selected]) => {
      if (selected.length > 0 && key !== "price") {
        const apiParamMap: Record<string, string> = {
          category: "category",
          subCategory: "subClass",
          author: "author",
          language: "language",
          academic: "academic",
          merchandise: "merchandise",
        };

        const apiParam = apiParamMap[key] || key;
        params[apiParam] = selected.join(",");
      }
    });

    if (selectedFilters.price && selectedFilters.price.length > 0) {
      const priceRanges = selectedFilters.price
        .map(parsePriceRange)
        .filter(Boolean);

      if (priceRanges.length > 0) {
        const firstRange = priceRanges[0];
        if (firstRange) {
          params.fromprice = firstRange.fromprice;
          params.Toprice = firstRange.Toprice;
        }
      }
    }

    return params;
  }, [selectedFilters, activePage, pageSize, categoryParam, subClassParam]);

  const { data: bookProducts, isLoading: bookProductsLoading } =
    useGetListOfBookProductsQuery(
      {
        mode: "CRITERIA",
        page: activePage,
        productsCount: pageSize,
        category: categoryParam || undefined,
        subClass: subClassParam || undefined,
      },
      { skip: hasFilters }
    );

  const { data: filteredProducts, isLoading: filteredLoading } =
    useGetListOfBookProductsWithFilterQuery(filterParams, {
      skip: !hasFilters,
    });

  const bookProductsResponse = bookProducts as ProductResponse;
  const filteredResponse = filteredProducts as ProductResponse;

  const bookProductsData =
    bookProductsResponse?.results?.products ||
    bookProductsResponse?.products ||
    [];
  const bookTotalProducts =
    bookProductsResponse?.results?.totalProducts ||
    bookProductsResponse?.totalProducts ||
    0;

  const filteredProductsData =
    filteredResponse?.results?.products || filteredResponse?.products || [];
  const filteredTotalProducts =
    filteredResponse?.results?.totalProducts ||
    filteredResponse?.totalProducts ||
    0;

  const currentProducts = useMemo(() => {
    if (hasFilters && filteredProductsData.length > 0) {
      let products = [...filteredProductsData];

      if (selectedFilters.price && selectedFilters.price.length > 1) {
        const priceRanges = selectedFilters.price
          .map(parsePriceRange)
          .filter(Boolean);

        products = products.filter((product) => {
          return priceRanges.some((range: any) => {
            const price = product.product.ecomUnitPrice;
            return price >= range.fromprice && price <= range.Toprice;
          });
        });
      }

      return handleSort(products, sort);
    }

    if (bookProductsData.length > 0 && !hasFilters) {
      return handleSort(bookProductsData, sort);
    }

    if (bookProductsData.length > 0 && hasFilters && !hasNonPriceFilters) {
      let filtered = [...bookProductsData];

      if (selectedFilters.price && selectedFilters.price.length > 0) {
        const priceRanges = selectedFilters.price
          .map(parsePriceRange)
          .filter(Boolean);

        filtered = filtered.filter((product) => {
          const price = product.product.ecomUnitPrice;
          return priceRanges.some(
            (range: any) => price >= range.fromprice && price <= range.Toprice
          );
        });
      }

      return handleSort(filtered, sort);
    }

    return [];
  }, [
    bookProductsData,
    filteredProductsData,
    selectedFilters,
    sort,
    hasFilters,
    hasNonPriceFilters,
  ]);

  const isLoading = !hasFilters ? bookProductsLoading : filteredLoading;

  const totalProducts = useMemo(() => {
    if (!hasFilters) {
      return bookTotalProducts;
    }

    if (hasNonPriceFilters) {
      return filteredTotalProducts;
    }

    return currentProducts.length;
  }, [
    bookTotalProducts,
    filteredTotalProducts,
    currentProducts.length,
    hasFilters,
    hasNonPriceFilters,
  ]);

  const paginate = (pageNumber: number) => {
    setSearchParams({ page: pageNumber.toString() });
    setActivePage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (
    filter: string,
    category: string,
    checked: boolean
  ) => {
    setSelectedFilters((prev: any) => {
      const prevCategoryFilters = prev[category] || [];
      let updatedCategoryFilters = [];
      if (checked) {
        updatedCategoryFilters = [...prevCategoryFilters, filter];
      } else {
        updatedCategoryFilters = prevCategoryFilters.filter(
          (f: any) => f !== filter
        );
      }
      return {
        ...prev,
        [category]: updatedCategoryFilters,
      };
    });
    setActivePage(1);
  };

  const removeFilter = (filter: string) => {
    const categoryToRemove = Object.entries(selectedFilters).find(
      ([category, filters]) => filters.includes(filter)
    )?.[0];

    if (categoryToRemove) {
      setSelectedFilters((prev) => {
        const prevCategoryFilters = prev[categoryToRemove] || [];
        const newCategoryFilters = prevCategoryFilters.filter(
          (f) => f !== filter
        );

        if (newCategoryFilters.length === 0) {
          const newFilters = { ...prev };
          delete newFilters[categoryToRemove];
          return newFilters;
        }

        return {
          ...prev,
          [categoryToRemove]: newCategoryFilters,
        };
      });
    }
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  useEffect(() => {
    setActivePage(1);
  }, [selectedFiltersArray]);

  useEffect(() => {
    dispatch(change("price-asc"));
  }, [dispatch]);

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page > 0) {
        setActivePage(page);
      }
    }
  }, [searchParams]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  const getPageType = () => {
    if (author) return "Author";
    if (category && subcategory) return "subCategory";
    if (category) return "Category";
    if (location.pathname.includes("/offers")) return "Offers";
    if (location.pathname.includes("/top-sellers")) return "TopSellers";
    return "BookProducts";
  };

  const pageType = getPageType();

  return (
    <div className="min-h-screen bg-vintageBg font-gilroyRegular tracking-wider">
      <div className="py-3 md:py-12 px-6 lg:px-24 flex gap-8">
        <aside className="hidden md:block w-1/4 sticky top-20 self-start">
          <FilterSidebar
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            pageType={pageType}
          />
        </aside>

        <main className="flex-1">
          {selectedFiltersArray.length > 0 && (
            <div className="mb-6 bg-vintageBg bg-opacity-50 rounded-lg shadow-sm p-3">
              <div className="flex flex-wrap gap-2 overflow-x-auto">
                {selectedFiltersArray.map((filter) => (
                  <span
                    key={filter}
                    className="bg-vintageText bg-opacity-70 text-light py-1 px-3 rounded-full text-sm flex items-center gap-2"
                  >
                    {filter}
                    <button
                      onClick={() => removeFilter(filter)}
                      className="text-xs bg-light text-vintageText rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-vintageText font-gilroyRegular font-bold ml-2"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {totalProducts > 0 && (
            <div
              data-aos="fade-down"
              className="hidden md:flex justify-between items-center mb-6 bg-opacity-70 px-4 py-2 rounded-lg shadow-sm"
            >
              <span className="text-base text-vintageText">
                Showing <strong>{(activePage - 1) * pageSize + 1}</strong> –{" "}
                <strong>
                  {Math.min(activePage * pageSize, totalProducts)}
                </strong>{" "}
                of <strong>{totalProducts}</strong> results for{" "}
                <strong className="capitalize">{resultsLabel}</strong>
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
                <ProductCard key={product.product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-2">
                <button
                  disabled={activePage === 1}
                  onClick={() => paginate(activePage - 1)}
                  className="px-3 py-2 border rounded-md text-vintageText border-opacity-50 hover:bg-vintageText hover:text-white disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => paginate(idx + 1)}
                    className={`px-3 py-2 border rounded-md ${
                      activePage === idx + 1
                        ? "bg-vintageText text-white"
                        : "border-vintageText border-opacity-50 text-vintageText hover:bg-vintageText hover:text-white"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  disabled={activePage === totalPages}
                  onClick={() => paginate(activePage + 1)}
                  className="px-3 py-2 border rounded-md text-vintageText border-opacity-50 hover:bg-vintageText hover:text-white disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopSubCategoryView;
