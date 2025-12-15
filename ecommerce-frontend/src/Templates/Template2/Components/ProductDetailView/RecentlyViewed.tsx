import { useState, useEffect } from "react";
import CustomDarkButton from "Components/StyleComponent/CustomDarkButton";
import { useGetConfigurationByPlantQuery } from "Services/Admin/ConfigurationApiSlice";

const recentlyViewed = [
  {
    id: 1,
    name: "Owl gray corduroy premium cotton solid shirt",
    price: 2190.0,
    image: "/template2/SectionHome/best_seller_shirt1.jpg",
    image_zoom: "/template2/SectionHome/best_seller_shirt_zoom1.jpg",
    tags: ["new arrival"],
  },
];

const RecentlyViewed = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [hoveredShirt, setHoveredShirt] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setItemsPerPage(4);
      else if (width >= 1024) setItemsPerPage(3);
      else if (width >= 768) setItemsPerPage(2);
      else setItemsPerPage(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(recentlyViewed.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleItems = recentlyViewed.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const getTagBgColor = (tag: string) => {
    switch (tag) {
      case "new arrival":
        return "#00008B";
      case "selling fast":
        return "#20b2aa";
      default:
        return "#000000";
    }
  };

  const PLANT = process.env.REACT_APP_PLANT;
  const { data: ecomConfig } = useGetConfigurationByPlantQuery(PLANT || "");
  const numberOfDecimal =
    ecomConfig &&
    ecomConfig.numberOfDecimal !== undefined &&
    ecomConfig.numberOfDecimal !== null
      ? parseInt(ecomConfig.numberOfDecimal, 10)
      : 0;

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold uppercase mb-8 text-center">
        Recently Viewed
      </h2>
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out">
            {visibleItems.map((shirt) => (
              <div
                key={shirt.id}
                className={`w-full flex-shrink-0 px-4 ${
                  itemsPerPage === 1
                    ? ""
                    : itemsPerPage === 2
                    ? "sm:w-1/2"
                    : itemsPerPage === 3
                    ? "sm:w-1/2 lg:w-1/3"
                    : "sm:w-1/2 lg:w-1/3 xl:w-1/4"
                }`}
              >
                <div
                  className="relative mb-4 overflow-hidden group"
                  onMouseEnter={() => setHoveredShirt(shirt.id)}
                  onMouseLeave={() => setHoveredShirt(null)}
                >
                  <img
                    width="auto"
                    height="auto"
                    src={
                      hoveredShirt === shirt.id
                        ? shirt.image_zoom
                        : shirt.image || "/placeholder.svg"
                    }
                    alt={shirt.name}
                    className="w-full h-auto transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 right-0 flex flex-col items-end">
                    {shirt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[.6rem] text-white uppercase px-2 py-1 mb-1"
                        style={{ backgroundColor: getTagBgColor(tag) }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-sm uppercase mb-1 text-center">
                  {shirt.name}
                </h3>
                <p className="text-sm text-gray-600 uppercase font-semibold text-center">
                  ${shirt.price.toFixed(numberOfDecimal)}
                </p>
                <p className="text-sm font-semibold text-center">
                  All Sizes Available
                </p>
              </div>
            ))}
          </div>
        </div>
        <button
          className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
          onClick={handlePrevPage}
          aria-label="Previous page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-left-icon lucide-chevron-left w-6 h-6"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
          onClick={handleNextPage}
          aria-label="Next page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right-icon lucide-chevron-right w-6 h-6"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
      {/* <div className="text-center mt-20">
        <CustomDarkButton>View all Shirts</CustomDarkButton>
      </div> */}
    </div>
  );
};

export default RecentlyViewed;
