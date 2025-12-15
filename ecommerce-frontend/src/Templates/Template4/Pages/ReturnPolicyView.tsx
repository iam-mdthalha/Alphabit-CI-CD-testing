import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-10" data-aos="fade-up">
    <h2 className="text-xl md:text-3xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-4">
      {title}
    </h2>
    <div className="space-y-4 font-gilroyRegular text-sm md:text-lg text-justify">{children}</div>
  </div>
);

const HighlightBox = ({ children }: { children: React.ReactNode }) => (
  <div
    className="border-l-4 px-4 py-3 mb-6 font-gilroyRegular bg-vintageBorder text-sm border-vintageText md:text-lg"
    data-aos="fade"
  >
    <div className="text-sm font-medium color-vintageText">
      {children}
    </div>
  </div>
);

const ReturnPolicyView = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-vintageBg px-10 md:px-20 lg:px-32 py-12 text-gray-800 tracking-wide font-gilroyRegular tracking-wider" data-aos="fade-up">
      <div className="w-full">
        <h1
          className="text-2xl md:text-4xl font-bold text-center mb-10 text-vintageText font-melodramaRegular tracking-wider"
          style={{ color: "#326638" }}
          data-aos="zoom-in"
        >
          Moore Market Private Limited Book Returns & Exchanges
        </h1>

        <div>
          <HighlightBox>
            Moore Market Private Limited offers a 15-day return window from the delivery date
            for eligible book purchases. Please review the rules below.
          </HighlightBox>

          <div className="py-2 px-0 mb-6 flex items-center space-x-2" data-aos="fade-right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#326638"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <p className="text-sm md:text-lg font-gilroyRegular" style={{ color: "#326638" }}>
              Books must be unused, in original condition, and include any
              publisher inserts/accessories to qualify for a return.
            </p>
          </div>

          <PolicySection title="How to Raise a Return/Exchange Request">
            <div className="space-y-4 text-sm md:text-lg" style={{ color: "#1a1a1a" }}>
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#326638"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-auto flex-shrink-0"
                >
                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                  <path d="M12 22V12" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <path d="m7.5 4.27 9 5.15" />
                </svg>
                <p>
                  Open the Returns section in the Moore Market Private Limited account dashboard
                  and choose the order to start a return/exchange.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#326638"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-auto flex-shrink-0"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                <p>
                  Provide the reason, condition, and preferred resolution
                  (refund or exchange), and confirm the pickup address.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#326638"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-auto flex-shrink-0"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
                <p>
                  After approval, a confirmation email/SMS will detail pickup
                  and next steps.
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="Exchange Policy">
            <div className="space-y-4 text-sm md:text-lg" style={{ color: "#1a1a1a" }}>
              <p>
                Reverse pickup is arranged within 2–3 business days after
                approval. Post-inspection, a replacement order is placed
                automatically when stock is available.
              </p>
              <p>
                Replacement dispatch takes 2–3 working days; delivery typically
                completes within 8–10 days depending on region/courier.
              </p>
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#326638"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-auto flex-shrink-0"
                >
                  <path d="M4.929 4.929 19.07 19.071" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <p>
                  Note: After an exchange is delivered, no further exchanges or
                  refunds are allowed for the same item.
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="Return Policy">
            <div className="space-y-6 text-sm md:text-lg">
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#326638"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-auto"
                >
                  <path d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <div>
                  <p className="text-base font-medium text-vintageText">
                    Refund Processing
                  </p>
                  <p className="text-sm font-gilroyRegular" style={{ color: "#1a1a1a" }}>
                    Refunds are issued to the original payment method within
                    8–10 business days after the returned book passes quality
                    checks.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#326638"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-auto"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                <div>
                  <p className="text-base font-medium text-vintageText">
                    Damages and Issues
                  </p>
                  <p className="text-sm font-gilroyRegular" style={{ color: "#1a1a1a" }}>
                    Report defective, damaged, or incorrect books within 48
                    hours of delivery. Photos of packaging and item may be
                    required to resolve the claim.
                  </p>
                </div>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="Non-Returnable Books">
            <div className="space-y-4 text-sm md:text-lg" style={{ color: "#1a1a1a" }}>
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#326638"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-auto flex-shrink-0"
                >
                  <path d="M4.929 4.929 19.07 19.071" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <p>No returns on e-books, digital downloads, or used books.</p>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#326638"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-auto flex-shrink-0"
                >
                  <path d="M9 18V5l12-2v13" />
                  <path d="M9 9l12-2" />
                  <path d="M5 6v13c0 .93 3 3 7 3s7-2.07 7-3V4" />
                </svg>
                <p>
                  Customized or personalized study materials are non-returnable.
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="Cancellation Policy">
            <div className="space-y-4 text-sm md:text-lg" style={{ color: "#1a1a1a" }}>
              <p>
                Orders can be cancelled before dispatch. Post-dispatch,
                cancellation requests are not guaranteed and may be subject to
                return policies.
              </p>
            </div>
          </PolicySection>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyView;
