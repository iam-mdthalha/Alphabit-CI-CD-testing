import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { useUpdateCustomerCartMutation } from "Services/CartApiSlice";
import { addToCart } from "State/CartSlice/CartSlice";
import { RootState } from "State/store";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { Heart } from "lucide-react";
import { toggleWishlist } from "State/WishlistSlice/WishlistSlice";
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from "Services/WishlistApiSlice";

interface ProductCardProps {
  product: ProductMetaDTO;
}

const PLANT = process.env.REACT_APP_PLANT;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state: RootState) => state.login);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const [updateCustomerCart] = useUpdateCustomerCartMutation();
  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");

  const [addAPI] = useAddToWishlistMutation();
  const [removeAPI] = useRemoveFromWishlistMutation();

  const numberOfDecimal =
    ecomConfig && ecomConfig.numberOfDecimal != null ? parseInt(ecomConfig.numberOfDecimal, 10) : 0;

  const calculateDiscountedPrice = () => {
    const basePrice = product.product.ecomUnitPrice || 0;
    const promotions = product.promotions || [];
    const promo = promotions.find((p: any) => p.promotionBy === "ByValue");
    if (!promo) return basePrice;
    if (promo.promotionType === "%") {
      return basePrice - (basePrice * promo.promotion) / 100;
    }
    if (promo.promotionType === "INR") {
      return basePrice - promo.promotion;
    }
    return basePrice;
  };

  const productId = String(product.product.id);

  
  const isWishlisted =
    token && wishlistItems.some((i: any) => String(i.product.product.id) === productId);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

   
    if (!token) {
      navigate("/wishlist");
      return;
    }

    
    dispatch(toggleWishlist({ product } as any));

    const itemCode = product.product.item;

    if (!itemCode) {
      notifications.show({ message: "Invalid product item", color: "red" });
      dispatch(toggleWishlist({ product } as any));
      return;
    }

    try {
      if (isWishlisted) {
        await removeAPI(itemCode).unwrap();
        notifications.show({ message: "Removed from wishlist", color: "red" });
      } else {
        await addAPI(itemCode).unwrap();
        notifications.show({ message: "Added to wishlist", color: "green" });
      }
    } catch (err) {
      dispatch(toggleWishlist({ product } as any));
      console.error("Wishlist API error:", err);
     
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const productData = product.product;
    if (!productData) return;

    const discountedPrice = calculateDiscountedPrice();

    try {
      if (token) {
        await updateCustomerCart([{ item: productData.item, quantity: 1, size: "" }]).unwrap();
      }

      dispatch(
        addToCart({
          productId: productData.item,
          quantity: 1,
          availableQuantity: productData.availqty || 0,
          ecomUnitPrice: productData.ecomUnitPrice || 0,
          discount: discountedPrice,
          size: "",
        })
      );

      notifications.show({
        message: `${productData.itemDesc} added to cart successfully`,
        color: "green",
      });
    } catch (err) {
      notifications.show({ title: "Error", message: "Failed to add product to cart", color: "red" });
    }
  };

  return (
    <div
      className="font-gilroyRegular leading-wider h-full flex flex-col overflow-hidden group"
      data-aos="zoom-in"
    >
      <Link
        to={`/${encodeURIComponent(product.product.item)}`}
        onClick={() => window.scrollTo(0, 0)}
        className="flex flex-col h-full"
      >
        <div className="relative overflow-hidden rounded-xl">
          <button
            onClick={handleToggleWishlist}
            className={`absolute right-2 top-2 z-20 p-1 rounded-full transition ${
              isWishlisted ? "bg-white/90" : "bg-vintageBg/80"
            } hover:scale-105`}
            aria-label="wishlist"
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? "text-red-600" : "text-vintageText"}`}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>

          {imageError || !product.imagePath ? (
            <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-xl">
              <span className="text-xs text-gray-500">No Image</span>
            </div>
          ) : (
            <img
              src={product.imagePath}
              alt={product.product.itemDesc}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        <div className="flex flex-col flex-1 justify-between p-2">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold line-clamp-2 h-[2.75rem] capitalize">
              {product.product.itemDesc}
            </h3>

            <div className="flex items-center gap-1 text-xs ml-2">
              <span className="font-medium">5.0</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="#d9b903ff"
                viewBox="0 0 24 24"
              >
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679..." />
              </svg>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-4 capitalize">
            {product.product.author || "unknown Author"}
          </p>

          <div className="flex justify-between items-start gap-2">

                <div className="flex flex-col space-y-0.5 h-[62px]">

              {(() => {
                const basePrice = product.product.ecomUnitPrice || 0;
                const discountedPrice = calculateDiscountedPrice();

                if (discountedPrice < basePrice) {
                  const discountPercent = Math.round(
                    ((basePrice - discountedPrice) / basePrice) * 100
                  );
                  return (
                    <>
                      <span className="text-sm font-extrabold text-vintageText">
                        ₹{discountedPrice.toFixed(numberOfDecimal)}
                      </span>
                      <del className="text-xs text-gray-500">
                        ₹{basePrice.toFixed(numberOfDecimal)}
                      </del>
                      <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded-full">
                        -{discountPercent}%
                      </span>
                    </>
                  );
                }

                return (
                  <span className="text-sm font-extrabold text-vintageText">
                    ₹{basePrice.toFixed(numberOfDecimal)}
                  </span>
                );
              })()}
            </div>

            <svg
              onClick={handleAddToCart}
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              className="w-5 h-5 flex-shrink-0 cursor-pointer"
            >
              <path d="m15 11-1 9" />
              <path d="m19 11-4-7" />
              <path d="M2 11h20" />
              <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
              <path d="M4.5 15.5h15" />
              <path d="m5 11 4-7" />
              <path d="m9 11 1 9" />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
