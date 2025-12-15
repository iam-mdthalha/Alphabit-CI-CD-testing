import { Link } from "react-router-dom";
import { useGetListOfSectionsQuery } from "Services/SectionApiSlice";
import { getImage } from "Utilities/ImageConverter";
import CustomButton from "../../../../Components/StyleComponent/CustomButton";

interface Section {
  catalogCount: string;
  sectionName: string;
  id: number;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  ctaText: string;
}

const SectionList = () => {
  const {
    data: sections,
    isLoading: sectionLoading,
    error,
  } = useGetListOfSectionsQuery();

  if (sectionLoading)
    return <div className="w-full text-center">Loading sections...</div>;
  if (error)
    return <div className="w-full text-center">Failed to load sections</div>;

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold uppercase tracking-widest mb-8 text-center">
        Sections
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* {sections?.map((section: Section, i: number) => {
          if (Number(section.catalogCount) === 1) {
            return <div key={i}>{section.sectionName}</div>;
          }
          return null;
        })} */}
        {sections &&
          sections.map((section, i) => {
            if (Number(section.catalogCount) === 1) {
              return (
                <div
                  key={i}
                  className="relative overflow-hidden group max-h-[90vh]"
                >
                  <img
                    width="auto"
                    height="auto"
                    src={getImage(section.image1) || undefined}
                    alt="Section 1 Img"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end items-start p-6">
                    <h3 className="text-2xl font-bold uppercase tracking-widest text-white mb-4">
                      {section.sectionName}
                    </h3>
                    <Link
                      onClick={() => window.scrollTo(0, 0)}
                      style={{ textDecoration: "none" }}
                      to={`/sec/${encodeURIComponent(
                        `${section.ctaText
                          .toLowerCase()
                          .replaceAll(" ", "-")}:${section.id}`
                      )}?page=1`}
                    >
                      <CustomButton>{section.ctaText}</CustomButton>
                    </Link>
                  </div>
                </div>
              );
            } else if (Number(section.catalogCount) === 2) {
              return (
                <div
                  key={i}
                  className="relative overflow-hidden group max-h-[90vh]"
                >
                  <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
                    <div className="flex justify-center items-center w-full max-h-[43.5vh]">
                      <img
                        width="auto"
                        height="auto"
                        src={getImage(section.image1) || undefined}
                        alt="Section 1 Img"
                        className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex justify-center items-center w-full max-h-[43.5vh]">
                      <img
                        width="auto"
                        height="auto"
                        src={getImage(section.image2) || undefined}
                        alt="Section 2 Img"
                        className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end items-start p-6">
                    <h3 className="text-2xl font-bold uppercase tracking-widest text-white mb-4">
                      {section.sectionName}
                    </h3>
                    <Link
                      onClick={() => window.scrollTo(0, 0)}
                      style={{ textDecoration: "none" }}
                      to={`/sec/${encodeURIComponent(
                        `${section.ctaText
                          .toLowerCase()
                          .replaceAll(" ", "-")}:${section.id}`
                      )}`}
                    >
                      <CustomButton>{section.ctaText}</CustomButton>
                    </Link>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={i}
                  className="relative overflow-hidden group max-h-[90vh]"
                >
                  <div className="grid grid-cols-2 gap-4 w-full h-full justify-center items-center">
                    <div className="flex justify-center items-center w-full max-h-[43.5vh]">
                      <img
                        width="auto"
                        height="auto"
                        src={getImage(section.image1) || undefined}
                        alt="Section 1 Img"
                        className="w-full max-h-[43.5vh] justify-center items-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex justify-center items-center w-full max-h-[43.5vh]">
                      <img
                        width="auto"
                        height="auto"
                        src={getImage(section.image2) || undefined}
                        alt="Section 2 Img"
                        className="w-full max-h-[43.5vh] justify-center items-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex justify-center items-center w-full max-h-[43.5vh]">
                      <img
                        width="auto"
                        height="auto"
                        src={getImage(section.image3) || undefined}
                        alt="Section 3 Img"
                        className="w-full max-h-[43.5vh] justify-center items-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex justify-center items-center w-full max-h-[43.5vh]">
                      <img
                        width="auto"
                        height="auto"
                        src={getImage(section.image4) || undefined}
                        alt="Section 4 Img"
                        className="w-full max-h-[43.5vh] justify-center items-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end items-start p-6">
                    <h3 className="text-2xl font-bold uppercase tracking-widest text-white mb-4">
                      {section.sectionName}
                    </h3>
                    <Link
                      onClick={() => window.scrollTo(0, 0)}
                      style={{ textDecoration: "none" }}
                      to={`/sec/${encodeURIComponent(
                        `${section.ctaText
                          .toLowerCase()
                          .replaceAll(" ", "-")}:${section.id}`
                      )}`}
                    >
                      <CustomButton>{section.ctaText}</CustomButton>
                    </Link>
                  </div>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};

export default SectionList;
