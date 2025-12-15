import { Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import emitter from "Events/eventEmitter";
import { useLoginWithPasswordMutation } from "Services/Auth/AuthApiSlice";
import { useUpdateCustomerCartMutation } from "Services/CartApiSlice";
import { setCredentials } from "State/AuthSlice/LoginSlice";
import { setLoggedIn } from "State/StateEvents";
import { AppDispatch, RootState } from "State/store";
import { useDispatch, useSelector } from "react-redux";

type Props = {
    next: () => void
}

const MiniLoginTab = ({next}: Props) => {
    const [login, { isLoading }] = useLoginWithPasswordMutation();
    const { cartList } = useSelector((state: RootState) => state.cart);
    const dispatch: AppDispatch = useDispatch();
    const [updateCustomerCart, { isLoading: cartUpdateLoading }] = useUpdateCustomerCartMutation();
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            authenticationId: '',
            password: ''
        },
        validate: {
            authenticationId: (value: any) => /^\S+@\S+$/.test(value) || /^\d{10}$/.test(value) ? null : "Invalid Credentials",
            password: (value: any) => value.length < 6 ? "Password must have at least 6 characters" : null,
        }
    })

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={form.onSubmit(async (values) => {
                try {
                    const userData = await login(values).unwrap();
                    
                    dispatch(setCredentials({ userToken: userData.results.token }));
                    if(userData.results.token) {
                        dispatch(setLoggedIn(true));
                        notifications.show({
                            id: 'login-success',
                            withCloseButton: true,
                            autoClose: 5000,
                            title: "Login Successful",
                            message: 'Browse Products',
                            loading: false,
                        });
                    }
                    
                    // if (cartList && cartList.length > 0) {
                    //     var cartDbData: CartSave[] = [];
                    //     cartList.map((item, i) => {
                    //         return cartDbData.push({
                    //             email: userInfo.email,
                    //             mobileNumber: userInfo.mobileNumber,
                    //             item: item.productId,
                    //             quantity: item.quantity
                    //         })
                    //     })
                    //     // dispatch(updateCartDb(cartDbData));
                    //     const updateCart = async (cartData: Array<CartSave>) => {
                    //         try {
                    //             let result = await updateCustomerCart(cartData).unwrap();
                    //         } catch(err) {
                    //             console.error(err);
                    //         }
                            
                    //     }
                    //     updateCart(cartDbData);
                        // dispatch(clearCart());
                        emitter.emit('loggedIn', { cartList: cartList, updateCustomerCart: updateCustomerCart });
                        next();
                    //     window.location.reload();
                    // }
                } catch (err: any) {
                    if (!err.response) {
                        notifications.show({
                            id: 'login-error',
                            withCloseButton: true,
                            autoClose: 5000,
                            title: "Login Failed",
                            message: "No Server Response",
                            loading: false,
                        });
                    } else if (err.response.status === 400) {
                        notifications.show({
                            id: 'login-error',
                            withCloseButton: true,
                            autoClose: 5000,
                            title: "Login Failed",
                            message: "Missing Username or Password",
                            loading: false,
                        });
                    } else if (err.response.status === 401) {
                        notifications.show({
                            id: 'login-error',
                            withCloseButton: true,
                            autoClose: 5000,
                            title: "Login Failed",
                            message: "Unauthorized",
                            loading: false,
                        });
                    } else {
                        notifications.show({
                            id: 'login-error',
                            withCloseButton: true,
                            autoClose: 5000,
                            title: "Login Failed",
                            message: "Login Failed",
                            loading: false,
                        });
                    }
                }

            })} style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Title ta={'center'} c="var(--mantine-color-dimmed)" order={4}>Login</Title>
                <Stack gap={10}>
                    <TextInput
                        size="md"
                        radius={0}
                        py={10}
                        placeholder='Email Address or Mobile Number'
                        key={form.key('authenticationId')}
                        {...form.getInputProps('authenticationId')}
                    />
                    <PasswordInput
                        size="md"
                        radius={0}
                        py={10}
                        placeholder='Password'
                        key={form.key('password')}
                        {...form.getInputProps('password')}
                    />
                    {/* Forgot Password link */}
                    <div style={{ textAlign: 'right', marginTop: 4 }}>
                      <span
                        style={{ color: '#2563eb', cursor: 'pointer', fontSize: 12 }}
                        onClick={() => window.location.href = '/reset-password'}
                      >
                        Forgot Password?
                      </span>
                    </div>
                    <Text ta={'center'}>By continuing, I agree to the terms of use & privacy policy.</Text>

                    <Button w='100%'
                        size='md' radius='xs'
                        bg='var(--mantine-color-secondary-filled)'
                        type="submit"
                        mt={30}>Continue</Button>
                    
                </Stack>
            </form>
            
        </div>
    );
}

export default MiniLoginTab;