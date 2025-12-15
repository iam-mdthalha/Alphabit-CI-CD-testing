import { Link } from "react-router-dom";
import { useGetListOfCategoriesQuery } from "Services/CategoryApiSlice";
import { toTitleCase } from "Utilities/ToTitleCase";

const CategoryListing = () => {
  const { data: categories, isLoading } = useGetListOfCategoriesQuery();

  return (
    <div className="w-full flex flex-row md:flex-col overflow-y-auto md:border-solid md:border-r-[1px] md:border-gray-300">
      {categories ? (
        categories.map((category, i) => {
          return (
            <div
              key={i}
              className="w-full px-4 py-2 font-medium text-center md:text-left rtl:text-right cursor-pointer hover:bg-gray-100 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-secondary-700 focus:text-secondary-700 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
            >
              <Link to={`/shop/${category.categoryCode}?page=1`}>
                {toTitleCase(category.categoryName)}
              </Link>
            </div>
          );
        })
      ) : (
        <p className="text-center font-semibold text-gray-400">
          No Categories found
        </p>
      )}
    </div>
  );
};

export default CategoryListing;
