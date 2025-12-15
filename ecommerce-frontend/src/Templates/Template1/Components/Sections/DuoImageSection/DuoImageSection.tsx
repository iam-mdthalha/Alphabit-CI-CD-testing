import { Flex, Image, SimpleGrid, Text, Title } from "@mantine/core";
import classes from "Templates/Template1/Components/Sections/DuoImageSection/DuoImageSection.module.css";
import { Section } from "Types/Section";
import { getImage } from "Utilities/ImageConverter";
import { Link } from "react-router-dom";

type Props = {
  section: Section;
};

const DuoImageSection = ({ section }: Props) => {
  return (
    <div className={classes.container}>
      <Title order={4} bg="white" py="10px" className="text-sm md:text-lg">
        {section.sectionName}
      </Title>
      <Flex justify="center" align="center">
        <SimpleGrid cols={1} style={{ width: "100%" }}>
          <Image
            style={{ objectFit: "cover" }}
            src={getImage(section.image1) || undefined}
            alt="Image 1"
          />
          <Image
            style={{ objectFit: "cover" }}
            src={getImage(section.image2) || undefined}
            alt="Image 2"
          />
        </SimpleGrid>
      </Flex>

      <Link
        to={`/sec/${encodeURIComponent(
          `${section.ctaText.toLowerCase().replaceAll(" ", "-")}:${section.id}`
        )}`}
        style={{ textDecoration: "none" }}
      >
        <Text className={classes.ctaText} size="sm" py="10px" c="blue">
          {section.ctaText}
        </Text>
      </Link>
    </div>
  );
};

export default DuoImageSection;
