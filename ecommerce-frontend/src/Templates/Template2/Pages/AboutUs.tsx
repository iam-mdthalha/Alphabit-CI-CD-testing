import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen font-montserrat max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-2 uppercase text-center">About Us</h1>
      <p className="text-sm text-gray-500 mb-8 text-center">
        Last updated on Jun 25th 2025
      </p>

      <div className="space-y-6 text-gray-700 text-justify leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">About the Company</h2>
          <p>
            At <strong>Caviaar Mode</strong>, we believe fashion is more than just
            clothing - it's a reflection of your individuality, your lifestyle, and your
            confidence. We're a passionate team dedicated to curating the latest trends
            in fashion to help you express your unique style.
          </p>
          <p>
            From timeless classics to bold statement pieces, we offer a wide range of
            high-quality apparel and accessories designed to make you look and feel
            your best. We're committed to delivering an exceptional shopping experience
            with fast shipping, hassle-free returns, and customer service that cares.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">About the Shop</h2>
          <p>
            Welcome to <strong>Caviaar Mode</strong>, your one-stop destination for
            timeless fashion. We curate the finest styles for every occasion, offering
            pieces that combine elegance with effortless chic.
          </p>
          <p>
            Whether you're looking for a stunning dress, everyday essentials, or a
            statement to the world, our collection is designed to empower you to express
            your unique style.
          </p>
          <p>
            Our mission is simple: to deliver high-quality fashion that makes you feel
            confident and stunning, no matter the occasion. We believe fashion should be
            fun, easy, and most importantly, true to you.
          </p>
          <p>
            Explore our curated collections, and discover the perfect pieces to elevate
            your wardrobe.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Our Mission Statement</h2>
          <p>
            At <strong>Caviaar Mode</strong>, our mission is to empower individuals
            through timeless, sustainable fashion that celebrates diversity, confidence,
            and self-expression. We are committed to crafting high-quality,
            ethically-made garments that inspire creativity and support a more conscious
            world.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
