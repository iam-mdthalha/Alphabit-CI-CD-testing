import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllCategoriesQuery } from "Services/Admin/CategoryAdminApiSlice";
import { useGetAdminSubClassesQuery } from "Services/Admin/SubClassApiSlice";

const CollectionsView = () => {
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: subClassesData } = useGetAdminSubClassesQuery();

  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const mappedCollections =
    categoriesData?.map((category) => {
      const subcategories =
        subClassesData?.results
          ?.filter(
            (subClass) => subClass.categoryCode === category.categoryCode
          )
          ?.map((subClass) => ({
            name: subClass.subClassName,
            code: subClass.subClassCode,
          })) || [];

      return {
        id: category.id || parseInt(category.categoryCode),
        name: category.categoryName,
        code: category.categoryCode,
        subcategories,
      };
    }) || [];

  const filteredCollections = mappedCollections
    .map((cat) => ({
      ...cat,
      matchedSubcategories: cat.subcategories.filter((sub) =>
        sub.name.toLowerCase().includes(search.toLowerCase())
      ),
      matched: cat.name.toLowerCase().includes(search.toLowerCase()),
    }))
    .filter((cat) => cat.matched || cat.matchedSubcategories.length > 0);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleCategoryClick = (categoryName: string) => {
    window.location.href = `/books-listing?category=${encodeURIComponent(
      categoryName
    )}`;
  };

  return (
    <div className="px-6 py-12 bg-vintageBg min-h-screen font-gilroyRegular tracking-wider">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-vintageText capitalize tracking-wider font-melodramaRegular mb-2">
          Explore Categories
        </h1>
        <p className="text-gray-600">Click a category to view subcategories</p>
      </div>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search category or subcategory..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 bg-vintageBg text-black placeholder:text-gray-700 border border-gray-700 border-opacity-50 rounded-xl px-2 lg:px-5 py-2 lg:py-3 focus:outline-none focus:ring-0"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {filteredCollections.length === 0 && (
          <div className="col-span-full text-center text-gray-600">
            No matching categories found.
          </div>
        )}

        {filteredCollections.map((cat) => (
          <div
            key={cat.id}
            className="min-w-[90vw] sm:min-w-[45vw] lg:min-w-[25vw] bg-vintageText hover:bg-opacity-90 text-vintageBg border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div
              className="cursor-pointer p-6 flex justify-between items-center"
              onClick={() => handleCategoryClick(cat.name)}
            >
              <div>
                <h2 className="text-xl font-semibold">{cat.name}</h2>
                <p className="text-sm text-vintageBg text-opacity-70">
                  {cat.subcategories.length} subcategories
                </p>
              </div>
              <div
                className="text-vintageBg font-bold text-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(cat.id);
                }}
              >
                {expanded === cat.id ? "-" : "+"}
              </div>
            </div>

            {expanded === cat.id && (
              <div className="px-6 pb-4">
                <ul className="space-y-2">
                  {(search ? cat.matchedSubcategories : cat.subcategories).map(
                    (sub, idx) => (
                      <li key={idx}>
                        <Link
                          to={`/books-listing?category=${encodeURIComponent(
                            cat.name
                          )}&subCategory=${encodeURIComponent(sub.code)}`}
                          className="text-vintageBg text-opacity-70 hover:text-text-opacity-40 transition duration-150"
                        >
                          ▸ {sub.name}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsView;
