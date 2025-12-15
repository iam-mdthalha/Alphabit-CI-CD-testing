import { lazy, Suspense } from "react";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";

const FullWidthCarousel = lazy(
  () => import("Templates/Template2/Components/SectionHome/FullWidthCarousel")
);
const VideoSection = lazy(
  () => import("Templates/Template2/Components/SectionHome/VideoSection")
);
const CollectionList = lazy(
  () => import("Templates/Template2/Components/SectionHome/CollectionList")
);
const TopSellers = lazy(
  () => import("Templates/Template2/Components/SectionHome/TopSellers")
);
const SectionList = lazy(
  () => import("Templates/Template2/Components/SectionHome/SectionList")
);
const NewCollection = lazy(
  () => import("Templates/Template2/Components/SectionHome/NewCollection")
);
const ContactSection = lazy(
  () => import("Templates/Template2/Components/SectionHome/ContactSection")
);
const WhyChooseUs = lazy(
  () => import("Templates/Template2/Components/SectionHome/WhyChooseUs")
);

const SectionHome = () => {
  return (
    <div className="font-montserrat tracking-widest">
      <Suspense fallback={<div className="w-full h-screen justify-center items-center"><CircleLoader /></div>}>
        <FullWidthCarousel />
        {/* <VideoSection /> */}
        <CollectionList />
        <TopSellers />
        {/* <SectionList /> */}
        <NewCollection />
        <ContactSection />
        <WhyChooseUs />
      </Suspense>
    </div>
  );
};

export default SectionHome;
