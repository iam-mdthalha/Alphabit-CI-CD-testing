import { useNavigate } from "react-router-dom";
import { useGetListOfSectionsQuery } from "Services/SectionApiSlice";
import { Section } from "Types/Section";
import { getImage } from "Utilities/ImageConverter";
import Button from "../Common/Button";

const SectionsGrid = () => {

    const { data: sections = [], isLoading } = useGetListOfSectionsQuery();
    

    const SectionCard = ({ section }: { section: Section }) => {
        
        const navigate = useNavigate();

        return (
        <div
            className="relative h-96 bg-cover bg-center w-full group"
            style={{ backgroundImage: `url(${getImage(section.image1)})` }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-3xl font-cardoRegular tracking-wide uppercase">{section.sectionName}</h3>
                <Button label={section.ctaText} onClick={() => {
                        navigate(`/sec/${encodeURIComponent(
                            `${section.ctaText.toLowerCase().replaceAll(" ", "-")}:${section.id}`
                        )}?page=1`);
                }} />
            </div>
        </div>
    )};

    const layoutPattern = [2, 3];
    const renderRows = () => {
    const rows = [];
    let index = 0;

    while(index < sections.length) {
            for (let colCount of layoutPattern) {
                if (index >= sections.length) break;

                const currentRow = sections.slice(index, index + colCount);
                const gridCols = colCount === 3 ? "md:grid-cols-3" : "md:grid-cols-2";

                rows.push(
                    <div key={index} className={`grid grid-cols-1 ${gridCols} gap-4`}>
                        {currentRow.map((section, idx) => (
                            <SectionCard key={`${index}-${idx}`} section={section} />
                        ))}
                    </div>
                );

                index += colCount;
            }
        }

        return rows;
    }


    return (
        <div className="mx-auto px-4 py-10 space-y-4">
           {renderRows()}
        </div>
    );
}

export default SectionsGrid;