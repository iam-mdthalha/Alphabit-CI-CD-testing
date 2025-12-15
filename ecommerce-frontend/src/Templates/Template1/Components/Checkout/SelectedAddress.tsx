import { Divider, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { CustomerAddress } from "Types/CustomerAddress";

type Props = {
  selectedAddress: CustomerAddress;
};

const SelectedAddress = ({ selectedAddress }: Props) => {
  return (
    <Paper
      py={20}
      px={20}
      bg="white"
      maw={350}
      component="div"
      style={{
        boxShadow: "0px 1px 13px -10px rgba(0,0,0,0.75)",
        wordWrap: "break-word",
      }}
    >
      <Stack>
        <Title order={5} c="var(--mantine-color-dimmed)">
          DELIVERY ADDRESS
        </Title>
        <Divider w={"100%"} />
        <Group wrap="nowrap">
          <Text size="md" fw={500} truncate>
            {selectedAddress.customerName}
          </Text>
          <Text truncate>{selectedAddress.mobileNumber}</Text>
        </Group>
        <Text style={{ whiteSpace: "pre-line" }}>
          {`${selectedAddress.addr1}, ${selectedAddress.addr2}${
            selectedAddress.addr4 ? `, ${selectedAddress.addr4}` : ""
          }, ${selectedAddress.addr3}, ${selectedAddress.state} - ${
            selectedAddress.pinCode
          }`
            .replace(/\s+/g, " ")
            .trim()}
        </Text>
      </Stack>
    </Paper>
  );
};

export default SelectedAddress;
