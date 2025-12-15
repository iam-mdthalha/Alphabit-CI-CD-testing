
import { Radio, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "State/store";

type Props = {
    value: (paymentType: string) => void
}



const PaymentView = ({ value } : Props) => {
    const [paymentType, setPaymentType] = useState("Cash");
    const [amount, setAmount] = useState(0);
    const { cartDiscount } = useSelector((state: RootState) => state.cart);


    useEffect(() => {
        value(paymentType);
    }, [paymentType, amount]);

  
    
    return (
        <>
            <Title c={'var(--mantine-color-dimmed)'} order={4}>Select Payment Type</Title>
            <Stack gap={10}>
                <Radio.Group
                    name="paymentType"
                    description="Choose from existing or create new"
                    value={paymentType}
                    bg='var(--mantine-color-white)'
                    w="100%"
                >
                    <Radio my={30} defaultChecked={true} onChange={(e) => {
                        setPaymentType(e.target.value)
                    }} value="cash" label="Cash On Delivery" />
                    <Radio my={30} onChange={(e) => {
                        setPaymentType(e.target.value)
                    }} value="card" label="Card" />
                    <Radio my={30} onChange={(e) => {
                        setPaymentType(e.target.value)
                    }} value="paypal" label="Paypal" />
                    <Radio my={30} onChange={(e) => {
                        setPaymentType(e.target.value)
                    }} value="amazon_pay" label="Amazon Pay" />
                </Radio.Group>
                
            </Stack>
            
        </>
    )
}

export default PaymentView;