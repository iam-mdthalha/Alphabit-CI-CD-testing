import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllAcademicsQuery } from "Services/Admin/AcademicApiSlice";

const PLANT = process.env.REACT_APP_PLANT;

const AcademicView = () => {
  const { data: apiAcademics = [], isLoading } = useGetAllAcademicsQuery({
    plant: PLANT || "",
  });

  const academics = apiAcademics.map((academic) => ({
    id: academic.id,
    name: academic.academic,
  }));

  const [search, setSearch] = useState("");

  const filteredAcademics = academics.filter((academic) =>
    academic.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="px-6 py-12 bg-vintageBg min-h-screen font-gilroyRegular tracking-wider flex justify-center items-center">
        <div className="text-vintageText text-lg">Loading academics...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 bg-vintageBg min-h-screen font-gilroyRegular tracking-wider">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-2">
          Explore Academics
        </h1>
        <p className="text-gray-600">Browse our collection of academics</p>
      </div>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search academics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 bg-vintageBg text-black placeholder:text-gray-700 border border-gray-700 border-opacity-50 rounded-xl px-2 lg:px-5 py-2 lg:py-3 focus:outline-none focus:ring-0"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {filteredAcademics.length === 0 && (
          <div className="col-span-full text-center text-gray-600">
            {academics.length === 0
              ? "No academics available."
              : "No academics found."}
          </div>
        )}

        {filteredAcademics.map((academic) => (
          <Link
            key={academic.id}
            to={`/books-listing?academic=${academic.name}`}
            className="min-w-[90vw] sm:min-w-[45vw] lg:min-w-[25vw] bg-vintageText text-vintageBg hover:bg-opacity-90 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 block"
          >
            <h2 className="text-xl font-semibold text-center">
              {academic.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AcademicView;
