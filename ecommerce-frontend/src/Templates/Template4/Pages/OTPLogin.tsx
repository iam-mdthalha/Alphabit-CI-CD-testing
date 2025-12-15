import { notifications } from "@mantine/notifications";
import emitter from "Events/eventEmitter";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useLoginWithOTPMutation,
  useSendFast2SmsOtpMutation,
} from "Services/Auth/AuthApiSlice";
import {
  useLazyGetCustomerCartQuery,
  useUpdateCustomerCartMutation,
} from "Services/CartApiSlice";
import { setCredentials } from "State/AuthSlice/LoginSlice";
import { appendToCart } from "State/CartSlice/CartSlice";
import { setLoggedIn } from "State/StateEvents";
import { AppDispatch, RootState } from "State/store";
import { Cart, CartResponse } from "Types/Cart";
import { calculatePromotions } from "Utilities/PromotionCalculator";
import { maskMobile } from "../Utils/mask-mobile-number.util";

const OTP_TIMER_SECONDS = 120;
const RESEND_COOLDOWN_SECONDS = 10;

const OTPLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const authenticationId = localStorage.getItem("pendingPhone") || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const dispatch: AppDispatch = useDispatch();
  const { cartList } = useSelector((state: RootState) => state.cart);
  const [getCustomerCart] = useLazyGetCustomerCartQuery();

  const [sendFast2SmsOtp] = useSendFast2SmsOtpMutation();
  const [loginWithOTP] = useLoginWithOTPMutation();
  const [updateCustomerCart, { isLoading: cartUpdateLoading }] =
    useUpdateCustomerCartMutation();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const [searchParams] = useSearchParams();
  const otpSent = searchParams.get("sent") === "1" ? true : false;

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (otpSent && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [otpSent, timer]);

  useEffect(() => {
    if (cooldownRef.current) {
      clearInterval(cooldownRef.current);
      cooldownRef.current = null;
    }

    if (resendCooldown > 0) {
      cooldownRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownRef.current!);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [resendCooldown]);

  const handleOTPResend = async () => {
    if (isResendDisabled || resendCooldown > 0) return;

    setIsResendDisabled(true);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);

    try {
      const otpSentResult = await sendFast2SmsOtp(authenticationId).unwrap();
      if (otpSentResult.otpStatus === "DELIVERED") {
        setTimer(OTP_TIMER_SECONDS);
        notifications.show({
          title: "OTP Resent",
          message: `OTP resent to ${maskMobile(otpSentResult.mobileNo)}`,
          color: "green",
        });
      } else {
        throw new Error(otpSentResult.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Failed to resend OTP";
      notifications.show({
        title: "Failed to Resend OTP",
        message: message,
        color: "red",
      });
    } finally {
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      notifications.show({
        title: "Invalid OTP",
        message: "Please enter a valid 6-digit OTP",
        color: "red",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await loginWithOTP({ authenticationId, otp }).unwrap();
      if (response.results?.token) {
        notifications.show({
          title: "Login successful",
          message: "Redirecting...",
          color: "green",
        });
        localStorage.removeItem("pendingPhone");
        dispatch(setCredentials({ userToken: response.results.token }));
        dispatch(setLoggedIn(true));

        emitter.emit("loggedIn", {
          cartList,
          updateCustomerCart,
        });

        if (!localStorage.getItem("isCartFetched")) {
          const fetchCart = async () => {
            try {
              let cartResponse: Array<CartResponse> =
                await getCustomerCart().unwrap();
              if (cartResponse) {
                let cartInfo = new Array<Cart>();
                cartResponse.forEach((cartItem, i) => {
                  let { discountPrice_ } =
                    calculatePromotions(cartItem.promotions, cartItem.price);
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
                dispatch(appendToCart(cartInfo));
              }
            } catch (err) {
              console.error(err);
            }
          };
          fetchCart();
        }
        navigate("/");
      } else {
        notifications.show({
          title: "Verification Failed",
          message: response.results?.message || "Invalid OTP, please try again",
          color: "red",
        });
      }
    } catch (err: any) {
      const errorMessage =
        err?.results?.message || err?.message || "OTP verification failed";

      notifications.show({
        title: "Verification Failed",
        message: errorMessage,
        color: "red",
      });
    }
    setLoading(false);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-vintageBg flex items-center justify-center px-4 py-12 font-gilroyRegular tracking-wider">
      <div className="w-full max-w-md">
        <div className="bg-vintageBg bg-opacity-90 rounded-2xl shadow-lg overflow-hidden mb-8 border border-vintageBorder">
          <div className="relative h-48 bg-gradient-to-br from-vintageBg via-emerald-100 to-vintageBg bg-opacity-70 flex items-center justify-center">
            <img
              src="/template4/login.jpg"
              alt="OTP Verification"
              className="w-32 h-32 rounded-full border-4 border-vintageBorder object-cover shadow-md"
            />
          </div>
          <div className="p-6 text-center">
            <h2 className="text-2xl font-melodramaRegular text-vintageText mb-2">
              OTP Verification
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Enter the OTP sent to your mobile number
            </p>
          </div>
        </div>

        <div className="bg-vintageBg bg-opacity-90 rounded-2xl shadow-lg p-6 border border-vintageBorder">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center px-3 py-1 border border-vintageBorder rounded-xl bg-vintageBg bg-opacity-50 text-vintageText font-medium text-sm">
              +91 {authenticationId}
            </span>
            <button
              type="button"
              className="text-green-600 hover:text-green-700 text-sm font-medium underline transition"
              onClick={() =>
                navigate("/login", { state: { loginMode: "otp" } })
              }
            >
              Change
            </button>
          </div>

          <form onSubmit={handleVerify} className="w-full">
            <div className="flex flex-col gap-4 mb-4">
              <input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter the 6-digit OTP"
                required
                className="mt-1 w-full px-3 py-2 border border-vintageText border-opacity-30 
                             rounded-sm shadow-inner bg-vintageBg bg-opacity-50 
                             text-vintageText placeholder:text-gray-500 
                             text-lg tracking-widest focus:ring-2 focus:ring-vintageText 
                             focus:border-vintageText"
                autoComplete="one-time-code"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-sm px-4 py-3 font-semibold text-light bg-vintageText
                             hover:bg-opacity-90 active:bg-opacity-80 transition-colors border 
                             border-vintageText border-opacity-50 shadow-md disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>

          {otpSent && (
            <div className="border-t border-vintageBorder pt-4 mt-4">
              <div className="text-center mb-3">
                <div className="text-sm text-gray-600 mb-2">
                  OTP expires in: {formatTimer(timer)}
                </div>
                <div className="text-xs text-gray-500">
                  Didn't receive the code?
                  {resendCooldown > 0 ? (
                    <span className="text-orange-600 font-medium ml-1">
                      Resend available in {resendCooldown}s
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium ml-1">
                      You can resend now
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleOTPResend}
                disabled={isResendDisabled || resendCooldown > 0}
                className="w-full bg-yellow-500 rounded-sm px-4 py-3 font-semibold text-light 
                             hover:bg-opacity-90 active:bg-opacity-80 transition-colors border 
                             border-vintageText border-opacity-50 shadow-md disabled:opacity-70"
              >
                {isResendDisabled || resendCooldown > 0
                  ? `Resend OTP (${resendCooldown}s)`
                  : "Resend OTP"}
              </button>
            </div>
          )}

          <div className="text-center mt-4">
            <button
              onClick={() =>
                navigate("/login", { state: { loginMode: "otp" } })
              }
              className="text-green-600 font-medium text-sm hover:underline transition hover:text-green-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPLoginPage;
