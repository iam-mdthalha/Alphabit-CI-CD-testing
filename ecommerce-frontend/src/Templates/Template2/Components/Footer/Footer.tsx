import CustomDarkButtonFull from "Components/StyleComponent/CustomDarkButtonFull";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="">
      <div className="container mx-auto px-12 py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">
              About the shop
            </h4>
            <p className="text-xs tracking-widest text-gray-500 mb-4">
              Our products are inspired by the people and world around us.
              Beautiful, high quality Shirts that are designed especially for
              you. Discover our story and meet the people that make our brand
              what it is.
            </p>
            <div className="flex space-x-4">
              {/* <a
                href="/"
                className="hover:text-gray-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
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
                  className="lucide lucide-facebook-icon lucide-facebook hover:text-gray-500 transition-colors"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a> */}
              {/* <a
                href="/"
                className="hover:text-gray-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
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
                  className="lucide lucide-instagram-icon lucide-instagram hover:text-gray-500 transition-colors"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a> */}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">
              Explore
            </h4>
            <div className="flex flex-col space-y-2">
              <a
                href="/about-us"
                className="text-xs tracking-widest hover:text-gray-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                About us
              </a>
              {/* <a
                href="/"
                className="text-xs tracking-widest hover:text-gray-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Return & Exchange
              </a> */}
              <a
                href="/terms-and-conditions"
                className="text-xs tracking-widest hover:text-gray-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </a>
              <a
                href="/privacy-policy"
                className="text-xs tracking-widest hover:text-gray-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <div className="flex flex-col space-y-2">
              {/* <a
                href="/"
                className="text-xs tracking-widest hover:text-gray-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Offers
              </a> */}
              <a
                href="/contact-us"
                className="text-xs tracking-widest hover:text-gray-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Us
              </a>
              <a
                href="/cancellation-and-refund-policy"
                className="text-xs tracking-widest hover:text-gray-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cancellation & Refund policy
              </a>
              <a
                href="/return-policy"
                className="text-xs tracking-widest hover:text-gray-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Return Policy
              </a>
              <a
                href="/shipping-policy"
                className="text-xs tracking-widest hover:text-gray-500 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Shipping Policy
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">
              Newsletter
            </h4>
            <p className="text-xs tracking-widest text-gray-500 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <h1 className="text-gray-700">COMING SOON</h1>
            {/* <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="text-xs w-full px-4 py-2 bg-transparent border border-gray-600 text-gray-600 placeholder-gray-400 tracking-widest focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <CustomDarkButtonFull>Subscribe</CustomDarkButtonFull>
            </form> */}
          </div>
        </div>
      </div>

      <div className="">
        <div className="container mx-auto px-12 py-12">
          <p className="text-xs text-gray-500 tracking-widest">
            © 2025 Caviaar Mode. All rights reserved. Powered by Alphabit
            Technologies IND.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
