import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetSectionDetailQuery } from "Services/SectionApiSlice";
import { AppDispatch, RootState } from "State/store";
import Breadcrumb from "../Components/Common/Breadcrumb";
import CircularLoader from "../Components/Common/CircularLoader";
import FilterSidebar from "../Components/SectionView/FilterSidebar";
import FilterSortBar from "../Components/SectionView/FilterSortBar";
import ProductCard from "../Components/SectionView/ProductCard";
import TopContent from "../Components/SectionView/TopContent";


const SectionView = () => {

    const { section } = useParams();
    
    const dispatch: AppDispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const { value: sort } = useSelector((state: RootState) => state.sort);

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
            {sectionDetailLoading ? <CircularLoader /> : sectionDetail ? <TopContent title={sectionDetail.sectionName} description={sectionDetail.sectionDesc} /> : <p className="font-cardoItalic">Unable to retrieve section details</p> }
            <Breadcrumb />
            <div className="flex flex-col md:flex-row">
                <FilterSidebar />
                <main className="w-full md:w-4/5 px-6">
                    <FilterSortBar />
                    <div className="flex flex-wrap -mx-4">
                        
                        {sectionDetailLoading ? 
                            <div className="w-full flex justify-center">
                                <CircularLoader />
                            </div>
                            :
                        sectionDetail?.sectionProducts.products.map((product, index) => (
                            <ProductCard key={index} {...product} />
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}

export default SectionView;