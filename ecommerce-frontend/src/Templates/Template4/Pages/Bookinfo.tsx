import React from "react";

interface BookInfoProps {
  title?: string;
}
const BookInfo: React.FC<BookInfoProps> = ({ title }) => {
  return (
    <div className="bg-vintageBg  py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-[200px]">
        
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="bg-white rounded-lg shadow-md overflow-hidden w-64 transform -rotate-[10deg]">
            <img
              src="/template4/Books.jpg"
              alt="The Swimmers"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>

        <div className="w-full md:w-2/3 space-y-2">
             <h2 className="text-2xl md:text-3xl font-bold font-cardoRegular text-gray-900">
            What is a {title} book?
          </h2>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg font-cardoRegular">
            Literary fiction is a genre of fiction that emphasizes{" "}
            <strong>character development</strong> over plot. Unlike genre
            fiction, which is more concerned with specific storytelling
            conventions, literary fiction prioritizes the exploration of themes
            and emotions. As a result, literary fiction books are often heavily
            character-driven and can have little to no plot.
          </p>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg font-cardoRegular">
            For example, you can summarize{" "}
            <span className="text-vintageText underline cursor-pointer font-cardoRegular">
              The Swimmers
            </span>{" "}
            by{" "}
            <span className="text-vintageText underline cursor-pointer font-cardoRegular">
              Julie Otsuka
            </span>{" "}
            in one sentence: a group of regulars become concerned with a crack
            at the bottom of their pool, which then worsens one of the swimmers’s
            dementia.
          </p>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg font-cardoRegular">
            If <em>The Swimmers</em> were a{" "}
            <span className="text-vintageText underline cursor-pointer font-cardoRegular">
              mystery
            </span>{" "}
            or{" "}
            <span className="text-vintageText underline cursor-pointer font-cardoRegular">
              thriller
            </span>
            , the characters would band together to discover the nefarious reason
            for this attack on their beloved pool. If it were a{" "}
            <span className="text-green-600 underline cursor-pointer font-cardoRegular">
              fantasy
            </span>
            , they would discover a new world below the pool, with the crack
            acting as their portal.
          </p>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg font-cardoRegular">
            However, the point of <em>The Swimmers</em> isn’t the crack or why it
            appeared, but its effects on the lives of the people who frequent
            this pool. While genre fiction seeks to enthrall the reader with what
            is happening, literary fiction relies less on plot twists and focuses
            rather on how the characters feel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookInfo;
