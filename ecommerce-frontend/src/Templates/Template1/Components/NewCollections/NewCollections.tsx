import { Carousel } from "@mantine/carousel";
import { Flex, Text, Title } from "@mantine/core";
import Item from "Templates/Template1/Components/Item/Item";
import classes from "Templates/Template1/Components/NewCollections/NewCollections.module.css";
import { ProductPackerDTO } from "Types/ProductPackerDTO";
import { Link } from "react-router-dom";

type Props = {
  newCollections: ProductPackerDTO;
};

const NewCollections = ({ newCollections }: Props) => {
  return (
    <div
      style={{
        backgroundColor: "var(--mantine-color-white)",
        padding: "10px 30px",
      }}
    >
      <Flex align="center" py={20} columnGap={20}>
        <Title order={2}>New Collections</Title>
        <Link to={`/new-collections?page=1`} style={{ textDecoration: "none" }}>
          <Text size="sm" c="blue" className={classes.ctaText}>
            See More
          </Text>
        </Link>
      </Flex>

      <Carousel
        bg="var(--mantine-carousel-arrow-color)"
        classNames={classes}
        slideSize="max-content"
        slideGap={20}
        align="start"
        slidesToScroll={1}
        height="max-content"
      >
        {/* {newCollections.products.slice(0, 2).map((item, i) => (
          <Carousel.Slide key={i}>
            <Item item={item} withBorder={false} />
          </Carousel.Slide>
        ))} */}
        {newCollections.products.slice(0, 2).map((item, i) => (
          <Carousel.Slide key={i}>
            <Item item={item} withBorder={false} />
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
};
export default NewCollections;
