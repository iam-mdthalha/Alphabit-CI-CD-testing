import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllMerchandisesQuery } from "Services/Admin/MerchandiseApiSlice";

const PLANT = process.env.REACT_APP_PLANT;

const MerchandiseView = () => {
  const { data: apiMerchandises = [], isLoading } = useGetAllMerchandisesQuery({
    plant: PLANT || "",
  });

  const merchandises = apiMerchandises.map((item) => ({
    id: item.id,
    name: item.merchandise,
  }));

  const [search, setSearch] = useState("");

  const filteredMerchandises = merchandises.filter((merch) =>
    merch.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="px-6 py-12 bg-vintageBg min-h-screen font-gilroyRegular tracking-wider flex justify-center items-center">
        <div className="text-vintageText text-lg">Loading merchandise...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 bg-vintageBg min-h-screen font-gilroyRegular tracking-wider">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-2">
          Explore Merchandise
        </h1>
        <p className="text-gray-600">Browse our collection of merchandise</p>
      </div>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search merchandise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 bg-vintageBg text-black placeholder:text-gray-700 border border-gray-700 border-opacity-50 rounded-xl px-2 lg:px-5 py-2 lg:py-3 focus:outline-none focus:ring-0"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {filteredMerchandises.length === 0 && (
          <div className="col-span-full text-center text-gray-600">
            {merchandises.length === 0
              ? "No merchandise available."
              : "No merchandise found."}
          </div>
        )}

        {filteredMerchandises.map((merch) => (
          <Link
            key={merch.id}
            to={`/books-listing?merchandise=${merch.name}`}
            className="min-w-[90vw] sm:min-w-[45vw] lg:min-w-[25vw] bg-vintageText hover:bg-opacity-90 text-vintageBg border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 block"
          >
            <h2 className="text-xl font-semibold text-center">{merch.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MerchandiseView;
