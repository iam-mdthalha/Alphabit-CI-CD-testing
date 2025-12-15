import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { RootState } from "State/store";
import {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} from "Services/WishlistApiSlice";

import { ProductEcomDetailDTO } from "Interface/Client/Products/product.interface";
import { useGetEcomProductDetailByIdPostMutation } from "Services/ProductApiSlice";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";

import ImageGallery from "Templates/Template4/Components/ProductDetailView/ImageGallery";
import ProductDetailsSection from "Templates/Template4/Components/ProductDetailView/ProductDetailsSection";
import OverviewSection from "Templates/Template4/Components/ProductDetailView/OverviewSection";
import ProductInfoSidebar from "Templates/Template4/Components/ProductDetailView/ProductInfoSidebar";
import ReviewsSection from "Templates/Template4/Components/ProductDetailView/ReviewsSection";
import AuthorBooksSection from "Templates/Template4/Components/ProductDetailView/AuthorBooksSection";
import AssuredHighlights from "Templates/Template4/Components/ProductDetailView/Assurence";

import { ProductDTO } from "Types/ProductDTO";
import { ProductMetaDTO } from "Types/ProductMetaDTO";

import { Heart } from "lucide-react";
import { notifications } from "@mantine/notifications";

const PLANT = process.env.REACT_APP_PLANT;
const DEFAULT_DESC =
  "This is everything I love! Cozy small town romance...";

const ProductDetailView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.login);
  const { productId } = useParams<{ productId: string }>();

  const [quantity, setQuantity] = useState(1);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  const [getEcomProductDetail, { data: ecomProductDetail, isLoading }] =
    useGetEcomProductDetailByIdPostMutation();

  const { data: config } = useGetConfigurationByPlantQuery(PLANT || "");

  const { data: wishlistApiData } = useGetWishlistQuery({
    page: 1,
    productsCount: 100,
  });

  const [addAPI] = useAddToWishlistMutation();
  const [removeAPI] = useRemoveFromWishlistMutation();

  useEffect(() => {
    if (!productId || !PLANT) return;

    const decoded = decodeURIComponent(productId);
    getEcomProductDetail({ plant: PLANT, productId: decoded });
  }, [productId]);

  const isLoadingProduct = isLoading || !ecomProductDetail;

  const productDetail =
    (ecomProductDetail as ProductEcomDetailDTO)?.productDetail;

  const productWrapper: ProductMetaDTO = {
    product: productDetail?.productWrapper?.product ?? {},
    imagePath: productDetail?.productWrapper?.imagePath ?? "",
    promotions: productDetail?.productWrapper?.promotions ?? [],
    productgarmenttype: productDetail?.productGarmentTypeDTO
      ? [productDetail.productGarmentTypeDTO]
      : [],
  };

  const productData: ProductDTO = productWrapper.product;
  const imagePaths = productDetail?.imagePaths ?? [];

  const id = productData.id;
  const itemCode = productData.item;

  useEffect(() => {
    if (!productData || !config) return;

    const qty = productData.availqty ?? 0;
    const allowLT = config.allow_LTAVAILINVQTY ?? 0;

    setIsOutOfStock(allowLT === 0 && qty === 0);
  }, [productData, config]);

  const wishlistItems = wishlistApiData?.results?.products ?? [];

  const isWishlisted = useMemo(() => {
    return wishlistItems.some(
      (w: any) =>
        String(w?.product?.product?.id || w?.product?.id) === String(id)
    );
  }, [wishlistItems, itemCode]);

  const handleToggleWishlist = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      navigate("/wishlist");
      return;
    }

    const itemCode = productData?.item;
    if (!itemCode) return;

    try {
      if (isWishlisted) {
        await removeAPI(itemCode).unwrap();
        notifications.show({ message: "Removed from wishlist", color: "red" });
      } else {
        await addAPI(itemCode).unwrap();
        notifications.show({ message: "Added to wishlist", color: "green" });
      }
    } catch (err) {
      console.error("Wishlist API error:", err);
    }
  };

  const productTitle = productData.itemDesc || "Moore Market";
  const author = productData.author || "Unknown Author";
  const isbn = (productData as any).isbn ?? "N/A";
  const basePrice = productData.ecomUnitPrice ?? 199;
  const mrp = productData.mrp ?? basePrice + 100;

  const detailDesc =
    productDetail?.detailDesc?.join("\n\n") ??
    (ecomProductDetail as any)?.ecomDescription ??
    DEFAULT_DESC;

  if (isLoadingProduct) {
    return (
      <div className="w-full h-96 bg-vintageBg flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="bg-vintageBg min-h-screen font-gilroyRegular tracking-wider w-full pt-8 pb-24 md:pb-8">
      <div className="mx-auto max-w-[1600px] flex gap-16 md:flex-row flex-col px-6 md:px-0">
        {/* LEFT COLUMN */}
        <div className="md:w-[50%] w-full flex flex-col gap-12 pl-0 md:pl-16 lg:pl-20">
          <div className="relative rounded-xl shadow-lg overflow-hidden w-full">
            <ImageGallery
              imagePaths={imagePaths}
              imagePath={productWrapper.imagePath}
            />

            {/* HEART BUTTON */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute right-3 top-3 z-30 p-2 rounded-full shadow-md ${
                isWishlisted ? "bg-white/90" : "bg-vintageBg/90"
              } hover:scale-105 transition`}
            >
              <Heart
                className={`w-6 h-6 ${
                  isWishlisted ? "text-red-600" : "text-vintageText"
                }`}
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/*  MOBILE SIDEBAR */}
          <div className="block md:hidden">
            <ProductInfoSidebar
              productTitle={productTitle}
              author={author}
              isbn={isbn}
              price={basePrice}
              originalPrice={mrp}
              quantity={quantity}
              setQuantity={setQuantity}
              navigate={navigate}
              dispatch={dispatch}
              productData={productData}
              ecomProductDetail={ecomProductDetail}
              ecomConfig={config}
              isOutOfStock={isOutOfStock}
              promotions={productWrapper.promotions}
            />
          </div>

          <ProductDetailsSection productData={productData} />
          <OverviewSection productData={productData} detailDesc={detailDesc} />
          {/* Assurance Card Section */}
            <div className="rounded-md shadow-sm mt-10 font-melodramaRegular px-6 lg:px-16 xl:px-24 py-6 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
    
          {/* 7 Million + Happy Customers */}
            <div className="flex flex-col items-center p-4 text-center">
            <div className="h-8 w-8 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-700">
        7 Million + Happy Customers
      </p>
    </div>

    {/* 100% Original Products */}
    <div className="flex flex-col items-center p-4 text-center">
      <div className="h-8 w-8 text-black">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1l3 5.9 6.5.9-4.7 4.6 1.1 6.5L12 15.9 6.1 19l1.1-6.5-4.7-4.6 6.5-.9L12 1z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-700">
        100% Original Products
      </p>
    </div>

    {/* 32-Point Quality Check */}
    <div className="flex flex-col items-center p-4 text-center">
      <div className="h-8 w-8 text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.285 6.709l-11.025 11.025-5.545-5.545 1.414-1.414 4.131 4.131 9.611-9.611z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-700">
        32 Points Quality Check
      </p>
    </div>

  </div>

    {/* Footer text */}
      <div className="text-sm px-4 py-2 mt-3 rounded-md text-[#326638] text-center">
       Book Covers May Vary. Request Actual Images For Used Books After Ordering.
      </div>
  </div>

          <ReviewsSection />
        </div>

        {/*  DESKTOP VIEW  */}
        <div className="hidden md:block flex-1">
          <ProductInfoSidebar
            productTitle={productTitle}
            author={author}
            isbn={isbn}
            price={basePrice}
            originalPrice={mrp}
            quantity={quantity}
            setQuantity={setQuantity}
            navigate={navigate}
            dispatch={dispatch}
            productData={productData}
            ecomProductDetail={ecomProductDetail}
            ecomConfig={config}
            isOutOfStock={isOutOfStock}
            promotions={productWrapper.promotions}
          />
        </div>
      </div>

      <AuthorBooksSection productData={productData} />
      <AssuredHighlights />
    </div>
  );
};

export default ProductDetailView;
