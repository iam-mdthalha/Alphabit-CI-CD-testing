import React from "react";
import { CartItem } from "Types/PlaceOrderView";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { CheckCircle, RotateCcw } from "lucide-react";

interface OrderItemCardProps {
  cartItem: CartItem;
  product: ProductMetaDTO;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ cartItem, product }) => {
  const price = product.product.ecomUnitPrice;
  const mrp = product.product.mrp || price;
  const savings = Math.max(0, mrp - price);

  return (
    <div className="border-b border-vintageBorder pb-4 mb-6 last:border-b-0 last:mb-0">
      <div className="flex gap-3 lg:gap-4">
        <div className="flex-shrink-0">
          <img
            src={product.imagePath}
            alt={product.product.itemDesc}
            className="w-16 h-20 lg:w-20 lg:h-28 object-cover rounded border border-vintageBorder"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2 gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-base lg:text-xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular leading-tight mb-1 truncate">
                {product.product.itemDesc}
              </h3>
              <p className="text-xs lg:text-lg font-gilroyRegular text-gray-600 truncate">
                {product.product.author}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <span className="text-xs lg:text-lg px-2 py-1 rounded text-[#326638] border border-vintageBorder font-gilroyRegular w-fit">
              Condition: New
            </span>
            <span className="text-xs lg:text-lg text-dark font-gilroyRegular">
              Qty: {cartItem.quantity}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-base lg:text-xl font-semibold text-dark font-gilroyRegular">
              ₹{price}
            </span>
            {savings > 0 && (
              <>
                <span className="text-xs lg:text-lg text-dark line-through font-gilroyRegular">
                  ₹{mrp}
                </span>
                <span className="text-xs lg:text-lg text-vintageText font-medium font-gilroyRegular">
                  {Math.round((savings / mrp) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {savings > 0 && (
            <div className="mb-3">
              <span className="text-xs lg:text-sm text-green-600 font-gilroyRegular">
                You save ₹{savings * cartItem.quantity}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#326638] pt-2 text-xs lg:text-sm text-dark leading-snug">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-vintageText w-3 h-3 lg:w-4 lg:h-4" />
              <span>Ships within 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="text-dark w-3 h-3 lg:w-4 lg:h-4" />
              <span>7 days replacement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemCard;
