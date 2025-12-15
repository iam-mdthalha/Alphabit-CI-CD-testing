import { Button, Divider, Paper, Stack, Text } from "@mantine/core";
import CartItem from "Templates/Template1/Components/CartItem/CartItem";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { useNavigate } from "react-router-dom";

type Props = {
    cartItems: ProductMetaDTO[],
    type: string
}

const CartItems = ({cartItems, type}: Props) => {
    const navigate = useNavigate();
    
    return (
        <div style={{width: '100%', boxShadow: '0px 1px 13px -10px rgba(0,0,0,0.75)', backgroundColor: 'white'}}>
            <Stack bg="var(--mantine-color-white)" py={10} px={10}>
                { cartItems.length > 0 ?
                    <>
                        {
                            cartItems.map((item, i) => {
                                return (
                                    <Paper component="div" key={i}>
                                        <CartItem cartProduct={item}/>
                                        { 
                                            cartItems.length - 1 !== i &&
                                            <Divider w={'100%'} size={'xs'} />
                                        }
                                    </Paper>
                                );
                            })
                        }
                        {
                            type === 'cart' &&
                            <div style={{display: 'flex', justifyContent: 'right', paddingBottom: '10px', paddingRight: '10px'}}>
                                <Button radius={0} w={'40%'} size="lg" onClick={() => {
                                    navigate('/checkout');
                                }}>Place Order</Button>
                            </div>
                        }
                        
                        
                    </>
                     :
                        <>
                            <Text ta={'center'} fw={500} c="var(--mantine-color-dimmed)" my={10}>{type === 'cart' ? "CURRENTLY NO ITEMS IN THE CART" : type === 'checkout' ? "YOUR CHECKOUT IS EMPTY" : ""}</Text>
                        </>
                }
                
            </Stack>
            
        </div>
    );
}


export default CartItems;