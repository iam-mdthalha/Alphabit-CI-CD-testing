import React, { useEffect } from "react";
import {
  BookOpen,
  Users,
  Heart,
  Award,
  Truck,
  Shield,
  Star,
  Calendar,
  Bookmark,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

const AboutUs: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  return (
    <div className="min-h-screen font-gilroyRegular bg-vintageBg">
      <div className="px-6 lg:px-16 xl:px-24 py-10 bg-vintageBg">
        <div className="flex flex-col md:flex-row gap-2 rounded-3xl bg-vintageText shadow-lg text-vintageBg p-8 md:p-12 items-center">
          <div className="flex-1 flex flex-col text-left justify-center py-4 md:py-8 px-2 md:px-8">
            <BookOpen
              className="w-16 h-20 mb-6 text-vintageBg animate-bounce"
              data-aos="zoom-in"
            />
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 text-vintageBg font-melodramaRegular"
              style={{ lineHeight: 1.2 }}
              data-aos="fade-up"
            >
              Who Are We?
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed text-vintageBg font-gilroyRegular"
              style={{ maxWidth: "800px" }}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Your trusted destination for books, knowledge, and literary
              adventures
            </p>
          </div>
          <div className="relative hidden lg:block h-full min-w-[340px]">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white opacity-10 animate-pulse"></div>
            <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-white opacity-10 animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full bg-white opacity-10 animate-pulse delay-2000"></div>
          </div>
        </div>
      </div>

      <div
        className="max-w-4xl ml-0 mr-auto lg:pl-16 xl:pl-24 px-8 py-12"
        data-aos="fade-up"
      >
        <div>
          <div className="flex items-center mb-6">
            <BookOpen className="w-8 h-8 mr-3" style={{ color: "#326638" }} />
            <h2
              className="text-2xl md:text-3xl font-bold font-melodramaRegular"
              style={{ color: "#326638" }}
            >
              Our Story
            </h2>
          </div>
          <p
            className="text-gray-800 leading-relaxed mb-4 text-base md:text-lg font-gilroyRegular"
            style={{}}
          >
            At <strong>Moore Market Private Limited</strong>, we believe that
            books are more than just pages bound together - they're gateways to
            infinite worlds, vessels of knowledge, and companions for life's
            journey. Founded with a passion for literature and learning, we've
            dedicated ourselves to bringing you the finest collection of books
            and related treasures.
          </p>
          <p
            className="text-gray-800 leading-relaxed text-base md:text-lg font-gilroyRegular"
            style={{}}
          >
            From timeless classics to contemporary bestsellers, academic texts
            to children's picture books, our carefully curated selection ensures
            there's something magical waiting for every reader. We're committed
            to fostering a love of reading and making knowledge accessible to
            all.
          </p>
          <div
            className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-green-300"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <div className="text-left">
              <div
                className="text-3xl md:text-4xl font-bold font-melodramaRegular"
                style={{ color: "#326638" }}
              >
                15K+
              </div>
              <div
                className="text-sm md:text-base text-gray-700 font-gilroyRegular"
                style={{}}
              >
                Books Available
              </div>
            </div>
            <div className="text-left">
              <div
                className="text-3xl md:text-4xl font-bold font-melodramaRegular"
                style={{ color: "#326638" }}
              >
                12+
              </div>
              <div
                className="text-sm md:text-base text-gray-700 font-gilroyRegular"
                style={{}}
              >
                Years in Business
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="max-w-4xl ml-0 mr-auto lg:pl-16 xl:pl-24 px-8 py-12"
        data-aos="fade-up"
      >
        <div>
          <div className="flex items-center mb-6">
            <Heart className="w-8 h-8 mr-3" style={{ color: "#326638" }} />
            <h2
              className="text-2xl md:text-3xl font-bold font-melodramaRegular"
              style={{ color: "#326638" }}
            >
              Our Mission
            </h2>
          </div>
          <p
            className="text-gray-800 leading-relaxed text-base md:text-lg font-gilroyRegular"
            style={{}}
          >
            Our mission is simple yet profound:{" "}
            <span className="font-semibold">
              to ignite curiosity, expand minds, and connect people
            </span>{" "}
            through the power of books. We strive to create a welcoming space
            where book lovers can discover their next great read, students can
            find the resources they need, and families can share the joy of
            reading together.
          </p>
          {/* <div className="flex items-center mt-6 pt-6 border-t border-green-300">
            <Calendar className="w-5 h-5 mr-2" style={{ color: "#326638" }} />
            <span
              className="text-sm md:text-base text-gray-700 font-gilroyRegular"
              style={{}}
            >
              Founded in 2010 by Elizabeth Moore
            </span>
          </div> */}
        </div>
      </div>
      <div
        className="max-w-5xl ml-0 mr-auto lg:pl-16 xl:pl-24 px-8 py-12"
        data-aos="fade-up"
      >
        <h3
          className="text-3xl md:text-4xl font-bold mb-8 mt-4 font-melodramaRegular"
          style={{ color: "#326638" }}
        >
          Why Choose Moore Market?
        </h3>
        <div className="space-y-6 px-6">
          {[
            {
              icon: Award,
              title: "Curated Selection",
              desc: "Hand-picked books across all genres and categories",
            },
            {
              icon: Users,
              title: "Expert Recommendations",
              desc: "Our book enthusiasts help you find your perfect read",
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              desc: "Quick and secure shipping to bring books to your doorstep",
            },
            {
              icon: Shield,
              title: "Quality Guaranteed",
              desc: "Every book is carefully inspected before shipping",
            },
            {
              icon: Star,
              title: "Reader Rewards",
              desc: "Earn points with every purchase for exclusive benefits",
            },
            {
              icon: Bookmark,
              title: "Book Clubs",
              desc: "Join our themed book clubs and reading communities",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-start space-x-4"
              data-aos="fade-right"
              data-aos-delay={i * 100}
            >
              <div
                className="flex-shrink-0 p-2 rounded-full"
                style={{ backgroundColor: "#ECE6C2" }}
              >
                <feature.icon
                  className="w-6 h-6"
                  style={{ color: "#326638" }}
                />
              </div>
              <div>
                <h4
                  className="font-semibold text-lg mb-2 font-melodramaRegular"
                  style={{ color: "#326638" }}
                >
                  {feature.title}
                </h4>
                <p
                  className="text-gray-700 text-sm md:text-base font-gilroyRegular"
                  style={{}}
                >
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="max-w-5xl ml-0 mr-auto lg:pl-16 xl:pl-24 px-8 py-16"
        data-aos="fade-up"
      >
        <h2
          className="text-3xl md:text-4xl font-bold mb-10 font-melodramaRegular"
          style={{ color: "#326638" }}
        >
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Quality",
              desc: "We meticulously select every book to ensure it meets our high standards.",
            },
            {
              title: "Community",
              desc: "We believe in building a reading community that supports authors, readers, and literacy initiatives.",
            },
            {
              title: "Accessibility",
              desc: "We strive to make reading accessible to everyone through fair pricing and diverse selections.",
            },
          ].map((value, i) => (
            <div
              key={i}
              className="text-left"
              data-aos="zoom-in"
              data-aos-delay={i * 150}
            >
              <div
                className="w-12 h-12 mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#326638", color: "#fff" }}
              >
                <span className="text-xl font-bold font-melodramaRegular">
                  {i + 1}
                </span>
              </div>
              <h3
                className="text-xl font-semibold mb-3 font-melodramaRegular"
                style={{ color: "#326638" }}
              >
                {value.title}
              </h3>
              <p
                className="text-gray-700 text-base md:text-lg font-gilroyRegular"
                style={{}}
              >
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div
        className="max-w-5xl ml-0 mr-auto lg:pl-16 xl:pl-24 px-8 py-16 text-left"
        data-aos="fade-up"
      >
        <Users className="w-12 h-12 mb-4" style={{ color: "#326638" }} />
        <h3
          className="text-2xl md:text-3xl font-bold mb-4 font-melodramaRegular"
          style={{ color: "#326638" }}
        >
          Join Our Reading Community
        </h3>
        <p
          className="text-gray-800 leading-relaxed max-w-3xl mb-6 text-base md:text-lg font-gilroyRegular"
          style={{}}
        >
          At Moore Market Private Limited you're not just a customer - you're
          part of a vibrant community of readers, learners, and dreamers.
          Whether you're searching for the latest bestseller, diving into
          academic research, or finding the perfect gift, we're here to help you
          discover the transformative power of books.
        </p>
        <Link
          to="/books-listing"
          className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-vintageBg hover:bg-opacity-90 font-gilroyRegular"
          style={{ backgroundColor: "#326638" }}
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        >
          Explore Our Collection
        </Link>
        <p className="text-sm text-gray-600 mt-8 font-gilroyRegular" style={{}}>
          Last updated on December 1st, 2025
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
