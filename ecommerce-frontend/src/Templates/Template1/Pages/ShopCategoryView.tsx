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
import { useGetListOfProductsQuery } from "Services/ProductApiSlice";
import { change } from "State/SortSlice/SortSlice";
import { AppDispatch, RootState } from "State/store";
import { handleSort } from "Utilities/SortHandler";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

const ShopCategoryView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const isTablet = useMediaQuery(`(max-width: ${em(1024)})`);
  const [activePage, setActivePage] = useState(
    Number(searchParams.get("page"))
  );
  const dispatch: AppDispatch = useDispatch();
  const pageSize = 5;
  const { value: sort } = useSelector((state: RootState) => state.sort);
  const { data: products, isLoading: productsLoading } =
    useGetListOfProductsQuery({
      category: category ? category : undefined,
      pageSize: pageSize,
      activePage: activePage,
    });

  useEffect(() => {
    setActivePage(Number(searchParams.get("page")));
  }, [dispatch, activePage, category, sort]); // Add sort to dependencies

  const changePage = (pageNumber: number) => {
    setSearchParams({ page: pageNumber.toString() });
    setActivePage(pageNumber);
  };

  return (
    <>
      <div className="shop-category mb-[4rem]">
        <Paper
          component="div"
          pl={isMobile ? 10 : isTablet ? 50 : "5vw"}
          pr={isMobile ? 10 : isTablet ? 50 : "5vw"}
          py={50}
          style={{ maxWidth: "100%", overflowX: "hidden" }}
        >
          {productsLoading ? (
            <CircleLoader />
          ) : (
            <>
              <Flex
                direction={isMobile ? "column" : "row"}
                justify="space-between"
                align="center"
              >
                <Text size={isMobile ? "sm" : "md"} mb={isMobile ? 10 : 0}>
                  Showing 1-1 out of {products?.totalProducts} results
                </Text>
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
                  size={isMobile ? "xs" : "sm"}
                  style={{ maxWidth: 200 }}
                />
              </Flex>
              <SimpleGrid
                cols={isMobile ? 2 : isTablet ? 3 : 4}
                spacing={16}
                my={50}
                style={{ width: "100%" }}
              >
                {products?.products && products.products.length > 0
                  ? handleSort(products.products, sort).map((item, i) => {
                      if (category === item.product.category) {
                        return (
                          <div
                            key={i}
                            style={{
                              minWidth: "0",
                              flex: "1 1 auto",
                            }}
                          >
                            <Item key={i} item={item} withBorder={false} />
                          </div>
                        );
                      } else if (!category || category === "all") {
                        return (
                          <div
                            key={i}
                            style={{
                              minWidth: "0",
                              flex: "1 1 auto",
                            }}
                          >
                            <Item key={i} item={item} withBorder={false} />
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })
                  : null}
              </SimpleGrid>
              <Pagination
                total={
                  products ? Math.ceil(products?.totalProducts / pageSize) : 0
                }
                value={activePage}
                onChange={(pageNumber) => {
                  changePage(pageNumber);
                }}
                size={isMobile ? "sm" : "md"}
              />
            </>
          )}
        </Paper>
      </div>
    </>
  );
};

export default ShopCategoryView;
