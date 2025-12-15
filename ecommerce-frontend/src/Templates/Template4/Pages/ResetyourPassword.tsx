import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useForgotPasswordEmailOtpMutation,
  useResetPasswordMutation,
  useResetPasswordVerifyOtpMutation,
} from "Services/Auth/AuthApiSlice";

const OTP_TIMER_SECONDS = 300;
const RESEND_COOLDOWN_SECONDS = 10;

const ResetyourPassword: React.FC = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false);

  const [passwordValue, setPasswordValue] = useState("");
  const [passwordChecks, setPasswordChecks] = useState({
    lower: false,
    upper: false,
    number: false,
    symbol: false,
    length: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const [forgotPasswordEmailOtp, { isLoading: sendingOtp }] =
    useForgotPasswordEmailOtpMutation();
  const [resetPasswordVerifyOtp, { isLoading: verifyingOtp }] =
    useResetPasswordVerifyOtpMutation();
  const [resetPassword, { isLoading: resettingPassword }] =
    useResetPasswordMutation();

  useEffect(() => {
    setPasswordChecks({
      lower: /[a-z]/.test(passwordValue),
      upper: /[A-Z]/.test(passwordValue),
      number: /[0-9]/.test(passwordValue),
      symbol: /[^A-Za-z0-9]/.test(passwordValue),
      length: passwordValue.length >= 6,
    });
  }, [passwordValue]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (step === "otp" && timer > 0) {
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
  }, [step, timer]);

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

  const handleResendOtp = async () => {
    if (isResendDisabled || resendCooldown > 0) return;

    setIsResendDisabled(true);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);

    setTimer(OTP_TIMER_SECONDS);

    notifications.show({
      id: "resend-otp-loader",
      title: "Sending OTP...",
      message: "Please wait...",
      color: "yellow",
      loading: true,
      autoClose: false,
    });

    try {
      const response = await forgotPasswordEmailOtp({ email }).unwrap();

      notifications.update({
        id: "resend-otp-loader",
        title: "OTP Sent",
        message: response.message || `A new OTP has been sent to ${email}`,
        color: "green",
        loading: false,
        autoClose: 3000,
      });
    } catch (error: any) {
      notifications.update({
        id: "resend-otp-loader",
        title: "Failed to Send OTP",
        message:
          error?.data?.message ||
          error?.error?.data?.message ||
          "Something went wrong",
        color: "red",
        loading: false,
        autoClose: 3000,
      });
    }
  };

  const emailForm = useForm({
    initialValues: { email: "" },
    validate: {
      email: (value: string) =>
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
          ? null
          : "Enter a valid email address",
    },
  });

  const otpForm = useForm({
    initialValues: { otp: "" },
    validate: {
      otp: (value: string) =>
        value.length === 6 ? null : "Enter the 6-digit OTP",
    },
  });

  const passwordForm = useForm({
    initialValues: { password: "", confirmPassword: "" },
    validate: {
      password: (value: string) => {
        if (value.length === 0) return "Password is required";
        if (value.length > 70) return "Password cannot exceed 70 characters";
        if (!/[a-z]/.test(value))
          return "Must have at least one lowercase letter";
        if (!/[A-Z]/.test(value))
          return "Must have at least one uppercase letter";
        if (!/[0-9]/.test(value)) return "Must have at least one number";
        if (!/[^A-Za-z0-9]/.test(value)) return "Must have at least one symbol";
        if (value.length < 6) return "Password must have at least 6 characters";
        return null;
      },
      confirmPassword: (value: string, values: { password: string }) =>
        value.length === 0
          ? "Confirm Password is required"
          : value.length > 70
          ? "Confirm Password cannot exceed 70 characters"
          : value !== values.password
          ? "Passwords don't match"
          : null,
    },
  });

  const handleSendOtp = async (values: { email: string }) => {
    try {
      const emailValue = values.email;
      setEmail(emailValue);

      const response = await forgotPasswordEmailOtp({
        email: emailValue,
      }).unwrap();

      notifications.show({
        title: "OTP Sent",
        message: response.message || `OTP sent to ${emailValue}`,
        color: "green",
      });

      setStep("otp");
      setTimer(OTP_TIMER_SECONDS);
      setIsResendDisabled(false);
    } catch (error: any) {
      notifications.show({
        title: "Failed to Send OTP",
        message:
          error?.data?.message ||
          error?.error?.data?.message ||
          "Something went wrong",
        color: "red",
      });
    }
  };

  const handleVerifyOtp = async (values: { otp: string }) => {
    if (isVerifyDisabled) return;

    setIsVerifyDisabled(true);

    try {
      const otpValue = values.otp;
      setOtp(otpValue);

      const response = await resetPasswordVerifyOtp({
        email: email,
        otp: otpValue,
      }).unwrap();

      if (
        response.message &&
        response.message.includes("Invalid or expired OTP")
      ) {
        notifications.show({
          title: "OTP Verification Failed",
          message: response.message,
          color: "red",
        });
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (
        response.message &&
        response.message.includes("OTP Verification Successful")
      ) {
        setStep("reset");
        notifications.show({
          title: "OTP Verified",
          message: response.message,
          color: "green",
        });
        return;
      }

      notifications.show({
        title: "OTP Verification",
        message: response.message,
        color: "yellow",
      });
    } catch (error: any) {
      notifications.show({
        title: "OTP Verification Failed",
        message:
          error?.data?.message || error?.error?.data?.message || "Invalid OTP",
        color: "red",
      });
    } finally {
      setTimeout(() => setIsVerifyDisabled(false), 3000);
    }
  };

  const handleResetPassword = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await resetPassword({
        email: email,
        newPassword: values.password,
      }).unwrap();

      notifications.show({
        title: "Password Reset Successful",
        message:
          response.message || "Password reset successful. Login to proceed.",
        color: "green",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      notifications.show({
        title: "Password Reset Failed",
        message:
          error?.data?.message ||
          error?.error?.data?.message ||
          "Something went wrong",
        color: "red",
      });
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="bg-vintageBg min-h-screen font-gilroyRegular tracking-wider flex items-center justify-center relative">
      <div className="w-full max-w-md">
        <div className="bg-vintageBg bg-opacity-90 rounded-2xl shadow-lg overflow-hidden mb-8 border border-vintageBorder">
          <div className="relative h-48 flex items-center justify-center">
            <img
              src="/template4/login.jpg"
              alt="Reset Password"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>

          <div className="p-6 text-center">
           <h2 className="text-2xl font-melodramaRegular font-semibold text-center text-vintageText mb-2">
              Reset Your Password
            </h2>

            <p className="text-vintageText text-sm leading-relaxed">
              {step === "email" &&
                "Enter your registered email address to receive an OTP for password reset."}
              {step === "otp" &&
                `An OTP has been sent to ${email}. Enter it below to verify your identity.`}
              {step === "reset" &&
                "Set a new password for your account. Make sure it's strong and secure."}
            </p>
          </div>
        </div>

        <div className="bg-vintageBg bg-opacity-90 rounded-2xl shadow-lg p-6 border border-vintageBorder">
          {step === "email" && (
            <form
              onSubmit={emailForm.onSubmit((values) => handleSendOtp(values))}
              className="w-full flex flex-col gap-4"
            >
              <label className="text-sm font-medium text-vintageText">
                Registered Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your registered email address"
                {...emailForm.getInputProps("email")}
                required
                className="mt-1 w-full px-3 py-2 border border-vintageText border-opacity-30 
                           rounded-sm shadow-inner bg-vintageBg bg-opacity-50 
                           text-vintageText placeholder:text-gray-500 
                           focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
              />

              {emailForm.errors.email && (
                <span className="text-red-500 text-xs">
                  {emailForm.errors.email}
                </span>
              )}

              <button
                type="submit"
                disabled={sendingOtp}
                className="w-full rounded-sm px-4 py-3 font-semibold text-light bg-vintageText
                           hover:bg-opacity-90 active:bg-opacity-80 transition-colors border 
                           border-vintageText border-opacity-50 shadow-md disabled:opacity-70"
              >
                {sendingOtp ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <>
              <form
                onSubmit={otpForm.onSubmit(handleVerifyOtp)}
                className="w-full flex flex-col gap-4"
              >
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="Enter the 6-digit OTP"
                  {...otpForm.getInputProps("otp")}
                  required
                  className="mt-1 w-full px-3 py-2 border border-vintageText border-opacity-30 
                             rounded-sm shadow-inner bg-vintageBg bg-opacity-50 
                             text-vintageText placeholder:text-gray-500 
                             text-lg tracking-widest focus:ring-2 focus:ring-vintageText 
                             focus:border-vintageText"
                />

                {otpForm.errors.otp && (
                  <span className="text-red-500 text-xs">
                    {otpForm.errors.otp}
                  </span>
                )}

                <button
                  type="submit"
                  disabled={verifyingOtp || isVerifyDisabled}
                  className="w-full rounded-sm px-4 py-3 font-semibold text-light bg-vintageText
                             hover:bg-opacity-90 active:bg-opacity-80 transition-colors border 
                             border-vintageText border-opacity-50 shadow-md disabled:opacity-70"
                >
                  {verifyingOtp || isVerifyDisabled
                    ? "Verifying..."
                    : "Verify OTP"}
                </button>
              </form>

              <div className="border-t border-vintageBorder pt-4 mt-4 text-center">
                <div className="text-sm text-vintageText mb-2">
                  OTP expires in: {formatTimer(timer)}
                </div>

                <div className="text-xs text-vintageText">
                  Didn't receive the code?
                  {resendCooldown > 0 ? (
                    <span className="text-red-600 font-medium ml-1">
                      Resend in {resendCooldown}s
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium ml-1">
                      You can resend now
                    </span>
                  )}
                </div>

                <button
                  onClick={handleResendOtp}
                  disabled={isResendDisabled || resendCooldown > 0}
                  className="w-full mt-3 rounded-sm px-4 py-3 font-semibold text-light bg-yellow-500 hover:opacity-90 active:bg-opacity-80 transition-colors border border-vintageText 
              border-opacity-50 shadow-md disabled:opacity-70"
                >
                  {isResendDisabled || resendCooldown > 0
                    ? `Resend OTP (${resendCooldown}s)`
                    : "Resend OTP"}
                </button>
              </div>
            </>
          )}

          {step === "reset" && (
            <form
              onSubmit={passwordForm.onSubmit(handleResetPassword)}
              className="w-full flex flex-col gap-4"
            >
              <label className="text-sm font-medium text-vintageText">
                New Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...passwordForm.getInputProps("password")}
                  required
                  onChange={(e) => {
                    passwordForm.getInputProps("password").onChange(e);
                    setPasswordValue(e.target.value);
                  }}
                  className="mt-1 w-full px-3 py-2 pr-10 border border-vintageText border-opacity-30 
                             rounded-sm shadow-inner bg-vintageBg bg-opacity-50 
                             text-vintageText placeholder:text-gray-500 
                             focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-vintageText text-opacity-60"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {passwordValue.length > 0 && (
                <div className="mt-2 mb-2 bg-vintageBg border border-vintageBorder rounded-xl p-3">
                  <div className="font-semibold text-xs mb-2 text-vintageText">
                    PASSWORD MUST CONTAIN:
                  </div>

                  <ul className="list-none p-0 m-0 text-xs space-y-1">
                    <li
                      className={
                        passwordChecks.lower ? "text-green-600" : "text-red-500"
                      }
                    >
                      • At least one lowercase letter
                    </li>
                    <li
                      className={
                        passwordChecks.upper ? "text-green-600" : "text-red-500"
                      }
                    >
                      • At least one uppercase letter
                    </li>
                    <li
                      className={
                        passwordChecks.number
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      • At least one number
                    </li>
                    <li
                      className={
                        passwordChecks.symbol
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      • At least one symbol
                    </li>
                    <li
                      className={
                        passwordChecks.length
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      • Minimum 6 characters
                    </li>
                  </ul>
                </div>
              )}

              {passwordForm.errors.password && (
                <span className="text-red-500 text-xs">
                  {passwordForm.errors.password}
                </span>
              )}

              <label className="text-sm font-medium text-vintageText">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  {...passwordForm.getInputProps("confirmPassword")}
                  required
                  className="mt-1 w-full px-3 py-2 pr-10 border border-vintageText border-opacity-30 
                             rounded-sm shadow-inner bg-vintageBg bg-opacity-50 
                             text-vintageText placeholder:text-gray-500 
                             focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-vintageText text-opacity-60"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {passwordForm.errors.confirmPassword && (
                <span className="text-red-500 text-xs">
                  {passwordForm.errors.confirmPassword}
                </span>
              )}

              <button
                type="submit"
                disabled={resettingPassword}
                className="w-full rounded-sm px-4 py-3 font-semibold text-light bg-vintageText
                           hover:bg-opacity-90 active:bg-opacity-80 transition-colors border 
                           border-vintageText border-opacity-50 shadow-md disabled:opacity-70"
              >
                {resettingPassword ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/login")}
              className="text-vintageText font-medium text-sm hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetyourPassword;
