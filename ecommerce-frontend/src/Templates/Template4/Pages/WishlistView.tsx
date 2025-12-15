import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "State/store";
import { addToCart } from "State/CartSlice/CartSlice";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

import WishlistItemCard from "Templates/Template4/Components/Common/WishlistItemCard";
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "Services/WishlistApiSlice";
import { setWishlist, removeFromWishlist } from "State/WishlistSlice/WishlistSlice";
import type { WishlistItem } from "State/WishlistSlice/WishlistSlice";

const WishlistView: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.login.token);
  const itemsLocal = useSelector((state: RootState) => state.wishlist.items);

  const { data: wishlistResp, isLoading, isError, refetch } = useGetWishlistQuery({
    page: 1,
    productsCount: 100,
  });

  const [addAPI] = useAddToWishlistMutation();
  const [removeAPI] = useRemoveFromWishlistMutation();

  useEffect(() => {
    if (wishlistResp && wishlistResp.results) {
      const products = wishlistResp.results.products ?? [];

      const items = products.map((p: any) => {
        return { product: p } as WishlistItem;
      });

      dispatch(setWishlist(items));
    }
  }, [wishlistResp, dispatch]);

  const handleMoveToCart = (item: WishlistItem) => {
    const p = item.product.product;
    if (!p) return;

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

    dispatch(removeFromWishlist(String(p.item)));

    navigate("/cart");
  };

  const handleRemoveItem = async (itemCode: string) => {
    dispatch(removeFromWishlist(itemCode));

    try {
      await removeAPI(itemCode).unwrap();
      notifications.show({ message: "Removed from wishlist", color: "red" });
    } catch (err) {
      notifications.show({ message: "Failed to remove from wishlist", color: "red" });
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-vintageBg flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-vintageBg px-4 py-10">
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="border border-vintageBorder rounded-md p-6 bg-vintageBg max-w-md text-center shadow-md">
            <p className="text-lg font-semibold text-vintageText mb-4">
              Get Started & Grab the Best Offers!
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full rounded-sm px-4 py-3 font-semibold text-light bg-vintageText hover:bg-opacity-90 active:bg-opacity-80 transition-colors border border-vintageText border-opacity-50 shadow-md"
            >
              Sign In / Sign Up
            </button>

            <p className="text-sm text-gray-700 mt-4">
              Sign In to view and manage your wishlist items.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-10 text-red-600">
        Failed to load wishlist.
      </div>
    );
  }

  const wishlistItems = itemsLocal;

  return (
    <div className="min-h-screen bg-vintageBg px-4 py-10">
      <div className="w-full flex justify-center">
        <h1 className="text-2xl lg:text-3xl xl:text-4xl text-vintageText font-melodramaRegular tracking-wider font-bold">
          My Wishlist
        </h1>
      </div>

      {token && wishlistItems.length === 0 && (
        <div className="text-center text-gray-700 text-lg mt-20">
          Your wishlist is empty 😔
          <br />
          <Link to="/" className="text-vintageText underline font-semibold mt-3 inline-block">
            Continue Shopping
          </Link>
        </div>
      )}

      {token && wishlistItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 justify-center max-w-7xl mx-auto">
          {wishlistItems.map((item, index) => (
            <div key={index}>
              <WishlistItemCard product={item.product} />
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistView;
