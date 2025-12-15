import React, { useEffect } from "react";

interface PaymentProcessingProps {
  orderId: string;
  paymentId: string;
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  orderId,
  paymentId,
}) => {
  useEffect(() => {
    // You can show the order details here if needed
    console.log("Processing payment for order:", orderId);
  }, [orderId, paymentId]);

  return (
    <div className="min-h-screen bg-vintageBg flex items-center justify-center">
      <div className="bg-vintageBg rounded-lg shadow-lg border-2 border-vintageBorder p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-vintageText"></div>
          </div>
          <h2 className="text-2xl font-bold text-vintageText mb-4 font-melodramaRegular">
            Processing Your Order
          </h2>
          <p className="text-vintageText opacity-80 mb-2">
            Please wait while we confirm your payment...
          </p>
          <p className="text-sm text-vintageText opacity-60">
            Order ID: {orderId}
          </p>
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-center text-sm text-vintageText">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Payment Received
            </div>
            <div className="flex items-center justify-center text-sm text-vintageText">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Verifying Payment
            </div>
            <div className="flex items-center justify-center text-sm text-vintageText opacity-60">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
              Completing Order
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
