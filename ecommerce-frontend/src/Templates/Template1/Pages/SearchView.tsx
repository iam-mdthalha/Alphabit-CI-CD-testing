import {
  Flex,
  NativeSelect,
  Pagination,
  Text,
  rem
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowsSort } from "@tabler/icons-react";
import { sortingOptions } from "Constants/SortingOptions";
import { useGetProductsBySearchQuery } from "Services/ProductApiSlice";
import { change } from "State/SortSlice/SortSlice";
import { AppDispatch, RootState } from "State/store";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import ItemWide from "Templates/Template1/Components/ItemWide/ItemWide";
import NoResults from "Templates/Template1/Components/NoResults/NoResults";
import { handleSort } from "Utilities/SortHandler";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
  
  const SearchView = () => {
    const dispatch: AppDispatch = useDispatch();
    // const {data: searches, loading: searchLoading, error: searchError} = useSelector((state: RootState) => state.search);
  
    const [searchParams, setSearchParams] = useSearchParams();
  
    const [activePage, setActivePage] = useState(
      Number(searchParams.get("page"))
    );
    const { value: sort } = useSelector((state: RootState) => state.sort);
    const pageSize = 6;
    let searchValue = searchParams.get("search") || "all";
    let searchOffsetValue = searchParams.get("offset") || "";
    const [scroll, scrollTo] = useWindowScroll();
    const { data: searches, isLoading: searchLoading } =
      useGetProductsBySearchQuery({
        searchValue: searchValue,
        searchOffsetValue: searchOffsetValue === "all" ? "" : searchOffsetValue,
        pageSize: pageSize,
        activePage: activePage,
      });
    useEffect(() => {
      scrollTo({ y: 0 });
    }, [dispatch, activePage, searchParams]);
  
    useEffect(() => {
      setActivePage(Number(searchParams.get("page")));
    }, [
      dispatch,
      activePage,
      searchParams,
      searchValue,
      searchOffsetValue,
      sort,
    ]);
  
    const changePage = (pageNumber: number) => {
      setSearchParams({
        search: searchValue,
        offset: searchOffsetValue,
        page: pageNumber.toString(),
      });
      setActivePage(pageNumber);
    };
  
    return (
      <>
        <Flex
          component="div"
          justify={'center'}
          w={{ base: "95vw", md: "98vw" }}
          // pl={{ base: 350, xl: 350, sm: 100, xs: 50, md: 200 }}
          // pr={100}
          px={10}
          py={50}
          mb={100}
        >
          {searchLoading ? (
            <CircleLoader />
          ) : (
            <div className="flex flex-col w-[90vw] md:w-[60vw]">
              <Flex
                justify="space-between"
                align="center"
              >
                <div>
                  <Text display={"inline"}>Showing 1-1 out of 50 results</Text>
                </div>
  
                <div>
                  <NativeSelect
                    leftSection={
                      <IconArrowsSort
                        style={{ width: rem(16), height: rem(16) }}
                      />
                    }
                    leftSectionPointerEvents="none"
                    data={sortingOptions}
                    value={sort}
                    onChange={(e) => {
                      dispatch(change(e.target.value));
                    }}
                  />
                </div>
              </Flex>
              <Flex direction={"column"} rowGap={10} my={10}>
                {searches &&
                  searches.products.length > 0 &&
                  handleSort(searches.products, sort).map((item, i) => {
                    return <ItemWide key={i} item={item} />;
                  })}
                {searches && searches.products.length === 0 && (
                  <NoResults
                    text={`No Results for "${searchValue}"${
                      searchOffsetValue == "all" ? "" : ` in ${searchOffsetValue}`
                    }`}
                  />
                )}
              </Flex>
              <Pagination
                total={
                  searches ? Math.ceil(searches.totalProducts / pageSize) : 0
                }
                value={activePage}
                onChange={(pageNumber) => {
                  changePage(pageNumber);
                }}
              />
            </div>
          )}
        </Flex>
      </>
    );
  };
  
  export default SearchView;
  