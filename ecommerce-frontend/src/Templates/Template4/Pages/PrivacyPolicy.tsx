import React from "react";
import { Lock, Mail, MapPin, Globe, Database, Users, Eye } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen font-gilroyRegular tracking-wider bg-vintageBg px-10 md:px-20 lg:px-32 py-12 text-gray-800">
      <h1
        className="text-3xl font-bold mb-2 uppercase text-center font-melodramaRegular"
        style={{ color: "#326638" }}
      >
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-600 mb-10 text-center">
        Last updated on December 1st, 2025
      </p>

      <div className="space-y-12 text-justify leading-relaxed">
        <div>
          <h2
            className="font-melodramaRegular text-2xl font-bold mb-4 flex items-center"
            style={{ color: "#326638" }}
          >
            <Lock className="w-6 h-6 mr-2 text-green-700" />
            Your Privacy Matters
          </h2>
          <p className="text-gray-700">
            At{" "}
            <span className="font-semibold">Moore Market Private Limited</span>,
            we are committed to protecting your privacy and ensuring the
            security of your personal information. This Privacy Policy explains
            how we collect, use, and safeguard your data when you use our
            services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2
              className="font-melodramaRegular text-xl font-bold mb-3 flex items-center"
              style={{ color: "#326638" }}
            >
              <Database className="w-6 h-6 mr-2 text-green-700" />
              Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Personal details (name, email, address, phone)</li>
              <li>Billing and transaction details</li>
              <li>Device information (IP, browser type, OS)</li>
              <li>Usage information (pages visited, time on site)</li>
            </ul>
          </div>

          <div>
            <h2
              className="font-melodramaRegular text-xl font-bold mb-3"
              style={{ color: "#326638" }}
            >
              Data Retention
            </h2>
            <p className="text-gray-700">
              We retain your information only as long as necessary for business
              and legal purposes. When your data is no longer needed, we
              securely delete or anonymize it.
            </p>
          </div>

          <div>
            <h2
              className="font-melodramaRegular text-xl font-bold mb-3"
              style={{ color: "#326638" }}
            >
              International Data Transfers
            </h2>
            <p className="text-gray-700">
              If you access our services from outside India, please note that
            </p>
            <p className="text-gray-700">
              your data may be transferred and processed in countries with
            </p>
            <p className="text-gray-700">different data protection laws.</p>
          </div>

          <div>
            <h2
              className="font-melodramaRegular text-xl font-bold mb-3 flex items-center"
              style={{ color: "#326638" }}
            >
              <Users className="w-6 h-6 mr-2 text-green-700" />
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>To process and fulfill your orders</li>
              <li>To improve our website & services</li>
              <li>To send important updates and promotions (with consent)</li>
              <li>For fraud prevention and compliance</li>
            </ul>
          </div>

          <div>
            <h2
              className="font-melodramaRegular text-xl font-bold mb-3 flex items-center"
              style={{ color: "#326638" }}
            >
              <Eye className="w-6 h-6 mr-2 text-green-700" />
              Your Rights
            </h2>
            <p className="text-gray-700 mb-2">You may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>Access the information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
            </ul>
          </div>

          <div>
            <h2
              className="font-melodramaRegular text-xl font-bold mb-3"
              style={{ color: "#326638" }}
            >
              Third-Party Analytics
            </h2>
            <p className="text-gray-700">
              We use third-party analytics tools like Google Analytics to track
              and improve our services. These tools may use cookies or tracking
              pixels to collect anonymized usage data.
            </p>
          </div>
        </div>

        <div>
          <h2
            className="font-melodramaRegular text-xl font-bold mb-3 flex items-center"
            style={{ color: "#326638" }}
          >
            <Mail className="w-6 h-6 mr-2 text-green-700" />
            Questions & Contact Information
          </h2>
          <p className="mb-3 text-gray-700">
            For any questions about this policy or your data, contact our
            Privacy Officer at{" "}
            <a
              href="mailto:support@mooremarket.in"
              className="text-green-700 underline font-medium"
            >
              support@mooremarket.in
            </a>
          </p>
          <p className="flex items-start text-gray-700">
            <MapPin className="w-5 h-5 mr-2 mt-1 text-green-700" />
            Door no 22, Paramount Plaza, 4th Floor, Nungambakkam High Road,
            Nungambakkam, Chennai, Tamil Nadu, 600034.
          </p>
        </div>

        {/* <div className="pt-8 border-t border-gray-300 text-center">
          <div className="flex items-center justify-center">
            <Globe className="w-5 h-5 mr-2 text-green-700" />
            <p className="text-sm text-gray-600">Moore Market Private Limited • Protecting Your Privacy Since 2010</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
