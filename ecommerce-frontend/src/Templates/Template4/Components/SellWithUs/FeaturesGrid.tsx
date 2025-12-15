import React from "react";
import FeatureCard from "./FeatureCard";
import {
  FaBook,
  FaBox,
  FaPercentage,
  FaHeadset,
  FaRupeeSign,
  FaMobileAlt,
  FaTruck,
  FaUser,
} from "react-icons/fa";

const features = [
  {
    icon: <FaTruck className="text-3xl text-vintageBg" />,
    title: "Sell Across India",
    desc: "Reach over 50 crore+ customers across 27,000+ pincodes",
  },
  {
    icon: <FaPercentage className="text-3xl text-vintageBg" />,
    title: "Higher Profits",
    desc: "With 0% commission*, you take 100% profits with you",
  },
  {
    icon: <FaUser className="text-3xl text-vintageBg" />,
    title: "Account Management",
    desc: "Our Dedicated managers will help your business",
  },
  {
    icon: <FaRupeeSign className="text-3xl text-vintageBg" />,
    title: "Lower Return Charges",
    desc: "With our flat and low return charges, ship stress-free",
  },
  {
    icon: <FaBook className="text-3xl text-vintageBg" />,
    title: "Simple Pricing Calculator",
    desc: "Use our simple pricing calculator to decide the best price",
  },
  {
    icon: <FaHeadset className="text-3xl text-vintageBg" />,
    title: "24x7 Seller Support",
    desc: "All your queries are answered by our dedicated support team",
  },
  {
    icon: <FaRupeeSign className="text-3xl text-vintageBg" />,
    title: "Fast & Regular Payments",
    desc: "Get payments as fast as 7-10 days from dispatch",
  },
  {
    icon: <FaMobileAlt className="text-3xl text-vintageBg" />,
    title: "Business on the go",
    desc: "Manage your business anywhere with our app",
  },
];

const FeaturesGrid: React.FC = () => {
  return (
    <div
      className="max-w-8xl mx-auto px-6 md:px-6 lg:px-16 py-16"
      data-aos="fade-up"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-2 text-center">
        Why sell with us?
      </h2>
      <p className="text-center text-gray-700 mb-10">
        A platform that helps you grow fast with tools, insights and support.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <FeatureCard
            key={idx}
            icon={feature.icon}
            title={feature.title}
            desc={feature.desc}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesGrid;
