import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import GoogleLoginButton from "Components/Common/GoogleLogin";
import CustomDarkButtonFull from "Components/StyleComponent/CustomDarkButtonFull";
import emitter from "Events/eventEmitter";
import { InvalidCredentialsException } from "Interface/Client/Authentication/Exceptions/auth-exceptions.interface";
import { AuthenticationResponse } from "Interface/Client/Authentication/auth.interface";
import {
  useLoginWithPasswordMutation
} from "Services/Auth/AuthApiSlice";
import { useLazyGetCustomerCartQuery, useUpdateCustomerCartMutation } from "Services/CartApiSlice";
import { setCredentials } from "State/AuthSlice/LoginSlice";
import { appendToCart } from "State/CartSlice/CartSlice";
import { setLoggedIn } from "State/StateEvents";
import { AppDispatch, RootState } from "State/store";
import { Cart, CartResponse } from "Types/Cart";
import { calculatePromotions } from "Utilities/PromotionCalculator";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export const loginWithPasswordSchema = z
  .object({
    authenticationId: z
      .string()
      .min(1, { message: "Email or Mobile Number is required" })
      .max(100, {
        message: "Email or Mobile Number cannot exceed 100 characters",
      })
      .refine((val) => /^\S+@\S+$/.test(val) || /^\d{10,30}$/.test(val), {
        message: "Invalid Credentials",
      }),

  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(70, { message: "Password cannot exceed 70 characters" })
});


export type LoginWithPasswordSchema = z.infer<typeof loginWithPasswordSchema>;


const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [loginWithPassword, { isLoading: loginWithPasswordLoading }] =
    useLoginWithPasswordMutation();

  const { cartList } = useSelector((state: RootState) => state.cart);
  const [updateCustomerCart, { isLoading: cartUpdateLoading }] =
    useUpdateCustomerCartMutation();

  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(120);
  const [canResend, setCanResend] = useState<boolean>(false);

  // const [otp, setOtp] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const { userInfo, token } = useSelector((state: RootState) => state.login);

  const [ getCustomerCart ] = useLazyGetCustomerCartQuery();
  

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const [loginDetails, setLoginDetails] = useState<{
    authenticationId: string;
  }>({ authenticationId: "" });

  // const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setOtp(e.target.value);
  // };

  useEffect(() => {
    let interval: any;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          const next = prev - 1;
          if (next <= 118) {
            setCanResend(true);
          }
          if (next <= 0) {
            clearInterval(interval);
          }
          return next;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  const {
    register: loginWithPasswordRegister,
    handleSubmit: loginWithPasswordHandleSubmit,
    formState: { errors: loginWithPasswordErrors },
  } = useForm<LoginWithPasswordSchema>({
    resolver: zodResolver(loginWithPasswordSchema),
    defaultValues: {
      authenticationId: "",
      password: ""
    }
  });



  const onLoginWithPasswordSubmit = async (data: LoginWithPasswordSchema) => {
    try {
      const loginPayload = {
        authenticationId: data.authenticationId,
        password: data.password,
      };

      const userData = await loginWithPassword(loginPayload).unwrap();

      if (userData.statusCode === 401) {
        const loginResponse: InvalidCredentialsException =
          userData.results as InvalidCredentialsException;
        dispatch(setLoggedIn(false));

        notifications.show({
          title: "Login Failed",
          message: loginResponse.message,
          color: "red",
        });
      } else {
        const loginResponse: AuthenticationResponse =
          userData.results as AuthenticationResponse;
        dispatch(setCredentials({ userToken: loginResponse.token }));
        dispatch(setLoggedIn(true));
        emitter.emit("loggedIn", {
          cartList,
          updateCustomerCart,
        });
        notifications.show({
          title: "Login Successful",
          message: "Redirecting...",
          color: "green",
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
        navigate("/");
      }
    } catch (err: any) {
      dispatch(setLoggedIn(false));
      notifications.show({
        title: "Login details not found",
        message:
          err?.data?.results?.message ||
          err?.data?.message ||
          "Something went wrong",
        color: "red",
      });
    }
  };


  const isSubmitting =
    loginWithPasswordLoading ||
    cartUpdateLoading;

  return (
    <div className="min-h-screen bg-gray-100 font-montserrat tracking-wider dark:bg-gray-900 flex items-center justify-center px-4">
      {isSubmitting ? (
        <div className="flex justify-center items-center h-[30vh] md:h-screen">
          <svg
            className="animate-spin h-8 w-8 text-gray-300"
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
              strokeWidth="1.5"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M12 2a10 10 0 00-10 10h4a6 6 0 0112 0h4a10 10 0 00-10-10z"
            />
          </svg>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-center text-gray-500 dark:text-gray-300">
            Login with your mobile number or email
          </p>

          <div className="flex flex-col gap-2">
            {/* <FacebookLoginButton mode="login" /> */}
            <GoogleLoginButton mode="login" />
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                OR
              </span>
            </div>
          </div>

          <form
            onSubmit={loginWithPasswordHandleSubmit(onLoginWithPasswordSubmit)}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="login-authenticationId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Email or Mobile Number<span className="text-red-500">*</span>
              </label>
              <input
                id="login-authenticationId"
                type="text"
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm"
                {...loginWithPasswordRegister("authenticationId")}
                maxLength={100}
                onChange={(e) => {
                  setLoginDetails({ authenticationId: e.target.value });
                }}
              />
              {loginWithPasswordErrors.authenticationId && (
                <p className="text-red-500 text-sm">
                  {loginWithPasswordErrors.authenticationId.message}
                </p>
              )}
            </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm pr-10"
                    {...loginWithPasswordRegister("password")}
                    maxLength={70}
                  />
                  {loginWithPasswordErrors.password && (
                    <p className="text-red-500 text-sm">
                      {loginWithPasswordErrors.password.message}
                    </p>
                  )}
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-eye-off-icon lucide-eye-off"
                      >
                        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                        <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                        <path d="m2 2 20 20" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-eye-icon lucide-eye"
                      >
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Forgot Password link */}
                <div className="text-right mt-1">
                  <span
                    className="text-blue-500 cursor-pointer hover:underline text-xs"
                    onClick={() => navigate("/reset-password")}
                  >
                    Forgot Password?
                  </span>
                </div>
              </div>
              <p className="text-xs font-medium text-end">
                Login with{" "}
                <span
                  className="text-blue-500 cursor-pointer hover:underline"
                  onClick={() => {
                    navigate('/otp-login')
                  }}
                >
                  OTP
                </span>
                ?
              </p>
            
            <CustomDarkButtonFull type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mx-auto"
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
              ) : (
                "Sign In"
              )}
            </CustomDarkButtonFull>
          </form>
          <p className="text-xs text-gray-700 dark:text-gray-300">
            By selecting Sign in for your Caviaar Mode Account, you agree to our{" "}
            <a
              href="/terms-and-conditions"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              terms and conditions
            </a>{" "}
            and{" "}
            <a
              href="privacy-policy"
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              privacy policy
            </a>
          </p>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href="/register"
              onClick={() => navigate("/register")}
              className="font-medium text-indigo-600 hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
