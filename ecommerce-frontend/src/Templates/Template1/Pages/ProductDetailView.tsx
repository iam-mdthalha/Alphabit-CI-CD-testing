import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import AdditionalProductWrapper from "Templates/Template1/Components/ProductDetail/AdditionalProductWrapper/AdditionalProductWrapper";
import DescriptionBox from "Templates/Template1/Components/ProductDetail/DescriptionBox/DescriptionBox";
import ProductDisplay from "Templates/Template1/Components/ProductDetail/ProductDisplay/ProductDisplay";
import RelatedProducts from "Templates/Template1/Components/RelatedProducts/RelatedProducts";
import { useGetProductByIdQuery } from "Services/ProductApiSlice";
import { AppDispatch } from "State/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ProductDetailView = () => {
  const dispatch: AppDispatch = useDispatch();
  const { productId } = useParams<{ productId: string }>();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { data: productDetail, isLoading: productDetailLoading } =
    useGetProductByIdQuery(
      { productId: productId || "" },
      {
        skip: !productId,
      }
    );

  useEffect(() => {}, [dispatch, productId, productDetail]);

  if (!productId) {
    return <div>Product ID is missing</div>;
  }

  return productDetailLoading ? (
    <CircleLoader />
  ) : (
    <div style={{ paddingInline: isMobile ? 10 : 200, marginBlock: 20 }}>
      <>
        {productDetail && (
          <>
            <ProductDisplay productDetail={productDetail} />
            {productDetail.detailDesc.length > 0 && (
              <DescriptionBox description={productDetail.detailDesc} />
            )}

            {productDetail.additionalProducts.length > 0 && (
              <AdditionalProductWrapper
                mainProduct={productDetail.productWrapper}
                additionalProducts={productDetail.additionalProducts}
              />
            )}
            <RelatedProducts productRef={productDetail.productWrapper} />
          </>
        )}
      </>
    </div>
  );
};

export default ProductDetailView;
