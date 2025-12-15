import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromWishlist } from "State/WishlistSlice/WishlistSlice";
import { addToCart } from "State/CartSlice/CartSlice";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { X } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { useRemoveFromWishlistMutation } from "Services/WishlistApiSlice";

interface Props {
  product: ProductMetaDTO;
}

const WishlistItemCard: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [removeAPI] = useRemoveFromWishlistMutation();


  const handleRemove = async () => {
    const itemCode = String(product.product.item);

    // Remove locally
    dispatch(removeFromWishlist(itemCode));

    try {
      await removeAPI(itemCode).unwrap();
      notifications.show({ message: "Removed from wishlist", color: "red" });
    } catch (err) {
      notifications.show({ message: "Failed to remove item", color: "red" });
    }
  };

  /** 🟢 MOVE TO CART */
  const handleMoveToCart = async () => {
    const p = product.product;
    if (!p) return;

    // Add to cart locally
    dispatch(
      addToCart({
        productId: p.item,
        quantity: 1,
        availableQuantity: p.availqty || 0,
        ecomUnitPrice: p.ecomUnitPrice || 0,
        discount: 0,
        size: "",
      })
    );

    // Remove from wishlist locally
    dispatch(removeFromWishlist(String(p.item)));

    // ⭐ Show success notification BEFORE redirect
    notifications.show({
      message: `${p.itemDesc} added to cart`,
      color: "green",
    });

    // Small delay so user can see the success message
    setTimeout(() => {
      navigate("/cart");
    }, 500);
  };

  return (
    <div className="relative bg-vintageBg rounded-xl shadow-md p-3 flex flex-col transition hover:shadow-lg hover:-translate-y-1 duration-200">
      
      {/* ❌ Remove button */}
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100"
        aria-label="remove wishlist item"
      >
        <X className="w-5 h-5 text-red-600" />
      </button>

      <Link to={`/${encodeURIComponent(product.product.item)}`}>
        <img
          src={product.imagePath}
          alt={product.product.itemDesc}
          className="w-full h-64 object-contain rounded-xl bg-white"
        />
      </Link>

      <div className="mt-3 px-1">
        <Link
          to={`/${encodeURIComponent(product.product.item)}`}
          className="font-semibold text-base text-vintageText hover:underline leading-tight"
        >
          {product.product.itemDesc}
        </Link>

        <p className="text-xs text-gray-700 mt-1">
          {product.product.author || "Unknown Author"}
        </p>

        <p className="font-bold mt-1 text-vintageText">
          ₹{product.product.ecomUnitPrice}
        </p>
      </div>

      {/* 🟢 Move to Cart */}
      <button
        onClick={handleMoveToCart}
        className="mt-3 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2 rounded-lg w-full"
      >
        Move to Cart
      </button>
    </div>
  );
};

export default WishlistItemCard;
