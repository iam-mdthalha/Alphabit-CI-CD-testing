import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllAuthorsQuery } from "Services/Admin/AuthorApiSlice";

const PLANT = process.env.REACT_APP_PLANT;

const AuthorsView = () => {
  const { data: apiAuthors = [], isLoading } = useGetAllAuthorsQuery({
    plant: PLANT || "",
  });

  const authors = apiAuthors.map((author) => ({
    id: author.id,
    name: author.author,
  }));

  const [search, setSearch] = useState("");

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="font-gilroyRegular leading-wider bg-vintageBg py-3 md:py-12 px-6 lg:px-24 flex justify-center items-center min-h-96">
        <div className="text-vintageText text-lg">Loading authors...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 bg-vintageBg min-h-screen font-gilroyRegular tracking-wider">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-2">
          Explore Authors
        </h1>
        <p className="text-gray-600">Browse our collection of authors</p>
      </div>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 bg-vintageBg text-black placeholder:text-gray-700 border border-gray-700 border-opacity-50 rounded-xl px-2 lg:px-5 py-2 lg:py-3 focus:outline-none focus:ring-0"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {filteredAuthors.length === 0 && (
          <div className="col-span-full text-center text-gray-600">
            {authors.length === 0
              ? "No authors available."
              : "No authors found."}
          </div>
        )}

        {filteredAuthors.map((author) => (
          <Link
            key={author.id}
            to={`/books-listing?author=${encodeURIComponent(author.name)}`}
            className="min-w-[90vw] sm:min-w-[45vw] lg:min-w-[25vw] bg-vintageText hover:bg-opacity-90 text-vintageBg border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 block"
          >
            <h2 className="text-xl font-semibold text-center">{author.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AuthorsView;
