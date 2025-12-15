import { Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AuthenticationResponse } from "Interface/Client/Authentication/auth.interface";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAdminLoginMutation } from "Services/Admin/Auth/AdminAuthApiSlice";
import { setAdminCredentials } from "State/Admin/AuthSlice/AdminLoginSlice";
import { AppDispatch } from "State/store";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [termsOfService, setTermsOfService] = useState(true);
  const dispatch: AppDispatch = useDispatch();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [loggingProcess, setLoggingProcess] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      authenticationId: "",
      password: "",
    },
    validate: {
      authenticationId: (value: any) => {
        const isValid = /^\S+@\S+$/.test(value);
        return isValid ? null : "Invalid email address";
      },
      password: (value: any) => {
        const isValid = value.length >= 5;
        return isValid ? null : "Password must be at least 5 characters";
      },
    },
  });

  // const handleSubmit = async (values: {
  //   authenticationId: string;
  //   password: string;
  // }) => {
  //   try {
  //     const adminData = await adminLogin(values).unwrap();

  //     if (adminData?.token) {
  //       dispatch(
  //         setAdminCredentials({
  //           adminToken: adminData.token,
  //           adminInfo: {
  //             plant: adminData.plant,
  //             ecomconfig: adminData.ecomconfig,
  //           },
  //         })
  //       );

  //       notifications.show({
  //         title: "Login Successful",
  //         message: "Redirecting to admin dashboard",
  //         color: "green",
  //       });

  //       navigate("/admin");
  //     }
  //   } catch (err: any) {
  //     console.error("Admin login failed:", err);
  //     notifications.show({
  //       title: "Login Failed",
  //       message: err.data?.message || "Invalid credentials",
  //       color: "red",
  //     });
  //   }
  // };

  return (
    <div className="font-gilroyRegular min-h-screen font-montserrat tracking-widest flex items-center justify-center bg-[#1E2753]">
      <div className="bg-white w-full max-w-md p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center uppercase">
          Admin Login
        </h1>
        <form
          onSubmit={form.onSubmit(async (values) => {
            try {
              setLoggingProcess(true);

              const adminDataResponse = await adminLogin(values).unwrap();
              const adminData: AuthenticationResponse = adminDataResponse.results as AuthenticationResponse;

              if (adminData.token) {
                dispatch(
                  setAdminCredentials({
                    adminToken: adminData.token,
                    adminInfo: {
                      ...adminData,
                      plant: adminData.plant,
                      ecomconfig: adminData.ecomconfig,
                    },
                  })
                );


                notifications.show({
                  title: "Admin Login Successful",
                  message: "Redirecting to admin dashboard",
                  color: "green",
                });

                navigate("/admin");
              } else {
                console.warn("No token received in admin login response");
                notifications.show({
                  title: "Login Error",
                  message: "No authentication token received",
                  color: "red",
                });
              }
            } catch (err: any) {
              console.error("Admin login error:", err);
              notifications.show({
                title: "Admin Login Failed",
                message: err.data?.results.message || "Invalid admin credentials",
                color: "red",
              });
            } finally {
              setLoggingProcess(false);
            }
          })}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none"
              key={form.key("authenticationId")}
              {...form.getInputProps("authenticationId")}
            />
            {form.errors.authenticationId && (
              <Text c="red" size="sm" mt={4}>
                {form.errors.authenticationId}
              </Text>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
            {form.errors.password && (
              <Text c="red" size="sm" mt={4}>
                {form.errors.password}
              </Text>
            )}
          </div>
          {/* <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              onChange={(e) => setTermsOfService(e.target.checked)}
              checked={termsOfService}
            />
            <label htmlFor="terms" className="ml-2 block text-xs text-gray-900">
              By continuing, I agree to the terms of use & privacy policy.
            </label>
          </div> */}
          <div className="flex justify-center cursor-pointer">
            <Button
              w="100%"
              size="md"
              radius="xs"
              bg="black"
              color="white"
              type="submit"
              disabled={!termsOfService || isLoading}
              loading={isLoading}
              mt={30}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
