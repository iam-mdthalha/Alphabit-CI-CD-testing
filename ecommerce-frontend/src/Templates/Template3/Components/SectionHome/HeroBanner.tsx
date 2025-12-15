import { useEffect, useState } from "react";
import { useGetListOfBannersQuery } from "Services/BannerApiSlice";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import { getImage } from "Utilities/ImageConverter";

const HeroBanner = () => {

    const {data: banners = [], isLoading } = useGetListOfBannersQuery();

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [banners.length]);

    if (isLoading || banners.length === 0) {
        return <div className="w-full h-screen justify-center items-center"><CircleLoader /></div>;
    }

    return (
        <div className="relative w-full bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: "url('/template3/SectionHome/herobanner.jpg')" }}>
            
            <div className="pt-[40%] sm:pt-[30%] md:pt-[25%] lg:pt-[20%] xl:pt-[35%]" />
            {banners.map((banner, index) => (
                <div
                    key={banner.id || index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    style={{ backgroundImage: `url(${getImage(banner.image)})` }}
                >
                    
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${index === current ? "bg-white" : "bg-gray-400"} transition`}
                        onClick={() => setCurrent(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default HeroBanner;