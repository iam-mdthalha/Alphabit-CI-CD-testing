import React from 'react';
import { BookItem } from 'Types/PlaceOrderView';
import { Address } from 'Templates/Template4/Components/PlaceOrderView/AddressForm';

interface OrderSummaryProps {
  cartItems: BookItem[];
  selectedCoupon: any;
  address: Address | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems, selectedCoupon, address }) => {
  const calculateTotal = (): number => {
    return cartItems.reduce((total: number, item: BookItem) => total + item.price * item.quantity, 0);
  };

  const calculateSavings = (): number => {
    return cartItems.reduce((savings: number, item: BookItem) => savings + item.savings * item.quantity, 0);
  };

  const calculateTotalPayable = (): number => {
    const total = calculateTotal();
    const discount = selectedCoupon ? selectedCoupon.discount : 0;
    return total - discount;
  };

  return (
    <div className="my-12 md:my-20">
      <h2 className="text-xl font-semibold text-vintageText mb-4">Order Summary</h2>
      
      <div className="bg-light bg-opacity-50 p-4 rounded-md mb-6">
        <h3 className="font-medium mb-2">Delivery Address</h3>
        {address ? (
          <div>
            <p className="font-semibold">{address.fullName}</p>
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            {address.landmark && <p>Landmark: {address.landmark}</p>}
            <p>{address.city}, {address.state} - {address.pincode}</p>
            <p className="mt-2">Phone: {address.phone}</p>
          </div>
        ) : (
          <p className="text-gray-500">No address selected</p>
        )}
      </div>
      
      <div className="space-y-4 mb-6">
        {cartItems.map(item => (
          <div key={item.id} className="flex border-b border-gray-200 pb-4">
            <div className="h-20 w-14 bg-gray-200 rounded-md shadow-sm flex items-center justify-center mr-4">
              <span className="text-gray-500 text-xs">Cover</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              <div className="flex items-center mt-1">
                <span className="text-green-700 font-medium">₹{item.price}</span>
                <span className="text-sm text-gray-500 line-through ml-2">₹{item.originalPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold mb-2">Price Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Price ({cartItems.length} books)</span>
            <span>₹{calculateTotal()}</span>
          </div>
          
          {selectedCoupon && (
            <div className="flex justify-between text-green-600">
              <span>Coupon Discount</span>
              <span>-₹{selectedCoupon.discount}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span className="text-green-600">Free</span>
          </div>
          
          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
            <span>Total Payable</span>
            <span>₹{calculateTotalPayable()}</span>
          </div>
          
          <p className="text-green-600 text-sm">
            You will save ₹{calculateSavings() + (selectedCoupon ? selectedCoupon.discount : 0)} on this order
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;