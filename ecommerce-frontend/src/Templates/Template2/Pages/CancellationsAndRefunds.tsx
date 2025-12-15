import React from "react";

const CancellationsAndRefunds: React.FC = () => {
  return (
    <div className="min-h-screen font-montserrat max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2 uppercase text-center">
        Refund Policy
      </h1>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Last updated on July 1st 2025
      </p>

      <div className="space-y-6 text-gray-700 text-justify leading-relaxed">
        <h2 className="text-xl font-bold">Returns</h2>
        <p>
          We have a 15-days return policy, which means you have up to 15 days
          after receiving your item to request a return.
        </p>
        <p>
          To be eligible for a return, your item must be in the same condition
          that you received it, unworn or unused, with tags, and in its original
          packaging. You'll also need the receipt or proof of purchase.
        </p>

        <h2 className="text-xl font-bold mt-8">
          How to Raise a Return/Exchange Request
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Visit the returns section on our website to raise a return/exchange
            request
          </li>
          <li>Submit the required details in the empty fields</li>
          <li>
            Follow the instructions and select the items you would want to
            return
          </li>
          <li>
            A confirmation email would be shared once the return request is
            approved
          </li>
        </ul>

        <h2 className="text-xl font-bold mt-8">Exchange Policy</h2>
        <p>
          For exchange, the reverse pick up will be done in 2-3 days once the
          request is placed. Once we have received the request and it is
          approved after review, a new exchange order is automatically placed
          and processed.
        </p>
        <p>
          The new order gets shipped in 2-3 working days and would take 8-10
          days for it to get delivered, mostly sooner depending on the region.
        </p>
        <p className="font-medium">
          Note: Once a product is exchanged and is delivered, no further actions
          such as exchange or refund would be applicable on that order.
        </p>

        <h2 className="text-xl font-bold mt-8">Return Policy</h2>
        <p>
          Once we receive the product at our warehouse, we will refund the
          money, as per your preferred choice. For Credit card/Debit card/Net
          Banking payments, it may take up to 8-10 business days for the refund
          amount to reflect in your account (depending upon your bank).
        </p>

        <h2 className="text-xl font-bold mt-8">Damages and Issues</h2>
        <p>
          Please inspect your order upon reception and contact us immediately if
          the item is defective, damaged or if you receive the wrong item, so
          that we can evaluate the issue and rectify the same at the earliest.
        </p>

        <h2 className="text-xl font-bold mt-8">
          Exceptions / Non-Returnable Items
        </h2>
        <p>
          Certain types of items cannot be returned, like perishable goods and
          personalized items (such as special orders, and personal care goods
          (such as beauty products). We also do not accept returns for hazardous
          materials, flammable liquids, or gases.
        </p>
        <p>
          Unfortunately, we cannot accept returns on sale items or gift cards.
        </p>

        <h2 className="text-xl font-bold mt-8">Refunds</h2>
        <p>
          We will notify you once we've received and inspected your return, and
          let you know if the refund was approved or not. If approved, you'll be
          automatically credited to your bank account.
        </p>

        <h2 className="text-xl font-bold mt-8">Contact Us</h2>
        <p>
          You can always contact us for any return question at{" "}
          <a
            href="mailto:info@caviaarmode.com"
            className="text-blue-500 underline font-medium"
          >
            info@caviaarmode.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default CancellationsAndRefunds;
