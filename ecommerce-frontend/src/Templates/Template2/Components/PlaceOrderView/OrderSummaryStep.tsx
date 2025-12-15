import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyGetAllCartWithIdQuery } from "Services/CartApiSlice";
import { addToProductCart } from "State/CartSlice/CartSlice";
import { setSelectedPaymentType } from "State/CustomerSlice/CustomerSlice";
import { AppDispatch, RootState } from "State/store";
import SelectedAddress from "Templates/Template1/Components/Checkout/SelectedAddress";
import CartItem from "Templates/Template2/Components/CartView/CartItem";
import CartPriceDetails from "Templates/Template2/Components/PlaceOrderView/CartPriceDetails";
import { Cart } from "Types/Cart";

type Props = {
  type: string;
  hideDeleteIcon?: boolean;
  hideQuantitySelector?: boolean;
};

type PaymentMethod = {
  label: string;
  subLabel: string | null;
  value: 'PREPAID' | 'CASH_ON_DELIVERY';
}

export const paymentMethods: PaymentMethod[] = [
  {
    label: "Pay with Credit/Debit Card or UPI",
    subLabel: null,
    value: 'PREPAID'
  },
  {
    label: "Cash on Delivery",
    subLabel: "Cash, UPI and Cards accepted",
    value: 'CASH_ON_DELIVERY'
  }
]

const OrderSummaryStep = ({
  type,
  hideDeleteIcon = false,
  hideQuantitySelector = false,
}: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const cartList = useSelector((state: RootState) => state.cart.cartList);
  
  const selectedAddress = useSelector(
    (state: RootState) => state.customer.selectedAddress
  );
  const cartProductList = useSelector(
    (state: RootState) => state.cart.cartProductList
  );
  const { token } = useSelector((state: RootState) => state.login);


  const [getCartItems, { isLoading: cartLoading }] = useLazyGetAllCartWithIdQuery();


  const getCartItemsApi = async (cartListIds: Array<string>) => {
    const response = await getCartItems({ cartItems: cartListIds }).unwrap();
    if (response) {
      dispatch(addToProductCart(response));
    }
  };

  useEffect(() => {
    if(cartList.length > 0) {
      getCartItemsApi(cartList.map((item: Cart) => item.productId));
    }
  }, [cartList]);
    

  const handleChange = (value: 'PREPAID' | 'CASH_ON_DELIVERY') => {
    dispatch(setSelectedPaymentType(value));
  };

  if (cartLoading) {
    return (
        <div className="flex justify-center items-center h-[50VH]">
          <svg
            className="animate-spin h-12 w-12 text-gray-800"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        );
  }

    return (
      <div className="flex flex-col">
        <div className="w-full mt-5 flex flex-col md:flex-row gap-[30px]">
          {/* Cart Items Section */}
          <div className="w-full">
            {type === "authenticated" ? (
              <div className="flex flex-col gap-4 w-full">
                {/* {cartProductList?.products.map((item: ProductMetaDTO, i: number) => {
                  const cartItem = cartList.find(
                      (cartItem) => cartItem.productId === item.product.item
                    );
                    const quantity = cartItem?.quantity;

                    const size = cartItem?.size || "";
                  return (
                    <CartItem
                      key={i}
                      item={item}
                      quantity={quantity ?? 1}
                      token={token}
                      showQuantitySelector={!hideQuantitySelector}
                      showDeleteIcon={!hideDeleteIcon}
                      size={size}
                    />
                  );
                })} */}

                {
                  cartList.map((item, i) => {
                      const product = cartProductList?.products.find((i) => i.product.item === item.productId);
                      if(!product) return;
                      return (
                        <CartItem
                          key={i}
                          item={product}
                          quantity={item.quantity ?? 1}
                          token={token}
                          showQuantitySelector={true}
                          showDeleteIcon={true}
                          size={item.size}
                        />
                    );
                  })
                }
              </div>
            ) : (
              <div className="w-full max-h-[300px] overflow-y-auto">
                <div className="flex flex-col gap-4">
                  {/* {cartProductList?.products.map((item: ProductMetaDTO, i: number) => {
                    const cartItem = cartList.find(
                      (cartItem) => cartItem.productId === item.product.item
                    );
                    const quantity = cartItem?.quantity;

                    const size = cartItem?.size || "";
                    return (
                      <CartItem
                        key={i}
                        item={item}
                        quantity={quantity ?? 1}
                        token={token}
                        showQuantitySelector={!hideQuantitySelector}
                        showDeleteIcon={!hideDeleteIcon}
                        size={size}
                      />
                    );
                  })} */}

                    {
                      cartList.map((item, i) => {
                          const product = cartProductList?.products.find((i) => i.product.item === item.productId);
                          if(!product) return;
                          return (
                            <CartItem
                              key={i}
                              item={product}
                              quantity={item.quantity ?? 1}
                              token={token}
                              showQuantitySelector={true}
                              showDeleteIcon={true}
                              size={item.size}
                            />
                        );
                      })
                  }
                </div>
              </div>
            )}
          </div>

          {/* Price & Address Section */}
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <CartPriceDetails />
            {type === "authenticated" && selectedAddress && (
              <div>
                <SelectedAddress selectedAddress={selectedAddress} />
              </div>
            )}
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 mt-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Choose Payment Method</h3>
          {
            paymentMethods.map((d) => {
              return (
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-gray-800 transition">
                  <input
                    type="radio"
                    name="payment"
                    className="form-radio text-gray-900"
                    onChange={() => handleChange(d.value)}
                  />
                  <span className="text-gray-700 font-semibold">{d.label}</span>
                  {
                    d.subLabel &&
                    <span className="text-xs">{d.subLabel}</span>
                  }
                </label>
              );
            })
          }

        </div>
      </div>
  );
};

export default OrderSummaryStep;
