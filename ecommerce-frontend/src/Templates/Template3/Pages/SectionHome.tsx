import { Suspense } from "react";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import BenefitBar from "../Components/SectionHome/BenefitBar";
import HeroBanner from "../Components/SectionHome/HeroBanner";
import LearnMoreGrid from "../Components/SectionHome/LearnMoreGrid";
import NewsLetter from "../Components/SectionHome/NewsLetter";
import PromotionalBanner from "../Components/SectionHome/PromotionalBanner";
import SectionsGrid from "../Components/SectionHome/SectionsGrid";

const SectionHome = () => {
  return (
    <div className="font-montserrat tracking-widest">
      <Suspense fallback={<div className="w-full h-screen justify-center items-center"><CircleLoader /></div>}>
        <HeroBanner />
        <BenefitBar />
        <SectionsGrid />
        <PromotionalBanner />
        <LearnMoreGrid />
        <NewsLetter />
      </Suspense>
    </div>
  );
};

export default SectionHome;