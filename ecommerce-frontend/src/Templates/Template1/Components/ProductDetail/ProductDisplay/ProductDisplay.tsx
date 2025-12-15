import { Button, Divider, Group, NumberFormatter, Stack, Text, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconShoppingCart } from "@tabler/icons-react";
import { useUpdateCustomerCartMutation } from "Services/CartApiSlice";
import { addToCart } from "State/CartSlice/CartSlice";
import { AppDispatch, RootState } from "State/store";
import classes from "Templates/Template1/Components/ProductDetail/ProductDisplay/ProductDisplay.module.css";
import { CartSave } from "Types/CartSave";
import { ProductDetailDTO } from "Types/ProductDetailDTO";
import { getBaseCurrency } from "Utilities/CurrencyHandler";
import { calculatePromotions } from "Utilities/PromotionCalculator";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductGallery from "../ProductGallery/ProductGallery";

type Props = {
    productDetail: ProductDetailDTO;
}

const ProductDisplay = ({ productDetail }: Props) => {
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const dispatch: AppDispatch = useDispatch();
    const { userInfo, token } = useSelector((state: RootState) => state.login);
    // const  product: Product | undefined  = useSelector((state: RootState) => state.productdetail.data?.productWrapper);
    const category: {id: string, category: string} | undefined = useSelector((state: RootState) => state.productdetail.data?.categoryWrapper);
    const [availableQuantity, setAvailableQuantity] = useState(1);
    const [updateCustomerCart, { isLoading: cartUpdateLoading }] = useUpdateCustomerCartMutation();
    const [buttonLoading, setButtonLoading] = useState(false);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [discountPer, setDiscountPer] = useState(0);
    const [isByValue, setIsByValue] = useState(false);

    useEffect(() => {
        let { discountPrice_, discountPer_, isByValue_ } = calculatePromotions(productDetail.productWrapper.promotions, productDetail.productWrapper.product.ecomUnitPrice);
            setDiscountPrice(discountPrice_);
            setDiscountPer(discountPer_);
            setIsByValue(isByValue_);
            
            // getAvailableQuantity(product.product.item).then((data: any) => setAvailableQuantity(data.data))
            setAvailableQuantity(productDetail.productWrapper.product.availqty || 0);
        
        
    }, []);


    return (
        <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-6 lg:gap-20">
            <ProductGallery productDetail={productDetail} />

            <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2 flex flex-col gap-3">
                <h1 className="sm: text-2xl font-bold text-gray-900 sm:text-3xl">{productDetail.productWrapper.product.itemDesc}</h1>
                <p className="ml-2 text-sm font-medium text-gray-500">{productDetail.productWrapper.product.remark1}</p>
                <div className="flex gap-x-5">
                    {   productDetail && (
                        isByValue ?
                            <>
                                <NumberFormatter decimalScale={2} fixedDecimalScale={true} prefix={getBaseCurrency(productDetail.productWrapper.product.baseCurrency) || undefined} className={classes.ecomUnitPrice} value={discountPrice} thousandSeparator />

                                <Group gap={5} >
                                    <Text size='lg' c="dimmed" td={'line-through'} fw={400} >Price <NumberFormatter decimalScale={2} fixedDecimalScale={true} color='dimmed' prefix={getBaseCurrency(productDetail.productWrapper.product.baseCurrency) || undefined} value={productDetail.productWrapper.product.ecomUnitPrice} thousandSeparator /></Text>
                                    <Text size='lg' c="var(--mantine-color-secondary-filled)" fw={400}>({discountPer}% off)</Text>
                                </Group>
                            </> :
                            <>
                                <NumberFormatter decimalScale={2} fixedDecimalScale={true} prefix={getBaseCurrency(productDetail.productWrapper.product.baseCurrency) || undefined} className={classes.ecomUnitPrice} value={productDetail.productWrapper.product.ecomUnitPrice} thousandSeparator />

                            </>
                    )
                    }
                    
                </div>
                {
                    availableQuantity > 0 ?
                        <Button w={150} my={10} bg={'var(--mantine-color-secondary-filled)'} radius={'xl'}
                            disabled={buttonLoading}
                            onClick={async () => {
                                setButtonLoading(true);
                                if (productDetail) {
                                    
                                    dispatch(addToCart({
                                        productId: productDetail.productWrapper.product.item, 
                                        quantity: 1, 
                                        availableQuantity: availableQuantity,
                                        ecomUnitPrice: Number(productDetail.productWrapper.product.ecomUnitPrice),
                                        discount: discountPrice,
                                        size: ""
                                    }));
                                    if(token) {
                                        //make add to cart db usage
                                        var cartDbData: CartSave[] = [];
                                        cartDbData.push({
                                            item: productDetail.productWrapper.product.item,
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
                                        message: `${productDetail.productWrapper.product.itemDesc} is added to cart successfully`
                                    });
                                }
                                setButtonLoading(false);
                            }}
                            leftSection={<IconShoppingCart size={20} />}>Add To Cart</Button>
                            :
                            <Text c='red'> No more stocks left!</Text>
                }

                <Divider
                    label={
                        <Text size='xs' fw={500}>PRODUCT DETAILS</Text>
                    }
                    my="md" size={'sm'} />
                <Stack>

                </Stack>
                <Divider
                    label={
                        <Text size='xs' fw={500}>ADDITIONAL INFORMATION</Text>
                    }
                    my="md" size={'sm'} />
                <Stack>

                </Stack>
                <Divider my="md" size={'sm'} />
                <Group>
                    <Text>Category: {category?.category}</Text>
                    <Text>Tags: </Text>
                </Group>
            </div>
        </div>
    )
}
export default ProductDisplay