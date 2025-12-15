import {
    Button,
    Card,
    Flex,
    Group,
    Notification,
    NumberFormatter,
    Stack,
    Text,
    Title,
    em
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconShoppingBag } from "@tabler/icons-react";
import { useUpdateCustomerCartMutation } from "Services/CartApiSlice";
import { addToCart } from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import { CartSave } from "Types/CartSave";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { getBaseCurrency } from "Utilities/CurrencyHandler";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdditionalProduct from "../AdditionalProduct/AdditionalProduct";

type Props = {
    mainProduct: ProductMetaDTO | undefined;
    additionalProducts: Array<ProductMetaDTO> | undefined;
}

const AdditionalProductWrapper = ({ mainProduct, additionalProducts }: Props) => {

    // const mainProduct: Product | undefined = useSelector((state: RootState) => state.productdetail.data?.productWrapper);
    // const additionalProducts: Array<Product> | undefined = useSelector((state: RootState) => state.productdetail.data?.additionalProducts);
    const [allProducts, setAllProducts] = useState( additionalProducts ? [mainProduct, ...additionalProducts] : []);
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const [inclAdditionalProdList, setInclAdditionalProdList] = useState(additionalProducts ? [mainProduct, ...additionalProducts] : []);
    const dispatch: AppDispatch = useDispatch();
    const { userInfo, token } = useSelector((state: RootState) => state.login);
    const [updateCustomerCart, { isLoading: cartUpdateLoading }] = useUpdateCustomerCartMutation();
    const [totalCost, setTotalCost] = useState(() => {
        let sum = Number(mainProduct?.product.ecomUnitPrice);

        additionalProducts && additionalProducts.forEach((product) => {
            sum += product.product.ecomUnitPrice;
        });
        return sum;
    });

    const [additionalProductState, setAdditionalProductState] = useState<{ id: number, checked: boolean }>({id: 0, checked: false});

    useEffect(() => {
        if (!additionalProductState.checked) {
            setInclAdditionalProdList(() => {
                let list = inclAdditionalProdList.filter(product => {
                    return product?.product.id != additionalProductState.id
                });

                setTotalCost(() => {
                    let sum = 0;
                    list && list.forEach((product, i) => {
                        if(product) {
                            sum += product.product.ecomUnitPrice;
                        }
                        
                    });

                    return sum;
                })
                return list;
            })
        }
        else {
            setInclAdditionalProdList((prevList) => {
                let newProduct = allProducts.find(product => product?.product.id === additionalProductState.id);
                prevList = prevList.filter((product) => product?.product.id !== newProduct?.product.id);
                let list = [...prevList, newProduct]
                setTotalCost(() => {
                    let sum = 0;
                    list.forEach((product, i) => {
                        if(product) {
                             sum += product.product.ecomUnitPrice;
                        }
                       
                    });

                    return sum;
                })
                return list;
            });
        }
    }, [additionalProductState, totalCost])

    const valueData = (value: { id: number, checked: boolean }) => {
        setAdditionalProductState(value);
    }

    return (
        <Card my={100}>
            <Title order={2} style={{ textAlign: isMobile ? 'center' : 'start' }}>Additional Products</Title>
            <Flex my={20} gap={20} align={'center'} direction={isMobile ? 'column' : 'row'}>
                {
                    allProducts && allProducts.map((item, i) => {
                       
                        return ( item  &&
                        <Flex key={i} gap={20} direction={isMobile ? 'column' : 'row'} align={'center'}>
                            <AdditionalProduct
                                key={i}
                                product={item}
                                valueCbFn={valueData}
                            />
                            {
                                allProducts.length - 1 !== i &&
                                <IconPlus />
                            }
                        </Flex>);
                    })
                }
                {
                    inclAdditionalProdList.length > 0 ?
                        <Stack mx={50} gap={10} align="center">
                            <Group gap={7} justify="center">
                                <Text size="lg" fw={500}>Total Price : </Text>
                                <Text size="xxl" fw={500}>
                                    <NumberFormatter prefix={getBaseCurrency(mainProduct?.product.baseCurrency || '') || undefined} 
                                    value={totalCost} thousandSeparator />
                                </Text>
                            </Group>

                            <Button w={190} my={10} bg={'var(--mantine-color-secondary-filled)'} radius={'xl'}
                                onClick={() => {
                                    // addToCart(...inclAdditionalProdList);
                                    inclAdditionalProdList.map(async (includedProduct, i) => {
                                        let product = allProducts.find((product) => product?.product.id === includedProduct?.product.id);
                                        // if(product) {
                                        //     let availableQuantity = await getAvailableQuantity(product.product.item).then((data: any) => data.data as number);
                                        //     dispatch(addToCart({
                                        //         productId: product?.product.item, quantity: 1, availableQuantity: availableQuantity,
                                        //         price: Number(product.product.ecomUnitPrice),
                                        //         discount: Number(product.product.ecomUnitPrice)
                                        //     }));
                                        //     return notifications.show({
                                        //         message: `${product?.product.itemDesc} is added to bag successfully`
                                        //     })
                                        // }
                                        if (product) {
                                            // let availableQuantity = await getAvailableQuantity(product.product.item).then((data: any) => data.data as number);
                                            let availableQuantity = product.product.availqty || 0;
                                            dispatch(addToCart({
                                                productId: product.product.item,
                                                quantity: 1,
                                                availableQuantity: availableQuantity,
                                                ecomUnitPrice: Number(product.product.ecomUnitPrice),
                                                discount: Number(product.product.ecomUnitPrice),
                                                size: ""
                                            }));
                                            if (token) {
                                                //make add to cart db usage
                                                var cartDbData: CartSave[] = [];
                                                cartDbData.push({
                                                    item: product.product.item,
                                                    quantity: 1,
                                                    size: ""
                                                });
                                                const updateCart = async (cartData: Array<CartSave>) => {
                                                    try {
                                                        let result = await updateCustomerCart(cartData).unwrap();
                                                    } catch (err) {
                                                        console.error(err);
                                                    }

                                                }
                                                updateCart(cartDbData);
                                            }
                                            notifications.show({
                                                message: `${product.product.itemDesc} is added to bag successfully`
                                            });
                                        }
                                    })
                                }}
                                leftSection={<IconShoppingBag size={20} />}>
                                {inclAdditionalProdList.length > 1 ? `Add all ${inclAdditionalProdList.length} to Bag` : 'Add to Bag'}</Button>
                        </Stack>
                        :
                        <Notification mx={50} color="var(--mantine-color-secondary-filled)" withCloseButton={false} withBorder>
                            <Text>Please select at least one product</Text>
                        </Notification>
                }
            </Flex>
        </Card>
    )
}

export default AdditionalProductWrapper;