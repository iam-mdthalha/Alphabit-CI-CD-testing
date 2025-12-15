import React from "react";
import { Link, useParams } from "react-router-dom";

interface OrderPlacedProps {}

const OrderPlaced: React.FC<OrderPlacedProps> = () => {
  const { orderId } = useParams<{ orderId: string }>();

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600">The order ID is missing from the URL.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-vintageBg">
      <div className="container mx-auto px-4 py-8 bg-vintageBg min-h-screen flex items-center justify-center">
        <div className="bg-light bg-opacity-50 rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-vintageText my-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase</p>

          <div className="bg-light bg-opacity-50 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold text-vintageText">{orderId}</p>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              We've sent a confirmation email with your order details
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to={`/track-order?orderId=${orderId}`}
              className="block w-full py-3 bg-vintageText hover:bg-opacity-90 text-white rounded-md font-medium"
            >
              View Order Details
            </Link>

            <Link
              to="/"
              className="block w-full py-2 border border-vintageText text-vintageText hover:border-opacity-90 hover:text-opacity-90 rounded-md font-medium"
            >
              Continue Shopping
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• You will receive an order confirmation email</p>
              <p>• We'll notify you when your order ships</p>
              <p>• Your order will arrive in 3-5 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlaced;
