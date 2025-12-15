import {
  Button,
  Flex,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { countries } from "Constants/Country";
import { states } from "Constants/State";
import { useProcessAnonymousOrderMutation } from "Services/OrderProcessingApiSlice";
import { clearCart } from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import OrderSummary from "Templates/Template1/Components/Checkout/OrderSummary";
import {
  AnonymousProductOrder,
  Batch,
  DoDetRemarks,
  ItemInfo,
} from "Types/ProductOrder";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type AnonymousOrderProp = {
  name: string;
  mobileNumber: string;
  email: string;
  addr1: string;
  addr2: string;
  addr3: string;
  addr4: string | undefined;
  state: string;
  pinCode: string;
  country: string;
};

const AnonymousPlaceOrderView = () => {
  //next step : redirect to success page after placing order
  const dispatch: AppDispatch = useDispatch();
  const { cartList } = useSelector((state: RootState) => state.cart);
  const [processOrder, { isLoading: processOrderLoading }] =
    useProcessAnonymousOrderMutation();
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      mobileNumber: "",
      email: "",
      addr1: "",
      addr2: "",
      addr3: "",
      addr4: undefined,
      state: "",
      pinCode: "",
      country: "",
    },
    validate: {
      name: (value: any) =>
        value.length >= 3 ? null : "Name should have at least 3 characters",
      mobileNumber: (value: any) =>
        /^\d{10}$/.test(value) ? null : "Invalid Mobile Number",
      email: (value: any) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? null
          : "Invalid Email",
      addr1: (value: any) =>
        value.length > 0 ? null : "This box should not be empty",
      addr2: (value: any) =>
        value.length > 0 ? null : "This box should not be empty",
      addr3: (value: any) =>
        value.length > 0 ? null : "This box should not be empty",
      state: (value: any) =>
        value.length > 0 ? null : "This box should not be empty",
      pinCode: (value: any) =>
        value.length > 0 ? null : "This box should not be empty",
      country: (value: any) =>
        value.length > 0 ? null : "This box should not be empty",
    },
  });

  // Convert plain arrays to Mantine Select format
  const stateOptions = states.map((s) => ({ value: s, label: s }));
  const countryOptions = countries.map((c) => ({ value: c, label: c }));

  const Order = (order: AnonymousOrderProp) => {
    if (order && cartList.length > 0) {
      var itemInfo: Array<ItemInfo> = [];
      var doDetRemarks: Array<DoDetRemarks> = [];
      var batch: Array<Batch> = [
        {
          doLineNo: 1,
          batch: "NOBATCH",
          location: "NONSTOCK",
        },
      ];

      cartList.map((item, i) => {
        itemInfo.push({
          item: item.productId,
          doLineNo: i + 1,
          ecomUnitPrice: item.ecomUnitPrice,
          quantityOr: item.quantity,
        });

        doDetRemarks.push({
          item: item.productId,
          doLineNo: i + 1,
          remarks: "",
        });
      });

      var anonymousOrder: AnonymousProductOrder = {
        orderId: "",
        orderDate: "",
        waybillNos: [],
        rzpOrderId: "",
        rzpStatus: "",
        customerName: order.name,
        mobileNumber: order.mobileNumber,
        addr1: order.addr1,
        addr2: order.addr2,
        addr3: order.addr3,
        addr4: order.addr4,
        state: order.state,
        pinCode: order.pinCode,
        country: order.country,
        itemList: itemInfo,
        remarks: doDetRemarks,
        email: order.email,
        batch: batch,
        paymentType: "CASH_ON_DELIVERY",
        isShippingSameAsBilling: false,
      };

      const processAnonymousOrderFunc = async (
        anonymousOrder: AnonymousProductOrder
      ) => {
        try {
          const result = await processOrder(anonymousOrder).unwrap();
          if (result) {
            dispatch(clearCart());
            // window.location.href = result.paymentUrl;
          }
        } catch (err) {
          console.error(err);
        }
      };

      processAnonymousOrderFunc(anonymousOrder);
    }
  };

  return (
    <Flex justify={"center"} pos={"relative"}>
      <Flex
        w={{ base: "100%", md: "70%" }}
        direction={{ base: "column", md: "row" }}
      >
        <Paper
          w={{ base: "100%", md: "55%" }}
          component="div"
          bg={"var(--mantine-color-white)"}
          my={20}
          px={20}
          py={30}
        >
          <Title
            ta={"center"}
            c="var(--mantine-color-dimmed)"
            order={4}
            my={20}
          >
            Anonymous Checkout
          </Title>
          <form
            onSubmit={form.onSubmit(async (order: AnonymousOrderProp) => {
              try {
                Order(order);
              } catch (err) {
                console.error(err);
              }
            })}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack w="100%">
              <Flex direction="row" gap={20}>
                <TextInput
                  size="md"
                  radius={0}
                  py={10}
                  label="Name"
                  required
                  w="50%"
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                />
                <TextInput
                  size="md"
                  radius={0}
                  py={10}
                  label="Mobile Number"
                  required
                  w="50%"
                  key={form.key("mobileNumber")}
                  {...form.getInputProps("mobileNumber")}
                />
              </Flex>
              <Flex direction="row" gap={20}>
                <TextInput
                  size="md"
                  radius={0}
                  py={10}
                  label="Email"
                  required
                  w="50%"
                  key={form.key("email")}
                  {...form.getInputProps("email")}
                />
                <TextInput
                  size="md"
                  radius={0}
                  py={10}
                  label="Address (Area and Street)"
                  required
                  w="50%"
                  key={form.key("addr1")}
                  {...form.getInputProps("addr1")}
                />
              </Flex>
              <Flex direction="row" gap={20}>
                <TextInput
                  size="md"
                  radius={0}
                  py={10}
                  label="Locality"
                  required
                  w="50%"
                  key={form.key("addr2")}
                  {...form.getInputProps("addr2")}
                />
                <TextInput
                  size="md"
                  radius={0}
                  py={10}
                  label="City/District/Town"
                  required
                  w="50%"
                  key={form.key("addr3")}
                  {...form.getInputProps("addr3")}
                />
              </Flex>
              <Flex direction="row" gap={20}>
                <Select
                  size="md"
                  radius={0}
                  py={10}
                  label="State"
                  data={stateOptions}
                  w="50%"
                  required
                  key={form.key("state")}
                  {...form.getInputProps("state")}
                />
                <TextInput
                  size="md"
                  radius={0}
                  py={10}
                  label="Pincode"
                  required
                  w="50%"
                  key={form.key("pinCode")}
                  {...form.getInputProps("pinCode")}
                />
              </Flex>
              <Flex direction="row" gap={20} align="center">
                <Select
                  size="md"
                  radius={0}
                  py={10}
                  label="Country"
                  data={countryOptions}
                  w="50%"
                  required
                  key={form.key("country")}
                  {...form.getInputProps("country")}
                />
                <TextInput
                  size="md"
                  radius={0}
                  py={10}
                  label="LandMark (Optional)"
                  w="50%"
                  key={form.key("addr4")}
                  {...form.getInputProps("addr4")}
                />
              </Flex>
              <Button radius={0} py={10} w="50%" size="md" type="submit">
                Pay
              </Button>
            </Stack>
          </form>
        </Paper>
        <Paper
          w={{ base: "100%", md: "35%" }}
          component="div"
          bg={"var(--mantine-color-white)"}
          my={20}
          px={20}
          py={30}
        >
          <OrderSummary type="anonymous" />
        </Paper>
      </Flex>
    </Flex>
  );
};

export default AnonymousPlaceOrderView;
