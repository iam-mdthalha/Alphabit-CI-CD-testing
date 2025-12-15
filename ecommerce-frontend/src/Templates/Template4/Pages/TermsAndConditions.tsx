import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen font-gilroyRegular tracking-wider bg-vintageBg px-10 md:px-20 lg:px-32 py-12 text-[#1a1a1a]">
      <div className="w-full">
        <h1
          className="text-3xl font-bold mb-2 capitalize text-center font-melodramaRegular"
          style={{ color: "#326638" }}
        >
          Terms & Conditions
        </h1>
        <p className="text-sm mb-8 text-center text-gray-700">
          Last updated on December 1st, 2025
        </p>

        <div className="space-y-6 text-justify leading-relaxed">
          <h2
            className="font-melodramaRegular text-xl font-bold"
            style={{ color: "#326638" }}
          >
            OVERVIEW
          </h2>
          <p>
            This website is operated by{" "}
            <span className="font-medium">Moore Market Private Limited</span>.
            Throughout the site, the terms "we", "us" and "our" refer to Moore
            Market Private Limited We offer this website as a platform to
            browse, buy, and sell books, subject to your acceptance of our Terms
            and Conditions.
          </p>
          <p>
            By visiting our site and/or purchasing or selling books through our
            platform, you agree to be bound by these Terms and Conditions. These
            apply to all users of the site, including browsers, book buyers,
            sellers, and content contributors.
          </p>
          <p>
            Please read these Terms carefully before accessing or using our
            website. By continuing to browse or transact, you indicate that you
            agree to comply with these Terms.
          </p>

          <h2
            className="font-melodramaRegular text-xl font-bold mt-8"
            style={{ color: "#326638" }}
          >
            SECTION 1 - BUYING AND SELLING TERMS
          </h2>
          <p>
            By agreeing to these Terms, you confirm that you are at least the
            age of majority in your state or province of residence, or you have
            parental consent to use our website.
          </p>
          <p>
            Sellers are responsible for ensuring that books listed are
            authentic, accurately described, and legally saleable.
            Misrepresentation or selling pirated/illegal books is prohibited.
          </p>
          <p>
            Buyers are responsible for checking descriptions before purchase. We
            do not guarantee the content accuracy of books sold by third-party
            sellers.
          </p>

          <h2
            className="font-melodramaRegular text-xl font-bold mt-8"
            style={{ color: "#326638" }}
          >
            SECTION 2 - GENERAL CONDITIONS
          </h2>
          <p>We reserve the right to refuse service to anyone at any time.</p>
          <p>
            Your content (listings, descriptions, reviews) may be transferred
            over networks and adapted to technical requirements. By posting
            content, you grant us the right to display and distribute that
            material.
          </p>

          <h2
            className="font-melodramaRegular text-xl font-bold mt-8"
            style={{ color: "#326638" }}
          >
            SECTION 3 - PRODUCT INFORMATION
          </h2>
          <p>
            We strive to ensure that information about the books listed is
            accurate, but we are not responsible for inaccuracies provided by
            sellers. Buyers are advised to verify details before making
            purchasing decisions.
          </p>

          <h2
            className="font-melodramaRegular text-xl font-bold mt-8"
            style={{ color: "#326638" }}
          >
            SECTION 4 - PRICES AND PAYMENTS
          </h2>
          <p>
            Prices of books are subject to change without notice. We are not
            liable for discrepancies between listed and final selling prices.
          </p>
          <p>
            Payments must be made securely through the methods provided on our
            platform. Unauthorized transactions or fraudulent activities will
            lead to account suspension.
          </p>

          <h2
            className="font-melodramaRegular text-xl font-bold mt-8"
            style={{ color: "#326638" }}
          >
            SECTION 5 - EXCHANGE AND RETURN POLICY
          </h2>
          <p>
            Returns or exchanges are accepted as per our Return Policy. Damaged
            or counterfeit books must be reported immediately. Refunds will be
            processed at our discretion.
          </p>

          <h2
            className="font-melodramaRegular text-xl font-bold mt-8"
            style={{ color: "#326638" }}
          >
            SECTION 6 - USER RESPONSIBILITIES
          </h2>
          <p>
            Users agree not to upload harmful content, infringe copyrights, or
            list prohibited books (including illegal, plagiarized, or obscene
            material).
          </p>
          <p>
            Any violation will result in removal of content and possible
            termination of account privileges.
          </p>

          <h2
            className="font-melodramaRegular text-xl font-bold mt-8"
            style={{ color: "#326638" }}
          >
            SECTION 7 - LIMITATION OF LIABILITY
          </h2>
          <p>
            Moore Market Private Limited is a platform connecting book buyers
            and sellers. We do not take responsibility for disputes between
            users, the condition of books, or losses incurred due to third-party
            transactions.
          </p>

          <h2
            className="font-melodramaRegular text-xl font-bold mt-8"
            style={{ color: "#326638" }}
          >
            SECTION 8 - GOVERNING LAW
          </h2>
          <p>
            These Terms & Conditions shall be governed by the laws of India,
            with jurisdiction in Chennai, Tamil Nadu.
          </p>

          <h2
            className="font-melodramaRegular text-xl font-bold mt-8"
            style={{ color: "#326638" }}
          >
            SECTION 9 - CONTACT INFORMATION
          </h2>
          <p>
            For questions about these Terms & Conditions, contact us at{" "}
            <a
              href="mailto:info@mooremarket.in"
              className="underline"
              style={{ color: "#326638" }}
            >
              info@mooremarket.in
            </a>{" "}
            or call us at{" "}
            <a
              href="tel:+919841735364"
              className="underline"
              style={{ color: "#326638" }}
            >
              +91 98417 35364
            </a>
            .
          </p>
          <p>
            Registered Office Address:{" "}
            <span className="font-medium">
              Door no 22, Paramount Plaza, 4th Floor, Nungambakkam High Road,
              Nungambakkam, Chennai, Tamil Nadu, 600034.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
