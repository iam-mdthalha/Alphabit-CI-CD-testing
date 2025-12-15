import {
    Flex,
    NativeSelect,
    Pagination,
    Paper,
    SimpleGrid,
    Text,
    em,
    rem,
  } from "@mantine/core";
  import { useMediaQuery } from "@mantine/hooks";
  import { IconArrowsSort } from "@tabler/icons-react";
  import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
  import Item from "Templates/Template1/Components/Item/Item";
  import { sortingOptions } from "Constants/SortingOptions";
  import { useGetTopSellersQuery } from "Services/ProductApiSlice";
  import { change } from "State/SortSlice/SortSlice";
  import { AppDispatch, RootState } from "State/store";
  import { handleSort } from "Utilities/SortHandler";
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useSearchParams } from "react-router-dom";
  
  const TopSellerView = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch: AppDispatch = useDispatch();
  
    const { value: sort } = useSelector((state: RootState) => state.sort);
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const isTablet = useMediaQuery(`(max-width: ${em(1024)})`);
    const isDesktop = useMediaQuery(`(min-width: ${em(1025)})`);
  
    const [activePage, setActivePage] = useState(
      Number(searchParams.get("page"))
    );
    const pageSize = 30;
    const {
      data: topSellers,
      error,
      isLoading,
    } = useGetTopSellersQuery({ pageSize: pageSize, activePage: activePage });
  
    useEffect(() => {}, [activePage]);
  
    const changePage = (pageNumber: number) => {
      setSearchParams({ page: pageNumber.toString() });
      setActivePage(pageNumber);
    };
  
    return (
      <Paper
        component="div"
        pl={isMobile ? 10 : isTablet ? 50 : "5vw"}
        pr={isMobile ? 10 : isTablet ? 50 : "5vw"}
        py={50}
        style={{ maxWidth: "100%", overflowX: "hidden" }}
      >
        {isLoading ? (
          <CircleLoader />
        ) : (
          <>
            <Flex
              direction={isMobile ? "column" : "row"}
              align="center"
              justify="space-between"
            >
              <Text size={isMobile ? "sm" : "md"} mb={isMobile ? 10 : 0}>
                Showing 1-1 out of {topSellers?.totalProducts} results
              </Text>
              <NativeSelect
                leftSection={
                  <IconArrowsSort style={{ width: rem(16), height: rem(16) }} />
                }
                leftSectionPointerEvents="none"
                data={sortingOptions}
                value={sort}
                onChange={(e) => {
                  dispatch(change(e.target.value));
                }}
                size={isMobile ? "xs" : "sm"}
                style={{ maxWidth: 200 }}
              />
            </Flex>
  
            <SimpleGrid
              cols={isMobile ? 2 : isTablet ? 3 : isDesktop ? 5 : 4}
              my={50}
              style={{
                width: "100%",
                gap: "16px",
              }}
            >
              {topSellers &&
                topSellers.products.length > 0 &&
                handleSort(topSellers.products, sort).map((item, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        minWidth: "0",
                        flex: "1 1 auto",
                      }}
                    >
                      <Item item={item} withBorder={false} />
                    </div>
                  );
                })}
            </SimpleGrid>
  
            <Pagination
              total={
                topSellers ? Math.ceil(topSellers.totalProducts / pageSize) : 0
              }
              value={activePage}
              onChange={changePage}
              size={isMobile ? "sm" : "md"}
            />
          </>
        )}
      </Paper>
    );
  };
  
  export default TopSellerView;
  