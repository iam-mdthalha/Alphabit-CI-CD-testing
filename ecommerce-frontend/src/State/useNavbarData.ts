import { useGetAllCategoriesQuery } from "Services/Admin/CategoryAdminApiSlice";
import { useGetAdminSubClassesQuery } from "Services/Admin/SubClassApiSlice";
import { useGetAllAuthorsQuery } from "Services/Admin/AuthorApiSlice";
import { useGetAllAcademicsQuery } from "Services/Admin/AcademicApiSlice";
import { useGetAllLanguagesQuery } from "Services/Admin/LanguageApiSlice";
import { useGetAllMerchandisesQuery } from "Services/Admin/MerchandiseApiSlice";
import { Category } from "Types/Navbar";

const PLANT = process.env.REACT_APP_PLANT;

export const useNavbarData = () => {
  const { data: categoriesData } = useGetAllCategoriesQuery();
  const { data: subClassesData } = useGetAdminSubClassesQuery();
  const {
    data: authorsData,
    isLoading,
    error,
  } = useGetAllAuthorsQuery({ plant: PLANT });
  const { data: languagesData } = useGetAllLanguagesQuery({ plant: PLANT });
  const { data: academicsData } = useGetAllAcademicsQuery({ plant: PLANT });
  const { data: merchandisesData } = useGetAllMerchandisesQuery({
    plant: PLANT,
  });

  const authors = authorsData?.map((author) => author.author) || [];
  const languages = languagesData?.map((lang) => lang.language) || [];
  const academics = academicsData?.map((aca) => aca.academic) || [];
  const merchandises =
    merchandisesData?.map((merch) => merch.merchandise) || [];

  const mappedCategories: Category[] =
    categoriesData?.map((cat) => {
      const subs =
        subClassesData?.results
          ?.filter((sub) => sub.categoryCode === cat.categoryCode)
          ?.map((sub) => ({
            name: sub.subClassName,
            code: sub.subClassCode,
          })) || [];

      return {
        name: cat.categoryName,
        code: cat.categoryCode,
        image: cat.imagePath,
        subs,
      };
    }) || [];

  return {
    mappedCategories,
    authors,
    languages,
    academics,
    merchandises,
    isLoading,
    error,
  };
};
