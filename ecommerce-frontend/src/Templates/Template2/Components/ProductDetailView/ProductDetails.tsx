"use client";

import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ProductEcomDetailDTO } from "Interface/Client/Products/product.interface";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { useUpdateCustomerCartMutation } from "Services/CartApiSlice";
import {
  useGetEcomProductDetailByCollarPostMutation,
  useGetEcomProductDetailByColorPostMutation,
  useGetEcomProductDetailBySizePostMutation,
} from "Services/ProductApiSlice";
import { addToCart } from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import SizeGuideModal from "Templates/Template2/Components/ProductDetailView/SizeGuideModal";
import { Promotion } from "Types/ProductMetaDTO";

interface SizeWithAvailability {
  data: string;
  productId: string | null;
  availQty: number;
}

interface ProductDetailsProps {
  productDetail: {
    productWrapper: {
      product: {
        item: string;
        itemDesc: string;
        ecomUnitPrice: number;
        stockQty: number;
        itemGroupId?: string;
        minimumAvailableInventoryQuantity?: number;
        availqty?: number;
        prvsales?: number;
      };
      imagePath: string;
      promotions: any[];
    };
    categoryWrapper: {
      id: string;
      category: string;
    };
    subCategoryWrapper: {
      id: string;
      subCategory: string;
    };
    brandWrapper: {
      id: string;
      brand: string;
    };
    additionalProducts: any[];
    detailDesc: string[];
    imagePaths: string[];
    productGarmentTypeDTO: {
      fabric?: string;
      occasion?: string;
      pattern?: string;
      color?: string;
      collar?: string;
      size?: string;
      sleeve?: string;
    };
    ecomDescription?: string;
    remarkTwo?: string;
    labelPara1?: string;
    labelPara2?: string;
    labelPara3?: string;
    labelPara4?: string;
    labelPara5?: string;
    labelPara6?: string;
    labelPara7?: string;
    labelPara8?: string;
    parameter1?: string;
    parameter2?: string;
    parameter3?: string;
    parameter4?: string;
    parameter5?: string;
    parameter6?: string;
    parameter7?: string;
    parameter8?: string;
    ecomConfig?: {
      prvsales_PERIOD?: number;
      show_PRVSALES?: number;
      show_MINAVAILINVQTY?: number;
      allow_LTAVAILINVQTY?: number;
    };
  };
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedSleeve: string;
  setSelectedSleeve: (sleeve: string) => void;
  selectedColor: string;
  setSelectedColor: (Colour: string) => void;
  availableSizes: { data: string; productId: string; availQty: number }[];
  availableSleeves: string[];
  availableColors: string[];
  ecomProductDetail?: ProductEcomDetailDTO;
  selectedImage: string;
  setSelectedImage: (image: string) => void;
  onImageItemClick: (itemId: string) => void;
  allImages: { item: string; color: string; image: string }[];
  ecomConfig?: {
    prvsales_PERIOD?: number;
    show_PRVSALES?: number;
    show_MINAVAILINVQTY?: number;
    allow_LTAVAILINVQTY?: number;
  };
  promotions: Promotion[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  productDetail,
  selectedSize,
  setSelectedSize,
  selectedSleeve,
  setSelectedSleeve,
  selectedColor,
  setSelectedColor,
  availableSizes,
  availableSleeves,
  availableColors,
  ecomProductDetail,
  selectedImage,
  setSelectedImage,
  onImageItemClick,
  allImages,
  ecomConfig,
  promotions,
}) => {
  const PLANT = process.env.REACT_APP_PLANT;
  const dispatch: AppDispatch = useDispatch();
  const { productId } = useParams();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const { token } = useSelector((state: RootState) => state.login);
  const [updateCustomerCart] = useUpdateCustomerCartMutation();
  const { data: ecomConfigData } = useGetConfigurationByPlantQuery(PLANT || "");
  const numberOfDecimal =
    ecomConfigData &&
    ecomConfigData.numberOfDecimal !== undefined &&
    ecomConfigData.numberOfDecimal !== null
      ? parseInt(ecomConfigData.numberOfDecimal, 10)
      : 0;

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    "description"
  );
  const [quantity, setQuantity] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [showPromoDetails, setShowPromoDetails] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [isQuantityExceeded, setIsQuantityExceeded] = useState(false);

  // const [fabricLabel, setFabricLabel] = useState<string | null>(null);
  // const [occasionLabel, setOccasionLabel] = useState<string | null>(null);
  // const [patternLabel, setPatternLabel] = useState<string | null>(null);

  // const [getFabric] = useLazyGetFabricByIdQuery();
  // const [getOccasion] = useLazyGetOccasionByIdQuery();
  // const [getPattern] = useLazyGetPatternByIdQuery();

  const itemGroupId = productDetail?.productWrapper?.product?.itemGroupId || "";
  const collar = productDetail?.productGarmentTypeDTO?.collar || "";
  const availqty = productDetail?.productWrapper?.product.availqty || 0;
  const allowLTAVAILINVQTY = ecomConfig?.allow_LTAVAILINVQTY || 0;

  useEffect(() => {
    if (
      !selectedSize &&
      ecomProductDetail?.allSize &&
      ecomProductDetail.allSize.length > 0
    ) {
      try {
        const firstSize = ecomProductDetail.allSize[0]?.data;
        if (firstSize) {
          setSelectedSize(firstSize);
        }
      } catch (error) {
        console.error("Error setting initial size:", error);
      }
    }
  }, [ecomProductDetail?.allSize, selectedSize, setSelectedSize]);

  useEffect(() => {
    if (allowLTAVAILINVQTY === 0 && availqty === 0) {
      setIsOutOfStock(true);
    } else {
      setIsOutOfStock(false);
    }
  }, [allowLTAVAILINVQTY, availqty]);

  useEffect(() => {
    if (allowLTAVAILINVQTY === 0 && quantity > availqty) {
      setIsQuantityExceeded(true);
      // notifications.show({
      //   title: "Quantity exceeded",
      //   message: `You cannot add more than ${availqty} items to cart`,
      //   color: "red",
      // });
    } else {
      setIsQuantityExceeded(false);
    }
  }, [quantity, availqty, allowLTAVAILINVQTY]);

  const [triggerCollarQuery] = useGetEcomProductDetailByCollarPostMutation();
  const [triggerColorQuery] = useGetEcomProductDetailByColorPostMutation();
  const [triggerSizeQuery] = useGetEcomProductDetailBySizePostMutation();

  const getImageSrc = (base64String: string) => {
    if (!base64String) return "";
    try {
      return `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      console.error("Error converting image:", error);
      return "";
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleSleeveSelect = (sleeve: string) => {
    setSelectedSleeve(sleeve);
    if (itemGroupId && PLANT && collar) {
      triggerCollarQuery({
        collar,
        itemgroupid: itemGroupId,
        plant: PLANT,
      })
        .unwrap()
        .then((data) => {});
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (itemGroupId && PLANT && color) {
      triggerColorQuery({
        color,
        itemgroupid: itemGroupId,
        plant: PLANT,
      })
        .unwrap()
        .then((data) => {});
    }
  };

  // useEffect(() => {
  //   const fetchLabels = async () => {
  //     try {
  //       if (productDetail?.productGarmentTypeDTO?.fabric) {
  //         const { data: fabricData } = await getFabric({
  //           id: parseInt(productDetail.productGarmentTypeDTO.fabric),
  //           plant: process.env.REACT_APP_PLANT
  //         });
  //         if (fabricData) setFabricLabel(fabricData.prd_fabric);
  //       }

  //       if (productDetail?.productGarmentTypeDTO?.occasion) {
  //         const { data: occasionData } = await getOccasion({
  //           id: parseInt(productDetail.productGarmentTypeDTO.occasion),
  //           plant: process.env.REACT_APP_PLANT
  //         });
  //         if (occasionData) setOccasionLabel(occasionData.prd_occasion_desc);
  //       }

  //       if (productDetail?.productGarmentTypeDTO?.pattern) {
  //         const { data: patternData } = await getPattern({
  //           id: parseInt(productDetail.productGarmentTypeDTO.pattern),
  //           plant: process.env.REACT_APP_PLANT
  //         });
  //         if (patternData) setPatternLabel(patternData.prd_pattern_desc);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching labels:", error);
  //     }
  //   };

  //   if (productDetail) {
  //     fetchLabels();
  //   }
  // }, [productDetail, getFabric, getOccasion, getPattern]);

  const handleApplyPromo = () => {
    notifications.show({
      message: promoCode
        ? `Promo code ${promoCode} applied`
        : "Please enter a promo code",
      color: "green",
    });
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  //#region Handle Add To Cart
  const handleAddToCart = async () => {
    if (!productDetail) return;

    const product = productDetail.productWrapper.product;

    if (token) {
      try {
        await updateCustomerCart([
          { item: product.item, quantity: quantity, size: selectedSize },
        ]).unwrap();

        dispatch(
          addToCart({
            productId: product.item,
            quantity: quantity,
            availableQuantity: product.availqty || 0,
            ecomUnitPrice: Number(product.ecomUnitPrice),
            discount: discountedPrice,
            size: selectedSize,
          })
        );
    

        notifications.show({
          message: `${product.itemDesc} is added to cart successfully`,
          color: "green",
        });
      } catch (err: any) {
        if (err.status === 409) {
          notifications.show({
            title: "Quantity exceeded",
            message: `You cannot add more than ${availqty} items to cart`,
            color: "red",
          });
        }
        console.error("Failed to update cart:", err);
      }
    } else {
      dispatch(
        addToCart({
          productId: product.item,
          quantity: quantity,
          availableQuantity: product.availqty || 0,
          ecomUnitPrice: Number(product.ecomUnitPrice),
          discount: discountedPrice,
          size: selectedSize,
        })
      );

      notifications.show({
        message: `${product.itemDesc} is added to cart successfully`,
        color: "green",
      });

    }
  };
  //#endregion

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;

    if (allowLTAVAILINVQTY === 0 && newQuantity > availqty) {
      notifications.show({
        title: "Quantity exceeded",
        message: `You cannot add more than ${availqty} items to cart`,
        color: "red",
      });
      setIsQuantityExceeded(true);
    } else {
      setQuantity(newQuantity);
      setIsQuantityExceeded(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setIsQuantityExceeded(false);
    }
  };

  const calculateDiscountedPrice = () => {
    const basePrice = productDetail.productWrapper.product.ecomUnitPrice || 0;

    // Filter ByValue promotions
    const byValuePromos = productDetail.productWrapper.promotions?.filter(
      (p) => p.promotionBy === "ByValue"
    );

    if (!byValuePromos || byValuePromos.length === 0) return basePrice;

    // Use the first active ByValue promotion (you can enhance this later)
    const promo = byValuePromos[0];

    if (promo.promotionType === "%") {
      return basePrice - (basePrice * promo.promotion) / 100;
    }

    if (promo.promotionType === "INR") {
      return basePrice - promo.promotion;
    }

    return basePrice;
  };

  const calculateDiscountedPercentage = () => {
    const basePrice = productDetail.productWrapper.product.ecomUnitPrice || 0;

    const byValuePromos = productDetail.productWrapper.promotions?.filter(
      (p) => p.promotionBy === "ByValue"
    );

    if (!byValuePromos || byValuePromos.length === 0) return 0;

    const promo = byValuePromos[0];

    if (promo.promotionType === "%") {
      return promo.promotion;
    }

    if (promo.promotionType === "INR") {
      const promoPrice: number = basePrice - promo.promotion;
      return ((basePrice - promoPrice) / basePrice) * 100;
    }

    return 0;
  };

  const discountedPrice = calculateDiscountedPrice();
  const discountedPercentage = calculateDiscountedPercentage();

  if (!productDetail) return <div className="flex justify-center items-center w-full min-h-screen"><p>Product not found</p></div>;

  return (
    <div>
      <h1 className="text-lg font-medium uppercase mb-2">
        {productDetail?.productWrapper.product.itemDesc}
      </h1>
      {discountedPrice <
      (productDetail.productWrapper.product.ecomUnitPrice || 0) ? (
        <div className="text-start mb-1 flex space-x-2">
          <p className="text-xs text-red-600 font-bold uppercase line-through">
            ₹{productDetail.productWrapper.product.ecomUnitPrice?.toFixed(
              numberOfDecimal
            )}
          </p>
          <p className="text-xs text-green-700 font-bold uppercase">
            ₹{discountedPrice.toFixed(numberOfDecimal)}
          </p>
          {discountedPercentage !== 0 && (
            <p className="text-xs text-green-700 font-bold uppercase">
              ({discountedPercentage.toFixed(numberOfDecimal)} % Offer)
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-600 uppercase font-bold text-start mb-1">
          ₹{productDetail.productWrapper.product.ecomUnitPrice?.toFixed(
            numberOfDecimal
          )}
        </p>
      )}
      {/* <div className="flex gap-2 items-center">
        <p className="text-gray-600 text-xs font-medium mb-2 line-through">
          Rs.
          {productDetail?.productWrapper.product.ecomUnitPrice?.toFixed(0)}
        </p>
        <p className="text-sm md:text-md font-bold mb-2">
          Rs.
          {productDetail?.productWrapper.product.ecomUnitPrice?.toFixed(0) - 30}
        </p>
        <p className="text-red-600 text-xs font-semibold mb-2">
          30%
        </p>
      </div> */}
      <p className="text-gray-600 text-xs font-medium mb-2">
        (Inclusive of all taxes)
      </p>

      {promotions?.length > 0 && (
        <div className="relative mb-2">
          <div className="flex gap-1 flex-wrap">
            {promotions.map((promo: Promotion, index) => (
              <span
                key={index}
                className="bg-yellow-500 text-[0.5rem] text-white uppercase px-2 py-1 shadow-sm rounded-sm"
              >
                {promo.promotionName}
              </span>
            ))}
          </div>
        </div>
      )}

      {ecomConfig?.show_PRVSALES != 0 && (
        <p className="text-xs font-medium mb-2 text-red-500 flex items-center gap-1">
          🔥{productDetail.productWrapper.product.prvsales || 0} sold in last{" "}
          {ecomConfig?.prvsales_PERIOD || ""} days
        </p>
      )}
      <hr className="my-4 border-gray-300" />
      <div className="my-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium">
            Size:{" "}
            <span className="text-xs text-gray-600">
              {selectedSize || "Select a Size"}
            </span>
          </h2>
          <button
            className="text-xs font-bold text-blue-600"
            onClick={() => setIsSizeGuideOpen(true)}
          >
            Size Guide &gt;
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {(
            ecomProductDetail?.allSize as unknown as SizeWithAvailability[]
          )?.map?.((sizeObj) => {
            try {
              const size = sizeObj?.data;
              if (!size) return null;

              const isAvailable =
                ecomConfigData?.allow_LTAVAILINVQTY === 1 && ecomProductDetail?.availableSize.find(d => d.data === size)
                  ? true
                  : sizeObj.availQty > 0;

              return (
                <button
                  key={size}
                  className={`p-2 border rounded text-sm ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : isAvailable
                      ? "bg-white hover:bg-gray-100"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => isAvailable && handleSizeSelect(size)}
                  disabled={!isAvailable}
                >
                  {size}
                </button>
              );
            } catch (error) {
              console.error("Error rendering size button:", error);
              return null;
            }
          })}
        </div>
      </div>
      {/* <div className="my-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium">
            Sleeve:{" "}
            <span className="text-xs text-gray-600">
              {selectedSleeve || "Select a Size"}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {ecomProductDetail?.allSleeve.map((sleeveObj) => {
            const sleeve = sleeveObj.data;
            const isAvailable = availableSleeves.includes(sleeve);
            return (
              <button
                key={sleeve}
                className={`p-2 border rounded text-sm ${
                  selectedSleeve === sleeve
                    ? "bg-gray-300"
                    : isAvailable
                    ? "bg-white hover:bg-gray-100"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => isAvailable && handleSleeveSelect(sleeve)}
                disabled={!isAvailable}
              >
                {sleeve}
              </button>
            );
          })}
        </div>
      </div> */}
      {/* <div className="my-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium">Color: <span className="text-xs text-gray-600">{selectedColor || "Select a colour"}</span></h2>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {ecomProductDetail?.allColors.map((colorObj) => {
            const color = colorObj.data;
            const isAvailable = availableColors.includes(color);
            return (
              <button
                key={color}
                className={`p-2 border rounded text-sm ${selectedColor === color
                  ? 'bg-gray-300'
                  : isAvailable
                    ? 'bg-white hover:bg-gray-100'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                onClick={() => isAvailable && handleColorSelect(color)}
                disabled={!isAvailable}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div> */}
      {/* <div className="my-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium">Pattern</h2>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {allImages.map((imgObj: any) => {
            //TODO: Modify Pattern Image
            const imageSrc = imgObj.image;
            return (
              <button
                key={imageSrc}
                className={`p-2 border rounded ${
                  selectedImage === imageSrc
                    ? "bg-gray-300"
                    : "bg-white hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedImage(imageSrc);
                  onImageItemClick(encodeURIComponent(imgObj.item));
                }}
              >
                <img
                  src={imageSrc}
                  alt="Product variant"
                  className="w-full h-16 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "placeholder.jpg";
                  }}
                />
              </button>
            );
          })}
        </div>
      </div> */}
      <div className="mb-4">
        <h2 className="text-sm font-medium mb-2">Quantity</h2>
        <div className="flex items-center border rounded w-24">
          <button
            className="px-2 py-1 border-r bg-gray-100"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="flex-1 text-center">{quantity}</span>
          <button
            className="px-2 py-1 border-l bg-gray-100"
            onClick={increaseQuantity}
          >
            +
          </button>
        </div>
      </div>
      {/* <div className="mb-4 border rounded p-2">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Add a Promo Code"
              className="w-full p-1 text-sm border-none focus:outline-none"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
          </div>
          <button
            className="text-sm font-bold text-blue-600 px-2"
            onClick={() => setShowPromoDetails(!showPromoDetails)}
          >
            {showPromoDetails ? "▲" : "▼"}
          </button>
          <button
            className="text-xs font-bold border border-black bg-white text-black text-montserrat px-4 py-2 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
            onClick={handleApplyPromo}
          >
            APPLY
          </button>
        </div>
        {showPromoDetails && (
          <div className="mt-2 text-xs text-gray-600">
            <p>Enter your promo code to get discounts</p>
          </div>
        )}
      </div> */}
      {typeof isOutOfStock === "boolean"
        ? isOutOfStock && (
            <p className="text-red-600 text-xs font-medium mb-2">
              Out of stock
            </p>
          )
        : productDetail?.productWrapper?.product?.availqty !== undefined &&
          productDetail?.productWrapper?.product
            ?.minimumAvailableInventoryQuantity !== undefined &&
          (productDetail.productWrapper.product.availqty === 0 ? (
            <p className="text-red-600 text-xs font-medium mb-2">
              Out of stock
            </p>
          ) : (
            productDetail.productWrapper.product.availqty <=
              productDetail.productWrapper.product
                .minimumAvailableInventoryQuantity && (
              <p className="text-red-600 text-xs font-medium mb-2">
                Only {productDetail.productWrapper.product.availqty} left in
                stock
              </p>
            )
          ))}

      <div className="w-full flex flex-col gap-2 mb-4">
        <button
          className={`w-full uppercase tracking-widest text-xs font-semibold px-8 py-4 transition-all duration-300 ease-in-out relative overflow-hidden group ${
            isOutOfStock
              ? "bg-gray-400 text-white border-gray-400 cursor-not-allowed"
              : "bg-black text-white border border-black hover:border-black hover:bg-white hover:text-black"
          }`}
          onClick={handleAddToCart}
          disabled={isOutOfStock || isQuantityExceeded}
        >
          <span className="relative z-10">Add To Cart</span>
          <span className="absolute inset-0 bg-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
        </button>
      </div>
      <div className="mb-4">
        <div
          className="w-full text-left cursor-pointer py-2 border-b"
          onClick={() => toggleAccordion("description")}
        >
          <h3 className="text-sm font-medium">Details</h3>
        </div>
        {activeAccordion === "description" && (
          <div className="py-2 text-sm">
            <p className="text-gray-600">{productDetail?.detailDesc[0]}</p>
            <ul className="mt-2 space-y-1 text-xs font-medium">
              {productDetail?.productGarmentTypeDTO?.fabric && (
                <li className="capitalize">
                  - Fabric: {productDetail.productGarmentTypeDTO.fabric}
                </li>
              )}
              {productDetail?.productGarmentTypeDTO?.occasion && (
                <li className="capitalize">
                  - Occasion: {productDetail.productGarmentTypeDTO.occasion}
                </li>
              )}
              {productDetail?.productGarmentTypeDTO?.pattern && (
                <li className="capitalize">
                  - Pattern: {productDetail.productGarmentTypeDTO.pattern}
                </li>
              )}
              {productDetail?.labelPara1 && productDetail?.parameter1 && (
                <li>
                  - {productDetail.labelPara1}: {productDetail.parameter1}
                </li>
              )}
              {productDetail?.labelPara2 && productDetail?.parameter2 && (
                <li>
                  - {productDetail.labelPara2}: {productDetail.parameter2}
                </li>
              )}
              {productDetail?.labelPara3 && productDetail?.parameter3 && (
                <li>
                  - {productDetail.labelPara3}: {productDetail.parameter3}
                </li>
              )}
              {productDetail?.labelPara4 && productDetail?.parameter4 && (
                <li>
                  - {productDetail.labelPara4}: {productDetail.parameter4}
                </li>
              )}
              {productDetail?.labelPara5 && productDetail?.parameter5 && (
                <li>
                  - {productDetail.labelPara5}: {productDetail.parameter5}
                </li>
              )}
              {productDetail?.labelPara6 && productDetail?.parameter6 && (
                <li>
                  - {productDetail.labelPara6}: {productDetail.parameter6}
                </li>
              )}
              {productDetail?.labelPara7 && productDetail?.parameter7 && (
                <li>
                  - {productDetail.labelPara7}: {productDetail.parameter7}
                </li>
              )}
              {productDetail?.labelPara8 && productDetail?.parameter8 && (
                <li>
                  - {productDetail.labelPara8}: {productDetail.parameter8}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {productDetail?.remarkTwo && (
        <div className="mb-4">
          <div
            className="w-full text-left cursor-pointer py-2 border-b"
            onClick={() => toggleAccordion("more-details")}
          >
            <h3 className="text-sm font-medium">
              More Details about the product
            </h3>
          </div>
          {activeAccordion === "more-details" && (
            <div className="py-2 text-sm">
              <p>{productDetail.remarkTwo}</p>
            </div>
          )}
        </div>
      )}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
};

export default ProductDetails;
