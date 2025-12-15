import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaMoneyBill,
  FaCalendarAlt,
  FaInfoCircle,
  FaUserAlt,
  FaUsers,
  FaClock,
  FaBook,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { BookOpen } from "lucide-react";

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQData {
  [key: string]: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: "buying",
    name: "Buying Books",
    icon: <FaShoppingCart className="text-lg" />,
  },
  {
    id: "selling",
    name: "Selling Books",
    icon: <FaMoneyBill className="text-lg" />,
  },
  {
    id: "events",
    name: "Events & Community",
    icon: <FaCalendarAlt className="text-lg" />,
  },
  {
    id: "general",
    name: "General Info",
    icon: <FaInfoCircle className="text-lg" />,
  },
  {
    id: "account",
    name: "Account & Orders",
    icon: <FaUserAlt className="text-lg" />,
  },
];

const faqs: FAQData = {
  buying: [
    {
      id: 1,
      question: "How do I buy books?",
      answer:
        "Browse our extensive collection online or visit our physical store. You can search by genre, author, or title. Add books to your cart and proceed to checkout. We accept all major payment methods including cards, UPI, and cash on delivery.",
    },
    {
      id: 2,
      question: "Are the books in good condition?",
      answer:
        "We carefully inspect each book and provide condition ratings: Excellent, Very Good, Good, and Fair. Each listing includes detailed photos and condition descriptions so you know exactly what you're getting.",
    },
    {
      id: 3,
      question: "Do you offer book recommendations?",
      answer:
        "Yes! Our expert staff loves helping customers discover new reads. Tell us your preferences, and we'll suggest books tailored to your taste. We also have curated collections and monthly staff picks.",
    },
    {
      id: 4,
      question: "Can I return books if I'm not satisfied?",
      answer:
        "Absolutely! We offer a 7-day return policy for online purchases. Books must be in the same condition as received. For in-store purchases, bring your receipt within 3 days for exchanges or store credit.",
    },
  ],
  selling: [
    {
      id: 5,
      question: "How can I sell my books?",
      answer:
        "Bring your books to our store for evaluation, or upload photos online for a quick quote. We buy books in good condition across all genres. Payment is immediate - cash or bank transfer available.",
    },
    {
      id: 6,
      question: "What types of books do you accept?",
      answer:
        "We accept novels, textbooks, rare books, comics, magazines, and more. Books should be complete with minimal damage. We're especially interested in first editions, signed copies, and out-of-print titles.",
    },
    {
      id: 7,
      question: "How do you determine book prices?",
      answer:
        "Our pricing considers condition, rarity, demand, and current market value. Rare and first-edition books command higher prices. We use industry-standard pricing guides and real-time market data.",
    },
  ],
  events: [
    {
      id: 8,
      question: "What events do you host?",
      answer:
        "We regularly host author readings, book clubs, writing workshops, and literary discussions. Special events include book launches, poetry nights, and seasonal book fairs. Check our events calendar for updates.",
    },
    {
      id: 9,
      question: "How can I join book club meetings?",
      answer:
        "Our book clubs meet monthly and welcome all reading levels. Registration is free - just sign up online or in-store. We provide discussion guides and sometimes offer discounted books for club members.",
    },
    {
      id: 10,
      question: "Do you host private events?",
      answer:
        "Yes! We can arrange private book parties, author meet-and-greets, and corporate events. Contact us at least 2 weeks in advance to discuss your requirements and pricing.",
    },
  ],
  general: [
    {
      id: 11,
      question: "What are your operating hours?",
      answer:
        "We're open Monday-Sunday, 9:00 AM to 9:00 PM. Extended hours during book fairs and special events. Holiday hours may vary - check our website or call ahead.",
    },
    {
      id: 12,
      question: "Do you offer delivery services?",
      answer:
        "Yes! Free delivery within 5km for orders above ₹500. Express delivery available for urgent orders. We also ship nationwide with tracking provided for all orders.",
    },
    {
      id: 13,
      question: "Is parking available?",
      answer:
        "Free parking available for customers. 50+ spots including disabled parking. During peak hours, additional street parking is available nearby. Public transport connections are excellent.",
    },
  ],
  account: [
    {
      id: 14,
      question: "How do I create an account?",
      answer:
        "Click 'Sign Up' on our website or app. Provide your email, phone number, and create a password. Verify your email to activate your account and start enjoying member benefits like wishlists and order tracking.",
    },
    {
      id: 15,
      question: "Can I track my orders?",
      answer:
        "Yes! Once your order is confirmed, you'll receive tracking information via email and SMS. Log into your account to view real-time order status and delivery updates.",
    },
    {
      id: 16,
      question: "What payment methods do you accept?",
      answer:
        "We accept credit/debit cards, net banking, UPI, digital wallets, and cash on delivery. All transactions are secured with 256-bit SSL encryption for your safety.",
    },
  ],
};

const Faqs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("buying");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const toggleFaq = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (
      formData.name &&
      formData.email &&
      formData.subject &&
      formData.message
    ) {
      alert("Thank you for your message! We will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      alert("Please fill in all fields.");
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen font-gilroyRegular bg-vintageBg">
      <div className="px-6 lg:px-16 xl:px-24 py-10 bg-vintageBg">
        <div className="flex flex-col md:flex-row gap-2 rounded-3xl bg-vintageText shadow-lg text-vintageBg p-8 md:p-12 items-center">
          <div className="flex-1 flex flex-col text-left justify-center py-4 md:py-8 px-2 md:px-8">
            <BookOpen
              className="w-16 h-20 mb-6 text-vintageBg animate-bounce"
              data-aos="zoom-in"
            />
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 text-vintageBg font-melodramaRegular"
              style={{ lineHeight: 1.2 }}
              data-aos="fade-up"
            >
              Help & Support
            </h1>
            <p
              className="text-lg md:text-xl leading-relaxed text-vintageBg font-gilroyRegular"
              style={{ maxWidth: "800px" }}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Find answers to all your questions about Moore Market Private Limited. Can't find
              what you're looking for? Contact us!
            </p>
          </div>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12"
        data-aos="fade-up"
      >
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-2xl p-6 sticky top-8 border-2 border-[#326638]/20 bg-transparent">
              <h3 className="text-xl font-bold text-[#326638] mb-6 font-melodramaRegular">
                Browse Topics
              </h3>
              <div className="space-y-2">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setExpandedId(null);
                    }}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                      selectedCategory === category.id
                        ? "bg-[#326638] text-vintageBg shadow-lg"
                        : "text-[#326638] hover:bg-[#326638]/10"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span className="font-medium">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl p-8 border-2 border-[#326638]/20 bg-transparent">
              <h2 className="text-3xl md:text-4xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-8">
                {faqCategories.find((cat) => cat.id === selectedCategory)?.name}
              </h2>

              <div className="space-y-4">
                {faqs[selectedCategory]?.map((faq: FAQItem) => (
                  <div
                    key={faq.id}
                    className="border-2 border-[#326638]/20 rounded-xl overflow-hidden text-vintageBg"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left p-6 hover:bg-[#326638]/5 transition-colors flex justify-between items-center"
                    >
                      <span className="font-semibold text-[#326638] text-lg pr-4 font-melodramaRegular">
                        {faq.question}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-[#326638] transition-transform ${
                          expandedId === faq.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        expandedId === faq.id
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="p-6 border-t-2 border-[#326638]/20 bg-vintageBg">
                          <p className="text-gray-700 leading-relaxed text-sm md:text-lg text-justify font-gilroyRegular">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-16 xl:px-24 py-10 bg-vintageBg">
        <div className="flex flex-col md:flex-row gap-2 rounded-3xl bg-vintageText shadow-lg text-vintageBg p-8 md:p-12 items-center">
          <div className="flex-1 flex flex-col text-left justify-center py-4 md:py-8 px-2 md:px-8">
            <div className="rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl md:text-4xl font-bold text-vintageBg capitalize tracking-wider font-melodramaRegular">
                  We're happy to help you
                </h2>
              </div>
              <p className="text-vintageBg/90 mb-8 text-lg text-justify font-gilroyRegular">
                Drop your query and our team will get back within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-vintageBg font-semibold mb-2 text-sm font-gilroyRegular">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-vintageBg/30 rounded-xl focus:border-vintageBg focus:outline-none transition-colors bg-transparent placeholder:text-vintageBg/70 text-vintageBg font-gilroyRegular"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-vintageBg font-semibold mb-2 text-sm font-gilroyRegular">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-4 border-2 border-vintageBg/30 rounded-xl focus:border-vintageBg focus:outline-none transition-colors bg-transparent placeholder:text-vintageBg/70 text-vintageBg font-gilroyRegular"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-vintageBg font-semibold mb-2 text-sm font-gilroyRegular">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-4 border-2 border-vintageBg/30 rounded-xl focus:outline-none focus:border-vintageBg transition-colors bg-transparent text-vintageBg font-gilroyRegular"
                  >
                    <option value="" className="text-gray-800">
                      Select a topic
                    </option>
                    <option value="buying" className="text-gray-800">
                      Book Buying Inquiry
                    </option>
                    <option value="selling" className="text-gray-800">
                      Book Selling Inquiry
                    </option>
                    <option value="events" className="text-gray-800">
                      Events & Community
                    </option>
                    <option value="technical" className="text-gray-800">
                      Technical Support
                    </option>
                    <option value="other" className="text-gray-800">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-vintageBg font-semibold mb-2 text-sm font-gilroyRegular">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full p-4 border-2 border-vintageBg/30 rounded-xl focus:outline-none focus:border-vintageBg transition-colors resize-none bg-transparent placeholder:text-vintageBg/70 text-vintageBg font-gilroyRegular"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-vintageBg text-[#326638] font-bold py-4 px-8 rounded-xl hover:bg-white transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-gilroyRegular"
                >
                  Send Message
                </button>
              </div>
            </div>

            <div className="text-vintageBg ">
              <div className="mb-8 p-6 bg-[#4A7B52] rounded-2xl shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center font-melodramaRegular">
                  <FaBook className="mr-3" /> Book Lovers Community
                </h3>
                <p className="text-lg opacity-90 mb-4 font-gilroyRegular">
                  Join our community of passionate readers and get access to
                  exclusive content, early book releases, and member-only
                  events.
                </p>
                <div className="flex items-center text-sm font-gilroyRegular">
                  <div className="bg-[#326638] rounded-full p-2 mr-3">
                    <FaUsers className="text-lg" />
                  </div>
                  <span>5,000+ active members</span>
                </div>
              </div>

              <div className="space-y-6 font-gilroyRegular">
                <div className="flex items-start">
                  <div className="bg-[#4A7B52] rounded-full p-3 mr-4 flex-shrink-0">
                    <FaClock />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 font-melodramaRegular">
                      Quick Response Guarantee
                    </h3>
                    <p className="opacity-90 font-gilroyRegular">
                      Our dedicated support team responds to all inquiries
                      within 24 hours, usually much sooner.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#4A7B52] rounded-full p-3 mr-4 flex-shrink-0">
                    <FaBook />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 font-melodramaRegular">
                      Expert Book Advice
                    </h3>
                    <p className="opacity-90 font-gilroyRegular">
                      Get personalized recommendations and expert advice from
                      our passionate team of book lovers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#4A7B52] rounded-full p-3 mr-4 flex-shrink-0">
                    <FaUsers />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 font-melodramaRegular">
                      Community Support
                    </h3>
                    <p className="opacity-90 font-gilroyRegular">
                      Join thousands of book enthusiasts in our community forums
                      and events.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
