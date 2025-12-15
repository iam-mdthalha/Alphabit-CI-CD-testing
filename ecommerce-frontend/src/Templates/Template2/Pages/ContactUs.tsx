import React from "react";
import { Button } from "@mantine/core";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

const ContactUs = () => {
  const contactInfo = [
    {
      icon: <IconPhone size={24} />,
      title: "Call Us",
      value: "+91 8056892910",
      link: "tel:+918056892910",
      secondary: (
        <span className="flex items-center mt-2 text-sm text-green-500">
          <IconBrandWhatsapp className="mr-1" /> Available on WhatsApp
        </span>
      ),
    },
    {
      icon: <IconMail size={24} />,
      title: "Email Us",
      value: "info@caviaarmode.com",
      link: "mailto:info@caviaarmode.com",
      secondary: "Typically replies within 24 hours",
    },
    {
      icon: <IconMapPin size={24} />,
      title: "Visit Us",
      value: "No 23 Mookanaginatru Lane, Parangipettai",
      link: "",
      secondary: "Cuddalore, Tamil Nadu 608502",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-montserrat tracking-wider flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out to us through any of these
            channels.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((item, index) => (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 group"
            >
              <div className="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                {item.value}
              </p>
              {item.secondary && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {item.secondary}
                </p>
              )}
            </a>
          ))}
        </div>

        {/* Company Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Caviaar Mode
              </h2>
              <p className="text-gray-600 dark:text-gray-300">Since 2018</p>
            </div>

            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Business Hours
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monday - Friday: 9AM - 6PM
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Saturday: 10AM - 4PM
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Sunday: Closed
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                All Government Holidays: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Simple Email Form */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Send Us a Message
          </h2>
          <div className="max-w-md mx-auto">
            <a
              href="mailto:info@caviaarmode.com?subject=Enquiry from Caviaar Mode Website"
              className="w-full"
            >
              <Button
                fullWidth
                size="lg"
                radius="md"
                variant="outline"
                color="dark"
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Email Us Directly
              </Button>
            </a>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4 text-sm">
              Clicking this button will open your default email client
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
