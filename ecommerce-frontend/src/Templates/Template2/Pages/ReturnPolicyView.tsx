import React from "react";
import { Link } from "react-router-dom";
import CustomDarkButton from "Components/StyleComponent/CustomDarkButton";

const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold mb-4 text-gray-800">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const HighlightBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-r-lg mb-4">
    <div className="text-xs text-blue-800 font-medium">{children}</div>
  </div>
);

const ReturnPolicyView = () => {
  return (
    <div className="bg-[#EFEFEF] min-h-screen font-montserrat tracking-wide mx-auto py-2 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center uppercase my-8 text-gray-900">
          Return & Exchange Policy
        </h1>

        <div className="p-6">
          <HighlightBox>
            We have a 15-days return policy from the date of receiving your item
          </HighlightBox>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg py-2 px-4 mb-6 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-yellow-600 lucide lucide-circle-alert-icon lucide-circle-alert"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <p className="text-xs text-yellow-800 font-medium">
              Items must be unused, with tags, and in original packaging to be
              eligible for return
            </p>
          </div>

          <PolicySection title="How to Raise a Return/Exchange Request">
            <div className="space-y-3">
              <div className="text-xs flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 h-4 w-auto flex-shrink-0 lucide lucide-package-icon lucide-package"
                >
                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                  <path d="M12 22V12" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <path d="m7.5 4.27 9 5.15" />
                </svg>
                <p>
                  Visit the returns section on our website to raise a
                  return/exchange request
                </p>
              </div>
              <div className="text-xs flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 h-4 w-auto flex-shrink-0 lucide lucide-refresh-cw-icon lucide-refresh-cw"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                <p>
                  Submit the required details and select the items you want to
                  return
                </p>
              </div>
              <div className="text-xs flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 h-4 w-auto flex-shrink-0 lucide lucide-mail-icon lucide-mail"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
                <p>
                  A confirmation email will be sent once your request is
                  approved
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="Exchange Policy">
            <div className="space-y-3">
              <div className="text-xs">
                <p>
                  Reverse pickup will be arranged within 2-3 days after request
                  approval. Once received and approved, a new exchange order
                  will be automatically placed.
                </p>
              </div>
              <div className="text-xs">
                <p>
                  The new order ships in 2-3 working days with delivery in 8-10
                  days (may vary by region).
                </p>
              </div>
              <div className="text-xs flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 h-4 w-auto flex-shrink-0 lucide lucide-ban-icon lucide-ban"
                >
                  <path d="M4.929 4.929 19.07 19.071" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <p>
                  Note: No further exchanges or refunds are possible after an
                  exchange is delivered.
                </p>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="Return Policy">
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500 h-4 w-auto lucide lucide-clock-icon lucide-clock"
                  >
                    <path d="M12 6v6l4 2" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">Refund Processing</p>
                    <p className="text-xs text-gray-600">
                      Refunds are processed to your bank account within 8-10
                      business days after we receive the returned item
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-500 h-4 w-auto lucide lucide-circle-alert-icon lucide-circle-alert"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">Damages and Issues</p>
                    <p className="text-xs text-gray-600">
                      Contact us immediately if you receive a defective,
                      damaged, or wrong item
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="Non-Returnable Items">
            <div className="space-y-3">
              <div className="text-xs flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 h-4 w-auto flex-shrink-0 lucide lucide-ban-icon lucide-ban"
                >
                  <path d="M4.929 4.929 19.07 19.071" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <p>
                  Perishable goods, personalized items, and personal care
                  products
                </p>
              </div>
              <div className="text-xs flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 h-4 w-auto flex-shrink-0 lucide lucide-ban-icon lucide-ban"
                >
                  <path d="M4.929 4.929 19.07 19.071" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <p>Hazardous materials, flammable liquids, or gases</p>
              </div>
              <div className="text-xs flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 h-4 w-auto flex-shrink-0 lucide lucide-ban-icon lucide-ban"
                >
                  <path d="M4.929 4.929 19.07 19.071" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <p>Sale items or gift cards</p>
              </div>
            </div>
          </PolicySection>

          <PolicySection title="Contact Us">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail-icon lucide-mail"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
                <a
                  href="mailto:info@caviaarmode.com"
                  className="hover:text-blue-600 underline"
                >
                  info@caviaarmode.com
                </a>
              </div>

              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-phone-icon lucide-phone"
                >
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                </svg>
                <a
                  href="tel:918056892910"
                  className="hover:text-blue-600 underline"
                >
                  +91 80568 92910
                </a>
              </div>
            </div>
          </PolicySection>
        </div>

        <div className="px-6 mb-12">
          <h3 className="text-lg font-semibold mb-4">Feedback</h3>
          <p className="text-xs text-gray-600 mb-4">
            We value your feedback and constantly strive to improve our products
            and services. If you have any suggestions or concerns, please don't
            hesitate to reach out to us.
          </p>
          <div className="w-full flex justify-center items-center">
            <CustomDarkButton>
              <a
                href="mailto:info@caviaarmode.com"
                className="flex justify-center items-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-auto lucide lucide-mail-icon lucide-mail"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
                <span>Send Feedback</span>
              </a>
            </CustomDarkButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyView;
