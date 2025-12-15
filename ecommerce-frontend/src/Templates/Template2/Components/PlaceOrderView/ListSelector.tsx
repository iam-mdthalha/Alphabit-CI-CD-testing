import React from "react";
import { Stack, Paper, Group, Text } from "@mantine/core";
import { useGetAllAddressQuery } from "Services/CustomerApiSlice";
import { CustomerAddressAPI } from "Types/CustomerAddress";

interface ListSelectorProps {
  existingAddresses: CustomerAddressAPI[];
  value: (address: CustomerAddressAPI | undefined) => void;
}

const ListSelector: React.FC<ListSelectorProps> = ({
  existingAddresses,
  value,
}) => {
  const { isLoading: isAddressLoading } = useGetAllAddressQuery(null, {
    skip: existingAddresses.length > 0,
  });

  if (isAddressLoading && existingAddresses.length === 0) {
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
    <Stack>
      {existingAddresses.map((address) => (
        <Paper
          key={address.id}
          p="md"
          withBorder
          radius="md"
          style={{ cursor: "pointer" }}
          onClick={() => value(address)}
        >
          <Group align="start">
            <input
              type="radio"
              name="deliveryAddress"
              value={address.id}
              onChange={() => value(address)}
              className="form-radio text-blue-500 focus:ring-blue-500 mt-1"
            />
            <div>
              <Group>
                <Text size="md" fw={500}>
                  {address.customerName}
                </Text>
                <Text>{address.mobileNumber}</Text>
              </Group>
              <Text size="sm">
                {address.addr1}, {address.addr2},{" "}
                {address.addr4 && `${address.addr4}, `}
                {address.addr3}, {address.state} - {address.pinCode}
              </Text>
            </div>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
};

export default ListSelector;
