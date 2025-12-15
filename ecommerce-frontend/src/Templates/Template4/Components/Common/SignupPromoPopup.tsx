import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "State/store";
import { useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { maskMobile } from "Templates/Template4/Utils/mask-mobile-number.util";

import {
  usePreRegisterMutation,
  useRegisterMutation,
  useRegisterSendFast2SmsOtpMutation,
  useValidateFast2SmsOtpMutation,
} from "Services/Auth/AuthApiSlice";

const SMALL_POPUP_DELAY = 3000;
const SMALL_POPUP_KEY = "small_signup_popup_clicked";

const OTP_TIMER_SECONDS = 120;
const RESEND_COOLDOWN_SECONDS = 10;

const SignupPromoPopup: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.login);

  const [showSmallPopup, setShowSmallPopup] = useState(false);
  const [showBigPopup, setShowBigPopup] = useState(false);

  const [preRegister, { isLoading: preRegisterLoading }] = usePreRegisterMutation();
  const [registerSendFast2SmsOtp, { isLoading: sendFast2SmsOtpLoading }] =
    useRegisterSendFast2SmsOtpMutation();
  const [validateFast2SmsOtp, { isLoading: validateOtpLoading }] =
    useValidateFast2SmsOtpMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();

  // OTP & timers
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(OTP_TIMER_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [otp, setOtp] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  // which field is focused — used to show requirement hints
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      fullName: (value: any) =>
        value.length === 0
          ? "Full Name is required"
          : value.length > 200
          ? "Full Name cannot exceed 200 characters"
          : value.length < 2
          ? "Name must have at least 2 letters"
          : null,
      email: (value: any) =>
        value.length === 0
          ? "Email is required"
          : value.length > 100
          ? "Email cannot exceed 100 characters"
          : !/^\S+@\S+$/.test(value)
          ? "Invalid email"
          : null,
      mobileNumber: (value: any) =>
        value.length === 0
          ? "Mobile Number is required"
          : value.length > 30
          ? "Mobile Number cannot exceed 30 characters"
          : !/^\d{10,30}$/.test(value)
          ? "Invalid mobile number"
          : null,
      password: (value: any) => {
        if (value.length === 0) return "Password is required";
        if (value.length > 70) return "Password cannot exceed 70 characters";
        if (!/[a-z]/.test(value)) return "Must have at least one lowercase letter";
        if (!/[A-Z]/.test(value)) return "Must have at least one uppercase letter";
        if (!/[0-9]/.test(value)) return "Must have at least one number";
        if (!/[^A-Za-z0-9]/.test(value)) return "Must have at least one symbol";
        if (value.length < 6) return "Password must have at least 6 characters";
        return null;
      },
      confirmPassword: (value: any, values: any) =>
        value.length === 0
          ? "Confirm Password is required"
          : value.length > 70
          ? "Confirm Password cannot exceed 70 characters"
          : value !== values.password
          ? "Passwords don't match"
          : null,
    },
  });

  // ===== Requirement-check helpers (for hint boxes) =====
  const fullNameChecks = {
    required: (v: string) => v.trim().length > 0,
    lengthOk: (v: string) => v.trim().length >= 2 && v.trim().length <= 200,
    format: (v: string) => /^[A-Za-z\s.'-]+$/.test(v.trim()) || v.trim().length === 0, // allow names with common punctuation; if empty treat as not failing format
  };

  const emailChecks = {
    required: (v: string) => v.trim().length > 0,
    format: (v: string) => /^\S+@\S+\.\S+$/.test(v) || v.trim().length === 0,
    maxLength: (v: string) => v.length <= 100,
  };

  const mobileChecks = {
    required: (v: string) => v.trim().length > 0,
    digitsOnly: (v: string) => /^\d*$/.test(v),
    exactTen: (v: string) => v.trim().length === 10,
    startsWith: (v: string) => /^[6-9]/.test(v),
  };

  const passwordChecks = {
    required: (v: string) => v.length > 0,
    minLen: (v: string) => v.length >= 6,
    lower: (v: string) => /[a-z]/.test(v),
    upper: (v: string) => /[A-Z]/.test(v),
    number: (v: string) => /[0-9]/.test(v),
    symbol: (v: string) => /[^A-Za-z0-9]/.test(v),
  };

  const confirmPasswordChecks = {
    required: (v: string) => v.length > 0,
    matches: (v: string, val: string) => v === val && v.length > 0,
  };
 

  useEffect(() => {
    if (token) return;
    if (sessionStorage.getItem(SMALL_POPUP_KEY) === "true") return;

    const timer = setTimeout(() => {
      setShowSmallPopup(true);
    }, SMALL_POPUP_DELAY);

    return () => clearTimeout(timer);
  }, [token]);

  // OTP timer effect
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (otpSent && otpTimer > 0) {
      timerRef.current = setInterval(() => {
        setOtpTimer((prev) => {
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
  }, [otpSent, otpTimer]);

  // resend cooldown effect
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

  const openBigPopup = () => {
    setShowSmallPopup(false);
    setShowBigPopup(true);
    sessionStorage.setItem(SMALL_POPUP_KEY, "true");
  };

  const closeBigPopup = () => {
    setShowBigPopup(false);
    setOtpSent(false);
    setOtpTimer(OTP_TIMER_SECONDS);
    setResendCooldown(0);
    setIsResendDisabled(false);
    setOtp("");

  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleInitialSubmit = async (values: typeof form.values) => {
    try {
      // call pre-register (validate user doesn't exist etc)
      await preRegister(values).unwrap();

      // send OTP
      const otpSentResult = await registerSendFast2SmsOtp(values.mobileNumber).unwrap();

      if (otpSentResult.otpStatus === "DELIVERED") {
        notifications.show({
          title: `OTP Sent to ${maskMobile(otpSentResult.mobileNo)}`,
          message: "Please check your phone",
          color: "green",
        });
        setOtpTimer(OTP_TIMER_SECONDS);
        setOtpSent(true);
      } else {
        throw new Error(otpSentResult.message || "Failed to send OTP");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      const message = err?.results?.message || err?.message || "An unexpected error occurred";

      notifications.show({
        title: "Registration Failed",
        message,
        color: "red",
      });
    }
  };

  // OTP resend
  const handleOTPResend = async () => {
    if (isResendDisabled || resendCooldown > 0) return;

    setIsResendDisabled(true);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);

    notifications.show({
      id: "resend-otp-loader",
      title: "Sending OTP...",
      message: "Please wait...",
      color: "yellow",
      loading: true,
      autoClose: false,
    });

    try {
      const otpSentResult = await registerSendFast2SmsOtp(form.getValues().mobileNumber).unwrap();

      if (otpSentResult.otpStatus === "DELIVERED") {
        notifications.update({
          id: "resend-otp-loader",
          title: "OTP Sent",
          message: `A new OTP has been sent to ${maskMobile(otpSentResult.mobileNo)}`,
          color: "green",
          loading: false,
          autoClose: 3000,
        });
        setOtpTimer(OTP_TIMER_SECONDS);
      } else {
        throw new Error(otpSentResult.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      const message = err?.data?.message || err?.message || "Failed to resend OTP";
      notifications.update({
        id: "resend-otp-loader",
        title: "Resend Failed",
        message,
        color: "red",
        loading: false,
        autoClose: 3000,
      });
    }
  };

  const handleOTPSubmit = async (values: typeof form.values) => {
    try {
      const result = await register({
        fullName: values.fullName,
        email: values.email,
        mobileNumber: values.mobileNumber,
        password: values.password,
        otp: otp,
      }).unwrap();

      notifications.show({
        title: "Success",
        message: "Registration successful! Please login",
        color: "green",
      });

      // close popup and navigate to login
      closeBigPopup();
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      let errorMessage = "Registration failed";

      if (err.data) {
        errorMessage = err.data.results?.message || JSON.stringify(err.data);
      } else if (err.status === 500) {
        errorMessage = "Server error occurred";
      }

      notifications.show({
        title: "Registration Failed",
        message: errorMessage,
        color: "red",
      });
    }
  };

  const isSubmitting = validateOtpLoading || sendFast2SmsOtpLoading || preRegisterLoading;

  // If user already logged in, hide popup entirely
  if (token) return null;

  return (
    <>
      {/* Small popup shown after delay */}
      {showSmallPopup && (
        <div
          className="
            fixed z-50
            bg-vintageText text-vintageBg
            px-6 py-4 rounded-2xl shadow-2xl
            animate-fade-in transition-all duration-300
            cursor-pointer w-[320px] hover:scale-[1.02]
            left-4 bottom-6 sm:left-8 sm:bottom-8 max-sm:left-4 max-sm:bottom-[90px]
          "
          onClick={openBigPopup}
          role="button"
          aria-label="Open signup popup"
        >
          <button
            aria-label="Close small popup"
            onClick={(e) => {
              e.stopPropagation();
              setShowSmallPopup(false);
              sessionStorage.setItem(SMALL_POPUP_KEY, "true");
            }}
            className="absolute top-2 right-2 text-lg font-bold hover:text-yellow-300"
          >
            ✕
          </button>

          <p className="text-base font-semibold leading-snug">
            🎉 Subscribe today and unlock your
            <span className="block mt-1 text-yellow-300">exclusive 50% OFF</span>
          </p>
        </div>
      )}

      {/* Big popup (main integration) */}
      {showBigPopup && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 animate-fade-in px-4"
          onClick={closeBigPopup}
          aria-modal="true"
        >
          {/* inline style + small <style> block below to hide scrollbar visually but keep scrolling */}
          <div
            className="
              bg-vintageBg text-vintageText
              w-full max-w-sm sm:max-w-md lg:max-w-lg
              max-h-[90vh] overflow-y-auto hide-scrollbar
              p-6 rounded-2xl shadow-xl
              relative animate-scale-in
            "
            onClick={(e) => e.stopPropagation()}
            
          >
            
            <style>{`
              .hide-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <button
              aria-label="Close signup popup"
              onClick={closeBigPopup}
              className="
                absolute top-3 right-3 w-9 h-9
                inline-flex items-center justify-center
                text-lg rounded-full hover:bg-vintageText/10
              "
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-center mb-2">Sign Up & Unlock 50% OFF 🎉</h2>

            <p className="text-center text-sm text-gray-700 mb-4">Complete the form to sign up.</p>

            {otpSent ? (
              <div className="space-y-6">
                <div className="text-center mb-6 relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-vintageText text-light mb-4">
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
                      className="lucide lucide-book-open-icon lucide-book-open"
                    >
                      <path d="M12 7v14" />
                      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-serif text-vintageText">OTP Verification</h2>
                  <p className="text-sm text-vintageText text-opacity-80 mt-1">Enter the OTP sent to your mobile</p>
                </div>

                <form onSubmit={form.onSubmit(handleOTPSubmit)} className="space-y-5 relative z-10">
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-vintageText mb-1" />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-vintageText text-opacity-70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2m10-10V7a4 4 0 00-8 0极4h8z" />
                        </svg>
                      </div>
                      <input
                        id="otp"
                        type="text"
                        maxLength={6}
                        onChange={handleOTPChange}
                        className="mt-1 w-full pl-10 pr-3 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                      />
                    </div>

                    <div className="border-t border-vintageBorder pt-4 mt-4 text-center">
                      <div className="text-sm text-vintageText mb-2">OTP expires in: {formatTimer(otpTimer)}</div>

                      <div className="text-xs text-vintageText">
                        Didn't receive the code?
                        {resendCooldown > 0 ? (
                          <span className="text-red-600 font-medium ml-1">Resend in {resendCooldown}s</span>
                        ) : (
                          <span className="text-green-600 font-medium ml-1">You can resend now</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleOTPResend}
                        disabled={isResendDisabled || resendCooldown > 0}
                        className="w-full mt-3 rounded-sm px-4 py-3 font-semibold text-light bg-yellow-500 hover:opacity-90 active:bg-opacity-80 transition-colors disabled:opacity-70"
                      >
                        {isResendDisabled || resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Resend OTP"}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={(otpSent && otpTimer === 0) || validateOtpLoading}
                      className="w-full rounded-sm px-4 py-3 font-semibold text-light bg-vintageText hover:bg-vintageText hover:bg-opacity-90 active:bg-vintageText active:bg-opacity-80 transition-colors duration-300 border border-vintageText border-opacity-50 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {validateOtpLoading ? (
                        <svg className="animate-spin h-5 w-5 text-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        "Complete Registration"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <form onSubmit={form.onSubmit(handleInitialSubmit)} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="reg-fullName" className="block text-sm font-medium text-vintageText mb-1">
                    Full Name<span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-vintageText text-opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A8 8 0 1119 12v1a4 4 0 01-4 4H9a4 4 0 01-4-4" />
                      </svg>
                    </div>
                    <input
                      id="reg-fullName"
                      type="text"
                      className="mt-1 w-full pl-10 pr-3 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                      placeholder="Enter your full name"
                      maxLength={200}
                      {...form.getInputProps("fullName")}
                      onFocus={() => setFocusedField("fullName")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {form.errors.fullName && <p className="text-red-700 text-xs italic mt-1">{form.errors.fullName}</p>}

                  {/* requirement hints */}
                  {focusedField === "fullName" && (
                    <div className="mt-2 text-xs border p-2 rounded bg-gray-50">
                      <p className={fullNameChecks.required(form.values.fullName) ? "text-green-600" : "text-red-600"}>
                        ✔ Required
                      </p>
                      <p className={fullNameChecks.lengthOk(form.values.fullName) ? "text-green-600" : "text-red-600"}>
                        ✔ 2 - 200 characters
                      </p>
                      <p className={fullNameChecks.format(form.values.fullName) ? "text-green-600" : "text-red-600"}>
                        ✔ Letters and common name punctuation
                      </p>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-vintageText mb-1">
                    Email Address<span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-vintageText text-opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2极" />
                      </svg>
                    </div>
                    <input
                      id="reg-email"
                      type="email"
                      className="mt-1 w-full pl-10 pr-3 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                      placeholder="Enter your email address"
                      maxLength={100}
                      {...form.getInputProps("email")}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {form.errors.email && <p className="text-red-700 text-xs italic mt-1">{form.errors.email}</p>}

                  {focusedField === "email" && (
                    <div className="mt-2 text-xs border p-2 rounded bg-gray-50">
                      <p className={emailChecks.required(form.values.email) ? "text-green-600" : "text-red-600"}>
                        ✔ Required
                      </p>
                      <p className={emailChecks.format(form.values.email) ? "text-green-600" : "text-red-600"}>
                        ✔ Valid email format
                      </p>
                      <p className={emailChecks.maxLength(form.values.email) ? "text-green-600" : "text-red-600"}>
                        ✔ Max 100 characters
                      </p>
                    </div>
                  )}
                </div>

                {/* Mobile */}
                <div>
                  <label htmlFor="reg-mobileNumber" className="block text-sm font-medium text-vintageText mb-1">
                    Mobile Number<span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-vintageText text-opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      id="reg-mobileNumber"
                      type="tel"
                      className="mt-1 w-full pl-10 pr-3 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                      placeholder="Enter mobile number"
                      maxLength={10}
                      {...form.getInputProps("mobileNumber")}
                      onFocus={() => setFocusedField("mobile")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {form.errors.mobileNumber && <p className="text-red-700 text-xs italic mt-1">{form.errors.mobileNumber}</p>}

                  {focusedField === "mobile" && (
                    <div className="mt-2 text-xs border p-2 rounded bg-gray-50">
                      <p className={mobileChecks.required(form.values.mobileNumber) ? "text-green-600" : "text-red-600"}>
                        ✔ Required
                      </p>
                      <p className={mobileChecks.exactTen(form.values.mobileNumber) ? "text-green-600" : "text-red-600"}>
                        ✔ Exactly 10 digits
                      </p>
                      <p className={mobileChecks.digitsOnly(form.values.mobileNumber) ? "text-green-600" : "text-red-600"}>
                        ✔ Numbers only
                      </p>
                      <p className={mobileChecks.startsWith(form.values.mobileNumber) ? "text-green-600" : "text-red-600"}>
                        ✔ Starts with digit 6-9
                      </p>
                    </div>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-medium text-vintageText mb-1">
                    Password<span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-vintageText text-opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0极4h8z" />
                      </svg>
                    </div>
                    <input
                      id="reg-password"
                      type="password"
                      className="mt-1 w-full pl-10 pr-10 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                      placeholder="Create a password"
                      maxLength={70}
                      {...form.getInputProps("password")}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {form.errors.password && <p className="text-red-700 text-xs italic mt-1">{form.errors.password}</p>}

                  {focusedField === "password" && (
                    <div className="mt-2 text-xs border p-2 rounded bg-gray-50">
                      <p className={passwordChecks.required(form.values.password) ? "text-green-600" : "text-red-600"}>
                        ✔ Required
                      </p>
                      <p className={passwordChecks.minLen(form.values.password) ? "text-green-600" : "text-red-600"}>
                        ✔ 6+ characters
                      </p>
                      <p className={passwordChecks.lower(form.values.password) ? "text-green-600" : "text-red-600"}>
                        ✔ Lowercase letter
                      </p>
                      <p className={passwordChecks.upper(form.values.password) ? "text-green-600" : "text-red-600"}>
                        ✔ Uppercase letter
                      </p>
                      <p className={passwordChecks.number(form.values.password) ? "text-green-600" : "text-red-600"}>
                        ✔ Number
                      </p>
                      <p className={passwordChecks.symbol(form.values.password) ? "text-green-600" : "text-red-600"}>
                        ✔ Symbol (non-alphanumeric)
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="reg-confirmPassword" className="block text-sm font-medium text-vintageText mb-1">
                    Confirm Password<span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-vintageText text-opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0极4h8z" />
                      </svg>
                    </div>
                    <input
                      id="reg-confirmPassword"
                      type="password"
                      className="mt-1 w-full pl-10 pr-10 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                      placeholder="Confirm your password"
                      maxLength={70}
                      {...form.getInputProps("confirmPassword")}
                      onFocus={() => setFocusedField("confirm")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {form.errors.confirmPassword && <p className="text-red-700 text-xs italic mt-1">{form.errors.confirmPassword}</p>}

                  {focusedField === "confirm" && (
                    <div className="mt-2 text-xs border p-2 rounded bg-gray-50">
                      <p className={confirmPasswordChecks.required(form.values.confirmPassword) ? "text-green-600" : "text-red-600"}>
                        ✔ Required
                      </p>
                      <p className={confirmPasswordChecks.matches(form.values.confirmPassword, form.values.password) ? "text-green-600" : "text-red-600"}>
                        ✔ Matches password
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || registerLoading}
                    className="w-full rounded-sm px-4 py-3 font-semibold text-light bg-vintageText hover:bg-vintageText hover:bg-opacity-90 active:bg-vintageText active:bg-opacity-80 transition-colors duration-300 border border-vintageText border-opacity-50 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting || registerLoading ? (
                      <svg className="animate-spin h-5 w-5 text-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      "Create a Moore Market Account"
                    )}
                  </button>
                </div>
              </form>
            )}
            <p className="text-xs text-vintageText text-opacity-80 italic text-center mt-6">
              By creating an account, you agree to our{" "}
              <a href="/terms-and-conditions" className="text-vintageText underline font-semibold" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" className="text-vintageText underline font-semibold" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupPromoPopup;
