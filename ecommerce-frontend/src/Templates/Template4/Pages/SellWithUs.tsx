import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import RegisterForm from "Templates/Template4/Components/SellWithUs/RegisterForm";
import ImageShowcase from "Templates/Template4/Components/SellWithUs/ImageShowcase";
import FeaturesGrid from "Templates/Template4/Components/SellWithUs/FeaturesGrid";

const SellWithUs: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
  }, []);

  return (
    <div className="min-h-screen bg-vintageBg text-vintageText font-gilroyRegular tracking-wider">
      <div className="px-7 lg:px-16 xl:px-24 py-10 bg-vintageBg">
        <div
          className="flex flex-col lg:flex-row gap-2 rounded-3xl bg-vintageText shadow-lg text-vintageBg p-8 md:p-12 items-center"
          data-aos="fade-up"
        >
          <RegisterForm />
          <ImageShowcase />
        </div>
      </div>

      <FeaturesGrid />
    </div>
  );
};

export default SellWithUs;
