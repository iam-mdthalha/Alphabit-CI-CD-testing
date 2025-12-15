import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Banner from "Templates/Template4/Components/SectionHome/Banner";
import BestSellers from "Templates/Template4/Components/SectionHome/BestSellers";
import NewArrivals from "Templates/Template4/Components/SectionHome/NewArrivals";
import BooksListing from "Templates/Template4/Pages/BooksListing";
import SignupPromoPopup from "Templates/Template4/Components/Common/SignupPromoPopup";
import ProfileCard from "Components/reactbits/ProfileCard/ProfileCard";

const SectionHome = () => {
  const [isBooksRendered, setIsBooksRendered] = useState(false);
  const booksRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search") || null;

  useEffect(() => {
    if (!booksRef.current || !searchTerm) return;

    const minLength = 3;
    if (searchTerm.length < minLength) return;

    const timer = setTimeout(() => {
      const firstProductEl =
        booksRef.current?.querySelector(`[id^="product-"]`);
      if (firstProductEl) {
        firstProductEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isBooksRendered, searchTerm]);

  useEffect(() => {
    const targetNode = booksRef.current;

    if (!targetNode) return;

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "childList" &&
          targetNode.innerHTML.trim() !== ""
        ) {
          setIsBooksRendered(true);
          observer.disconnect();
          break;
        }
      }
    });

    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="bg-vintageBg w-full font-gilroyRegular overflow-x-hidden">
        <div className="w-full bg-vintageBg pt-3 md:pt-8 px-6 lg:px-16 xl:px-24">
          <Banner />
        </div>
        <BooksListing showHeader={false} />

        <div
          className="px-6 lg:px-16 xl:px-24 py-3 bg-vintageBg"
          ref={booksRef}
        >
          <div className="flex flex-col md:flex-row gap-2 rounded-xl md:rounded-2xl bg-vintageText text-vintageBg p-2 md:p-4">
            <div className="flex-1" data-aos="fade-right">
              <h2 className="text-center md:text-start font-yellowBg tracking-widest font-melodramaRegular text-lg md:text-2xl font-semibold capitalize mb-2">
                Moore Market sellers having sales!
              </h2>
              <p className="text-center md:text-start text-sm md:text-lg text-justify">
                Save big on your next book haul. Explore Moore Market bookshops
                with free shipping and special discount offers here!
              </p>
            </div>
            <div
              className="flex justify-center items-center"
              data-aos="fade-left"
            >
              <Link
                to="/Sell-with-us"
                className="bg-vintageBg text-xs lg:text-base px-4 py-2 rounded-xl text-vintageText hover:bg-opacity-90 font-semibold tracking-wider capitalize"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>

        <BestSellers />

        <div className="px-6 lg:px-16 xl:px-24 py-3 bg-vintageBg">
          <div className="flex flex-col md:flex-row gap-2 rounded-xl md:rounded-2xl bg-vintageText text-vintageBg p-2 md:p-4">
            <div className="flex-1" data-aos="fade-right">
              <h2 className="text-center md:text-start font-yellowBg tracking-widest font-melodramaRegular text-lg md:text-2xl font-semibold capitalize mb-2">
                Shop with confidence!
              </h2>
              <p className="text-center md:text-start text-sm md:text-lg text-justify">
                All books on Moore Market are 100% guaranteed. Contact our
                customer support team for help at any step!
              </p>
            </div>
            <div
              className="flex justify-center items-center"
              data-aos="fade-left"
            >
              <Link
                to="/shipping-policy"
                className="bg-vintageBg text-xs lg:text-base px-4 py-2 rounded-xl text-vintageText hover:bg-opacity-90 font-semibold tracking-wider capitalize"
              >
                See More
              </Link>
            </div>
          </div>
        </div>

        <NewArrivals />

        <div className="px-6 lg:px-16 xl:px-24 py-3 bg-vintageBg">
          <div className="flex flex-col md:flex-row gap-2 rounded-xl md:rounded-2xl bg-vintageText text-vintageBg p-2 md:p-4">
            <div className="flex-1" data-aos="fade-right">
              <h2 className="text-center md:text-start font-yellowBg tracking-widest font-melodramaRegular text-lg md:text-2xl font-semibold capitalize mb-2">
                Save more with these bookstores!
              </h2>
              <p className="text-center md:text-start text-sm md:text-lg text-justify">
                Many of our sellers offer additional discounts & free shipping!
              </p>
            </div>
            <div
              className="flex justify-center items-center"
              data-aos="fade-left"
            >
              <Link
                to="/collections"
                className="bg-vintageBg text-xs lg:text-base px-4 py-2 rounded-xl text-vintageText hover:bg-opacity-90 font-semibold tracking-wider capitalize"
              >
                Browse Sellers
              </Link>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-16 xl:px-24 py-12 bg-vintageBg">
          <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
            <img
              src="/template4/History/history-landing.png"
              alt="History Section"
              className="w-full h-[70vh] object-cover group-hover:scale-105 transition duration-700"
            />

            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition"></div>

            <div className="absolute inset-0 flex flex-col items-start justify-center px-6 lg:px-12">
              <h2 className="text-vintageBg text-3xl md:text-5xl font-melodramaRegular drop-shadow-xl">
                Explore Our History
              </h2>

              <p className="text-vintageBg text-opacity-80 mt-3 max-w-lg leading-relaxed">
                Travel through time with the stories that shaped the Moore
                Market and the world around it.
              </p>

              <Link
                to="/history"
                className="mt-6 bg-vintageBg text-vintageText px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition"
              >
                Visit History
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SignupPromoPopup />
    </>
  );
};

export default SectionHome;
