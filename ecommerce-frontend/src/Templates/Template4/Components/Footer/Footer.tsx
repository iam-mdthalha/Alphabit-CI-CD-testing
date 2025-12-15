import React from "react";
import { Link } from "react-router-dom";
import ChatWidget from "Templates/Template4/Components/ChatBot/ChatWidget";

interface Props {
  brandName: string;
}

const Footer: React.FC<Props> = ({ brandName }: Props) => {
  return (
    <>
      <ChatWidget />

      <footer className="bg-vintageText font-gilroyRegular relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjYiPgo8cmVjdCB3aWR0aD0iNiIgaGVpZ2h0PSI2IiBmaWxsPSIjRkZGIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCA2TDYgME0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMjY2MzgiIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20 pointer-events-none"></div>
        <div className="px-6 lg:px-16 xl:px-24 py-12">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-2/6 md:pr-12" data-aos="flip-up">
              <Link to="/">
                <h1 className="text-3xl xl:text-4xl text-center md:text-start text-vintageBg font-melodramaRegular tracking-wider font-bold">
                  {brandName}
                </h1>
              </Link>
              <p className="mt-4 text-base text-center md:text-start leading-relaxed text-vintageBg text-opacity-70 text-justify">
                Ever wanted to buy a book but could not because it was too
                expensive? Worry not! Moore Market is here. These days, it's
                being called the Robinhood of the world of books.
              </p>
            </div>
            <div className="w-full lg:w-4/6 flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 py-6 lg:my-0">
              <div data-aos="flip-up">
                <h3 className="font-bold text-sm md:text-base text-vintageBg mb-4">
                  Shop
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/collections"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Collections
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/authors"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Authors
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/language"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Language
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/academic"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Academic
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/merchandise"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Merchandise
                    </Link>
                  </li>
                </ul>
              </div>

              <div data-aos="flip-up">
                <h3 className="font-bold text-sm md:text-base text-vintageBg mb-4">
                  Sell & Explore
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/sell-with-us"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Sell with Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wholesale"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Wholesale
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/track-order"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Track Order
                    </Link>
                  </li>
                </ul>
              </div>

              <div data-aos="flip-up">
                <h3 className="font-bold text-sm md:text-base text-vintageBg mb-4">
                  Company
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/about-us"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact-us"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blogs"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Blogs
                    </Link>
                  </li>
                </ul>
              </div>

              <div data-aos="flip-up">
                <h3 className="font-bold text-sm md:text-base text-vintageBg mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/terms-and-conditions"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy-policy"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cancellation-and-refund-policy"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Cancellation & Refund policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/return-policy"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Return Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shipping-policy"
                      className="text-base lg:text-lg text-vintageBg text-opacity-70 font-semibold hover:text-gray-400 transform-150 transform transition-transform duration-300"
                    >
                      Shipping Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-vintageBg border-opacity-20 flex flex-col md:flex-row justify-between items-center gap-2 pt-6 text-sm">
            <p
              className="order-2 md:order-1 text-vintageBg text-sm md:text-xs text-center md:text-start"
              // data-aos="flip-up"
            >
              © 2025 <span className="font-semibold">Moore Market Private Limited</span>
              . All rights reserved. Powered by Alphabit Technologies IND.
            </p>
            <div
              className="order-1 md:order-3 flex space-x-4"
              // data-aos="flip-up"
            >
              <Link
                to=""
                className="text-vintageBg hover:text-gray-400 transform-150 transform transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram-icon lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link
                to=""
                className="text-vintageBg hover:text-gray-400 transform-150 transform transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-facebook-icon lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link
                to=""
                className="text-vintageBg hover:text-gray-400 transform-150 transform transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-twitter-icon lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
