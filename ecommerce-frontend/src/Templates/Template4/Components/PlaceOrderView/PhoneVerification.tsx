import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  usePreOtpLoginMutation,
  usePreRegisterMutation,
  useRegisterSendFast2SmsOtpMutation,
  useValidateFast2SmsOtpMutation,
} from "Services/Auth/AuthApiSlice";
import { setCredentials } from "State/AuthSlice/LoginSlice";
import { setLoggedIn } from "State/StateEvents";
import { AppDispatch } from "State/store";
import { z } from "zod";
import { maskMobile } from "../../Utils/mask-mobile-number.util";

export const loginWithOTPSchema = z.object({
  otp: z
    .string()
    .min(1, { message: "OTP is required" })
    .max(6, { message: "OTP cannot exceed 6 characters" }),
});

export type LoginWithOTPSchema = z.infer<typeof loginWithOTPSchema>;

interface PhoneVerificationProps {
  onVerified: (phoneNo: string) => void;
  isVerified: boolean;
  isLoggedIn: boolean;
  isGuestVerified: boolean;
}

const OTP_TIMER_SECONDS = 120;
const RESEND_COOLDOWN_SECONDS = 10;

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  onVerified,
  isVerified,
  isLoggedIn,
  isGuestVerified,
}) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [phone, setPhone] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [timer, setTimer] = useState<number>(OTP_TIMER_SECONDS);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [authenticationId, setAuthenticationId] = useState<string>("");

  const [
    registerSendFast2SmsOtp,
    { isLoading: registerSendFast2SmsOtpLoading },
  ] = useRegisterSendFast2SmsOtpMutation();
  const [validateFast2SmsOtp, { isLoading: validateFast2SmsOtpLoading }] =
    useValidateFast2SmsOtpMutation();
  const [preOTPLogin, { isLoading: preOTPLoginLoading }] =
    usePreOtpLoginMutation();
  const [preRegister, { isLoading: preRegisterLoading }] =
    usePreRegisterMutation();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register: loginWithOTPRegister,
    handleSubmit: loginWithOTPHandleSubmit,
    formState: { errors: loginWithOTPErrors },
    reset,
    setValue,
  } = useForm<LoginWithOTPSchema>({
    resolver: zodResolver(loginWithOTPSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isOtpSent && timer > 0) {
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
  }, [isOtpSent, timer]);

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

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      notifications.show({
        title: "Invalid Phone Number",
        message: "Please enter a valid 10-digit phone number",
        color: "red",
      });
      return;
    }

    const phoneWithCountryCode = `${phone}`;
    setAuthenticationId(phoneWithCountryCode);

    try {
      // First check if mobile number can be registered (same as Register.tsx)
      // This will fail if mobile is already registered
      await preRegister({
        mobileNumber: phoneWithCountryCode,
        fullName: "Guest User",
        email: `guest_${Date.now()}@example.com`,
        password: "TempPassword123!",
        confirmPassword: "TempPassword123!",
        isAnonymous: true
      }).unwrap();

      await preOTPLogin({
        authenticationId: phoneWithCountryCode,
        anonymous: true,
      });

      const otpSentResult = await registerSendFast2SmsOtp(
        phoneWithCountryCode
      ).unwrap();

      if (otpSentResult.otpStatus === "DELIVERED") {
        notifications.show({
          title: `OTP Sent to ${maskMobile(otpSentResult.mobileNo)}`,
          message: "Please check your phone",
          color: "green",
        });
        setTimer(OTP_TIMER_SECONDS);
        setIsOtpSent(true);
        setIsResendDisabled(false);
        setResendCooldown(0);
      } else {
        console.error("Failed to send OTP:", otpSentResult.message);
        throw new Error(otpSentResult.message || "Failed to send OTP");
      }
    } catch (err: any) {
      console.log("OTP sending error:", err);

      const message =
        err?.results?.message ||
        err?.data?.message ||
        err?.message ||
        "Failed to send verification code";

      if (
        message.toLowerCase().includes("already registered") ||
        message.toLowerCase().includes("already taken") ||
        err?.data?.statusCode === 409
      ) {
        notifications.show({
          title: "Account Already Exists",
          message:
            "This mobile number is already registered. You are being redirected to login.",
          color: "blue",
        });

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        notifications.show({
          title: "Verification Failed",
          message: message,
          color: "red",
        });
      }
    }
  };

  const handleOTPResend = async () => {
    if (isResendDisabled || resendCooldown > 0) return;

    setIsResendDisabled(true);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);

    try {
      const otpSentResult = await registerSendFast2SmsOtp(
        authenticationId
      ).unwrap();
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
        err?.results?.message ||
        err?.data?.message ||
        err?.message ||
        "Failed to resend OTP";

      notifications.show({
        title: "Resend Failed",
        message: message,
        color: "red",
      });
    }
  };

  const onLoginWithOTPSubmit = async (data: LoginWithOTPSchema) => {
    try {
      const validateOtpPayload = {
        otp: data.otp,
        username: authenticationId,
      };
      const userData = await validateFast2SmsOtp(validateOtpPayload).unwrap();

      if (userData.statusCode === 401) {
        notifications.show({
          title: "Verification Failed",
          message: "Invalid OTP. Please try again.",
          color: "red",
        });
      } else {
        const loginResponse = userData.results;

        dispatch(setCredentials({ userToken: loginResponse.token }));
        dispatch(setLoggedIn(true));

        notifications.show({
          title: "Phone Verified Successfully",
          message: "Your phone number has been verified",
          color: "green",
        });

        onVerified(authenticationId);
        reset();
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      const message =
        err?.results?.message ||
        err?.data?.message ||
        err?.message ||
        "An unexpected error occurred";

      notifications.show({
        title: "Verification Failed",
        message: message,
        color: "red",
      });
    }
  };

  const isSubmitting =
    registerSendFast2SmsOtpLoading ||
    validateFast2SmsOtpLoading ||
    preRegisterLoading ||
    preOTPLoginLoading;

  if (isVerified || isLoggedIn || isGuestVerified) {
    return (
      <div className="font-gilroyRegular tracking-wider bg-green-50 p-4 rounded-md border border-green-200">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-full">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-green-800">
              Phone Verified
            </h3>
            <p className="text-green-600">
              {isLoggedIn ? "Logged in user" : "Guest user"} - Verification
              completed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-gilroyRegular tracking-wider max-w-md mx-auto py-12 md:py-20">
      <h2 className="font-melodramaRegular tracking-widest text-lg md:text-2xl font-semibold text-center text-vintageText mb-4">
        Continue as Guest
      </h2>
      <p className="text-gray-600 text-center mb-6">
        We'll send you a verification code to confirm your number
      </p>

      {!isOtpSent ? (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <div className="flex">
              <div className="border border-yellow-600 text-light rounded-l-md px-4 py-2 bg-yellow-600">
                +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="flex-1 border border-vintageText bg-light bg-opacity-50 rounded-r-md px-4 py-2 focus:outline-none focus:ring-1 focus:outline-blue-100"
                placeholder="Enter your phone number"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <button
            onClick={handleSendOtp}
            disabled={phone.length !== 10 || isSubmitting}
            className={`w-full py-3 rounded-md font-medium ${
              phone.length === 10 && !isSubmitting
                ? "bg-vintageText text-white hover:bg-vintageText-dark"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } transition-colors duration-200`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
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
                Sending OTP...
              </div>
            ) : (
              "Send Verification Code"
            )}
          </button>
        </div>
      ) : (
        <div>
          <form onSubmit={loginWithOTPHandleSubmit(onLoginWithOTPSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                {...loginWithOTPRegister("otp")}
                className="w-full border border-yellow-600 bg-light bg-opacity-50 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:outline-blue-100"
                placeholder="Enter 6-digit code"
                disabled={validateFast2SmsOtpLoading}
              />
              {loginWithOTPErrors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {loginWithOTPErrors.otp.message}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Sent to +91 ••••• •••{phone.slice(-2)}
              </p>
            </div>

            <button
              type="submit"
              disabled={validateFast2SmsOtpLoading || timer === 0}
              className={`w-full py-3 rounded-md font-medium ${
                !validateFast2SmsOtpLoading && timer > 0
                  ? "bg-vintageText text-white hover:bg-vintageText-dark"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } transition-colors duration-200`}
            >
              {validateFast2SmsOtpLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
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
                  Verifying...
                </div>
              ) : (
                "Verify & Continue"
              )}
            </button>

            {isOtpSent && (
              <div className="border-t border-gray-200 pt-4 mt-4 mb-4">
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
                  type="button"
                  onClick={handleOTPResend}
                  disabled={isResendDisabled || resendCooldown > 0}
                  className="w-full bg-yellow-500 text-vintageBg font-bold text-sm py-2 rounded-md transition hover:bg-opacity-90 disabled:opacity-60 shadow-md mb-3"
                >
                  {isResendDisabled || resendCooldown > 0
                    ? `Resend OTP (${resendCooldown}s)`
                    : "Resend OTP"}
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-vintageText font-medium hover:underline"
          >
            Log In
          </button>
        </p>
        <p className="text-sm text-gray-600">
          New user?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-vintageText font-medium hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default PhoneVerification;
