import { Flex, Image, Text, Title } from "@mantine/core";
import circleCheck from "Assets/circle-check.png";
import { RootState } from "State/store";
import { useSelector } from "react-redux";

const OrderPlaced = () => {
  const { userInfo, token } = useSelector((state: RootState) => state.login);
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center">
      <Flex direction={"column"} align={"center"} px={20} my={30}>
        <Image my={10} src={circleCheck} w={75} h={75} />
        <Title
          ta={"center"}
          my={10}
          order={4}
          c="var(--mantine-color-green-filled)"
        >
          Order Placed Successfully
        </Title>

        <Text c="var(--mantine-color-dimmed)" mt={20}>
          Hi {userInfo?.fullName}, <br />
          Thanks for placing your order with us. Below are the details of your
          order. If you have any queries, feel free to get in touch with us at
          demo@example.com
        </Text>
        {/* <Group justify="space-between" w={'100%'} mt={20}>
                <Stack>
                    <Text c="var(--mantine-color-dimmed)">Order ID: <br/>{order?.orderId}</Text>
                    <Text c="var(--mantine-color-dimmed)">Order Date: <br />{order?.orderDate}</Text>
                </Stack>
                <Stack>
                    <Text c="var(--mantine-color-dimmed)">Delivery Address</Text>
                    <Text c="var(--mantine-color-dimmed)">{order?.deliveryAddress}</Text>
                </Stack>
            </Group> */}
      </Flex>
    </div>
  );
};

export default OrderPlaced;
