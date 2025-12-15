import { Accordion, Divider, Group, Paper, Radio, Stack, Text, Title } from "@mantine/core";
import { useGetAllAddressQuery } from "Services/CustomerApiSlice";
import { addSelectedAddress } from "State/CustomerSlice/CustomerSlice";
import { AppDispatch, RootState } from "State/store";
import { CustomerAddressAPI } from "Types/CustomerAddress";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListSelector from "./ListSelector";
import NewAddressSection from "./NewAddressSection";

type Props = {
    next: () => void
}

const DeliveryAddressTab = ({ next } :Props) => {
    const [addressType, setAddressType] = useState('new');
    // const [selectedAddress, setSelectedAddress] = useState<CustomerAddress>();
    const { userInfo, token } = useSelector((state: RootState) => state.login);
    const { data: customerAddress, isLoading } = useGetAllAddressQuery(null, {
        skip: !token
    }); 
    const [existingAddresses, setExistingAddresses] = useState([]);
    const dispatch: AppDispatch = useDispatch();
    const { selectedAddress } = useSelector((state: RootState) => state.customer);

    useEffect(() => {
        if(token) {
            const fetchAddress = async () => {
                try {
                    let customerAddresses = await customerAddress;
                    if(customerAddress) {
                        setExistingAddresses(customerAddresses);
                    }
                     
                } catch (err) {
                    console.error(err);
                }
               
            }

            fetchAddress();
        }
    }, [token, customerAddress]);

    const setSelectedAddress = (value: CustomerAddressAPI | undefined) => {
        if(value) {
            dispatch(addSelectedAddress(value));
        }
    }

    return (
        <Radio.Group
            name="deliveryAddress"
            label={<Title c={'var(--mantine-color-dimmed)'} order={4}>Choose Your Delivery Address</Title>}
            description="Choose from existing or create new"
            value={addressType}
            bg='var(--mantine-color-white)'
            w="100%"
        >
            <Stack mt="xs">

                <Accordion w="100%" defaultValue={addressType} bg='var(--mantine-color-white)' variant="filled" onChange={(e) => {
                    setAddressType((prev) => {
                        if (e) {
                            return e;
                        }
                        return prev;
                    })
                }}>
                    <Accordion.Item value="new">
                        <Accordion.Control>
                            <Radio
                                color="var(--mantine-color-secondary-filled)"
                                value='new'
                                label={<Text fw={500}>Add New Address</Text>} />
                        </Accordion.Control>
                        <Accordion.Panel>
                            <NewAddressSection next={next}/>
                        </Accordion.Panel>
                    </Accordion.Item>
                    <Accordion.Item value="existing">
                        <Accordion.Control>
                            <Radio
                                color="var(--mantine-color-secondary-filled)"
                                value='existing'
                                label={<Text fw={500}>Use Existing Address</Text>} />
                        </Accordion.Control>
                        <Accordion.Panel>
                           <ListSelector existingAddresses={existingAddresses} value={setSelectedAddress}/>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
                {
                    selectedAddress &&
                    (
                        <>
                        <Divider />
                        <Paper component="div" bg="white" my={20} px={20} py={20}>
                            <Title order={5} c="var(--mantine-color-dimmed)">SELECTED ADDRESS</Title>
                            <Group>
                                <Text size="md" fw={500}>{selectedAddress.customerName}</Text>
                                <Text>{selectedAddress.mobileNumber}</Text>
                            </Group>
                                <Text>{selectedAddress.addr1}, {selectedAddress.addr2}, {selectedAddress.addr4 && `${selectedAddress.addr4}, `} {selectedAddress.addr3}, {selectedAddress.state} - {selectedAddress.pinCode}</Text>
                        </Paper>
                        <Divider />
                        </>
                    )
                    
                }
            </Stack>

        </Radio.Group>
    );
}


export default DeliveryAddressTab;