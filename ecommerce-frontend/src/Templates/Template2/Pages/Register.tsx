import { Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import GoogleLoginButton from "Components/Common/GoogleLogin";
import CustomDarkButtonFull from "Components/StyleComponent/CustomDarkButtonFull";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  usePreRegisterMutation,
  useRegisterMutation,
  useRegisterSendFast2SmsOtpMutation,
} from "Services/Auth/AuthApiSlice";
import { RootState } from "State/store";
import { maskMobile } from "../Utils/mask-mobile-number.util";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [registerSendFast2SmsOtp, { isLoading: sendFast2SmsOtpLoading }] =
    useRegisterSendFast2SmsOtpMutation();
  const [preRegister, { isLoading: preRegisterLoading }] =
    usePreRegisterMutation();

  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpTimer, setOtpTimer] = useState<number>(120);
  const [canResend, setCanResend] = useState<boolean>(false);

  const [otp, setOtp] = useState<string>("");

  const { userInfo, token } = useSelector((state: RootState) => state.login);

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
      isAnonymous: false
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
        setOtpTimer(120);
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
    }
  };

  const handleOTPResend = async () => {
    const otpSentResult = await registerSendFast2SmsOtp(
      form.getValues().mobileNumber
    ).unwrap();
    if (otpSentResult.otpStatus === "DELIVERED") {
      notifications.show({
        title: `OTP Sent to ${maskMobile(otpSentResult.mobileNo)}`,
        message: "Please check your phone",
        color: "green",
      });
      setOtpTimer(120);
      setCanResend(false);
    } else {
      throw new Error(otpSentResult.message || "Failed to resend OTP");
    }
    return;
  };

  // Combined loading state for form submissions
  const isSubmitting =
    registerLoading || sendFast2SmsOtpLoading || preRegisterLoading;

  return (
    <div className="min-h-screen bg-gray-100 font-montserrat tracking-wider flex items-center justify-center dark:bg-gray-900 px-4">
      {isSubmitting && !otpSent ? (
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
      ) : otpSent ? (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6 mt-12 mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
            Register
          </h2>
          <p className="text-sm text-center text-gray-500 dark:text-gray-300">
            OTP Verification
          </p>
          <form
            onSubmit={form.onSubmit(handleOTPSubmit)}
            className="space-y-5"
            autoComplete="off"
          >
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                OTP (6 digits)
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                onChange={handleOTPChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {otpSent && (
                <div className="flex justify-between">
                  <p className="text-sm text-red-600">
                    OTP will expire in {Math.floor(otpTimer / 60)}:
                    {(otpTimer % 60).toString().padStart(2, "0")}
                  </p>
                  {canResend && (
                    <button
                      type="button"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      onClick={handleOTPResend}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}
            </div>

            <CustomDarkButtonFull
              type="submit"
              disabled={(otpSent && otpTimer === 0) || registerLoading}
            >
              {registerLoading ? (
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
                "Register"
              )}
            </CustomDarkButtonFull>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6">
          <h1 className="text-3xl font-bold text-center uppercase">Register</h1>

          {/* Added Social Login Buttons */}
          <div className="flex flex-col gap-2">
            {/* <FacebookLoginButton mode="register" /> */}
            <GoogleLoginButton mode="register" />
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
            onSubmit={form.onSubmit(handleInitialSubmit)}
            className="space-y-6"
          >
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Full Name<span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm"
                maxLength={200}
                placeholder="Enter Full Name"
                {...form.getInputProps("fullName")}
              />
              {form.errors.fullName && (
                <Text c="red" size="sm" mt={4}>
                  {form.errors.fullName}
                </Text>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Email Address<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm"
                maxLength={100}
                placeholder="Enter Email Address"
                {...form.getInputProps("email")}
              />
              {form.errors.email && (
                <Text c="red" size="sm" mt={4}>
                  {form.errors.email}
                </Text>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Mobile Number<span className="text-red-500">*</span>
              </label>
              <input
                id="mobileNumber"
                type="tel"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm"
                maxLength={10}
                placeholder="Enter Mobile Number (Max 10 digits)"
                {...form.getInputProps("mobileNumber")}
              />
              {form.errors.mobileNumber && (
                <Text c="red" size="sm" mt={4}>
                  {form.errors.mobileNumber}
                </Text>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {(() => {
                  const { onChange, ...passwordProps } =
                    form.getInputProps("password");
                  return (
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={passwordValue}
                      onChange={(e) => {
                        setPasswordValue(e.target.value);
                        form.setFieldValue("password", e.target.value);
                      }}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm pr-10"
                      maxLength={70}
                      placeholder="Enter Password"
                      {...passwordProps}
                    />
                  );
                })()}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
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
              {/* Show checklist only if user has started typing */}
              {passwordValue.length > 0 && (
                <div className="mt-2 mb-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-all border border-gray-200 dark:border-gray-600">
                  <div className="font-semibold text-xs mb-1 text-gray-700 dark:text-gray-200">
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
                      <span style={{ fontSize: "1em", marginRight: 6 }}>
                        {passwordChecks.lower ? "✔" : "✖"}
                      </span>{" "}
                      At least{" "}
                      <span style={{ fontWeight: 500, marginLeft: 3 }}>
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
                      <span style={{ fontSize: "1em", marginRight: 6 }}>
                        {passwordChecks.upper ? "✔" : "✖"}
                      </span>{" "}
                      At least{" "}
                      <span style={{ fontWeight: 500, marginLeft: 3 }}>
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
                      <span style={{ fontSize: "1em", marginRight: 6 }}>
                        {passwordChecks.number ? "✔" : "✖"}
                      </span>{" "}
                      At least{" "}
                      <span style={{ fontWeight: 500, marginLeft: 3 }}>
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
                      <span style={{ fontSize: "1em", marginRight: 6 }}>
                        {passwordChecks.symbol ? "✔" : "✖"}
                      </span>{" "}
                      At least{" "}
                      <span style={{ fontWeight: 500, marginLeft: 3 }}>
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
                      <span style={{ fontSize: "1em", marginRight: 6 }}>
                        {passwordChecks.length ? "✔" : "✖"}
                      </span>{" "}
                      Minimum{" "}
                      <span style={{ fontWeight: 500, marginLeft: 3 }}>
                        6 characters
                      </span>
                    </li>
                  </ul>
                </div>
              )}
              {form.errors.password && (
                <Text c="red" size="sm" mt={4}>
                  {form.errors.password}
                </Text>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 text-sm pr-10"
                  maxLength={70}
                  placeholder="Enter Confirm Password"
                  {...form.getInputProps("confirmPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
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
              {form.errors.confirmPassword && (
                <Text c="red" size="sm" mt={4}>
                  {form.errors.confirmPassword}
                </Text>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
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
                  "Create a Caviaar Mode Account"
                )}
              </CustomDarkButtonFull>
            </div>
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

          <p className="text-center text-xs text-gray-600 dark:text-gray-400">
            <span>Already have an account? </span>
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              className="font-medium text-indigo-600 hover:underline"
            >
              Click here
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Register;
