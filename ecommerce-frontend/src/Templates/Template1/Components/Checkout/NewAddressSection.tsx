import { Button, Flex, Paper, Select, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { states } from "Constants/State";
import { useAddAddressMutation } from "Services/CustomerApiSlice";
import { addSelectedAddress } from "State/CustomerSlice/CustomerSlice";
import { AppDispatch, RootState } from "State/store";
import { useDispatch, useSelector } from "react-redux";

type Props = {
    next: () => void
}

const NewAddressSection = ({ next } : Props) => {
    const dispatch: AppDispatch = useDispatch();
    const { userInfo, token } = useSelector((state: RootState) => state.login);
    const [ address, { isLoading }] = useAddAddressMutation();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            id: 0,
            customerName: '',
            mobileNumber :'',
            addr1: '',
            addr2: '',
            addr3: '',
            addr4: undefined,
            state: '',
            pinCode: ''
        },
        validate: {
            customerName: (value: any) => value.length >= 3 ? null : "Name should have at least 3 characters",
            mobileNumber: (value: any) => /^\d{10}$/.test(value) ? null : "Invalid Mobile Number",
            addr1: (value: any) => value.length > 0 ? null : "This box should not be empty",
            addr2: (value: any) => value.length > 0 ? null : "This box should not be empty",
            addr3: (value: any) => value.length > 0 ? null : "This box should not be empty",
            state: (value: any) => value.length > 0 ? null : "This box should not be empty",
            pinCode: (value: any) => value.length > 0 ? null : "This box should not be empty",
        }
    })
    return (
        <Paper w="70%" bg="transparent" component="div">
            <form onSubmit={form.onSubmit(async (values) => {
                try{
                    const result = await address(values).unwrap();
                    dispatch(addSelectedAddress(result));
                    next();
                    
                } catch (err) {
                    console.error(err);
                }
            })} style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Stack w="100%">
                    <Flex direction="row" gap={20}>
                        <TextInput
                            size="md"
                            radius={0}
                            py={10}
                            placeholder='Name'
                            w="50%"
                            key={form.key('customerName')}
                            maxLength={200}
                            {...form.getInputProps('customerName')}
                        />
                        <TextInput
                            size="md"
                            radius={0}
                            py={10}
                            placeholder='Mobile Number'
                            w="50%"
                            key={form.key('mobileNumber')}
                            maxLength={20}
                            {...form.getInputProps('mobileNumber')}
                        />
                    </Flex>
                    <Flex>
                        <Textarea
                            size="md"
                            radius={0}
                            py={10}
                            placeholder='Address (Area and Street)'
                            w="100%"
                            key={form.key('addr1')}
                            maxLength={100}
                            {...form.getInputProps('addr1')}
                        />
                    </Flex>
                    <Flex direction="row" gap={20}>
                        <TextInput
                            size="md"
                            radius={0}
                            py={10}
                            placeholder='Locality'
                            w="50%"
                            key={form.key('addr2')}
                            maxLength={100}
                            {...form.getInputProps('addr2')}
                        />
                        <TextInput
                            size="md"
                            radius={0}
                            py={10}
                            placeholder='City/District/Town'
                            w="50%"
                            key={form.key('addr3')}
                            maxLength={100}
                            {...form.getInputProps('addr3')}
                        />
                    </Flex>
                    <Flex direction="row" gap={20}>
                        <Select
                            size="md"
                            radius={0}
                            py={10}
                            placeholder="State"
                            data={states}
                            w="50%"
                            key={form.key('state')}
                            // maxLength is not applicable for Select
                            {...form.getInputProps('state')}
                        >
                        </Select>
                        <TextInput
                            size="md"
                            radius={0}
                            py={10}
                            placeholder='Pincode'
                            w="50%"
                            key={form.key('pinCode')}
                            maxLength={100}
                            {...form.getInputProps('pinCode')}
                        />
                    </Flex>
                    <Flex direction="row" gap={20} align="center">
                        <TextInput
                            size="md"
                            radius={0}
                            py={10}
                            placeholder='LandMark (Optional)'
                            w="50%"
                            key={form.key('addr4')}
                            maxLength={100}
                            {...form.getInputProps('addr4')}
                        />
                        <Button radius={0} py={10} w="50%" size="md" type="submit">
                            Save and Deliver Here
                        </Button>
                    </Flex>
                </Stack>
            </form>
        </Paper>
    );
}


export default NewAddressSection;