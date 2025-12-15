import { useGetListOfBannersQuery } from "Services/BannerApiSlice";
import { useGetNewArrivalsQuery } from "Services/ProductApiSlice";
import { useGetListOfSectionsQuery } from "Services/SectionApiSlice";
import { AppDispatch } from "State/store";
import CategoryListing from "Templates/Template1/Components/CategoryListing/CategoryListing";
import CircleLoader from "Templates/Template1/Components/CircleLoader/CircleLoader";
import ImageCarousel from "Templates/Template1/Components/ImageCarousel/ImageCarousel";
import NewCollections from "Templates/Template1/Components/NewCollections/NewCollections";
import SectionGrid from "Templates/Template1/Components/Sections/SectionGrid";
import { Suspense } from "react";
import { useDispatch } from "react-redux";
 
const SectionHome = () => {
  const dispatch: AppDispatch = useDispatch();

  const { data: banners, isLoading: bannerLoading } =
    useGetListOfBannersQuery();
  const { data: sections, isLoading: sectionLoading } =
    useGetListOfSectionsQuery();
  const newCollectionsLimit = 10;
  const { data: newCollections, isLoading: newCollectionsLoading } =
    useGetNewArrivalsQuery({ pageSize: 10, activePage: 1 });

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-y-10">
        {banners && banners.length > 0 && (
          <Suspense fallback={<CircleLoader />}>
            <div className="w-full flex flex-col md:flex-row justify-between gap-10 p-4 mt-10">
              <CategoryListing />
              <ImageCarousel banners={banners} />
            </div>
          </Suspense>
        )}
        {sections && sections.length > 0 && (
          <Suspense fallback={<CircleLoader />}>
            <SectionGrid sections={sections} />
          </Suspense>
        )}
        {newCollections && newCollections?.products.length > 0 && (
          <Suspense fallback={<CircleLoader />}>
            <NewCollections newCollections={newCollections} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default SectionHome;
