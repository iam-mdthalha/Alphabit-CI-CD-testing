import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  useGetTopSellingbygroupQuery,
  useGetListOfBookProductsWithFilterQuery,
  useGetProductsBySearchQuery,
} from "Services/ProductApiSlice";
import { change } from "State/SortSlice/SortSlice";
import type { AppDispatch, RootState } from "State/store";
import ProductCard from "Templates/Template4/Components/Common/ProductCard";
import FilterSidebar from "Templates/Template4/Components/Common/FilterSidebar";
import SortDropdown from "Templates/Template4/Components/Common/SortDropdown";
import { handleSort } from "Utilities/SortHandler";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import { useSearch } from "Context/SearchContext";
import BooksListing from "Templates/Template4/Pages/BooksListing";

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

const paramsToSelectedFilters = (searchParams: URLSearchParams) => {
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
      filters[key] = value.split(",");
    }
  });

  return filters;
};

const TopSellerView: React.FC = () => {
  const { searchTerm } = useSearch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { value: sort } = useSelector((state: RootState) => state.sort);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState(1);
  const pageSize = 12;

  const selectedFilters = useMemo(
    () => paramsToSelectedFilters(searchParams),
    [searchParams]
  );

  const hasFilters = Object.values(selectedFilters).some(
    (sel) => sel.length > 0
  );
  const hasNonPriceFilters = Object.entries(selectedFilters).some(
    ([key, sel]) => key !== "price" && sel.length > 0
  );

  const filterParams = useMemo(() => {
    const params: any = {
      mode: "CRITERIA",
      page: activePage,
      productsCount: pageSize,
      isTopSelling: true,
    };

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
  }, [selectedFilters, activePage, pageSize]);

  const { data: topSellingProducts, isLoading: topSellingLoading } =
    useGetTopSellingbygroupQuery({
      page: activePage,
      productsCount: pageSize,
    });

  const { data: filteredProducts, isLoading: filteredLoading } =
    useGetListOfBookProductsWithFilterQuery(filterParams, {
      skip: !hasFilters,
    });

  const { data: searchedProducts, isLoading: searchedLoading } =
    useGetProductsBySearchQuery(
      {
        searchValue: searchTerm ?? "",
        activePage,
        pageSize,
        searchOffsetValue: "",
      },
      { skip: !searchTerm }
    );

  const topSellingResponse = topSellingProducts as any;
  const filteredResponse = filteredProducts as any;
  const searchedResponse = searchedProducts as any;

  const topSellingProductsData =
    topSellingResponse?.results?.products || topSellingResponse?.products || [];
  const topSellingTotalProducts =
    topSellingResponse?.results?.totalProducts ||
    topSellingResponse?.totalProducts ||
    0;

  const filteredProductsData =
    filteredResponse?.results?.products || filteredResponse?.products || [];
  const filteredTotalProducts =
    filteredResponse?.results?.totalProducts ||
    filteredResponse?.totalProducts ||
    0;

  const searchedProductsData =
    searchedResponse?.results?.products || searchedResponse?.products || [];
  const searchedTotalProducts =
    searchedResponse?.results?.totalProducts ||
    searchedResponse?.totalProducts ||
    0;

  const currentProducts = useMemo(() => {
    if (searchTerm && searchedProductsData.length > 0) {
      return handleSort(searchedProductsData, sort);
    }

    if (hasFilters && filteredProductsData.length > 0) {
      let products = [...filteredProductsData];

      if (selectedFilters.price && selectedFilters.price.length > 0) {
        const priceRanges = selectedFilters.price
          .map(parsePriceRange)
          .filter(Boolean);

        products = products.filter((product) => {
          const price = product.product.ecomUnitPrice;
          return priceRanges.some(
            (range: any) => price >= range.fromprice && price <= range.Toprice
          );
        });
      }

      return handleSort(products, sort);
    }

    if (topSellingProductsData.length > 0 && !hasFilters) {
      return handleSort(topSellingProductsData, sort);
    }

    if (
      topSellingProductsData.length > 0 &&
      hasFilters &&
      !hasNonPriceFilters
    ) {
      let filtered = [...topSellingProductsData];

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
    topSellingProductsData,
    filteredProductsData,
    selectedFilters,
    sort,
    hasFilters,
    hasNonPriceFilters,
    searchedProductsData,
    searchTerm,
  ]);

  const isLoading = !hasFilters ? topSellingLoading : filteredLoading;

  const totalProducts = useMemo(() => {
    if (searchTerm && searchedProductsData.length > 0)
      return searchedTotalProducts;

    if (!hasFilters) {
      return topSellingTotalProducts;
    }

    if (hasNonPriceFilters) {
      return filteredTotalProducts;
    }

    return currentProducts.length;
  }, [
    topSellingTotalProducts,
    filteredTotalProducts,
    currentProducts.length,
    hasFilters,
    hasNonPriceFilters,
    searchedTotalProducts,
    searchTerm,
    searchedProductsData,
  ]);

  const paginate = (pageNumber: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", pageNumber.toString());
    setSearchParams(newSearchParams);
  };

  const handleFilterChange = (
    filter: string,
    category: string,
    checked: boolean
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);

    const currentValues = newSearchParams.get(category)?.split(",") || [];

    if (checked) {
      if (!currentValues.includes(filter)) {
        currentValues.push(filter);
      }
    } else {
      const index = currentValues.indexOf(filter);
      if (index > -1) {
        currentValues.splice(index, 1);
      }
    }

    if (currentValues.length > 0) {
      newSearchParams.set(category, currentValues.join(","));
    } else {
      newSearchParams.delete(category);
    }

    newSearchParams.delete("page");
    setSearchParams(newSearchParams);
  };

  const removeFilter = (filter: string) => {
    const categoryToRemove = Object.entries(selectedFilters).find(
      ([category, filters]) => filters.includes(filter)
    )?.[0];

    if (categoryToRemove) {
      const newSearchParams = new URLSearchParams(searchParams);
      const currentValues =
        newSearchParams.get(categoryToRemove)?.split(",") || [];
      const filteredValues = currentValues.filter((f) => f !== filter);

      if (filteredValues.length > 0) {
        newSearchParams.set(categoryToRemove, filteredValues.join(","));
      } else {
        newSearchParams.delete(categoryToRemove);
      }

      newSearchParams.delete("page");
      setSearchParams(newSearchParams);
    }
  };

  const clearAllFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    [
      "category",
      "subCategory",
      "author",
      "language",
      "academic",
      "merchandise",
      "price",
    ].forEach((key) => newSearchParams.delete(key));
    newSearchParams.delete("page");
    setSearchParams(newSearchParams);
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

  const totalPages = Math.ceil(totalProducts / pageSize);
  return <BooksListing isTopSelling={true} />;
};
export default TopSellerView;
