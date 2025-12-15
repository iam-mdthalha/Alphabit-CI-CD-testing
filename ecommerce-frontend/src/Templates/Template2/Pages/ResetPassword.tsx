import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useForgotPasswordEmailOtpMutation,
  useResetPasswordMutation,
  useResetPasswordVerifyOtpMutation,
} from "Services/Auth/AuthApiSlice";

const OTP_TIMER_SECONDS = 120;
const THEME_GREEN = "#228722";

const ResetPassword: React.FC = () => {
  const [step, setStep] = useState<"mobile" | "otp" | "reset">("mobile");
  const [method, setMethod] = useState<"mobile" | "email">("email");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const [forgotPasswordEmailOtp, { isLoading: sendingOtp }] =
    useForgotPasswordEmailOtpMutation();
  const [resetPasswordVerifyOtp, { isLoading: verifyingOtp }] =
    useResetPasswordVerifyOtpMutation();
  const [resetPassword, { isLoading: resettingPassword }] =
    useResetPasswordMutation();

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      setCanResend(false);
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const handleResendOtp = async () => {
    try {
      const response = await forgotPasswordEmailOtp({ email }).unwrap();

      setTimer(OTP_TIMER_SECONDS);
      setCanResend(false);
      notifications.show({
        title: "OTP Resent",
        message: response.message || `OTP resent to ${email}`,
        color: "green",
      });
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      notifications.show({
        title: "Failed to Resend OTP",
        message:
          error?.data?.message ||
          error?.error?.data?.message ||
          "Something went wrong",
        color: "red",
      });
    }
  };

  const mobileForm = useForm({
    initialValues: { mobile: "" },
    validate: {
      mobile: (value: string) =>
        /^\d{10}$/.test(value) ? null : "Enter a valid 10-digit mobile number",
    },
  });

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
      password: (value: string) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      confirmPassword: (value: string, values: { password: string }) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleSendOtp = async (values: { mobile?: string; email?: string }) => {
    try {
      const emailValue = values.email || "";
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
      setCanResend(false);
    } catch (error: any) {
      console.error("OTP send error:", error);
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
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
        message: response.message || "Unknown response",
        color: "yellow",
      });
    } catch (error: any) {
      console.error("OTP verification error:", error);
      notifications.show({
        title: "OTP Verification Failed",
        message:
          error?.data?.message || error?.error?.data?.message || "Invalid OTP",
        color: "red",
      });
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
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Password reset error:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-montserrat px-4 mt-12 mb-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md flex flex-col items-center justify-center p-0 min-h-[540px]">
        <div className="w-full flex flex-col items-center px-8 pt-12 pb-10">
          <h2 className="text-2xl font-bold text-black mb-2">
            Reset Your Password
          </h2>
          <p className="text-gray-500 text-[15px] text-center mb-8 mt-1">
            {step === "mobile" &&
              "Enter your registered email address to receive an OTP for password reset."}
            {step === "otp" &&
              `An OTP has been sent to ${email}. Enter it below to verify your identity.`}
            {step === "reset" &&
              "Set a new password for your account. Make sure it's strong and secure."}
          </p>
          {step === "mobile" && (
            <form
              onSubmit={emailForm.onSubmit((v) =>
                handleSendOtp({ email: v.email })
              )}
              className="w-full"
            >
              <div className="flex flex-col gap-6 mt-6 mb-8">
                <label
                  className="font-semibold text-black text-[15px] mb-1"
                  htmlFor="email"
                >
                  Registered Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email address"
                  {...emailForm.getInputProps("email")}
                  required
                  className="mb-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-black text-[15px] focus:outline-none focus:ring-2 focus:ring-[#228722] transition"
                />
                {emailForm.errors.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {emailForm.errors.email}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={sendingOtp}
                  className="mt-3 mb-1 w-full bg-black text-white font-bold text-[16px] py-2 rounded-lg transition hover:bg-gray-800 disabled:opacity-60"
                >
                  {sendingOtp ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </form>
          )}
          {step === "otp" && (
            <form
              onSubmit={otpForm.onSubmit(handleVerifyOtp)}
              className="w-full"
            >
              <div className="flex flex-col gap-6 mt-6 mb-8">
                <label
                  className="font-semibold text-black text-[15px] mb-1"
                  htmlFor="otp"
                >
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter the 6-digit OTP"
                  maxLength={6}
                  {...otpForm.getInputProps("otp")}
                  required
                  className="mb-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-black text-[18px] tracking-widest focus:outline-none focus:ring-2 focus:ring-[#228722] transition"
                />
                {otpForm.errors.otp && (
                  <span className="text-red-500 text-sm mt-1">
                    {otpForm.errors.otp}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={verifyingOtp}
                  className="mt-3 mb-1 w-full bg-black text-white font-bold text-[16px] py-2 rounded-lg transition hover:bg-gray-800 disabled:opacity-60"
                >
                  {verifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
                <div className="text-center mt-2 text-[15px]">
                  {canResend ? (
                    <span
                      className="text-[#228722] font-semibold underline cursor-pointer hover:text-green-800 transition"
                      onClick={handleResendOtp}
                    >
                      Resend OTP
                    </span>
                  ) : (
                    <span className="text-gray-400 font-medium">
                      Resend OTP in {formatTimer(timer)}
                    </span>
                  )}
                </div>
              </div>
            </form>
          )}
          {step === "reset" && (
            <form
              onSubmit={passwordForm.onSubmit(handleResetPassword)}
              className="w-full"
            >
              <div className="flex flex-col gap-6 mt-6 mb-8">
                <label
                  className="font-semibold text-black text-[15px] mb-1"
                  htmlFor="password"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...passwordForm.getInputProps("password")}
                    required
                    className="mb-2 px-3 py-2 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-black text-[15px] focus:outline-none focus:ring-2 focus:ring-[#228722] transition w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
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
                        width="20"
                        height="20"
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
                {passwordForm.errors.password && (
                  <span className="text-red-500 text-sm mt-1">
                    {passwordForm.errors.password}
                  </span>
                )}
                <label
                  className="font-semibold text-black text-[15px] mb-1"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    {...passwordForm.getInputProps("confirmPassword")}
                    required
                    className="mb-2 px-3 py-2 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-black text-[15px] focus:outline-none focus:ring-2 focus:ring-[#228722] transition w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
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
                        width="20"
                        height="20"
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
                {passwordForm.errors.confirmPassword && (
                  <span className="text-red-500 text-sm mt-1">
                    {passwordForm.errors.confirmPassword}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={resettingPassword}
                  className="mt-3 mb-1 w-full bg-black text-white font-bold text-[16px] py-2 rounded-lg transition hover:bg-gray-800 disabled:opacity-60"
                >
                  {resettingPassword ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
