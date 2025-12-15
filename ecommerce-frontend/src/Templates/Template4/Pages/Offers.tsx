import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  useGetListOfProductsWithFilterbygroupQuery,
  useGetNewArrivalsQuery,
  useGetProductsBySearchQuery,
} from "Services/ProductApiSlice";
import { change } from "State/SortSlice/SortSlice";
import type { AppDispatch, RootState } from "State/store";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import ProductCard from "Templates/Template4/Components/Common/ProductCard";
import FilterSidebar from "Templates/Template4/Components/Common/FilterSidebar";
import SortDropdown from "Templates/Template4/Components/Common/SortDropdown";
import { handleSort } from "Utilities/SortHandler";
import { useSearch } from "Context/SearchContext";
import BooksListing from "Templates/Template4/Pages/BooksListing";

const Offers: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [filterCategories, setFilterCategories] = useState<
    Record<string, string>
  >({});
  const dispatch: AppDispatch = useDispatch();
  const { value: sort } = useSelector((state: RootState) => state.sort);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState(1);
  const pageSize = 12;

  const { searchTerm } = useSearch();

  const hasOnlyPriceFilter =
    selectedFilters.price?.length! > 0 &&
    Object.keys(selectedFilters).every(
      (key) => key === "price" || (selectedFilters[key]?.length || 0) === 0
    );

  // New search API query - runs when searchTerm exists
  const { data: searchResults, isLoading: searchLoading } = useGetProductsBySearchQuery(
    {
      searchValue: searchTerm || "",
      searchOffsetValue: "",
      pageSize,
      activePage,
    },
    { skip: !searchTerm }
  );

  const { data: newCollectionProducts, isLoading: newCollectionLoading } =
    useGetNewArrivalsQuery(
      {
        pageSize,
        activePage,
      },
      { skip: Object.values(selectedFilters).some((arr) => arr.length > 0) || Boolean(searchTerm) }
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
        hasOnlyPriceFilter ||
        Boolean(searchTerm),
    });

  const currentProducts = useMemo(() => {
    if (searchTerm && searchResults?.products) {
      return handleSort(searchResults.products, sort);
    }

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
    searchTerm,
    searchResults,
    newCollectionProducts,
    filteredProducts,
    filterCategories,
    sort,
    selectedFilters,
  ]);

  const isLoading = Boolean(searchTerm)
    ? searchLoading
    : Object.values(selectedFilters).some((arr) => arr.length > 0)
    ? filteredLoading
    : newCollectionLoading;

  const totalProducts = Boolean(searchTerm)
    ? searchResults?.totalProducts || 0
    : Object.values(selectedFilters).some((arr) => arr.length > 0)
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
  }, [selectedFilters, searchTerm]);

  useEffect(() => {
    dispatch(change("price-asc"));
  }, [dispatch]);

  
   return <BooksListing />;

 
};

export default Offers;
