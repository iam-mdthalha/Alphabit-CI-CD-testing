import {
    Box,
    Button,
    Checkbox,
    Flex,
    Group,
    LoadingOverlay,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
  } from "@mantine/core";
  import { useForm } from "@mantine/form";
  import { notifications } from "@mantine/notifications";
  import { useRegisterMutation } from "Services/Auth/AuthApiSlice";
  import { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  
  const Register = () => {
    const navigate = useNavigate();
    const [termsOfService, setTermsOfService] = useState(false);
  
    // const {loading: registerLoading, error: registerError, success: registerSuccess} = useSelector((state: RootState) => state.register);
    const [register, { isLoading }] = useRegisterMutation();
  
    // useEffect(() => {
    //     if(registerSuccess) {
    //             notifications.show({
    //                 id: 'register-success',
    //                 withCloseButton: true,
    //                 autoClose: 5000,
    //                 title: "Registration Successful",
    //                 message: 'Please Login to proceed',
    //                 loading: false,
    //             });
    //             dispatch(changeRegisterSuccessState(false));
    //             navigate('/login');
    //     }
    //     else if(registerError) {
    //             notifications.show({
    //                 id: 'register-error',
    //                 withCloseButton: true,
    //                 autoClose: 5000,
    //                 title: "Registration Failed",
    //                 message: registerError,
    //                 loading: false,
  
    //             });
    //             dispatch(changeRegisterErrorState(null));
    //     }
    // }, [registerSuccess, navigate, dispatch, registerError]);
  
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
        fullName: (value: any) => {
          return value.length < 2
            ? "Your Name must have at least 2 letters"
            : null;
        },
        email: (value: any) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
        mobileNumber: (value: any) =>
          /^\d{10}$/.test(value) ? null : "Invalid mobile number",
        password: (value: any) => {
          if (!/[a-z]/.test(value)) return "Must have at least one lowercase letter";
          if (!/[A-Z]/.test(value)) return "Must have at least one uppercase letter";
          if (!/[0-9]/.test(value)) return "Must have at least one number";
          if (!/[^A-Za-z0-9]/.test(value)) return "Must have at least one symbol";
          if (value.length < 6) return "Password must have at least 6 characters";
          return null;
        },
        confirmPassword: (value: any, values: any) =>
          value !== values.password ? "Passwords did not match" : null,
      },
    });

    const [passwordChecks, setPasswordChecks] = useState({
      lower: false,
      upper: false,
      number: false,
      symbol: false,
      length: false,
    });

    useEffect(() => {
      const pwd = form.getInputProps("password").value || "";
      setPasswordChecks({
        lower: /[a-z]/.test(pwd),
        upper: /[A-Z]/.test(pwd),
        number: /[0-9]/.test(pwd),
        symbol: /[^A-Za-z0-9]/.test(pwd),
        length: pwd.length >= 6,
      });
    }, [form.getInputProps("password").value]);
  
    return (
      <div>
        <Group h="120vh" bg={"var(--mantine-color-login-background-0)"}>
          <form
            onSubmit={form.onSubmit(async (values) => {
              // dispatch(registerUser(values));
              try {
                const customerData = {
                  fullName: values.fullName,
                  email: values.email,
                  mobileNumber: values.mobileNumber,
                  password: values.password,
                };
                const result = await register(customerData).unwrap();
                notifications.show({
                  id: "register-success",
                  withCloseButton: true,
                  autoClose: 5000,
                  title: "Registration Successful",
                  message: '',
                  // message: "Please Login to proceed",
                  loading: false,
                });
                navigate("/login");
              } catch (err: any) {
                if (!err.response) {
                  notifications.show({
                    id: "register-error",
                    withCloseButton: true,
                    autoClose: 5000,
                    title: "Registration Failed",
                    message: "No Server Response",
                    loading: false,
                  });
                } else if (err.response.status === 400) {
                  notifications.show({
                    id: "register-error",
                    withCloseButton: true,
                    autoClose: 5000,
                    title: "Registration Failed",
                    message: "Missing Username or Password",
                    loading: false,
                  });
                } else {
                  notifications.show({
                    id: "register-error",
                    withCloseButton: true,
                    autoClose: 5000,
                    title: "Registration Failed",
                    message: "Registration Failed",
                    loading: false,
                  });
                }
              }
            })}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              component="div"
              pos="relative"
              p={50}
              w={{ base: "90%", sm: "50%", lg: "30%" }}
              style={{ boxShadow: "var(--mantine-shadow-lg)" }}
            >
              <Box pos="absolute">
                <LoadingOverlay
                  visible={isLoading}
                  zIndex={1000}
                  overlayProps={{ radius: "sm", blur: 2 }}
                />
              </Box>
  
              <Title order={4}>Register</Title>
  
              <Stack gap={10} w="100%">
                <TextInput
                  size="md"
                  radius="xs"
                  py={10}
                  withAsterisk
                  label="Name"
                  key={form.key("fullName")}
                  placeholder="Your First and Last Name"
                  {...form.getInputProps("fullName")}
                />
                <Flex w="100%" gap={20}>
                  <TextInput
                    size="md"
                    radius="xs"
                    py={10}
                    w="100%"
                    key={form.key("email")}
                    withAsterisk
                    label="Email Address"
                    placeholder="youremail@example.com"
                    {...form.getInputProps("email")}
                  />
                  <TextInput
                    size="md"
                    radius="xs"
                    py={10}
                    w="100%"
                    withAsterisk
                    label="Mobile Number"
                    maxLength={10}
                    key={form.key("mobileNumber")}
                    placeholder="XXXXX XXXXX"
                    {...form.getInputProps("mobileNumber")}
                  />
                </Flex>
  
                <PasswordInput
                  size="md"
                  radius="xs"
                  py={10}
                  label="Password"
                  key={form.key("password")}
                  withAsterisk
                  placeholder="Min 6 Characters"
                  {...form.getInputProps("password")}
                />
                <Box mt={5} mb={10}>
                  <Text fw={700} mb={5}>
                    PASSWORD MUST CONTAIN:
                  </Text>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li style={{ color: passwordChecks.lower ? 'green' : 'red', fontWeight: 600 }}>
                      {passwordChecks.lower ? '✔' : '✖'} At least <span style={{ fontWeight: 700 }}>one lowercase letter</span>
                    </li>
                    <li style={{ color: passwordChecks.upper ? 'green' : 'red', fontWeight: 600 }}>
                      {passwordChecks.upper ? '✔' : '✖'} At least <span style={{ fontWeight: 700 }}>one uppercase letter</span>
                    </li>
                    <li style={{ color: passwordChecks.number ? 'green' : 'red', fontWeight: 600 }}>
                      {passwordChecks.number ? '✔' : '✖'} At least <span style={{ fontWeight: 700 }}>one number</span>
                    </li>
                    <li style={{ color: passwordChecks.symbol ? 'green' : 'red', fontWeight: 600 }}>
                      {passwordChecks.symbol ? '✔' : '✖'} At least <span style={{ fontWeight: 700 }}>one symbol</span>
                    </li>
                    <li style={{ color: passwordChecks.length ? 'green' : 'red', fontWeight: 600 }}>
                      {passwordChecks.length ? '✔' : '✖'} Minimum <span style={{ fontWeight: 700 }}>6 characters</span>
                    </li>
                  </ul>
                </Box>
                <PasswordInput
                  size="md"
                  radius="xs"
                  py={10}
                  withAsterisk
                  key={form.key("confirmPassword")}
                  label="Confirm Password"
                  {...form.getInputProps("confirmPassword")}
                />
              </Stack>
              <Checkbox
                mt={30}
                label="By continuing, I agree to the terms of use & privacy policy."
                checked={termsOfService}
                onChange={(e) => {
                  setTermsOfService(e.target.checked);
                }}
              />
              <Button
                w="100%"
                size="md"
                radius="xs"
                type="submit"
                disabled={!termsOfService}
                bg="var(--mantine-color-secondary-filled)"
                mt={30}
              >
                Continue
              </Button>
              <Text mt={30}>
                Already have an account?{" "}
                <span
                  style={{
                    color: "var(--mantine-color-secondary-filled)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Click here
                </span>
              </Text>
            </Paper>
          </form>
        </Group>
      </div>
    );
  };
  
  export default Register;
  