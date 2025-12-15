import { Card, Checkbox, Group, Image, NumberFormatter, Text, em } from "@mantine/core";
import classes from 'Templates/Template1/Components/ProductDetail/AdditionalProduct/AdditionalProduct.module.css';

import { useMediaQuery } from "@mantine/hooks";
import { AppDispatch } from "State/store";
import { ProductMetaDTO } from "Types/ProductMetaDTO";
import { getBaseCurrency } from "Utilities/CurrencyHandler";
import { getImage } from "Utilities/ImageConverter";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

type Props = {
    product: ProductMetaDTO;
    valueCbFn: ({id, checked}: {id: number, checked: boolean}) => void;
}

const AdditionalProduct = ({ product, valueCbFn }: Props) => {
    
    const dispatch: AppDispatch = useDispatch();
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const [value, setValue] = useState({ id: product.product.id, checked: true });
    

    useEffect(() => {
        valueCbFn(value);
    }, [value]);

    return (
        <>
            <Card w={isMobile ? "200px" : "260px"} className={classes.item} withBorder={true}>
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <Checkbox value={product.product.id} defaultChecked
                        onChange={(e) => {
                            setValue({ id: product.product.id, checked: e.target.checked });
                        }} />
                </div>

                <Link to={`/${product.product.item}`} onClick={() => window.scrollTo(0, 0)}>
                    <Card.Section>
                        <Image w={260} h={290} src={getImage(product.imagePath)} alt="" />
                    </Card.Section>
                </Link>

                <Card.Section px={15} mt={20} mb={5}>
                    <Link to={`/${product.product.item}`} style={{ textDecoration: 'none', color: 'black' }} onClick={() => window.scrollTo(0, 0)}>
                        <Text lineClamp={2} className={classes.title} size="md" fw={500}>{product.product.itemDesc}</Text>
                    </Link>
                    {/* <Text size='sm' fw={300}>{product.productDao.productDesc}</Text> */}
                    <Group align='center' justify="start" gap={10}>
                        {/* <Text size='xl' fw={700}>{props.baseCurrency}{props.new_price}</Text> */}
                        <NumberFormatter prefix={getBaseCurrency(product.product.baseCurrency) || undefined} className={classes.price} value={product.product.ecomUnitPrice} thousandSeparator />

                    </Group>

                </Card.Section>
            </Card>
        </>
    );
}

export default AdditionalProduct;