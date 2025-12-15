import { SimpleGrid, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Section } from "Types/Section";
import DuoImageSection from "./DuoImageSection/DuoImageSection";
import QuadImageSection from "./QuadImageSection/QuadImageSection";
import SingleImageSection from "./SingleImageSection/SingleImageSection";
 
type Props = {
    sections: Array<Section>
} 

const SectionGrid = ({sections}: Props) => {
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

    return (
        <div>
            <SimpleGrid
                cols={isMobile ? 2 : 4}
                spacing={isMobile ? 0 : 'sm'}
                verticalSpacing={isMobile ? 'md' : 'xl'}
            >
                {
                    sections.map((section, i) => {
                        if(Number(section.catalogCount) === 1) {
                            return <SingleImageSection
                                key={i}
                                section={section} />
                        }
                        else if(Number(section.catalogCount) === 2) {
                            return <DuoImageSection
                                key={i}
                                section={section}
                            />
                        }
                        else {
                            return <QuadImageSection
                                        key={i}
                                        section={section}
                                    />
                        }
                    })
                }
            </SimpleGrid>
        </div>
    );
}

export default SectionGrid;