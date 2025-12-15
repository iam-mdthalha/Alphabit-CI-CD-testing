import React from "react";
import { BookItem, Coupon } from "Types/CartView";

interface OrderSummaryProps {
  cartItems: BookItem[];
  selectedCoupon: Coupon | null;
  onApplyCoupon: () => void;
  onContinue: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  selectedCoupon,
  onApplyCoupon,
  onContinue,
}) => {
  const calculateTotal = (): number => {
    return cartItems.reduce(
      (total: number, item: BookItem) => total + item.price * item.quantity,
      0
    );
  };

  const calculateSavings = (): number => {
    return cartItems.reduce(
      (savings: number, item: BookItem) =>
        savings + item.savings * item.quantity,
      0
    );
  };

  const calculateTotalPayable = (): number => {
    const total = calculateTotal();
    const discount = selectedCoupon ? selectedCoupon.discount : 0;
    return total - discount;
  };

  return (
    <div className="w-full lg:w-1/3 lg:sticky lg:top-4 h-fit">
      <div className="bg-light bg-opacity-50 rounded-lg shadow-md p-6">
        {/* <h2 className="text-xl font-semibold mb-4 text-vintageText">Apply Coupon</h2> */}
        <div className="mb-6">
          {/* <p className="text-sm text-gray-600 mb-2">2 Coupons Available</p> */}
          {/* <button
            className="w-full py-2 border border-vintageText text-vintageText hover:bg-opacity-90 hover:text-opacity-90 rounded-md font-medium"
            onClick={onApplyCoupon}
          >
            APPLY COUPON
          </button> */}
        </div>

        <h2 className="text-lg font-semibold mb-4">
          Price Details ({cartItems.length} Items)
        </h2>
        <div className="border-b border-vintageBorder pb-4 mb-4">
          <div className="flex justify-between mb-2">
            <span>Total Price ({cartItems.length} items)</span>
            <span>₹{calculateTotal()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span className="text-green-600">Free Delivery</span>
          </div>
        </div>

        <div className="flex justify-between font-semibold text-lg mb-4">
          <span>Total Payable Amount</span>
          <span>₹{calculateTotalPayable()}</span>
        </div>

        {selectedCoupon && (
          <div className="bg-light bg-opacity-50 p-3 rounded-md mb-4">
            <div className="flex justify-between">
              <span className="text-green-700">Coupon Applied</span>
              <span className="text-green-700">
                -₹{selectedCoupon.discount}
              </span>
            </div>
            <p className="text-sm text-green-700">{selectedCoupon.code}</p>
          </div>
        )}

        <p className="text-green-700 font-medium mb-6">
          You will save ₹
          {calculateSavings() + (selectedCoupon ? selectedCoupon.discount : 0)}{" "}
          on this order
        </p>

        <button
          className="w-full py-3 bg-vintageText hover:bg-opacity-90 text-white rounded-md font-medium"
          onClick={onContinue}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
