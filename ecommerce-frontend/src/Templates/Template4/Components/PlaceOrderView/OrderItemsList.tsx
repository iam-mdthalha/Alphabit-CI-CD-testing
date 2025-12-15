import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "State/store";
import CartItemCard from "Templates/Template4/Components/Common/CartItemCard";

const PLANT = process.env.REACT_APP_PLANT;

interface OrderItemsListProps {
  cartList: any[];
  cartProductList: any;
  onContinue: () => void;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  cartList,
  cartProductList,
  onContinue,
}) => {
  const selectedAddress = useSelector(
    (state: RootState) => state.customer.selectedAddress
  );
  const { token } = useSelector((state: RootState) => state.login);

  
  const totalBooks = cartList.reduce(
    (sum, item) => sum + (item.quantity ?? 1),
    0
  );

  return (
    <div className="py-6 md:py-8">
      <h2 className="text-xl font-semibold text-vintageText text-center mb-6 font-melodramaRegular tracking-widest">
        Order Summary
      </h2>

      {selectedAddress && (
        <div className="bg-light bg-opacity-30 border border-vintageBorder rounded-md p-4 mb-6">
          <h3 className="font-semibold text-vintageText mb-2">
            Delivery Address
          </h3>
          <div className="text-vintageText">
            <p className="font-medium">{selectedAddress.customerName}</p>
            <p>{selectedAddress.mobileNumber}</p>
            <p>
              {selectedAddress.addr1}, {selectedAddress.addr2},{" "}
              {selectedAddress.addr4 && `${selectedAddress.addr4}, `}
              {selectedAddress.addr3}, {selectedAddress.state} -{" "}
              {selectedAddress.pinCode}
            </p>
            {selectedAddress.country &&
              selectedAddress.country !== "India" && (
                <p>{selectedAddress.country}</p>
              )}
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-vintageText mb-4">
          Order Books ({totalBooks})
        </h3>

        {cartList.length > 0 ? (
          cartList.map((item) => {
            const product = cartProductList?.products?.find(
              (p: any) => p.product.item === item.productId
            );
            if (!product) return null;

            return (
              <CartItemCard
                key={`${item.productId}-${item.size || "_"}`}
                item={product}
                quantity={item.quantity ?? 1}
                token={token}
                showQuantitySelector={true}
                showDeleteIcon={true}
              />
            );
          })
        ) : (
          <p className="text-vintageText text-center py-4">
            No books in cart
          </p>
        )}
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 bg-vintageText text-white rounded-md font-medium hover:bg-opacity-90 transition-colors duration-200"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default OrderItemsList;
