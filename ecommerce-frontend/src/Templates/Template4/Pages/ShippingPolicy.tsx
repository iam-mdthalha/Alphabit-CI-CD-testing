import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ShippingPolicy: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen font-gilroyRegular tracking-wider bg-vintageBg px-10 md:px-20 lg:px-32 py-12 text-gray-800" data-aos="fade-up">
      <h1
        className="text-2xl md:text-4xl font-bold mb-2 text-center text-vintageText font-melodramaRegular tracking-wider"
        style={{ color: "#326638" }}
        data-aos="zoom-in"
      >
        Shipping Policy
      </h1>
      <p className="text-sm md:text-lg text-center text-gray-600 mb-10" data-aos="fade">
        Last updated on December 1st 2025
      </p>

       <div className="max-w-7xl ml-0 mr-auto lg:pl-16 xl:pl-24 px-4 py-10" data-aos="fade-up"></div>
      <div className="space-y-10 text-gray-800 text-justify leading-relaxed text-sm md:text-lg">
        <p data-aos="fade-right">
          At <span className="font-semibold text-[#326638]">Moore Market Private Limited</span>,
          we ensure a smooth and reliable shipping process for all books bought
          or sold through our platform. Whether you're purchasing a rare
          collectible or reselling a pre-loved book, our logistics network is
          designed to keep your books safe and delivered on time.
        </p>
    

        <section data-aos="fade-up">
          <h2 className="text-2xl md:text-2xl font-bold text-vintageText mb-3 font-melodramaRegular tracking-wider" style={{ color: "#326638" }}>
            Logistic Partners & Delivery
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Once your order is confirmed, details of the{" "}
              <span className="font-semibold">logistic partner</span> handling
              your delivery will be shared.
            </li>
            <li>
              Estimated delivery timelines are shown at checkout and may vary
              depending on the book's seller location.
            </li>
            <li>
              In some cases, <span className="font-semibold">Moore Market Private Limited</span>{" "}
              may directly handle deliveries to speed up the process.
            </li>
          </ul>
        </section>

        <section data-aos="fade-up">
          <h2 className="text-2xl md:text-2xl font-bold text-vintageText mb-3 font-melodramaRegular tracking-wider" style={{ color: "#326638" }}>
            Delivery Areas
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              We currently deliver across most major cities in India. Rural or
              remote areas may have limited service.
            </li>
            <li>
              During checkout, please enter your{" "}
              <span className="font-semibold">PIN code</span> to check service
              availability. Orders cannot be processed for non-serviceable
              areas.
            </li>
          </ul>
        </section>

        <section data-aos="fade-up">
          <h2 className="text-2xl md:text-2xl font-bold text-vintageText mb-3 font-melodramaRegular tracking-wider" style={{ color: "#326638" }}>
            Shipping Address Accuracy
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Ensure your shipping address is entered correctly, with clear
              landmarks where possible.
            </li>
            <li>
              <span className="font-semibold">Moore Market Private Limited is not responsible</span>{" "}
              for failed deliveries due to incorrect or incomplete addresses.
            </li>
            <li>
              Orders are usually{" "}
              <span className="font-semibold">
                dispatched within 2-3 working days
              </span>{" "}
              after confirmation.
            </li>
          </ul>
        </section>

        <section data-aos="fade-up">
          <h2 className="text-2xl md:text-2xl font-bold text-vintageText mb-3 font-melodramaRegular tracking-wider" style={{ color: "#326638" }}>
            Delivery Attempts & Cancellations
          </h2>
          <p>
            Our logistic partners will attempt delivery up to{" "}
            <span className="font-semibold">3 times</span>. If the buyer is
            unavailable, the order may be canceled and returned to the seller.
          </p>
        </section>

        <section data-aos="fade-up">
          <h2 className="text-2xl md:text-2xl font-bold text-vintageText mb-3 font-melodramaRegular tracking-wider" style={{ color: "#326638" }}>
            Possible Delays
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Delays may occur due to weather conditions, logistics strikes,
              natural events, or other unforeseen circumstances.
            </li>
            <li>
              In such cases, we will notify you via{" "}
              <span className="font-semibold">email or SMS</span>.
            </li>
          </ul>
        </section>

        <section data-aos="fade-up">
          <h2 className="text-2xl md:text-2xl font-bold text-vintageText mb-3 font-melodramaRegular tracking-wider" style={{ color: "#326638" }}>
            Tracking Your Order
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Every confirmed order comes with a{" "}
              <span className="font-semibold">tracking ID</span>.
            </li>
            <li>
              Use this ID on Moore Market Private Limited or the logistic partner's portal to
              track your shipment in real-time.
            </li>
          </ul>
        </section>

        <section data-aos="fade-up">
          <h2 className="text-2xl md:text-2xl font-bold text-vintageText mb-3 font-melodramaRegular tracking-wider" style={{ color: "#326638" }}>
            Shipping Fees & Risk of Loss
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Shipping fees are displayed at checkout and are{" "}
              <span className="font-semibold">non-refundable</span> once shipped,
              except for cases of defective or wrong items.
            </li>
            <li>
              The <span className="font-semibold">title and risk of loss</span>{" "}
              pass to the buyer once the book is delivered.
            </li>
          </ul>
        </section>

        <section data-aos="fade-up">
          <p>
            For any queries regarding shipping, reach us at{" "}
            <a
              href="mailto:support@mooremarket.in"
              className="text-vintageText underline font-medium font-gilroyRegular"
            >
              support@mooremarket.in
            </a>
            . We're here to help ensure your books reach you safely!
          </p>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
