import React from "react";

interface CategoryCardProps {
  title?: string;
}

const LiteratureFictionSection: React.FC<CategoryCardProps> = ({
  title = "literary (fiction)",
}) => {
  return (
    <div className="w-full bg-vintageBg px-4 sm:px-6 md:px-10 py-8 sm:py-12 font-melodramaRegular font-bold">
      <div className="w-full mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl leading-snug text-vintageText">
          Explore Bookstores
        </h1>

        <p className="mt-3 text-base sm:text-lg md:text-xl font-gilroyRegular font-medium leading-relaxed">
          Save some cash and discover new books by browsing an individual
          Moore Market Private Limited booksellers&apos; inventory. Snag all the books you want from a
          single seller and only pay shipping once! Use the filters to see which
          sellers offer special discounts or even free shipping and find
          everything you&apos;re looking for.
        </p>
      </div>
    </div>
  );
};

export default LiteratureFictionSection;
