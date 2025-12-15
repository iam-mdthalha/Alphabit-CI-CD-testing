import React, { useEffect } from "react";
import {
  RotateCcw,
  ArrowLeftRight,
  AlertCircle,
  Ban,
  CreditCard,
  BookOpen,
  Mail,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const CancellationsAndRefunds: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div
      className="min-h-screen bg-vintageBg px-10 md:px-20 lg:px-32 py-12 text-gray-800 font-gilroyRegular"
    >
      <div className="text-center mb-12" data-aos="fade-up">
        <h1
          className="text-xl md:text-3xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular uppercase mb-4"
          style={{ color: "#326638" }}
          data-aos="fade"
        >
          Refund & Return Policy
        </h1>
        <p className="text-base md:text-xl text-gray-600 text-center mt-2">
          Last updated on December 1st 2025
        </p>
      </div>

      <div className="space-y-12 leading-relaxed text-justify">
        <section data-aos="fade-up">
          <h2
            className="text-3xl md:text-4xl font-bold flex items-center mb-4 text-vintageText capitalize tracking-wider font-melodramaRegular"
            style={{ color: "#326638" }}
          >
            <RotateCcw className="w-6 h-6 mr-2" /> Returns
          </h2>
          <p className="text-base md:text-xl">
            At <span className="font-semibold">Moore Market Private Limited</span>, customer
            satisfaction is our priority. We accept returns within{" "}
            <span className="font-medium">7 days</span> of delivery for eligible
            items. Books must be in{" "}
            <span className="font-medium">unused and resaleable condition</span>,
            free from markings, highlights, or damage.
          </p>
          <p className="mt-2 text-base md:text-xl">
            You will also need to provide{" "}
            <span className="font-medium">order details or receipt</span> to
            process your return.
          </p>
        </section>

        <section data-aos="fade-up" data-aos-delay="100">
          <h2
            className="text-3xl md:text-4xl font-bold flex items-center mb-4 text-vintageText capitalize tracking-wider font-melodramaRegular"
            style={{ color: "#326638" }}
          >
            <ArrowLeftRight className="w-6 h-6 mr-2" /> How to Raise a Return/Exchange Request
          </h2>
          <ul className="list-disc list-inside space-y-2 text-base md:text-xl">
            <li>
              Visit the <span className="font-medium">My Orders</span> section on
              our website and choose the item you want to return/exchange.
            </li>
            <li>Fill out the return/exchange request form online.</li>
            <li>
              Pack the book securely in its original condition for pickup or drop-off.
            </li>
            <li>
              Once approved, we'll notify you via email with further instructions.
            </li>
          </ul>
        </section>

        <section data-aos="fade-up" data-aos-delay="200">
          <h2
            className="text-3xl md:text-4xl font-bold flex items-center mb-4 text-vintageText capitalize tracking-wider font-melodramaRegular"
            style={{ color: "#326638" }}
          >
            <ArrowLeftRight className="w-6 h-6 mr-2" /> Exchange Policy
          </h2>
          <p className="text-base md:text-xl">
            If you received the wrong edition or a duplicate order, we are happy
            to offer an{" "}
            <span className="font-medium">exchange within 7 days</span>. Once the
            returned book is inspected, your replacement will be shipped within{" "}
            <span className="font-medium">3-5 working days</span>.
          </p>
          <p
            className="mt-4 p-3 rounded-lg text-base md:text-xl font-medium"
            style={{
              backgroundColor: "#326638",
              color: "#ECE6C2",
            }}
          >
            ⚠️ Note: Second-hand books purchased from other sellers through
            Moore Market Private Limited are{" "}
            <span className="underline">only exchangeable if defective</span> and
            not eligible for refunds.
          </p>
        </section>

        <section data-aos="fade-up" data-aos-delay="300">
          <h2
            className="text-3xl md:text-4xl font-bold flex items-center mb-4 text-vintageText capitalize tracking-wider font-melodramaRegular"
            style={{ color: "#326638" }}
          >
            <CreditCard className="w-6 h-6 mr-2" /> Refunds
          </h2>
          <p className="text-base md:text-xl">
            Once we receive and inspect the returned book, your refund will be
            processed within{" "}
            <span className="font-medium">7-10 business days</span>. The amount
            will be credited to your original payment method (bank account,
            credit/debit card, or wallet balance).
          </p>
        </section>

        <section data-aos="fade-up" data-aos-delay="400">
          <h2
            className="text-3xl md:text-4xl font-bold flex items-center mb-4 text-vintageText capitalize tracking-wider font-melodramaRegular"
            style={{ color: "#326638" }}
          >
            <AlertCircle className="w-6 h-6 mr-2" /> Damaged or Wrong Books
          </h2>
          <p className="text-base md:text-xl">
            If you receive a{" "}
            <span className="font-medium">damaged, misprinted, or wrong book</span>,
            please contact us within{" "}
            <span className="font-medium">48 hours</span> of delivery. We'll
            arrange a quick replacement or refund at no extra cost.
          </p>
        </section>

        <section data-aos="fade-up" data-aos-delay="500">
          <h2
            className="text-3xl md:text-4xl font-bold flex items-center mb-4 text-vintageText capitalize tracking-wider font-melodramaRegular"
            style={{ color: "#326638" }}
          >
            <Ban className="w-6 h-6 mr-2" /> Non-Returnable Items
          </h2>
          <p className="text-base md:text-xl">
            For fairness and copyright protection,{" "}
            <span className="font-medium">
              e-books, digital downloads, clearance sale books, and personalized
              study materials
            </span>{" "}
            are not eligible for return or refund.
          </p>
        </section>

        <section data-aos="fade-up" data-aos-delay="600">
          <h2
            className="text-3xl md:text-4xl font-bold flex items-center mb-4 text-vintageText capitalize tracking-wider font-melodramaRegular"
            style={{ color: "#326638" }}
          >
            <BookOpen className="w-6 h-6 mr-2" /> Selling Books on Moore Market Private Limited
          </h2>
          <p className="text-base md:text-xl">
            If you're selling books through Moore Market Private Limited, payments will be
            released to your registered account{" "}
            <span className="font-medium">7 days after buyer confirmation</span>.
            Please ensure books are in the agreed condition before listing, as
            disputes may affect your seller rating.
          </p>
        </section>

        <section data-aos="fade-up" data-aos-delay="700">
          <h2
            className="text-3xl md:text-4xl font-bold flex items-center mb-4 text-vintageText capitalize tracking-wider font-melodramaRegular"
            style={{ color: "#326638" }}
          >
            <Mail className="w-6 h-6 mr-2" /> Contact Us
          </h2>
          <p className="text-base md:text-xl">
            For any questions about returns, refunds, or seller disputes, reach
            us at{" "}
            <a
              href="mailto:support@mooremarket.in"
              className="font-medium underline"
              style={{ color: "#326638" }}
            >
              support@mooremarket.in
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default CancellationsAndRefunds;
