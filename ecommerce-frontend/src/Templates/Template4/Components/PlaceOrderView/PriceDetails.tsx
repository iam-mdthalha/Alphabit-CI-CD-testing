import { NumberFormatter } from "@mantine/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";
import {
  calculateDiscount,
  calculateSubTotal,
} from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import { getBaseCurrency } from "Utilities/CurrencyHandler";

interface PriceDetailsProps {
  subtotal: number;
  bagDiscount: number;
  rewardApplied: boolean;
  rewardValue: number;
}

const PLANT = process.env.REACT_APP_PLANT;

const PriceDetails: React.FC<PriceDetailsProps> = ({
  subtotal,
  bagDiscount,
  rewardApplied,
  rewardValue,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { cartSubTotal, cartDiscount, cartList } = useSelector(
    (state: RootState) => state.cart
  );

  const rewardSavings = rewardApplied ? rewardValue : 0;
  const finalTotal = cartDiscount - rewardSavings;

  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const numberOfDecimal =
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 0;

  useEffect(() => {
    dispatch(calculateSubTotal());
    dispatch(calculateDiscount());
  }, [cartList, dispatch]);

  const itemCount = cartList?.reduce(
    (total: number, item: any) => total + (item.quantity || 0),
    0
  );

  return (
    <div className="bg-vintageBg p-4 rounded-lg border-2 border-vintageBorder shadow-sm">
      <div className="p-3 bg-vintageBg rounded-lg border border-vintageBorder mb-4">
        <p className="text-sm font-semibold text-vintageText">
          1165 Reward Points
        </p>
        <p className="text-[11px] text-gray-600">(₹{rewardValue} value)</p>

        {rewardApplied && (
          <p className="text-green-700 text-xs mt-1">Applied ✓</p>
        )}
      </div>

      <h3 className="text-lg font-semibold text-vintageText mb-3">
        Price Details{" "}
        {itemCount > 0 && (
          <span className="text-sm text-gray-700">
            ({itemCount} {itemCount === 1 ? "Book" : "Books"})
          </span>
        )}
      </h3>

      <div className="flex justify-between text-sm mb-2">
        <span>Bag MRP</span>
        <span>
          <NumberFormatter
            decimalScale={numberOfDecimal}
            fixedDecimalScale
            prefix={getBaseCurrency("INR") || undefined}
            value={cartSubTotal}
            thousandSeparator
          />
        </span>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <span>Bag Discount</span>
        <span className="text-green-700">
          -{" "}
          <NumberFormatter
            decimalScale={numberOfDecimal}
            fixedDecimalScale
            prefix={getBaseCurrency("INR") || undefined}
            value={Math.abs(cartSubTotal - cartDiscount)}
            thousandSeparator
          />
        </span>
      </div>

      {rewardApplied && (
        <div className="flex justify-between text-sm mb-2">
          <span>Reward Savings</span>
          <span className="text-green-700">
            {/* -{" "}
            <NumberFormatter
              decimalScale={numberOfDecimal}
              fixedDecimalScale
              prefix={getBaseCurrency("INR") || undefined}
              value={cartDiscount}
              thousandSeparator
            /> */}
            -{" "}
            <NumberFormatter
              decimalScale={numberOfDecimal}
              fixedDecimalScale
              prefix={getBaseCurrency("INR") || undefined}
              value={rewardSavings}
              thousandSeparator
            />
          </span>
        </div>
      )}

      <div className="border-t border-vintageBorder my-3"></div>

      <div className="flex justify-between font-semibold text-base">
        <span>You Pay</span>
        <span>₹{finalTotal.toFixed(numberOfDecimal)}</span>
      </div>
    </div>
  );
};

export default PriceDetails;
