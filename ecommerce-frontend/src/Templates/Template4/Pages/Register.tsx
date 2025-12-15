import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  usePreRegisterMutation,
  useRegisterMutation,
  useRegisterSendFast2SmsOtpMutation,
  useValidateFast2SmsOtpMutation,
} from "Services/Auth/AuthApiSlice";
import { RootState } from "State/store";
import { maskMobile } from "../Utils/mask-mobile-number.util";

const OTP_TIMER_SECONDS = 120;
const RESEND_COOLDOWN_SECONDS = 10;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [validateFast2SmsOtp, { isLoading: validateOtpLoading }] =
    useValidateFast2SmsOtpMutation();
  const [registerSendFast2SmsOtp, { isLoading: sendFast2SmsOtpLoading }] =
    useRegisterSendFast2SmsOtpMutation();
  const [preRegister, { isLoading: preRegisterLoading }] =
    usePreRegisterMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();

  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(OTP_TIMER_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otp, setOtp] = useState<string>("");
  const [isSubmittingInitial, setIsSubmittingInitial] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const { token } = useSelector((state: RootState) => state.login);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      isAnonymous: false,
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
        if (!/[a-z]/.test(value))
          return "Must have at least one lowercase letter";
        if (!/[A-Z]/.test(value))
          return "Must have at least one uppercase letter";
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

  const [passwordValue, setPasswordValue] = useState("");
  const [passwordChecks, setPasswordChecks] = useState({
    lower: false,
    upper: false,
    number: false,
    symbol: false,
    length: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  useEffect(() => {
    setPasswordChecks({
      lower: /[a-z]/.test(passwordValue),
      upper: /[A-Z]/.test(passwordValue),
      number: /[0-9]/.test(passwordValue),
      symbol: /[^A-Za-z0-9]/.test(passwordValue),
      length: passwordValue.length >= 6,
    });
  }, [passwordValue]);

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
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      let errorMessage = "Registration failed";

      if (err.data) {
        errorMessage = err.data.results.message || JSON.stringify(err.data);
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

  const handleInitialSubmit = async (values: typeof form.values) => {
    setIsSubmittingInitial(true);

    try {
      const response = await preRegister(values).unwrap();
      const otpSentResult = await registerSendFast2SmsOtp(
        values.mobileNumber
      ).unwrap();

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
      const message =
        err?.results?.message || err?.message || "An unexpected error occurred";

      notifications.show({
        title: "Registration Failed",
        message: message,
        color: "red",
      });
      setIsSubmittingInitial(false);
    }
  };

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
      const otpSentResult = await registerSendFast2SmsOtp(
        form.getValues().mobileNumber
      ).unwrap();

      if (otpSentResult.otpStatus === "DELIVERED") {
        notifications.update({
          id: "resend-otp-loader",
          title: "OTP Sent",
          message: `A new OTP has been sent to ${maskMobile(
            otpSentResult.mobileNo
          )}`,
          color: "green",
          loading: false,
          autoClose: 3000,
        });
        setOtpTimer(OTP_TIMER_SECONDS);
      } else {
        throw new Error(otpSentResult.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || "Failed to resend OTP";
      notifications.update({
        id: "resend-otp-loader",
        title: "Resend Failed",
        message: message,
        color: "red",
        loading: false,
        autoClose: 3000,
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

  const isSubmitting = validateOtpLoading || sendFast2SmsOtpLoading;

  return (
    <div className="bg-vintageBg min-h-screen font-gilroyRegular tracking-wider flex items-center justify-center relative">
      <div className="flex flex-1">
        <div className="hidden md:flex w-1/2 bg-vintageText items-center justify-center p-12 relative overflow-hidden">
          <div className="relative z-10 text-center text-vintageBg max-w-md">
            <div className="mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 极.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h1 className="text-4xl font-serif mb-4">Join Moore Market</h1>
              <p className="text-lg italic">
                Sign up today and earn 5 loyalty points on your purchase and
                enjoy even more exclusive member benefits!
              </p>
            </div>

            <div className="border-t border-light border-opacity-30 pt-6 mt-6">
              <p className="text-sm mb-4">Already have an account?</p>
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate("/login");
                }}
                className="px-6 py-2 bg-transparent border-2 border-light border-vintageBg text-vintageBg rounded-sm hover:bg-light hover:bg-opacity-10 transition-colors font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-vintageBg relative">
          <div className="w-full max-w-md bg-vintageBg p-8 rounded-sm shadow-lg border border-vintageText border-opacity-30 relative">
            {isSubmitting && !otpSent ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <svg
                    className="animate-spin h-12 w-12 text-vintageText"
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
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-vintageBg rounded-full"></div>
                </div>
              </div>
            ) : otpSent ? (
              <>
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
                    <h2 className="text-2xl font-serif text-vintageText">
                      OTP Verification
                    </h2>
                    <p className="text-sm text-vintageText text-opacity-80 mt-1">
                      Enter the OTP sent to your mobile
                    </p>
                  </div>

                  <form
                    onSubmit={form.onSubmit(handleOTPSubmit)}
                    className="space-y-5 relative z-10"
                  >
                    <div>
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium text-vintageText mb-1"
                      ></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-vintageText text-opacity-70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0极4h8z"
                            />
                          </svg>
                        </div>
                        <input
                          id="otp"
                          type="text"
                          maxLength={6}
                          onChange={handleOTPChange}
                          className="mt-1 w-full pl-10 pr-3 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                          placeholder="Enter 6-digit OTP"
                        />
                      </div>

                      <div className="border-t border-vintageBorder pt-4 mt-4 text-center">
                        <div className="text-sm text-vintageText mb-2">
                          OTP expires in: {formatTimer(otpTimer)}
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
                          type="button"
                          onClick={handleOTPResend}
                          disabled={isResendDisabled || resendCooldown > 0}
                          className="w-full mt-3 rounded-sm px-4 py-3 font-semibold text-light bg-yellow-500 hover:opacity-90 active:bg-opacity-80 transition-colors border border-vintageText 
                          border-opacity-50 shadow-md disabled:opacity-70"
                        >
                          {isResendDisabled || resendCooldown > 0
                            ? `Resend OTP (${resendCooldown}s)`
                            : "Resend OTP"}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={
                          (otpSent && otpTimer === 0) || validateOtpLoading
                        }
                        className="w-full rounded-sm px-4 py-3 font-semibold text-light bg-vintageText hover:bg-vintageText hover:bg-opacity-90 active:bg-vintageText active:bg-opacity-80 transition-colors duration-300 border border-vintageText border-opacity-50 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {validateOtpLoading ? (
                          <svg
                            className="animate-spin h-5 w-5 text-light"
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
                          "Complete Registration"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <>
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
                  <h2 className="text-2xl font-melodramaRegular font-semibold text-center text-vintageText mb-2">
                    Create Account
                  </h2>

                  <p className="text-sm text-vintageText text-opacity-80 mt-1">
                    Create an account to explore timeless books and vintage
                    treasures.
                  </p>
                </div>

                <form
                  onSubmit={form.onSubmit(handleInitialSubmit)}
                  className="space-y-5 relative z-10"
                >
                  <div>
                    <label
                      htmlFor="reg-fullName"
                      className="block text-sm font-medium text-vintageText mb-1"
                    >
                      Full Name<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-vintageText text-opacity-70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.121 17.804A8 8 0 1119 12v1a4 4 0 01-4 4H9a4 4 0 01-4-4"
                          />
                        </svg>
                      </div>
                      <input
                        id="reg-fullName"
                        type="text"
                        className="mt-1 w-full pl-10 pr-3 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                        placeholder="Enter your full name"
                        maxLength={200}
                        {...form.getInputProps("fullName")}
                      />
                    </div>
                    {form.errors.fullName && (
                      <p className="text-red-700 text-xs italic mt-1">
                        {form.errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-sm font-medium text-vintageText mb-1"
                    >
                      Email Address<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-vintageText text-opacity-70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2极"
                          />
                        </svg>
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        className="mt-1 w-full pl-10 pr-3 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                        placeholder="Enter your email address"
                        maxLength={100}
                        {...form.getInputProps("email")}
                      />
                    </div>
                    {form.errors.email && (
                      <p className="text-red-700 text-xs italic mt-1">
                        {form.errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-mobileNumber"
                      className="block text-sm font-medium text-vintageText mb-1"
                    >
                      Mobile Number<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-vintageText text-opacity-70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <input
                        id="reg-mobileNumber"
                        type="tel"
                        className="mt-1 w-full pl-10 pr-3 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                        placeholder="Enter mobile number"
                        maxLength={10}
                        {...form.getInputProps("mobileNumber")}
                      />
                    </div>
                    {form.errors.mobileNumber && (
                      <p className="text-red-700 text-xs italic mt-1">
                        {form.errors.mobileNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-password"
                      className="block text-sm font-medium text-vintageText mb-1"
                    >
                      Password<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-vintageText text-opacity-70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0极4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        className="mt-1 w-full pl-10 pr-10 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                        placeholder="Create a password"
                        maxLength={70}
                        {...form.getInputProps("password")}
                        onChange={(e) => {
                          form.getInputProps("password").onChange(e);
                          setPasswordValue(e.target.value);
                        }}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-vintageText text-opacity-70 hover:text-vintageText focus:outline-none"
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

                    {passwordValue.length > 0 && (
                      <div className="mt-2 mb-2 bg-vintageBg border border-vintageText border-opacity-20 rounded-sm p-3 transition-all">
                        <div className="font-semibold text-xs mb-1 text-vintageText">
                          PASSWORD MUST CONTAIN:
                        </div>
                        <ul className="list-none p-0 m-0 text-xs space-y-1">
                          <li
                            style={{
                              color: passwordChecks.lower ? "green" : "red",
                              fontWeight: 400,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "1em",
                                marginRight: 6,
                              }}
                            >
                              {passwordChecks.lower ? "✔" : "✖"}
                            </span>{" "}
                            At least{" "}
                            <span
                              style={{
                                fontWeight: 500,
                                marginLeft: 3,
                              }}
                            >
                              one lowercase letter
                            </span>
                          </li>

                          <li
                            style={{
                              color: passwordChecks.upper ? "green" : "red",
                              fontWeight: 400,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "1em",
                                marginRight: 6,
                              }}
                            >
                              {passwordChecks.upper ? "✔" : "✖"}
                            </span>{" "}
                            At least{" "}
                            <span
                              style={{
                                fontWeight: 500,
                                marginLeft: 3,
                              }}
                            >
                              one uppercase letter
                            </span>
                          </li>

                          <li
                            style={{
                              color: passwordChecks.number ? "green" : "red",
                              fontWeight: 400,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "1em",
                                marginRight: 6,
                              }}
                            >
                              {passwordChecks.number ? "✔" : "✖"}
                            </span>{" "}
                            At least{" "}
                            <span
                              style={{
                                fontWeight: 500,
                                marginLeft: 3,
                              }}
                            >
                              one number
                            </span>
                          </li>

                          <li
                            style={{
                              color: passwordChecks.symbol ? "green" : "red",
                              fontWeight: 400,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "1em",
                                marginRight: 6,
                              }}
                            >
                              {passwordChecks.symbol ? "✔" : "✖"}
                            </span>{" "}
                            At least{" "}
                            <span
                              style={{
                                fontWeight: 500,
                                marginLeft: 3,
                              }}
                            >
                              one symbol
                            </span>
                          </li>

                          <li
                            style={{
                              color: passwordChecks.length ? "green" : "red",
                              fontWeight: 400,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "1em",
                                marginRight: 6,
                              }}
                            >
                              {passwordChecks.length ? "✔" : "✖"}
                            </span>{" "}
                            Minimum{" "}
                            <span
                              style={{
                                fontWeight: 500,
                                marginLeft: 3,
                              }}
                            >
                              6 characters
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}

                    {form.errors.password && (
                      <p className="text-red-700 text-xs italic mt-1">
                        {form.errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-confirmPassword"
                      className="block text-sm font-medium text-vintageText mb-1"
                    >
                      Confirm Password<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-vintageText text-opacity-70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0极4h8z"
                          />
                        </svg>
                      </div>
                      <input
                        id="reg-confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="mt-1 w-full pl-10 pr-10 py-2 border border-vintageText border-opacity-30 rounded-sm shadow-inner bg-vintageBg bg-opacity-50 text-vintageText focus:ring-2 focus:ring-vintageText focus:border-vintageText text-sm"
                        placeholder="Confirm your password"
                        maxLength={70}
                        {...form.getInputProps("confirmPassword")}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-vintageText text-opacity-70 hover:text-vintageText focus:outline-none"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
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
                    {form.errors.confirmPassword && (
                      <p className="text-red-700 text-xs italic mt-1">
                        {form.errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || isSubmittingInitial}
                      className="w-full rounded-sm px-4 py-3 font-semibold text-light bg-vintageText hover:bg-vintageText hover:bg-opacity-90 active:bg-vintageText active:bg-opacity-80 transition-colors duration-300 border border-vintageText border-opacity-50 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting || isSubmittingInitial ? (
                        <svg
                          className="animate-spin h-5 w-5 text-light"
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
                        "Create a Moore Market Account"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            <p className="text-xs text-vintageText text-opacity-80 italic text-center mt-6">
              By creating an account, you agree to our{" "}
              <a
                href="/terms-and-conditions"
                className="text-vintageText underline font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy-policy"
                className="text-vintageText underline font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
