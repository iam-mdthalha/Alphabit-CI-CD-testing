import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import emitter from "Events/eventEmitter";
import { AuthenticationResponse } from "Interface/Client/Authentication/auth.interface";
import { InvalidCredentialsException } from "Interface/Client/Authentication/Exceptions/auth-exceptions.interface";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  useLoginWithPasswordMutation,
  useSendFast2SmsOtpMutation,
} from "Services/Auth/AuthApiSlice";
import {
  useLazyGetCustomerCartQuery,
  useUpdateCustomerCartMutation,
} from "Services/CartApiSlice";
import { setCredentials } from "State/AuthSlice/LoginSlice";
import { putToCart } from "State/CartSlice/CartSlice";
import { setLoggedIn } from "State/StateEvents";
import { AppDispatch, RootState } from "State/store";
import { Cart, CartResponse } from "Types/Cart";
import { calculatePromotions } from "Utilities/PromotionCalculator";
import { z } from "zod";

const heroImage = "/template4/login.jpg";

const loginSchema = z.object({
  authenticationId: z
    .string()
    .min(1, "Email or mobile number is required")
    .max(100, "Email or mobile number cannot exceed 100 characters")
    .refine(
      (val) => /^\S+@\S+$/.test(val) || /^\d{10,30}$/.test(val),
      "Invalid credentials"
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .max(70, "Password cannot exceed 70 characters"),
});

type LoginSchema = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState<"password" | "otp">(
    location.state?.loginMode || "password"
  );
  const [showPassword, setShowPassword] = useState(false);

  const { token } = useSelector((state: RootState) => state.login);
  const { cartList } = useSelector((state: RootState) => state.cart);

  const [loginWithPassword, { isLoading: loginWithPasswordLoading }] =
    useLoginWithPasswordMutation();
  const [sendFast2SmsOtp, { isLoading: sendFast2SmsOtpLoading }] =
    useSendFast2SmsOtpMutation();
  const [getCustomerCart] = useLazyGetCustomerCartQuery();
  const [updateCustomerCart, { isLoading: cartUpdateLoading }] =
    useUpdateCustomerCartMutation();

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { authenticationId: "", password: "" },
  });

  const onLoginSubmit = async (data: LoginSchema) => {
    setError("");
    try {
      const userData = await loginWithPassword(data).unwrap();

      if (userData.statusCode === 401) {
        const loginResponse: InvalidCredentialsException =
          userData.results as InvalidCredentialsException;
        dispatch(setLoggedIn(false));

        notifications.show({
          title: "Sign-in failed",
          message: loginResponse.message,
          color: "red",
        });
      } else {
        const loginResponse: AuthenticationResponse =
          userData.results as AuthenticationResponse;
        dispatch(setCredentials({ userToken: loginResponse.token }));
        dispatch(setLoggedIn(true));

        emitter.emit("loggedIn", { cartList, updateCustomerCart });

        notifications.show({
          title: "Signed in successfully",
          message: "Redirecting...",
          color: "green",
        });

        if (!localStorage.getItem("isCartFetched")) {
          const fetchCart = async () => {
            try {
              let cartResponse: Array<CartResponse> =
                await getCustomerCart().unwrap();

              if (cartResponse && cartResponse.length > 0) {
                let cartInfo = new Array<Cart>();
                cartResponse.forEach((cartItem) => {
                  let { discountPrice_ } = calculatePromotions(
                    cartItem.promotions,
                    cartItem.price
                  );
                  cartInfo.push({
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    availableQuantity: cartItem.availableQuantity,
                    ecomUnitPrice: cartItem.price,
                    discount: discountPrice_,
                    size: cartItem.size,
                  });
                });
                localStorage.setItem("isCartFetched", "true");
                dispatch(putToCart(cartInfo));
              } else {
                const storedCart = localStorage.getItem("cart");
                if (storedCart) {
                  const localCart: Array<Cart> = JSON.parse(storedCart);
                  if (localCart.length > 0) {
                    const cartSaveData = localCart.map((cartItem) => ({
                      item: cartItem.productId,
                      quantity: cartItem.quantity,
                      size: cartItem.size || "",
                    }));
                    await updateCustomerCart(cartSaveData).unwrap();
                  }
                }
                localStorage.setItem("isCartFetched", "true");
              }
            } catch {
              localStorage.setItem("isCartFetched", "true");
            }
          };
          fetchCart();
        }
        navigate("/");
      }
    } catch (err: any) {
      dispatch(setLoggedIn(false));
      notifications.show({
        title: "Sign-in error",
        message:
          err?.data?.results?.message ||
          err?.data?.message ||
          "Something went wrong",
        color: "red",
      });
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setError("Enter exactly 10 digits for mobile number");
      return;
    }

    localStorage.setItem("pendingPhone", phone);

    try {
      const result = await sendFast2SmsOtp(phone).unwrap();
      if (result.otpStatus === "DELIVERED") {
        notifications.show({
          title: "OTP sent",
          message: `OTP sent to +91${phone}`,
          color: "green",
        });
        navigate("/otp-login?sent=1");
      } else throw new Error(result.message);
    } catch (err: any) {
      notifications.show({
        title: "OTP send failed",
        message: err.message || "Failed to send OTP",
        color: "red",
      });
    }
  };

  const isSubmitting =
    loginWithPasswordLoading || sendFast2SmsOtpLoading || cartUpdateLoading;

  return (
    <div className="bg-vintageBg min-h-screen font-gilroyRegular tracking-wider flex items-center justify-center relative">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('${heroImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="mx-auto w-full max-w-md bg-vintageBg rounded-sm shadow-2xl py-10 px-6 relative z-10 border border-vintageText border-opacity-30">
        <div className="flex flex-col items-center mb-6">
          <img
            src={heroImage}
            alt="Hero"
            className="w-full max-w-lg h-56 object-cover rounded-sm"
          />
        </div>

        <div className="flex flex-col justify-center mb-8 gap-4">
          <button
            className={`px-6 py-2 rounded-sm font-semibold border border-vintageText border-opacity-50 shadow-md transition-all duration-200 ${
              loginMode === "password"
                ? "bg-vintageText text-light"
                : "bg-vintageBg text-vintageText"
            }`}
            disabled={loginMode === "password"}
            onClick={() => setLoginMode("password")}
          >
            Sign In with Password
          </button>

          <button
            className={`px-6 py-2 rounded-sm font-semibold border border-vintageText border-opacity-50 shadow-md transition-all duration-200 ${
              loginMode === "otp"
                ? "bg-vintageText text-light"
                : "bg-vintageBg text-vintageText"
            }`}
            disabled={loginMode === "otp"}
            onClick={() => setLoginMode("otp")}
          >
            Sign In with OTP
          </button>
        </div>

        {loginMode === "password" && (
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onLoginSubmit)}
          >
            <h2 className="text-2xl font-melodramaRegular font-semibold text-center text-vintageText mb-2">
              Sign In to Your Account
            </h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-vintageText">
                Email or Mobile Number
              </label>

              <input
                type="text"
                placeholder="Enter email or mobile number"
                {...register("authenticationId")}
                className="mt-1 w-full px-3 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText 
                focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
              />

              {errors.authenticationId && (
                <p className="text-red-700 text-xs">
                  {errors.authenticationId.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-vintageText">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className="mt-1 w-full px-3 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 
                  text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm pr-12"
                />

                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-vintageText text-opacity-70 hover:text-vintageText focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
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
                    >
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </svg>
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-700 text-xs">
                  {errors.password.message}
                </p>
              )}

              <div className="text-right mt-1">
                <span
                  onClick={() => navigate("/reset-password")}
                  className="text-vintageText text-xs underline cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-sm px-4 py-3 font-semibold text-light bg-vintageText 
                hover:bg-opacity-90 active:bg-opacity-80 transition-colors border border-vintageText border-opacity-50 shadow-md disabled:opacity-70"
            >
              {isSubmitting ? "Please wait..." : "Sign In"}
            </button>
          </form>
        )}

        {loginMode === "otp" && (
          <form className="flex flex-col gap-5" onSubmit={handleOtpSubmit}>
            <h2 className="text-2xl font-melodramaRegular font-semibold text-center text-vintageText mb-2">
              Sign In with OTP
            </h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-vintageText">
                Mobile number
              </label>

              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-sm border border-vintageText bg-vintageText text-light text-sm">
                  +91
                </span>

                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 px-3 py-2 border border-vintageText border-opacity-30 rounded-r-sm shadow-inner bg-vintageBg bg-opacity-50 
                  text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                />
              </div>

              {error && <p className="text-red-700 text-xs">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-sm px-4 py-3 font-semibold text-light bg-vintageText 
                hover:bg-opacity-90 active:bg-opacity-80 transition-colors border border-vintageText border-opacity-50 shadow-md disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        <p className="text-xs text-center text-vintageText text-opacity-80 mt-6 italic">
          By continuing, you agree to Moore Market's{" "}
          <Link
            to="/terms-and-conditions"
            className="underline text-vintageText whitespace-nowrap"
          >
            Terms of Use & Policy
          </Link>
        </p>

        <p className="text-center text-sm text-vintageText text-opacity-80 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="underline font-semibold text-vintageText cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
