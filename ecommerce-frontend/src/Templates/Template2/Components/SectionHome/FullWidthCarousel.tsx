import { BannerDTO } from "Interface/Client/Banners/Banner.interface";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetListOfBannersQuery } from "Services/BannerApiSlice";
import { getImage } from "Utilities/ImageConverter";

const FullWidthCarousel = () => {
  const { data: apiBanners, isLoading: bannerLoading } =
    useGetListOfBannersQuery();
  const banners: BannerDTO[] = apiBanners || [];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (banners?.length) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) =>
          prevSlide === banners.length - 1 ? 0 : prevSlide + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners]);

  if (bannerLoading) {
    return (
      <div className="flex justify-center items-center w-full h-[30vh] md:h-screen">
        <svg
          className="animate-spin h-8 w-8 text-gray-300"
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
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-300">
        <div className="text-center p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>Image Not Found</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {banners.map((banner, i) => (
        <div
          key={banner.id || i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img
            width="auto"
            height="auto"
            src={getImage(banner.image) ?? undefined}
            alt={banner.title || "Banner image"}
            className="w-full h-full object-cover hidden md:block"
            loading={i === 0 ? "eager" : "lazy"}
          />

          {/* Mobile Image */}
          <img
            width="auto"
            height="auto"
            src={getImage(banner.image2) ?? getImage(banner.image) ?? undefined}
            alt={banner.title || "Banner image"}
            className="w-full h-full object-cover md:hidden"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-black bg-opacity-20" />

          <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 text-white z-10">
            <p className="text-xs uppercase mb-6">{banner.title || "Title"}</p>
            <h1 className="text-2xl font-bold uppercase mb-6">
              {banner.bannerDescription || "Category"}
            </h1>
            <Link
              to={`/shop/${banner.link}?page=1`}
              onClick={() => window.scrollTo(0, 0)}
              className="uppercase tracking-widest bg-white text-black border border-white text-xs font-semibold px-8 py-4 transition-all duration-300 ease-in-out hover:bg-transparent hover:text-white relative overflow-hidden group"
            >
              <span className="relative z-10">
                {banner.buttonText || "Shop Now"}
              </span>
              <span className="absolute inset-0 bg-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></span>
            </Link>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 right-8 md:bottom-16 md:right-16 flex space-x-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full border border-white transition-colors ${
              index === currentSlide ? "bg-white" : "bg-transparent"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FullWidthCarousel;
