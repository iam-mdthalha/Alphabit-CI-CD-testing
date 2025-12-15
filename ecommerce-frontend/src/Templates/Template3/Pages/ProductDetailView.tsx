import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "Services/ProductApiSlice";
import Breadcrumb from "../Components/Common/Breadcrumb";
import CircularLoader from "../Components/Common/CircularLoader";
import PreFooterContent from "../Components/ProductDetailView/PreFooterContent";
import ProductDetails from "../Components/ProductDetailView/ProductDetails";
import ProductImages from "../Components/ProductDetailView/ProductImages";
import ProductTabs from "../Components/ProductDetailView/ProductTabs";


const ProductDetailView = () => {
     const { productId } = useParams();
      const { data: productDetail, isLoading } = useGetProductByIdQuery({
        productId: productId || "",
      });

    return (
        <>
            <div className="mt-6">
                <Breadcrumb />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {
                        isLoading ?
                            <div className="w-full flex justify-center">
                                <CircularLoader />
                            </div>
                            :
                            productDetail && productDetail.imagePaths.length > 0 ? <ProductImages images={productDetail.imagePaths} /> : <p className="font-cardoItalic">No images found</p>
                    }
                    {
                        isLoading ?
                            <div className="w-full flex justify-center">
                                <CircularLoader />
                            </div>
                            :
                            productDetail && <ProductDetails product={productDetail.productWrapper} />
                    }  
                </div>

                {/* <div className="my-12">
                    <ProductVideo videoUrl="https://youtu.be/864B4rzoPog?feature=shared" />
                </div> */}

                <div className="my-12">
                    {/* <ProductTabs tabs={mockProductData.tabs}  /> */}
                    {
                        isLoading ?
                            <div className="w-full flex justify-center">
                                <CircularLoader />
                            </div>
                            :
                            productDetail && <ProductTabs description={productDetail.detailDesc} shippingAndReturns="Shipping and returns" careInstructions="Care Instructions" />
                    }
                </div>

                {/* <div className="my-12">
                <RecentlyViewed items={mockProductData.recentlyViewed}/>
                </div> */}

                <div className="bg-black">
                    <PreFooterContent />
                </div>
            </div>
        </>
    );
}

export default ProductDetailView;