import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllCategoriesQuery } from "Services/Admin/CategoryAdminApiSlice";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import { CategoryAdminDTO } from "Types/Admin/AdminCategoryType";
import CustomButton from "../../../../Components/StyleComponent/CustomButton";

const CollectionList = () => {
  const {
    data: apiCategories,
    isLoading,
    refetch,
  } = useGetAllCategoriesQuery();

  const categories: CategoryAdminDTO[] = apiCategories || [];

  const [imageLoadedMap, setImageLoadedMap] = useState<Record<string, boolean>>(
    {}
  );

  const handleImageLoad = (categoryCode: string) => {
    setImageLoadedMap((prev) => ({ ...prev, [categoryCode]: true }));
  };

  

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold uppercase tracking-widest mb-8 text-center">
        Collection List
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.length > 0 ? (
          isLoading ? (
            <div className="col-span-full text-center min-h-[40vh] flex items-center justify-center">
              <CircleLoader />
            </div>
          ) : (
            categories.map((category) => {
              const isImageLoaded =
                imageLoadedMap[category.categoryCode] ?? false;

              return (
                <Link
                  to={`/shop/${category.categoryCode}?page=1`}
                  key={category.categoryCode}
                  className="relative overflow-hidden group min-h-[50vh]"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {!isImageLoaded && <CircleLoader />}
                  <img
                    src={category.imagePath ?? undefined}
                    alt={category.categoryName}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      isImageLoaded ? "block" : "hidden"
                    }`}
                    onLoad={() => handleImageLoad(category.categoryCode)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-end items-start p-2 md:p-6 pb-6">
                    <h3 className="text-md md:text-2xl font-bold uppercase tracking-widest text-white mb-2 md:mb-4">
                      {category.categoryName}
                    </h3>
                    <CustomButton>view {category.categoryName}</CustomButton>
                  </div>
                </Link>
              );
            })
          )
        ) : (
          <div className="col-span-full text-center min-h-[40vh] flex items-center justify-center">
            <p className="text-gray-500 text-lg">No collections found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionList;
