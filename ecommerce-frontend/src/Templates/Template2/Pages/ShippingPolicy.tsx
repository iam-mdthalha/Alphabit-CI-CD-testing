import React from "react";

const ShippingPolicy: React.FC = () => {
  return (
    <div className="min-h-screen font-montserrat max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2 uppercase text-center">
        Shipping Policy
      </h1>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Last updated on July 1st 2025
      </p>

      <div className="space-y-6 text-gray-700 text-justify leading-relaxed">
        <p>
          At CAVIAARMODE, we collaborate with third-party logistics service
          providers to ensure the smooth delivery of our premium products to our
          valued customers ("Logistic Partners"). Here's what you need to know
          about our shipping process:
        </p>

        <h2 className="text-xl font-bold mt-8">
          Logistic Partners and Delivery Information
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Details about the Logistic Partner responsible for processing the
            delivery of purchased products will be shared with the user once
            CAVIAARMODE hands over the products to the Logistic Partner.
          </li>
          <li>
            Users will receive an estimated delivery time frame on the order
            confirmation page.
          </li>
          <li>
            CAVIAARMODE may, at its discretion, handle product delivery to users
            without involving Logistic Partners.
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8">Delivery Areas</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            While we aim to provide services and product delivery across India
            through our Platforms, delivery availability is currently limited to
            specific areas.
          </li>
          <li>
            Users are required to enter their pin-code details during order
            placement to verify delivery feasibility. If the user's area is not
            within our recognized delivery network, the order cannot be
            processed further.
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8">Shipping Address Accuracy</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Before making payments, users will be prompted to provide a shipping
            address. It is essential to ensure the accuracy and completeness of
            the provided information, including sufficient landmarks for address
            identification.
          </li>
          <li>
            CAVIAARMODE will not be held liable for any delivery failures due to
            incorrect user-provided information.
          </li>
          <li>
            Dispatch Time: All orders will be dispatched within 2-3 days of
            placement.
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8">
          Delivery Attempts and Cancellation
        </h2>
        <p>
          A maximum of 3 delivery attempts will be made. If the user remains
          unavailable after three attempts, CAVIAARMODE reserves the right to
          cancel the order.
        </p>

        <h2 className="text-xl font-bold mt-8">Delays and Notification</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            While we strive for timely deliveries, delays may occur due to
            logistical issues, weather conditions, political disruptions, acts
            of god, or unforeseen circumstances.
          </li>
          <li>
            In such cases, CAVIAARMODE will attempt to notify the user of delays
            via email and/or mobile communication.
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8">Tracking Information</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            After successfully placing an order, users will receive a unique
            tracking identity number for monitoring delivery status.
          </li>
          <li>
            Users can use this number on the Platforms or the Logistic Partner's
            website/app to track the purchased product's whereabouts.
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8">
          Shipping Fees and Title/Risk of Loss
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Shipping charges are non-refundable post-shipping, except for
            defective products upon delivery.
          </li>
          <li>
            Title and risk of loss pass to the user upon product delivery.
          </li>
        </ul>

        <p className="mt-6">
          For any additional queries or assistance, please feel free to contact
          us at{" "}
          <a
            href="mailto:info@caviaarmode.com"
            className="text-blue-600 underline font-medium"
          >
            info@caviaarmode.com
          </a>
          . Your satisfaction is our priority!
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
