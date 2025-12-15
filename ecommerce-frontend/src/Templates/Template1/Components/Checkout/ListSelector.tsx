import { Group, Paper, Text } from "@mantine/core";
import { CustomerAddressAPI } from "Types/CustomerAddress";
import { useEffect, useState } from "react";

type Props = {
    existingAddresses: Array<CustomerAddressAPI>;
    value: (customerAddress: CustomerAddressAPI | undefined) => void;
}

const ListSelector = ({existingAddresses, value}: Props) => {
    const [selectedValue, setSelectedValue] = useState<CustomerAddressAPI>();

    useEffect(() => {
        value(selectedValue);
    }, [selectedValue]);

    return (
    <>
        {
            existingAddresses.map((item, i) => {
                return (
                    <Paper key={i}
                        onClick={() => {
                            setSelectedValue(item);
                        }}
                        component="div" style={selectedValue?.id === item.id ? { border: '1px solid var(--mantine-color-secondary-filled)', backgroundColor: 'ButtonHighlight', cursor: 'pointer' } : { border: 'none', cursor: 'pointer' }} my={20} px={20} py={20}>
                        <Group>
                            <Text size="md" fw={500}>{item.customerName}</Text>
                            <Text>{item.mobileNumber}</Text>
                        </Group>
                        <Text>{item.addr1}, {item.addr2}, { item.addr4 && `${item.addr4}, `} {item.addr3}, {item.state} - {item.pinCode}</Text>
                    </Paper>
                );
            })
        }
    </>    
    );
    
}

export default ListSelector;