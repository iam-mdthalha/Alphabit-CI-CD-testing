import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetAdminSubClassesQuery } from "Services/Admin/SubClassApiSlice";
import { useGetListOfBookProductsWithFilterQuery } from "Services/ProductApiSlice";

import { change } from "State/SortSlice/SortSlice";
import type { AppDispatch, RootState } from "State/store";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import FilterSidebar from "Templates/Template4/Components/Common/FilterSidebar";
import ProductCard from "Templates/Template4/Components/Common/ProductCard";
import SortDropdown from "Templates/Template4/Components/Common/SortDropdown";
import { Loader } from "@mantine/core";
import { useSearch } from "Context/SearchContext";

interface ProductResponse {
  results?: {
    products: any[];
    totalProducts: number;
  };
  products?: any[];
  totalProducts?: number;
}

interface BooksListingProps {
  showHeader?: boolean;
  isNewArrival?: boolean;
  isTopSelling?: boolean;
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

const paramsToSelectedFilters = (
  searchParams: URLSearchParams,
  subClassesData: any[] = []
) => {
  const filters: Record<string, string[]> = {};
  const filterKeys = [
    "category",
    "subCategory",
    "author",
    "language",
    "academic",
    "merchandise",
    "price",
  ];

  filterKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      if (key === "subCategory" && subClassesData?.length > 0) {
        const subClassNames = value
          .split(",")
          .map((code) => {
            const subClass = subClassesData.find(
              (s: any) => s.subClassCode === code
            );
            return subClass ? subClass.subClassName : code;
          })
          .filter(Boolean);
        if (subClassNames.length > 0) {
          filters[key] = subClassNames;
        }
      } else if (key !== "price") {
        filters[key] = value.split(",");
      }
    }
  });

  const fromprice = searchParams.get("fromprice");
  const Toprice = searchParams.get("Toprice");
  if (fromprice && Toprice) {
    const minPrice = parseInt(fromprice);
    const maxPrice = parseInt(Toprice);
    const priceRanges = [
      "Rs. 0 - Rs. 100",
      "Rs. 101 - Rs. 200",
      "Rs. 201 - Rs. 400",
      "Rs. 401 - Rs. 1000",
      "Rs. 1001 - Rs. 3000",
      "Rs. 3000 above",
    ];

    const matchingRange = priceRanges.find((range) => {
      const parsed = parsePriceRange(range);
      return (
        parsed && parsed.fromprice === minPrice && parsed.Toprice === maxPrice
      );
    });

    if (matchingRange) {
      filters.price = [matchingRange];
    }
  }
  return filters;
};

const BooksListing: React.FC<BooksListingProps> = ({
  showHeader = true,
  isNewArrival = false,
  isTopSelling = false,
}) => {
  const { author } = useParams<{ author: string }>();
  const dispatch: AppDispatch = useDispatch();
  const { value: sort } = useSelector((state: RootState) => state.sort);

  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState(1);
  const pageSize = 12;

  const searchQuery = searchParams.get("search");
  const { setSearchTerm } = useSearch();

  const { data: subClassesData } = useGetAdminSubClassesQuery();

  const selectedFilters = useMemo(
    () => paramsToSelectedFilters(searchParams, subClassesData?.results || []),
    [searchParams, subClassesData]
  );

  const filterParams = useMemo(() => {
    const params: any = {
      mode: "CRITERIA",
      page: activePage,
      productsCount: pageSize,
      sort: sort === "price-desc" ? "price-hightolow" : "price-lowtohigh",
    };

    if (isNewArrival) {
      params.isNewArrival = true;
    }

    if (isTopSelling) {
      params.isTopSelling = true;
    }

    if (author) {
      params.author = author;
    }

    if (searchQuery) {
      params.search = searchQuery;
    }

    const urlParams = [
      "category",
      "author",
      "language",
      "academic",
      "merchandise",
    ];
    urlParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        params[param] = value;
      }
    });

    const subCategoryValue = searchParams.get("subCategory");
    if (subCategoryValue) {
      params.subClass = subCategoryValue;
    }

    const fromprice = searchParams.get("fromprice");
    const Toprice = searchParams.get("Toprice");
    if (fromprice && Toprice) {
      params.fromprice = parseInt(fromprice);
      params.Toprice = parseInt(Toprice);
    }
    return params;
  }, [
    searchParams,
    activePage,
    pageSize,
    author,
    isNewArrival,
    isTopSelling,
    sort,
  ]);

  const { data: productsData, isLoading } =
    useGetListOfBookProductsWithFilterQuery(filterParams);

  const response = productsData as ProductResponse;

  const productsDataList =
    response?.results?.products || response?.products || [];
  const totalProductsCount =
    response?.results?.totalProducts || response?.totalProducts || 0;

  const currentProducts = productsDataList;

  const paginate = (pageNumber: number) => {
    setActivePage(pageNumber);

    const newSearchParams = new URLSearchParams(searchParams);
    if (newSearchParams.has("search")) {
      newSearchParams.delete("search");
    }

    newSearchParams.set("page", pageNumber.toString());

    setSearchParams(newSearchParams, { replace: true });

    setSearchTerm("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (
    filter: string,
    category: string,
    checked: boolean
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (category === "price") {
      if (checked) {
        const priceRange = parsePriceRange(filter);
        if (priceRange) {
          newSearchParams.set("fromprice", priceRange.fromprice.toString());
          newSearchParams.set("Toprice", priceRange.Toprice.toString());
        }

        newSearchParams.delete("fromprice");
        newSearchParams.delete("Toprice");
        if (priceRange) {
          newSearchParams.set("fromprice", priceRange.fromprice.toString());
          newSearchParams.set("Toprice", priceRange.Toprice.toString());
        }
      } else {
        newSearchParams.delete("fromprice");
        newSearchParams.delete("Toprice");
      }
    } else if (category === "subCategory") {
      const currentValues =
        newSearchParams.get("subCategory")?.split(",") || [];

      if (checked) {
        const subClass = subClassesData?.results?.find(
          (s: any) => s.subClassName === filter
        );
        if (subClass && !currentValues.includes(subClass.subClassCode)) {
          currentValues.push(subClass.subClassCode);
          newSearchParams.set("subCategory", currentValues.join(","));
        }
      } else {
        const subClass = subClassesData?.results?.find(
          (s: any) => s.subClassName === filter
        );
        if (subClass) {
          const updatedValues = currentValues.filter(
            (code) => code !== subClass.subClassCode
          );
          if (updatedValues.length > 0) {
            newSearchParams.set("subCategory", updatedValues.join(","));
          } else {
            newSearchParams.delete("subCategory");
          }
        }
      }
    } else {
      const currentValues = newSearchParams.get(category)?.split(",") || [];

      if (checked) {
        if (!currentValues.includes(filter)) {
          currentValues.push(filter);
          newSearchParams.set(category, currentValues.join(","));
        }
      } else {
        const updatedValues = currentValues.filter((value) => value !== filter);
        if (updatedValues.length > 0) {
          newSearchParams.set(category, updatedValues.join(","));
        } else {
          newSearchParams.delete(category);
        }
      }
    }

    newSearchParams.delete("page");
    setSearchParams(newSearchParams, { replace: true });
    setActivePage(1);
  };

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page > 0) {
        setActivePage(page);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(change("price-asc"));
  }, [dispatch]);

  const totalPages = Math.ceil(totalProductsCount / pageSize);

  const labels: Record<string, string> = {
    academic: "Academic",
    language: "Language",
    author: "Author",
    category: "Category",
    subCategory: "Sub Category",
    merchandise: "Merchandise",
  };

  const activeFilters = Object.entries(labels)
    .map(([key, label]) => {
      if (subClassesData) {
        let value: string | null = null;

        if (key === "subCategory") {
          value =
            subClassesData?.results.find(
              (d) => d.subClassCode === searchParams.get(key)
            )?.subClassName ?? null;
        } else {
          value = searchParams.get(key);
        }
        return value ? `${label} > ${value}` : null;
      }
    })
    .filter(Boolean)
    .join(" ✦ ");

  const searchFilter = searchParams.get("search");
  const finalActiveFilters = searchFilter
    ? `Search: "${searchFilter}"${activeFilters ? " ✦ " + activeFilters : ""}`
    : activeFilters;

  return (
    <div className="min-h-screen bg-vintageBg font-gilroyRegular tracking-wider">
      <div className="py-3 md:py-12 px-6 lg:px-24 flex gap-8">
        <aside className="hidden md:block w-1/4 sticky top-20 self-start">
          <FilterSidebar
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            pageType="BooksListing"
          />
        </aside>

        <main className="flex-1">
          {!showHeader && (
            <div>
              <span className="text-base md:text-xl px-4 text-vintageText font-semibold">
                All Books
              </span>
            </div>
          )}
          <div>
            <span className="text-base px-4 text-vintageText font-semibold">
              {finalActiveFilters}
            </span>
          </div>
          {totalProductsCount > 0 && (
            <div
              data-aos="fade-down"
              className="hidden md:flex justify-between items-center mb-6 bg-opacity-70 px-4 py-2 rounded-lg shadow-sm"
            >
              <span className="text-base text-vintageText">
                Showing <strong>{(activePage - 1) * pageSize + 1}</strong> -{" "}
                <strong>
                  {Math.min(activePage * pageSize, totalProductsCount)}
                </strong>{" "}
                of <strong>{totalProductsCount}</strong> results for{" "}
                <strong className="capitalize">
                  {author ? `Author: ${author}` : "All Books"}
                </strong>
              </span>
              <SortDropdown
                selectedSort={sort}
                onSortChange={(value) => dispatch(change(value))}
              />
            </div>
          )}

          {isLoading ? (
            <div className="w-full h-96 bg-vintageBg flex justify-center items-center">
              <div
                style={{
                  width: "100%",
                  height: "88vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  left: 0,
                  top: 110,
                  backgroundColor: "#f5f2f2ff",
                  // backgroundColor: "#f4dfb4",
                }}
              >
                <Loader color="#326638" />
              </div>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="text-center py-8 text-vintageText">
              No Products Available
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
              {currentProducts.map((product: any) => (
                <div
                  id={`product-${product.product.id}`}
                  key={product.product.id}
                >
                  <ProductCard product={product} />
                </div>
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

export default BooksListing;
