import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useGetListOfProductsQuery } from "Services/ProductApiSlice";
import { AppDispatch, RootState } from "State/store";
import Breadcrumb from "../Components/Common/Breadcrumb";
import CircularLoader from "../Components/Common/CircularLoader";
import FilterSidebar from "../Components/SectionView/FilterSidebar";
import FilterSortBar from "../Components/SectionView/FilterSortBar";
import ProductCard from "../Components/SectionView/ProductCard";
import TopContent from "../Components/SectionView/TopContent";

const ShopCategoryView = () => {

    const location = useLocation();

    const { category } = useParams();
    const categoryName = location.state?.categoryName;

        
    const dispatch: AppDispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const { value: sort } = useSelector((state: RootState) => state.sort);

    const [activePage, setActivePage] = useState(1);
    const pageSize = 5;
    
    const { data: products, isLoading: productsLoading } =
        useGetListOfProductsQuery({
          category: category ? category : undefined,
          pageSize: pageSize,
          activePage: activePage,
        });

    
    useEffect(() => {}, [dispatch, activePage, sort]);
    
    const changePage = (pageNumber: number) => {
        setSearchParams({ page: pageNumber.toString() });
        setActivePage(pageNumber);
    };

    return (
        <>
            <TopContent title={categoryName} description="" />
            <Breadcrumb />
            <div className="flex flex-col md:flex-row">
                <FilterSidebar />
                <main className="w-full md:w-4/5 px-6">
                    <FilterSortBar />
                    <div className="flex flex-wrap -mx-4">
                        
                        {productsLoading ? 
                            <div className="w-full flex justify-center">
                                <CircularLoader />
                            </div>
                            :
                            products?.products.map((product, index) => (
                            <ProductCard key={index} {...product} />
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}

export default ShopCategoryView;