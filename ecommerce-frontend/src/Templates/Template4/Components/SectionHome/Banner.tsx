import React, { useEffect, useState } from "react";
import { useGetAllBannersWithoutBytesQuery } from "Services/Admin/BannerApiSlice";
import { Link } from "react-router-dom";

interface BannerProps {
  autoPlay?: boolean;
  interval?: number;
}

const Banner: React.FC<BannerProps> = ({
  autoPlay = true,
  interval = 5000,
}) => {
  const { data: apiBanners, isLoading: bannerLoading } =
    useGetAllBannersWithoutBytesQuery();
  const banners: any[] = apiBanners?.results || [];
  const [current, setCurrent] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!autoPlay || !banners.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, banners.length]);

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  if (bannerLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-[40vh] bg-vintageBg">
        <svg
          className="animate-spin h-8 w-8 text-vintageText"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M12 2a10 10 0 00-10 10h4a6 6 0 0112 0h4a10 10 0 00-10-10z"
          />
        </svg>
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div className="w-full mx-auto bg-vintageBg py-3 md:py-8 px-6 lg:px-16 xl:px-24">
        <div className="w-full min-h-[50vh] text-center bg-vintageText bg-opacity-50 text-light text-opacity-50 capitalize rounded-3xl flex justify-center items-center">
          No banners available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-vintageBg ">
      <div className="mx-auto relative">
        {banners.map((banner, index) => (
          <div
            key={`banner-${index}`}
            className={`flex flex-col md:flex-row items-center bg-vintageText text-vintageBg border border-amber-300 rounded-3xl shadow-lg overflow-hidden transition-opacity duration-500 ${
              index === current
                ? "opacity-100 relative pointer-events-auto"
                : "hidden opacity-0 absolute inset-0 pointer-events-none"
            }`}
          >
            <div
              className="order-2 md:order-1 w-full md:w-3/5 px-6 md:px-16 py-4 flex flex-col justify-center items-center md:items-start gap-2"
              data-aos="fade-right"
            >
              <h2 className="text-2xl md:text-4xl font-melodramaRegular font-semibold tracking-wider text-center md:text-start">
                {banner.title && banner.title.length > 35
                  ? `${banner.title.slice(0, 35)}...`
                  : banner.title}
              </h2>

              <p className="text-base md:text-xl font-light text-center md:text-start mb-2">
                {banner.bannerDescription &&
                banner.bannerDescription.length > 150
                  ? `${banner.bannerDescription.slice(0, 150)}...`
                  : banner.bannerDescription}
              </p>

              {banner.buttonText && (
                <Link
                  to={banner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 md:px-6 py-2 md:py-3 bg-vintageBg text-sm md:text-base font-semibold text-vintageText rounded-md font-medium hover:bg-opacity-50 transition-bg duration-200 w-fit"
                >
                  {banner.buttonText}
                </Link>
              )}
            </div>

            <div
              className="order-1 md:order-2 w-full md:w-2/5 flex justify-center p-3"
              data-aos="fade-left"
            >
              {imageErrors[index] || !banner.bannerPath ? (
                <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-2xl">
                  <span className="text-sm text-gray-500">No Image</span>
                </div>
              ) : (
                <img
                  src={banner.bannerPath}
                  alt={banner.title || "Banner image"}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={() => handleImageError(index)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
