import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { useRazorpay } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { AppDispatch, RootState } from "State/store";

interface PaymentMethodProps {
  selectedMethod: "PREPAID" | "CASH_ON_DELIVERY" | null;
  onSelectMethod: (method: "PREPAID" | "CASH_ON_DELIVERY" | null) => void;
  onPayment: () => void;
  isLoading?: boolean;
  rewardApplied: boolean;
  rewardValue: number;
}

const PLANT = process.env.REACT_APP_PLANT;

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onSelectMethod,
  onPayment,
  isLoading,
  rewardApplied,
  rewardValue,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();

  const { cartDiscount } = useSelector((state: RootState) => state.cart);
  const rewardSavings = rewardApplied ? rewardValue : 0;
  const finalTotal = cartDiscount - rewardSavings;

  const cartList = useSelector((state: RootState) => state.cart.cartList);
  const selectedAddress = useSelector(
    (state: RootState) => state.customer.selectedAddress
  );
  const { token } = useSelector((state: RootState) => state.login);

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");

  const numberOfDecimal =
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 0;

  const paymentMethods: {
    id: "PREPAID" | "CASH_ON_DELIVERY" | null;
    name: string;
    icon: string;
    description: string;
  }[] = [
    {
      id: "PREPAID",
      name: "Credit/Debit Card & UPI",
      icon: "💳",
      description: "Pay using card, UPI, net banking",
    },
    {
      id: "CASH_ON_DELIVERY",
      name: "Cash on Delivery",
      icon: "💰",
      description: "Pay when you receive the order",
    },
  ];

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      notifications.show({
        title: "Address Required",
        message: "Please select a delivery address",
        color: "red",
      });
      return;
    }

    if (cartList.length === 0) {
      notifications.show({
        title: "Empty Cart",
        message: "Your cart is empty",
        color: "red",
      });
      return;
    }

    // setIsProcessing(true);

    onPayment();

    // setIsProcessing(false);
  };

  return (
    <div className="py-6 md:py-8">
      <h2 className="text-xl font-semibold text-vintageText text-center mb-4 font-melodramaRegular tracking-widest">
        Select Payment Method
      </h2>

      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-md p-4 cursor-pointer transition-colors ${
              selectedMethod === method.id
                ? "border-vintageText bg-light bg-opacity-70"
                : "border-vintageText hover:bg-light hover:bg-opacity-30"
            }`}
            onClick={() => onSelectMethod(method.id)}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{method.icon}</span>
              <div className="flex-1">
                <h3 className="font-medium text-vintageText">{method.name}</h3>
                <p className="text-sm text-vintageText opacity-80">
                  {method.description}
                </p>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                checked={selectedMethod === method.id}
                onChange={() => onSelectMethod(method.id)}
                className="h-5 w-5 text-vintageText"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedMethod && (
        <div className="border-t border-vintageBorder pt-4">
          <div className="flex justify-between font-semibold text-lg mb-4 text-vintageText">
            <span>Total Amount:</span>
            <span>₹{finalTotal.toFixed(numberOfDecimal)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isLoading}
            className={`w-full py-3 rounded-md font-medium transition-colors duration-200 ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-vintageText hover:bg-opacity-90 text-white"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : selectedMethod === "CASH_ON_DELIVERY" ? (
              "Place Order"
            ) : (
              `Pay ₹${finalTotal.toFixed(numberOfDecimal)}`
            )}
          </button>

          <p className="text-xs text-vintageText opacity-70 mt-2 text-center">
            By completing your purchase you agree to our Terms of Service
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
