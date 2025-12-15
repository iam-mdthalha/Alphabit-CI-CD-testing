import { useEffect, useState } from "react";
import ImageModal from "Templates/Template4/Components/ProductDetailView/ImageModal";

interface ImageGalleryProps {
  imagePaths: string[];
  imagePath: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  imagePaths,
  imagePath,
}) => {
  const allImages = [
    ...(imagePath ? [imagePath] : []),
    ...(Array.isArray(imagePaths) ? imagePaths : []),
  ];

  const normalizedImages = allImages.filter(
    (img) => typeof img === "string" && img.trim() !== ""
  );

  const [selectedImage, setSelectedImage] = useState<string>(
    normalizedImages[0] || ""
  );
  const [zoomStyle, setZoomStyle] = useState({});
  const [showZoom, setShowZoom] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModalIndex, setCurrentModalIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showZoom || isMobile) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${selectedImage})`,
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const openModal = () => {
    const index = normalizedImages.indexOf(selectedImage);
    if (index !== -1) {
      setCurrentModalIndex(index);
      setModalOpen(true);
    }
  };

  useEffect(() => {
    if (
      normalizedImages.length > 0 &&
      !normalizedImages.includes(selectedImage)
    ) {
      setSelectedImage(normalizedImages[0]);
    }
  }, [normalizedImages, selectedImage]);

  const navigateImage = (direction: "prev" | "next") => {
    const currentIndex = normalizedImages.indexOf(selectedImage);
    if (currentIndex === -1) return;

    if (direction === "prev") {
      const prevIndex =
        (currentIndex - 1 + normalizedImages.length) % normalizedImages.length;
      setSelectedImage(normalizedImages[prevIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % normalizedImages.length;
      setSelectedImage(normalizedImages[nextIndex]);
    }
  };

  if (normalizedImages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] bg-gray-50 rounded-lg">
        <div className="text-center p-8">
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No images available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            This product doesn't have any images.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 min-h-[30vh] md:min-h-[80vh]">
        <div className="hidden lg:flex flex-col gap-3 mt-4 lg:mt-0 justify-center items-center lg:items-start lg:justify-start overflow-x-auto lg:overflow-y-auto hide-scrollbar p-2">
          {normalizedImages.map((src, index) => {
            const isSelected = selectedImage === src;

            return (
              <div
                key={`${src}-${index}`}
                className={`cursor-pointer rounded-md border p-1 transition-all duration-150 ${
                  isSelected
                    ? "border-vintageText border-opacity-70 ring-2 ring-vintageText ring-opacity-50"
                    : "border-vintageText border-opacity-30 hover:border-vintageText hover:border-opacity-40"
                }`}
                onClick={() => setSelectedImage(src)}
              >
                <img
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  loading="lazy"
                  className="object-cover mx-auto"
                />
              </div>
            );
          })}
        </div>

        <div className="flex-1 relative">
          <div
            className="min-h-[30vh] md:h-[75vh] flex items-center justify-center relative cursor-zoom-in"
            onMouseEnter={() => !isMobile && setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
            onClick={openModal}
          >
            {selectedImage && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("prev");
                  }}
                  className="absolute left-4 z-10 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-md md:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <img
                  src={selectedImage}
                  alt="Selected"
                  loading="lazy"
                  className="object-contain h-full max-w-full"
                />

                {showZoom && !isMobile && (
                  <div
                    className="hidden md:block absolute left-full top-0 ml-4 w-2/3 lg:w-1/2 h-1/2 border border-gray-200 bg-white z-20 pointer-events-none overflow-hidden"
                    style={{
                      ...zoomStyle,
                      backgroundSize: "250%",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("next");
                  }}
                  className="absolute right-4 z-10 bg-white/80 hover:bg-white/90 rounded-full p-2 shadow-md md:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-800"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        {modalOpen && (
          <ImageModal
            images={normalizedImages}
            currentIndex={currentModalIndex}
            onClose={() => setModalOpen(false)}
            onChangeImage={(index) => setCurrentModalIndex(index)}
          />
        )}
      </div>
      {/* <div className="mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 rounded-md divide-y sm:divide-y-0 sm:divide-x">
          <div className="flex flex-col items-center p-4 text-center">
            <div className="h-8 w-8 text-yellow-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">
              7 Million + Happy Customers
            </p>
          </div>

          <div className="flex flex-col items-center p-4 text-center">
            <div className="h-8 w-8 text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 1l3 5.9 6.5.9-4.7 4.6 1.1 6.5L12 15.9 6.1 19l1.1-6.5-4.7-4.6 6.5-.9L12 1z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">
              100% Original Products
            </p>
          </div>

          <div className="flex flex-col items-center p-4 text-center">
            <div className="h-8 w-8 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.285 6.709l-11.025 11.025-5.545-5.545 1.414-1.414 4.131 4.131 9.611-9.611z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">
              32 Points Quality Check
            </p>
          </div>
        </div>

        <div className=" text-sm px-4 py-2 mt-3 rounded-md text-[#326638]  text-center">
          Book Covers May Vary, Request Actual Images For Used Books After
          Ordering.
        </div>
      </div> */}
    </div>
  );
};

export default ImageGallery;
