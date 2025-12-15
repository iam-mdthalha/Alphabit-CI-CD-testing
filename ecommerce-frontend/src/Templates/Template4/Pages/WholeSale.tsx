
import React, { useState } from "react";
import {
  CheckCircle,
  User,
  CreditCard,
  Package,
  Truck,
  Book,
  Check,
  Plus,
  Trash2,
  Search,
  ArrowLeft,
} from "lucide-react";

const steps = [
  "Register / Login",
  "Pricing & MOQ",
  "Bulk Order",
  "Payment & Shipping",
  "Confirmation",
];

interface OrderItem {
  title: string;
  isbn: string;
  quantity: number;
  price: number;
}

interface FormData {
  email: string;
  password: string;
  companyName: string;
  businessType: string;
}

const WholeSale = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { title: "", isbn: "", quantity: 1, price: 0 },
  ]);
  const [userType, setUserType] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    companyName: "",
    businessType: "",
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      { title: "", isbn: "", quantity: 1, price: 0 },
    ]);
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const updateOrderItem = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    const updated = orderItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setOrderItems(updated);
  };

  const getTotalQuantity = () => {
    return orderItems.reduce(
      (sum, item) => sum + parseInt(item.quantity.toString() || "0"),
      0
    );
  };

  const getDiscount = () => {
    const total = getTotalQuantity();
    if (total >= 100) return 30;
    if (total >= 51) return 20;
    if (total >= 10) return 10;
    return 0;
  };

  const getTotalPrice = () => {
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = getDiscount();
    return subtotal - (subtotal * discount) / 100;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return userType && formData.email && formData.password;
      case 1:
        return true;
      case 2:
        return orderItems.some((item) => item.title && item.quantity > 0);
      case 3:
        return selectedPayment && selectedShipping;
      default:
        return true;
    }
  };

  React.useEffect(() => {
    import("aos").then((AOS) => {
      AOS.init({ once: true, duration: 800 });
    });
  }, []);

  return (
    <div className="min-h-screen bg-vintageBg font-gilroyRegular leading-wider py-3 md:py-12 px-6 lg:px-24">
      <div
        className="max-w-8xl mx-auto mb-8 bg-vintageText text-vintageBg rounded-3xl shadow-lg p-8"
        data-aos="fade-up"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center tracking-wider font-melodramaRegular mb-4">
          Our Wholesale
        </h1>
        <p className="text-center text-lg opacity-90 mb-8">
          Your trusted partner for bulk book purchases
        </p>

                

      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center relative"
            >
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 ${
                    index < currentStep ? "bg-vintageBg" : "bg-vintageBg/30"
                  }`}
                  style={{ zIndex: 1 }}
                />
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 relative z-10 transition-all duration-300
                ${
                  index < currentStep
                    ? "bg-vintageBg text-vintageText border-vintageBg"
                    : index === currentStep
                    ? "bg-vintageText text-vintageBg border-vintageBg ring-2 ring-vintageBg/50"
                    : "bg-vintageText border-vintageBg/50 text-vintageBg/50"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  index + 1
                )}
              </div>
              <p
                className={`mt-2 text-xs sm:text-sm text-center max-w-20 transition-all duration-300 ${
                  index === currentStep
                    ? "font-bold text-vintageBg"
                    : index < currentStep
                    ? "text-vintageBg"
                    : "text-vintageBg/60"
                }`}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-8xl mx-auto bg-vintageBg text-vintageText rounded-2xl shadow-2xl overflow-hidden">
        {currentStep > 0 && currentStep < 4 && (
          <button
            onClick={prevStep}
            className="absolute mt-4 ml-4 p-2 rounded-full bg-vintageText text-vintageBg hover:bg-vintageText transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="p-5 sm:p-8">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-8 h-8 text-vintageText" />
                <h2 className="text-2xl md:text-3xl font-bold text-vintageText text-center capitalize tracking-wider font-melodramaRegular">
                  Register / Login
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Account Type</h3>
                  <div className="space-y-3">
                    {["existing", "new"].map((type) => (
                      <label
                        key={type}
                        className="flex items-center p-4 border-2 border-vintageText/20 rounded-lg cursor-pointer hover:bg-vintageText/5 transition-colors"
                      >
                        <input
                          type="radio"
                          name="userType"
                          value={type}
                          checked={userType === type}
                          onChange={(e) => setUserType(e.target.value)}
                          className="mr-3 w-5 h-5 text-vintageText focus:ring-green-500"
                        />
                        <span className="font-medium">
                          {type === "existing"
                            ? "I have an existing account"
                            : "Create new wholesale account"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Account Details
                  </h3>
                  <input
                    type="email"
                    placeholder="Business Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-4 border-1 border-gray-500 focus:ring-1 bg-vintageBg rounded-lg outline-none"
                  />
                  <input
                    type="password"
                    placeholder={
                      userType === "existing" ? "Password" : "Create Password"
                    }
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-4 border-1 border-gray-500 focus:ring-1 bg-vintageBg rounded-lg outline-none"
                  />
                  {userType === "new" && (
                    <>
                      <input
                        type="text"
                        placeholder="Company/Organization Name"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                        className="w-full p-4 border-1 border-gray-500 focus:ring-1 bg-vintageBg rounded-lg outline-none"
                      />
                      <select
                        value={formData.businessType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessType: e.target.value,
                          })
                        }
                        className="w-full p-4 border-1 border-gray-500 focus:ring-1 bg-vintageBg rounded-lg outline-none"
                      >
                        <option
                          value=""
                          className="bg-vintageBg text-vintageText hover:bg-vintageBg"
                        >
                          Select Business Type
                        </option>
                        <option
                          value="bookstore"
                          className="bg-vintageBg text-vintageText"
                        >
                          Bookstore
                        </option>
                        <option
                          value="library"
                          className="bg-vintageBg text-vintageText"
                        >
                          Library
                        </option>
                        <option
                          value="school"
                          className="bg-vintageBg text-vintageText"
                        >
                          Educational Institution
                        </option>
                        <option
                          value="distributor"
                          className="bg-vintageBg text-vintageText"
                        >
                          Distributor
                        </option>
                        <option
                          value="other"
                          className="bg-vintageBg text-vintageText"
                        >
                          Other
                        </option>
                      </select>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 p-10">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-8 h-8 text-vintageText" />
                <h2 className="text-2xl md:text-3xl font-bold text-vintageText text-center capitalize tracking-wider font-melodramaRegular">
                  Wholesale Pricing & MOQ
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-vintageText">
                    Volume Discounts
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        range: "10-50 Books",
                        discount: "10%",
                        icon: <Book className="text-vintageText w-7 h-7" />,
                      },
                      {
                        range: "51-100 Books",
                        discount: "20%",
                        icon: <Package className="text-vintageText w-7 h-7" />,
                      },
                      {
                        range: "100+ Books",
                        discount: "30%",
                        icon: <Truck className="text-vintageText w-7 h-7" />,
                      },
                    ].map((tier, index) => (
                      <div
                        key={index}
                        className="p-4 bg-light bg-opacity-50 rounded-lg border-2 border-green-500/20 hover:border-green-500/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span>{tier.icon}</span>
                            <span className="font-medium">{tier.range}</span>
                          </div>
                          <span className="text-xl font-bold text-vintageText">
                            {tier.discount} Off
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-vintageText">
                    Additional Benefits
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Free shipping on orders over $500",
                      "Dedicated account manager",
                      "Priority customer support",
                      "Flexible payment terms",
                      "Bulk ISBN lookup tools",
                      "Custom cataloging services",
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3 p-2">
                        <Check className="w-5 h-5 text-vintageText" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-vintageText rounded-lg border border-green-200">
                <h4 className="font-bold text-lg mb-2 text-vintageBg">
                  Getting Started
                </h4>
                <p className="text-vintageBg">
                  Our wholesale program is designed for businesses purchasing 10
                  or more books. Start building your order in the next step and
                  see your savings automatically calculated.
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Search className="w-8 h-8 text-vintageText" />
                  <h2 className="text-2xl md:text-3xl font-bold text-vintageText text-center capitalize tracking-wider font-melodramaRegular">
                    Build Your Bulk Order
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-sm text-vintageText/70">
                    Total Quantity
                  </div>
                  <div className="text-2xl font-bold">{getTotalQuantity()}</div>
                  {getDiscount() > 0 && (
                    <div className="text-sm text-vintageText font-medium">
                      {getDiscount()}% Discount
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-light bg-opacity-50 rounded-lg border-2 border-green-500/20"
                  >
                    <div className="md:col-span-4">
                      <input
                        type="text"
                        placeholder="Book Title"
                        value={item.title}
                        onChange={(e) =>
                          updateOrderItem(index, "title", e.target.value)
                        }
                        className="w-full p-3 border border-vintageText/20 rounded-lg bg-vintageBg bg-opacity-50 focus:border-green-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        type="text"
                        placeholder="ISBN (optional)"
                        value={item.isbn}
                        onChange={(e) =>
                          updateOrderItem(index, "isbn", e.target.value)
                        }
                        className="w-full p-3 border border-vintageText/20 rounded-lg bg-vintageBg bg-opacity-50 focus:border-green-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateOrderItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full p-3 border border-vintageText/20 rounded-lg bg-vintageBg bg-opacity-50 focus:border-green-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <input
                        type="number"
                        placeholder="Price $"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          updateOrderItem(
                            index,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full p-3 border border-vintageText/20 rounded-lg bg-vintageBg bg-opacity-50 focus:border-green-500 outline-none"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-center justify-center">
                      <button
                        onClick={() => removeOrderItem(index)}
                        disabled={orderItems.length === 1}
                        className={`p-3 rounded-lg ${
                          orderItems.length === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addOrderItem}
                  className="w-full p-4 border-2 text-vintageText border-dashed hover:text-vintageBg border-green-500/30 rounded-lg hover:border-vintageText hover:bg-vintageText transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5 text-vintageText hover:text-vintageBg " />
                  Add Another Book
                </button>
              </div>

              {getTotalQuantity() > 0 && (
                <div className="p-6 bg-vintageText rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-vintageBg">
                        Order Summary
                      </div>
                      <div className="text-sm text-vintageBg">
                        {getTotalQuantity()} books • {getDiscount()}% wholesale
                        discount
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-vintageBg">
                        ${getTotalPrice().toFixed(2)}
                      </div>
                      {getDiscount() > 0 && (
                        <div className="text-sm text-vintageBg">
                          You save $
                          {(
                            (orderItems.reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            ) *
                              getDiscount()) /
                            100
                          ).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 p-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-8 h-8 text-vintageText" />
                <h2 className="text-2xl md:text-3xl font-bold text-vintageText text-center capitalize tracking-wider font-melodramaRegular">
                  Payment & Shipping
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {[
                      {
                        id: "transfer",
                        label: "Bank Transfer (Wire)",
                        desc: "Secure bank-to-bank transfer",
                      },
                      {
                        id: "card",
                        label: "Credit / Debit Card",
                        desc: "Visa, MasterCard, American Express",
                      },
                      {
                        id: "invoice",
                        label: "Invoice (Net 30)",
                        desc: "For qualified business accounts",
                      },
                      {
                        id: "check",
                        label: "Company Check",
                        desc: "Mail payment with order",
                      },
                    ].map((payment) => (
                      <label
                        key={payment.id}
                        className="group flex items-start p-4 border-2 border-green-500/20 rounded-lg cursor-pointer transition-colors hover:bg-vintageText"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={payment.id}
                          checked={selectedPayment === payment.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="mr-3 mt-1 w-5 h-5 text-vintageText focus:ring-green-500"
                        />
                        <div>
                          <div className="font-medium text-vintageText group-hover:text-vintageBg">
                            {payment.label}
                          </div>
                          <div className="text-sm text-vintageText/70 group-hover:text-vintageBg">
                            {payment.desc}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">
                    Shipping Options
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        id: "standard",
                        label: "Standard Shipping",
                        desc: "5-7 business days • FREE over $500",
                        price: "$25",
                      },
                      {
                        id: "expedited",
                        label: "Expedited Shipping",
                        desc: "2-3 business days",
                        price: "$75",
                      },
                      {
                        id: "overnight",
                        label: "Overnight Express",
                        desc: "Next business day",
                        price: "$150",
                      },
                      {
                        id: "pickup",
                        label: "Local Pickup",
                        desc: "Pick up at our warehouse",
                        price: "FREE",
                      },
                    ].map((shipping) => (
                      <label
                        key={shipping.id}
                        className="group flex items-start justify-between p-4 border-2 border-green-500/20 rounded-lg cursor-pointer hover:bg-vintageText transition-colors"
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="shipping"
                            value={shipping.id}
                            checked={selectedShipping === shipping.id}
                            onChange={(e) =>
                              setSelectedShipping(e.target.value)
                            }
                            className="mr-3 mt-1 w-5 h-5 text-vintageText focus:ring-green-500"
                          />
                          <div>
                            <div className="font-medium text-vintageText group-hover:text-vintageBg">
                              {shipping.label}
                            </div>
                            <div className="text-sm text-vintageText/70 group-hover:text-vintageBg">
                              {shipping.desc}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-vintageText group-hover:text-vintageBg">
                          {shipping.price}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-vintageText rounded-lg border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-6 h-6 text-vintageBg" />
                  <h4 className="font-bold text-lg text-vintageBg">
                    Shipping Information
                  </h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Shipping Address"
                    className="p-3 border border-vintageText/20 rounded-lg bg-vintageBg outline-none"
                  />
                  <input
                    type="text"
                    placeholder="City, State, ZIP"
                    className="p-3 border border-vintageText/20 rounded-lg bg-vintageBg outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-vintageText" />
              </div>

              <h2 className="text-3xl font-bold text-vintageText">
                Order Submitted Successfully! 🎉
              </h2>

              <div className="max-w-2xl mx-auto space-y-4">
                <p className="text-lg">
                  Thank you for your wholesale order request. Your order details
                  have been received and are being processed.
                </p>

                <div className="bg-vintageText p-6 text-vintageBg rounded-lg border border-green-200">
                  <h3 className="font-bold text-lg mb-3 text-vintageBg">
                    What happens next?
                  </h3>
                  <div className="text-left space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-vintageText text-vintageBg rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <span>Our team reviews your order within 2-4 hours</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-vintageText text-vintageBg rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <span>We confirm availability and finalize pricing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-vintageText text-vintageBg rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <span>You'll receive a detailed quote via email</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-vintageText text-vintageBg  rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <span>Upon approval, we process and ship your order</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/track-order"
                    className="bg-vintageText text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-colors inline-block"
                  >
                    Track Your Order
                  </a>

                  <button
                    onClick={() => {
                      setCurrentStep(0);
                      setOrderItems([
                        { title: "", isbn: "", quantity: 1, price: 0 },
                      ]);
                      setSelectedPayment("");
                      setSelectedShipping("");
                    }}
                    className="border-2 border-green-600 text-vintageText px-8 py-3 rounded-lg hover:bg-vintageText hover:text-white transition-colors"
                  >
                    Place Another Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {currentStep < 4 && (
          <div className="bg-vintageText/5 p-6 flex justify-between items-center">
            <div className="text-center text-sm text-vintageText/70 flex-1 text-left">
              Step {currentStep + 1} of {steps.length}
            </div>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-lg shadow transition-colors ${
                canProceed()
                  ? "bg-vintageText hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {currentStep === steps.length - 2 ? "Submit Order" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WholeSale;
