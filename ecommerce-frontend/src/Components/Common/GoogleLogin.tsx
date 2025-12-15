import { notifications } from '@mantine/notifications';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import emitter from 'Events/eventEmitter';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGoogleLoginMutation } from 'Services/Auth/GoogleAuthApiSlice';
import { useLazyGetCustomerCartQuery, useUpdateCustomerCartMutation } from 'Services/CartApiSlice';
import { setCredentials } from 'State/AuthSlice/LoginSlice';
import { appendToCart } from 'State/CartSlice/CartSlice';
import { setLoggedIn } from 'State/StateEvents';
import { RootState } from 'State/store';
import { Cart, CartResponse } from 'Types/Cart';
import { calculatePromotions } from 'Utilities/PromotionCalculator';

interface GoogleLoginButtonProps {
  mode: 'login' | 'register';
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ mode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [googleLogin] = useGoogleLoginMutation();
    const { cartList } = useSelector((state: RootState) => state.cart);
    const [updateCustomerCart, { isLoading: cartUpdateLoading }] =
      useUpdateCustomerCartMutation();
    const [ getCustomerCart ] = useLazyGetCustomerCartQuery();

  const handleSuccess = async (response: CredentialResponse) => {
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }
      
      // Send the Google token to your backend
      const backendResponse = await googleLogin({ token: response.credential }).unwrap();

      if (backendResponse.token) {
        // Store the JWT token from your backend
        dispatch(setCredentials({
          userToken: backendResponse.token,
          userInfo: backendResponse.user,
        }));
        dispatch(setLoggedIn(true));
        emitter.emit("loggedIn", {
          cartList,
          updateCustomerCart,
        });

        notifications.show({
          title: 'Login Successful',
          message: 'Welcome! You have been logged in successfully.',
          color: 'green',
        });

        if (!localStorage.getItem("isCartFetched")) {
          const fetchCart = async () => {
            try {
              let cartResponse: Array<CartResponse> = await getCustomerCart().unwrap();
              if (cartResponse) {
                let cartInfo = new Array<Cart>();
                cartResponse.forEach((cartItem, i) => {
                  let { discountPrice_, discountPer_, isByValue_ } =
                    calculatePromotions(cartItem.promotions, cartItem.price);
                  cartInfo.push({
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    availableQuantity: cartItem.availableQuantity,
                    ecomUnitPrice: cartItem.price,
                    discount: discountPrice_,
                    size: cartItem.size
                  });
                });
                localStorage.setItem("isCartFetched", "true");
    
                // dispatch(putToCart(cartInfo));
                dispatch(appendToCart(cartInfo));
                
              }
            } catch (err) {
              console.error(err);
            }
          };
          fetchCart();
          
        }

        navigate('/');
      } else {
        throw new Error(backendResponse.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      notifications.show({
        title: 'Login Failed',
        message: 'Google login failed. Please try again.',
        color: 'red',
      });
    }
  };

  const handleError = () => {
    notifications.show({
      title: 'Login Failed',
      message: 'Google login was cancelled or failed.',
      color: 'red',
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        theme="outline"
        size="large"
        text={mode === 'login' ? 'signin_with' : 'signup_with'}
        shape="rectangular"
        width="100%"
        locale="en"
        // style overrides for font, left alignment, etc.
        ux_mode="popup"
      />
    </div>
  );
};

export default GoogleLoginButton; 