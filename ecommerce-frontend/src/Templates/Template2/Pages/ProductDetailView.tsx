import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import {
  useGetEcomProductDetailByIdPostMutation,
  useGetEcomProductDetailBySizePostMutation,
} from "Services/ProductApiSlice";
import ImageGallery from "Templates/Template2/Components/ProductDetailView/ImageGallery";
import ProductDetails from "Templates/Template2/Components/ProductDetailView/ProductDetails";
import SimilarProducts from "Templates/Template2/Components/ProductDetailView/SimilarProducts";
import WhyChooseUs from "Templates/Template2/Components/SectionHome/WhyChooseUs";

const PLANT = process.env.REACT_APP_PLANT;

const ProductDetailView = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [getEcomProductDetail, { data: ecomProductDetail, isLoading }] =
    useGetEcomProductDetailByIdPostMutation();
  const [triggerSizeQuery] = useGetEcomProductDetailBySizePostMutation();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedSleeve, setSelectedSleeve] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");

  const handleSizeChange = async (size: string) => {
    setSelectedSize(size);
    if (
      PLANT &&
      ecomProductDetail?.productDetail?.productWrapper?.product?.itemGroupId
    ) {
      try {
        const response = await triggerSizeQuery({
          size,
          itemgroupid:
            ecomProductDetail.productDetail.productWrapper.product.itemGroupId,
          plant: PLANT,
        }).unwrap();

        if (response.productId) {
          navigate(`/${encodeURIComponent(response.productId)}`, {
            replace: true,
          });
        }
      } catch (error) {
        console.error("Error fetching product by size:", error);
      }
    }
  };

  useEffect(() => {
    if (PLANT && productId) {
      const decodedProductId = decodeURIComponent(productId);
      getEcomProductDetail({ plant: PLANT, productId: decodedProductId })
        .unwrap()
        .then((response) => {
          if (response?.productDetail?.productGarmentTypeDTO) {
            const garmentData = response.productDetail.productGarmentTypeDTO;
            if (garmentData.size) {
              setSelectedSize(garmentData.size);
            }
          }
        });
    }
  }, [productId, PLANT, getEcomProductDetail]);

  useEffect(() => {
    if (ecomProductDetail?.productDetail?.imagePaths?.[0]) {
      setSelectedImage(ecomProductDetail.productDetail.imagePaths[0]);
    }
  }, [ecomProductDetail]);

  if (isLoading) return <></>;
  if (!ecomProductDetail) return <p>Product not found</p>;
  if (!ecomProductDetail?.productDetail?.imagePaths)
    return <p>Image not found</p>;

  // Safely access nested properties with null checks
  const productWrapper = ecomProductDetail.productDetail?.productWrapper || {};
  const categoryWrapper =
    ecomProductDetail.productDetail?.categoryWrapper || {};
  const subCategoryWrapper =
    ecomProductDetail.productDetail?.subCategoryWrapper || {};
  const brandWrapper = ecomProductDetail.productDetail?.brandWrapper || {};
  const productGarmentTypeDTO =
    ecomProductDetail.productDetail?.productGarmentTypeDTO || {};

  const transformedProductDetail = {
    productWrapper: {
      product: productWrapper.product || {},
      imagePath: productWrapper.imagePath || "",
      imagePaths: ecomProductDetail.productDetail.imagePaths || [],
      promotions: productWrapper.promotions || [],
      productgarmenttype: productGarmentTypeDTO
        ? [
            {
              id: productGarmentTypeDTO.id || 1,
              size: productGarmentTypeDTO.size || "",
              sleeve: productGarmentTypeDTO.sleeve || "",
              color: productGarmentTypeDTO.color || "",
              collar: productGarmentTypeDTO.collar || "",
              fabric: productGarmentTypeDTO.fabric || "",
              occasion: productGarmentTypeDTO.occasion || "",
              pattern: productGarmentTypeDTO.pattern || "",
            },
          ]
        : [],
    },
    categoryWrapper: {
      id: categoryWrapper.categoryCode || "",
      category: categoryWrapper.categoryName || "",
    },
    subCategoryWrapper: subCategoryWrapper,
    brandWrapper: brandWrapper,
    additionalProducts:
      ecomProductDetail.productDetail?.additionalProducts || [],
    detailDesc: ecomProductDetail.productDetail?.detailDesc || "",
    imagePaths: ecomProductDetail.productDetail?.imagePaths || [],
    productGarmentTypeDTO: productGarmentTypeDTO,
    remarkTwo: productWrapper.product?.remarkTwo || "",
    labelPara1: ecomProductDetail.labelPara1 || "",
    labelPara2: ecomProductDetail.labelPara2 || "",
    labelPara3: ecomProductDetail.labelPara3 || "",
    labelPara4: ecomProductDetail.labelPara4 || "",
    labelPara5: ecomProductDetail.labelPara5 || "",
    labelPara6: ecomProductDetail.labelPara6 || "",
    labelPara7: ecomProductDetail.labelPara7 || "",
    labelPara8: ecomProductDetail.labelPara8 || "",
    parameter1: ecomProductDetail.parameter1 || "",
    parameter2: ecomProductDetail.parameter2 || "",
    parameter3: ecomProductDetail.parameter3 || "",
    parameter4: ecomProductDetail.parameter4 || "",
    parameter5: ecomProductDetail.parameter5 || "",
    parameter6: ecomProductDetail.parameter6 || "",
    parameter7: ecomProductDetail.parameter7 || "",
    parameter8: ecomProductDetail.parameter8 || "",
    ecomDescription: ecomProductDetail.ecomDescription || "",
  };

  const availableSizes =
    ecomProductDetail.availableSize?.map((item) => ({
      data: item.data,
      productId: item.productId,
      availQty: item.availQty,
    })) || [];
  const availableSleeves =
    ecomProductDetail.availableSleeve?.map((item) => item.data) || [];
  const availableColors =
    ecomProductDetail.availableColors?.map((item) => item.data) || [];

  const handleImageItemClick = (itemId: string) => {
    navigate(`/${itemId}`);
  };

  return (
    <div className="min-h-screen font-montserrat tracking-widest container mx-auto px-4 py-8">
      <div className="mx-auto w-full md:w-[80vw] flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-2/3">
          <ImageGallery
            imagePaths={transformedProductDetail.imagePaths}
            imagePath={transformedProductDetail.productWrapper.imagePath}
          />
        </div>
        <div className="w-full md:w-1/3">
          <ProductDetails
            productDetail={transformedProductDetail}
            selectedSize={selectedSize}
            setSelectedSize={handleSizeChange}
            selectedSleeve={selectedSleeve}
            setSelectedSleeve={setSelectedSleeve}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            availableSizes={availableSizes}
            availableSleeves={availableSleeves}
            availableColors={availableColors}
            ecomProductDetail={ecomProductDetail}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            onImageItemClick={handleImageItemClick}
            allImages={
              ecomProductDetail.allImageList?.map((image) => ({
                item: image.item || "",
                color: image.color || "",
                image: image.imagePath || "",
              })) || []
            }
            ecomConfig={ecomConfig}
            promotions={transformedProductDetail.productWrapper.promotions}
          />
        </div>
      </div>
      <SimilarProducts productRef={transformedProductDetail.productWrapper} />
      <WhyChooseUs />
    </div>
  );
};

export default ProductDetailView;
