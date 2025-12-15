import { Carousel } from '@mantine/carousel'
import { Card, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { ResponsiveSize } from 'Constants/ResponsiveSize'
import { useGetRelatedProductsQuery } from 'Services/ProductApiSlice'
import { AppDispatch } from 'State/store'
import CircleLoader from 'Templates/Template1/Components/CircleLoader/CircleLoader'
import Item from 'Templates/Template1/Components/Item/Item'
import { ProductMetaDTO } from 'Types/ProductMetaDTO'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

type Props = {
    productRef: ProductMetaDTO
}

const RelatedProducts = ({ productRef }: Props) => {
    const dispatch: AppDispatch = useDispatch();
    const isMobile = useMediaQuery(`(max-width: ${ResponsiveSize.mobile})`);
    // const {data: relatedProducts, loading: relatedProductsLoading, error: relatedProductsError} = useSelector((state: RootState) => state.relatedproduct);
    const { data: relatedProducts, isLoading: relatedProductsLoading } = useGetRelatedProductsQuery({
        productId: productRef.product.item,
        category: productRef.product.category,
        subCategory: productRef.product.subCategory,
        brand: productRef.product.brand,
        dept: ''
    });

    useEffect(() => {
        // dispatch(fetchRelatedProducts({
        //     productId: productRef.product.item,
        //     category: productRef.product.category,
        //     subCategory: productRef.product.subcategory,
        //     brand: productRef.product.brand,
        //     dept: null}));
    }, []);


    return (
        <Card>
            <Title style={{ textAlign: isMobile ? 'center' : 'start' }} order={2}>Related Products</Title>
            {
                relatedProductsLoading ? <CircleLoader /> :
                <Carousel my={20} slideSize='max-content' slideGap={20} align='start' slidesToScroll={3} height='max-content'>
                {
                    relatedProducts && relatedProducts.products.map((item, i) => {
                        return <Carousel.Slide key={i}>
                            <Item
                                item={item}
                                withBorder={false}

                            />
                        </Carousel.Slide>
                    })
                }
                </Carousel>
            }
            
        </Card>
    )
}
export default RelatedProducts;