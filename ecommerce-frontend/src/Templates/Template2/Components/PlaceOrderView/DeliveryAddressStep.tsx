import {
  Accordion,
  Divider,
  Group,
  Paper,
  Radio,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useGetAllAddressQuery } from "Services/CustomerApiSlice";
import { addSelectedAddress } from "State/CustomerSlice/CustomerSlice";
import { AppDispatch, RootState } from "State/store";
import { CustomerAddressAPI } from "Types/CustomerAddress";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListSelector from "./ListSelector";
import NewAddressSection from "./NewAddressSection";

type Props = {
  next: () => void;
  onAddressTypeSelected: (isSelected: boolean) => void;
};

const DeliveryAddressTab = ({ next, onAddressTypeSelected }: Props) => {
  const [addressType, setAddressType] = useState("");
  const { userInfo, token } = useSelector((state: RootState) => state.login);
  const { data: customerAddress, isLoading: isAddressLoading } =
    useGetAllAddressQuery(null, {
      skip: !token,
    });
  const [existingAddresses, setExistingAddresses] = useState([]);
  const dispatch: AppDispatch = useDispatch();
  const { selectedAddress } = useSelector((state: RootState) => state.customer);

  useEffect(() => {
    if (token) {
      const fetchAddress = async () => {
        try {
          let customerAddresses = await customerAddress;
          if (customerAddress) {
            setExistingAddresses(customerAddresses);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchAddress();
    }
  }, [token, customerAddress]);

  const setSelectedAddress = (value: CustomerAddressAPI | undefined) => {
    if (value) {
      dispatch(addSelectedAddress(value));
      setAddressType("existing");
      onAddressTypeSelected(true);
    }
  };

  const handleAddressTypeChange = (value: string) => {
    setAddressType(value);
    onAddressTypeSelected(!!value);
  };

  if (isAddressLoading) {
    return (
      <div className="flex justify-center items-center h-[30vh]">
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
    );
  }

  return (
    <Radio.Group
      name="deliveryAddress"
      label={
        <Title c={"var(--mantine-color-dimmed)"} order={4}>
          Choose Your Delivery Address
        </Title>
      }
      description="Choose from existing or create new"
      value={addressType}
      onChange={handleAddressTypeChange}
      bg="var(--mantine-color-white)"
      w="100%"
    >
      <Stack mt="xs">
        <Accordion
          w="100%"
          defaultValue={addressType}
          bg="var(--mantine-color-white)"
          variant="filled"
          onChange={(e) => {
            setAddressType((prev) => {
              if (e) {
                return e;
              }
              return prev;
            });
          }}
        >
          <Accordion.Item value="new">
            <Accordion.Control>
              <label className=" px-2 space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="address"
                  value="new"
                  className="form-radio text-blue focus:ring-blue"
                />
                <span className="font-medium">Add New Address</span>
              </label>
            </Accordion.Control>
            <Accordion.Panel>
              <NewAddressSection next={next} />
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="existing">
            <Accordion.Control>
              <label className="px-2 space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="address"
                  value="existing"
                  className="form-radio text-blue focus:ring-blue"
                />
                <span className="font-medium">Use Existing Address</span>
              </label>
            </Accordion.Control>
            <Accordion.Panel>
              <ListSelector
                existingAddresses={existingAddresses}
                value={setSelectedAddress}
              />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        {selectedAddress && (
          <>
            <Divider />
            <Paper component="div" bg="white" my={20} px={20} py={20}>
              <Title order={5} c="var(--mantine-color-dimmed)">
                SELECTED ADDRESS
              </Title>
              <Group>
                <Text size="md" fw={500}>
                  {selectedAddress.customerName}
                </Text>
                <Text>{selectedAddress.mobileNumber}</Text>
              </Group>
              <Text>
                {selectedAddress.addr1}, {selectedAddress.addr2},{" "}
                {selectedAddress.addr4 && `${selectedAddress.addr4}, `}{" "}
                {selectedAddress.addr3}, {selectedAddress.state} -{" "}
                {selectedAddress.pinCode}
              </Text>
            </Paper>
            <Divider />
          </>
        )}
      </Stack>
    </Radio.Group>
  );
};

export default DeliveryAddressTab;
