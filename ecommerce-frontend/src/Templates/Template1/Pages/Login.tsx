import {
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import emitter from "Events/eventEmitter";
import { useLoginWithPasswordMutation } from "Services/Auth/AuthApiSlice";
import { useUpdateCustomerCartMutation } from "Services/CartApiSlice";
import { setCredentials } from "State/AuthSlice/LoginSlice";
import { setLoggedIn } from "State/StateEvents";
import { AppDispatch, RootState } from "State/store";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [termsOfService, setTermsOfService] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  // const {loading: loginLoading, error: loginError, success: loginSuccess} = useSelector((state: RootState) => state.login);

  const [login, { isLoading: loginLoading }] = useLoginWithPasswordMutation();
  const { cartList } = useSelector((state: RootState) => state.cart);
  const [updateCustomerCart, { isLoading: cartUpdateLoading }] =
    useUpdateCustomerCartMutation();
  const [loggingProcess, setLoggingProcess] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      authenticationId: "",
      password: "",
    },
    validate: {
      authenticationId: (value: any) =>
        /^\S+@\S+$/.test(value) || /^\d{10}$/.test(value)
          ? null
          : "Invalid Credentials",
      password: (value: any) =>
        value.length < 6 ? "Password must have at least 6 characters" : null,
    },
  });

  return loginLoading && loggingProcess ? (
    <CircleLoader />
  ) : (
    <Group
      h="90vh"
      justify="center"
      align="center"
      bg={"var(--mantine-color-login-background-0)"}
    >
      <form
        onSubmit={form.onSubmit(async (values) => {
          try {
            // setLoggingProcess(true);
            const userData = await login(values).unwrap();

            dispatch(setCredentials({ userToken: userData.results.token }));
            if (userData.results.token) {
              dispatch(setLoggedIn(true));
              notifications.show({
                id: "login-success",
                withCloseButton: true,
                autoClose: 3000,
                title: "Login Successful",
                message: "Browse Products",
                loading: false,
              });
            }

          
            emitter.emit("loggedIn", {
              cartList: cartList,
              updateCustomerCart: updateCustomerCart,
            });

            navigate("/");
         
          } catch (err: any) {
            dispatch(setLoggedIn(false));
            if (err.originalStatus === 401) {
              notifications.show({
                id: "login-error",
                withCloseButton: true,
                autoClose: 5000,
                title: "Login Failed",
                message: err.data,
                loading: false,
              });
            } else {
              notifications.show({
                id: "login-error",
                withCloseButton: true,
                autoClose: 5000,
                title: "Login Failed",
                message: "Login Failed",
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
          w={{ base: "90%", sm: "50%", lg: "30%" }}
          p={50}
          style={{ boxShadow: "var(--mantine-shadow-lg)" }}
        >
          <Title order={4}>Login</Title>
          <Stack gap={10}>
            <TextInput
              size="md"
              radius="xs"
              py={10}
              placeholder="Email Address / Mobile Number"
              key={form.key("authenticationId")}
              {...form.getInputProps("authenticationId")}
            />
            <PasswordInput
              size="md"
              radius="xs"
              py={10}
              placeholder="Password"
              key={form.key("password")}
              {...form.getInputProps("password")}
            />
          </Stack>
          <Checkbox
            mt={30}
            label="By continuing, I agree to the terms of use & privacy policy."
            onChange={(e) => {
              setTermsOfService(e.target.checked);
            }}
            checked={termsOfService}
          />
          <Button
            w="100%"
            size="md"
            radius="xs"
            bg="var(--mantine-color-secondary-filled)"
            type="submit"
            disabled={!termsOfService}
            mt={30}
          >
            Continue
          </Button>
          <Text mt={30}>
            Create an account?{" "}
            <span
              style={{
                color: "var(--mantine-color-secondary-filled)",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/register");
              }}
            >
              Click here
            </span>
          </Text>
        </Paper>
      </form>
    </Group>
  );
};
export default Login;
