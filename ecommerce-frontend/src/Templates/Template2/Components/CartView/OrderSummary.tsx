import { NumberFormatter } from "@mantine/core";
import CustomDarkButton from "Components/StyleComponent/CustomDarkButton";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import { RootState } from "State/store";
import { getBaseCurrency } from "Utilities/CurrencyHandler";

interface OrderSummaryProps {
  showCheckoutButton?: boolean;
}

const PLANT = process.env.REACT_APP_PLANT;

const OrderSummary: React.FC<OrderSummaryProps> = ({
  showCheckoutButton = true,
}) => {
  const { cartSubTotal, cartDiscount } = useSelector(
    (state: RootState) => state.cart
  );
  console.log("Cart subtotal : ", cartSubTotal);
  console.log("Cart Discount : ", cartDiscount);

  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const numberOfDecimal =
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-md font-semibold uppercase mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <NumberFormatter
          decimalScale={numberOfDecimal}
          fixedDecimalScale
          prefix={getBaseCurrency("INR") || undefined}
          value={cartSubTotal}
          thousandSeparator
        />
      </div>
      <div className="flex justify-between mb-2">
        <span>Discount</span>
        <NumberFormatter
          decimalScale={numberOfDecimal}
          fixedDecimalScale
          prefix={getBaseCurrency("INR") || undefined}
          value={Math.abs(cartSubTotal - cartDiscount)}
          thousandSeparator
        />
      </div>
      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <NumberFormatter
            decimalScale={numberOfDecimal}
            fixedDecimalScale
            prefix={getBaseCurrency("INR") || undefined}
            value={cartDiscount}
            thousandSeparator
          />
        </div>
      </div>

      {showCheckoutButton && (
        <div className="mt-8 text-end">
          <Link to="/checkout">
            <CustomDarkButton>Proceed to Checkout</CustomDarkButton>
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
