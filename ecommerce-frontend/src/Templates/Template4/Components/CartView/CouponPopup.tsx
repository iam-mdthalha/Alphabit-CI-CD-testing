import React from "react";
import { Coupon } from "Types/CartView";

interface CouponPopupProps {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  onApply: (coupon: Coupon | null) => void;
  onCancel: () => void;
  onCouponSelect: (coupon: Coupon) => void;
}

const CouponPopup: React.FC<CouponPopupProps> = ({
  coupons,
  selectedCoupon,
  onApply,
  onCancel,
  onCouponSelect,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-vintageBg rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
        <h3 className="text-lg font-semibold text-vintageText mb-4">Apply Coupon</h3>
        <div className="mb-4">
          <div className="flex border border-vintageText overflow-hidden">
            <input
              type="text"
              placeholder="ENTER COUPON CODE"
              className="bg-vintageBg flex-grow px-4 py-2"
            />
            <button className="px-4 py-2 bg-vintageText hover:bg-opacity-90 text-white">Apply</button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {coupons.map((coupon: Coupon, index: number) => (
            <div key={index} className="border border-vintageBorder bg-light bg-opacity-20 rounded-md p-4">
              <div className="flex items-start mb-2">
                <input
                  type="radio"
                  name="coupon"
                  className="mt-1 mr-3"
                  checked={selectedCoupon?.code === coupon.code}
                  onChange={() => onCouponSelect(coupon)}
                />
                <div>
                  <h4 className="font-semibold">{coupon.code}</h4>
                  <p className="text-sm text-gray-600">{coupon.description}</p>
                  <p className="text-sm text-gray-500">
                    Expires on: {coupon.expiry}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            className="px-4 py-2 border border-vintageText text-vintageText hover:bg-opacity-90 hover:text-opacity-90 rounded-md mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          {/* <button
            className="px-4 py-2 bg-vintageText hover:bg-opacity-90 text-white rounded-md"
            onClick={() => onApply(selectedCoupon)}
          >
            Apply
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default CouponPopup;
