import React from "react";
import { BookItem } from "Types/CartView";

interface CartItemProps {
  item: BookItem;
  isSaved?: boolean;
  onRemove: () => void;
  onMoveToCart?: () => void;
  onQuantityChange: (id: number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  isSaved = false,
  onRemove,
  onMoveToCart,
  onQuantityChange,
}) => {
  return (
    <div className="font-montserrat border-b border-vintageBorder pb-6 mb-6">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-3/4">
          <h3 className="text-lg font-semibold text-vintageText">{item.title}</h3>
          {item.author && (
            <p className="text-sm text-gray-600">{item.author}</p>
          )}
          <p className="text-sm text-gray-600 mb-2">
            Condition: {item.condition}
          </p>
          <div className="flex items-center mb-2">
            <span className="text-gray-600 mr-2">Qty:</span>
            <select
              className="border border-gray-300 rounded-md px-2 py-1"
              value={item.quantity}
              onChange={(e) =>
                onQuantityChange(item.id, parseInt(e.target.value))
              }
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-lg font-bold text-green-700">
              ₹{item.price}
            </span>
            <span className="text-md text-gray-500 line-through ml-2">
              ₹{item.originalPrice}
            </span>
            <span className="text-sm text-green-700 font-medium ml-2">
              {item.discount}
            </span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            You save ₹{item.savings}
          </p>
          <div className="mt-3 text-sm">
            <p className="text-gray-600">{item.shipping}</p>
            <p className="text-green-700 font-medium">{item.replacement}</p>
          </div>
        </div>
        <div className="md:w-1/4 mt-4 md:mt-0 flex justify-end">
          <div className="h-40 w-28 bg-vintageBorder rounded-md shadow-md flex items-center justify-center">
            <span className="text-gray-500">Book Cover</span>
          </div>
        </div>
      </div>
      {!isSaved && (
        <div className="flex justify-end mt-4">
          <button className="text-red-500 font-medium" onClick={onRemove}>
            <i className="fas fa-trash-alt mr-1"></i> Remove
          </button>
        </div>
      )}
      {isSaved && (
        <div className="flex justify-end mt-4">
          <button
            className="text-blue-500 font-medium mr-4"
            onClick={onMoveToCart}
          >
            Move to Cart
          </button>
          <button className="text-red-500 font-medium" onClick={onRemove}>
            <i className="fas fa-trash-alt mr-1"></i> Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default CartItem;
