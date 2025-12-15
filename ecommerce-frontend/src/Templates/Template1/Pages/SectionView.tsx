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
  import NoResults from "Templates/Template1/Components/NoResults/NoResults";
  import { sortingOptions } from "Constants/SortingOptions";
  import { useGetSectionDetailQuery } from "Services/SectionApiSlice"; 
  import { change } from "State/SortSlice/SortSlice";
  import { AppDispatch, RootState } from "State/store";
  import { handleSort } from "Utilities/SortHandler";
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useParams, useSearchParams } from "react-router-dom";
  
  const SectionView = () => {
    const { section } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch: AppDispatch = useDispatch();
  
    const { value: sort } = useSelector((state: RootState) => state.sort);
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const isTablet = useMediaQuery(`(max-width: ${em(1024)})`);
  
    const [activePage, setActivePage] = useState(1);
    const pageSize = 5;
  
    const { data: sectionDetail, isLoading: sectionDetailLoading } =
      useGetSectionDetailQuery({
        sectionString: section,
        activePage: activePage,
        pageSize: pageSize,
      });
  
    useEffect(() => {}, [dispatch, activePage, sort]);
  
    const changePage = (pageNumber: number) => {
      setSearchParams({ page: pageNumber.toString() });
      setActivePage(pageNumber);
    };
  
    return (
      <>
        <Paper
          component="div"
          pl={isMobile ? 10 : isTablet ? 50 : "5vw"}
          pr={isMobile ? 10 : isTablet ? 50 : "5vw"}
          py={50}
          style={{ maxWidth: "100%", overflowX: "hidden" }}
        >
          {sectionDetailLoading ? (
            <CircleLoader />
          ) : (
            <>
              {sectionDetail && (
                <>
                  <Flex
                    direction={isMobile ? "column" : "row"}
                    align="center"
                    justify="space-between"
                  >
                    <Text size={isMobile ? "sm" : "md"} mb={isMobile ? 10 : 0}>
                      Showing 1-1 out of{" "}
                      {sectionDetail?.sectionProducts.totalProducts} results
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
                    {sectionDetail.sectionProducts.products.length > 0 ? (
                      handleSort(
                        sectionDetail.sectionProducts.products,
                        sort
                      ).map((item, i) => {
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
                      })
                    ) : (
                      <NoResults
                        text={`No Results found for ${sectionDetail?.sectionName}`}
                      />
                    )}
                  </SimpleGrid>
  
                  <Pagination
                    total={Math.ceil(
                      sectionDetail.sectionProducts.totalProducts / pageSize
                    )}
                    value={activePage}
                    onChange={changePage}
                    size={isMobile ? "sm" : "md"}
                  />
                </>
              )}
            </>
          )}
        </Paper>
      </>
    );
  };
  
  export default SectionView;
  