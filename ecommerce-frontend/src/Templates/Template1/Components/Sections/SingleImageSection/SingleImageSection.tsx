import { Flex, Image, Text, Title, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import classes from "Templates/Template1/Components/Sections/SingleImageSection/SingleImageSection.module.css";
import { Section } from "Types/Section";
import { getImage } from "Utilities/ImageConverter";
import { Link } from "react-router-dom";
 
type Props = {
  section: Section;
};

const SingleImageSection = ({ section }: Props) => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <div className={classes.container}>
      <Title
        order={4}
        bg="white"
        py="10px"
        id="title"
        className="text-sm md:text-lg"
      >
        {section.sectionName}
      </Title>
      <Flex direction="column" gap="md" justify="center" align="center">
        <Image src={getImage(section.image1) || undefined} alt="Image 1" />
      </Flex>
      <Link
        style={{ textDecoration: "none" }}
        to={`/sec/${encodeURIComponent(
          `${section.ctaText.toLowerCase().replaceAll(" ", "-")}:${section.id}`
        )}?page=1`}
      >
        <Text className={classes.ctaText} size="sm" py="10px" c="blue">
          {section.ctaText}
        </Text>
      </Link>
    </div>
  );
};

export default SingleImageSection;
