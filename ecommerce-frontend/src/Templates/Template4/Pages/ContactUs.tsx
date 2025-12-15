import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="font-gilroyRegular tracking-wider min-h-screen bg-vintageBg py-12 px-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-20 h-20 opacity-5">
        <svg viewBox="0 0 100 100" className="text-vintageText">
          <path
            d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="absolute bottom-10 right-10 w-24 h-24 opacity-5 rotate-45">
        <svg viewBox="0 0 100 100" className="text-vintageText">
          <rect x="10" y="10" width="80" height="80" fill="currentColor" />
        </svg>
      </div>

      <div className="max-w-8xl mx-auto relative z-10" data-aos="fade-up">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-4 relative">
            <span className="relative z-10 px-4 bg-vintageBg">
              Get In Touch
            </span>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-0.5 bg-vintageText opacity-30"></div>
          </h1>
          <p
            className="text-sm md:text-lg text-justify text-vintageText max-w-2xl mx-auto opacity-90"
            style={{ fontFamily: "gilroyRegular, sans-serif" }}
          >
            Have questions about our vintage book collection? We'd love to hear
            from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 md:px-8 lg:px-16">
          <div
            className="lg:col-span-1"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="bg-vintageBg border-2 border-vintageText border-opacity-20 rounded-lg p-6 shadow-sm h-full">
              <h2 className="text-xl md:text-3xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-6">
                Contact Information
              </h2>
              <div
                className="space-y-6 text-sm md:text-lg text-justify"
                style={{ fontFamily: "gilroyRegular, sans-serif" }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-vintageText bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-vintageText"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-vintageText text-base md:text-lg">
                      Our Address
                    </h3>
                    <p className="text-vintageText opacity-90">
                      Door no 22, Paramount Plaza, 4th Floor, Nungambakkam High
                      Road, Nungambakkam, Chennai, Tamil Nadu, 600034.
                      <br />
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-vintageText bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-vintageText"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-vintageText text-base md:text-lg">
                      Phone Number
                    </h3>
                    <a
                      href="tel:+919841735364"
                      className="text-vintageText opacity-90"
                    >
                      +91 98417 35364
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-vintageText bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-vintageText"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-vintageText text-base md:text-lg">
                      Email Address
                    </h3>
                    <a
                      href="mailto:admin@mooremarket.in"
                      className="font-medium underline text-vintageText opacity-90"
                    >
                      admin@mooremarket.in
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-vintageText bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-vintageText"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-vintageText text-base md:text-lg">
                      Business Hours
                    </h3>
                    <p className="text-vintageText opacity-90">
                      Mon-Fri: 9AM-6PM
                      <br />
                      Sat: 10AM-4PM
                      <br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </div>
              {/* <div className="mt-8 pt-6 border-t border-vintageText border-opacity-20">
                <h3 className="font-semibold text-vintageText mb-4 text-xl md:text-3xl capitalize tracking-wider font-melodramaRegular">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {["facebook", "twitter", "instagram", "pinterest"].map(
                    (platform) => (
                      <a
                        key={platform}
                        href="#"
                        className="w-10 h-10 bg-vintageText bg-opacity-10 rounded-full flex items-center justify-center hover:bg-vintageText hover:text-vintageBg transition-colors"
                      >
                        <span className="sr-only">{platform}</span>
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                        </svg>
                      </a>
                    )
                  )}
                </div>
              </div> */}
            </div>
          </div>
          <div
            className="lg:col-span-2"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <div className="bg-vintageBg border-2 border-vintageText border-opacity-20 rounded-lg p-8 shadow-sm">
              <h2 className="text-xl md:text-3xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-vintageText mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-vintageText border-opacity-30 rounded-md focus:outline-none focus:border-vintageText bg-vintageBg bg-opacity-50 text-vintageText placeholder-vintageText placeholder-opacity-50"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-vintageText mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-vintageText border-opacity-30 rounded-md focus:outline-none focus:border-vintageText bg-vintageBg bg-opacity-50 text-vintageText placeholder-vintageText placeholder-opacity-50"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-vintageText mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-vintageText border-opacity-30 rounded-md focus:outline-none focus:border-vintageText bg-vintageBg bg-opacity-50 text-vintageText"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="technical">Technical Support</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="suggestion">Book Suggestion</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-vintageText mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-vintageText border-opacity-30 rounded-md focus:outline-none focus:border-vintageText bg-vintageBg bg-opacity-50 text-vintageText placeholder-vintageText placeholder-opacity-50 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-vintageText text-vintageBg py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors font-semibold text-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="mt-8 bg-vintageText bg-opacity-10 border-2 border-vintageText border-opacity-20 rounded-lg p-6">
              <h3 className="text-xl md:text-3xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-4">
                Why Choose Moore Market?
              </h3>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-justify text-base md:text-xl"
                style={{ fontFamily: "gilroyRegular, sans-serif" }}
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-vintageText text-vintageBg rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    ✓
                  </span>
                  <span className="text-vintageText opacity-90">
                    Vintage book specialists since 1995
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-vintageText text-vintageBg rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    ✓
                  </span>
                  <span className="text-vintageText opacity-90">
                    Free shipping on orders over $50
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-vintageText text-vintageBg rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    ✓
                  </span>
                  <span className="text-vintageText opacity-90">
                    Authenticity guarantee on all books
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-vintageText text-vintageBg rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                    ✓
                  </span>
                  <span className="text-vintageText opacity-90">
                    Expert book restoration services
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-vintageBg border-1 border-vintageText border-opacity-20 rounded-lg p-6 w-full px-4 md:px-8 lg:px-16">
          <h2 className="text-2xl text-vintageText mb-6 text-left">
            Visit Our Store
          </h2>
          <div className="bg-vintageText bg-opacity-5 h-64 rounded-lg flex items-center justify-center border border-vintageText border-opacity-20">
            <div className="text-center text-vintageText opacity-90">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-vintageText opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-lg font-semibold">
                Interactive Map Coming Soon
              </p>
              <p className="text-sm">
                Door no 22, Paramount Plaza, 4th Floor, Nungambakkam High Road,
                Nungambakkam, Chennai, Tamil Nadu, 600034.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
