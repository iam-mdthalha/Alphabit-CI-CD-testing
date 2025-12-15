import { ProductAdminRequestDTO } from "Interface/Admin/Products/admin-product.interface";
import React from "react";
import Select from "react-select";
import { useGetAllBrandsQuery } from "Services/Admin/BrandApiSlice";
import { useGetAllCategoriesQuery } from "Services/Admin/CategoryAdminApiSlice";
import { useGetAllModelsQuery } from "Services/Admin/ModelApiSlice";
import { useGetAllSubCategoriesQuery } from "Services/Admin/SubCategoryApiSlice";
import { useGetAdminSubClassesQuery } from "Services/Admin/SubClassApiSlice";
import { useGetAllAuthorsQuery } from "Services/Admin/AuthorApiSlice";
import { useGetAllLanguagesQuery } from "Services/Admin/LanguageApiSlice";
import { useGetAllAcademicsQuery } from "Services/Admin/AcademicApiSlice";
import { useGetAllMerchandisesQuery } from "Services/Admin/MerchandiseApiSlice";
import { Brand } from "Types/Admin/AdminBrandType";
import { CategoryAdminDTO } from "Types/Admin/AdminCategoryType";
import { Model } from "Types/Admin/AdminModelType";
import { SubCategoryAdminRequestDTO } from "Types/Admin/AdminSubCategoryType";
import { SubClassAdminRequestDTO } from "Types/Admin/AdminSubClassType";
import { AuthorReqDTO } from "Types/Admin/AdminAuthorType";
import { LanguageReqDTO } from "Types/Admin/AdminLanguageType";
import { AcademicReqDTO } from "Types/Admin/AdminAcademicType";
import { MerchandiseReqDTO } from "Types/Admin/AdminMerchandiseType";
import { notifications } from "@mantine/notifications";

interface CategoriesSectionProps {
  formData: ProductAdminRequestDTO;
  setFormData: React.Dispatch<React.SetStateAction<ProductAdminRequestDTO>>;
  mode: "add" | "edit" | "view";
  open: boolean;
  toggleSection: () => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  formData,
  setFormData,
  mode,
  open,
  toggleSection,
}) => {
  const { data: apiCategories, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery();
  const { data: apiSubCategories, isLoading: isLoadingSubCategories } =
    useGetAllSubCategoriesQuery();
  const { data: apiBrands, isLoading: isLoadingBrands } = useGetAllBrandsQuery({
    plant: process.env.REACT_APP_PLANT,
  });
  const { data: apiModels = [], isLoading: isLoadingModels } =
    useGetAllModelsQuery({ plant: process.env.REACT_APP_PLANT });
  const { data: subClassesData, isLoading: isLoadingSubClasses } =
    useGetAdminSubClassesQuery();
  const {
    data: authorsData,
    isLoading: isLoadingAuthors,
    error,
  } = useGetAllAuthorsQuery({
    plant: process.env.REACT_APP_PLANT,
  });
  const { data: languagesData, isLoading: isLoadingLanguages } =
    useGetAllLanguagesQuery({
      plant: process.env.REACT_APP_PLANT,
    });
  const { data: academicsData, isLoading: isLoadingAcademics } =
    useGetAllAcademicsQuery({
      plant: process.env.REACT_APP_PLANT,
    });
  const { data: merchandisesData, isLoading: isLoadingMerchandises } =
    useGetAllMerchandisesQuery({
      plant: process.env.REACT_APP_PLANT,
    });

  const categories: CategoryAdminDTO[] = apiCategories || [];
  const subCategories: SubCategoryAdminRequestDTO[] = apiSubCategories || [];
  const brands: Brand[] = apiBrands || [];
  const models: Model[] = apiModels || [];
  const allSubClasses: SubClassAdminRequestDTO[] =
    subClassesData?.results?.map(
      (item): SubClassAdminRequestDTO => ({
        subClassCode: item.subClassCode,
        subClassName: item.subClassName,
        categoryCode: item.categoryCode,
        isActive:
          typeof item.isActive === "boolean"
            ? String(item.isActive)
            : item.isActive,
      })
    ) || [];

  // Filter subclasses based on selected category
  const filteredSubClasses = formData.category
    ? allSubClasses.filter(
        (subClass) => subClass.categoryCode === formData.category
      )
    : [];

  const authors: AuthorReqDTO[] = authorsData || [];
  const languages: LanguageReqDTO[] = languagesData || [];
  const academics: AcademicReqDTO[] = academicsData || [];
  const merchandises: MerchandiseReqDTO[] = merchandisesData || [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubClassChange = (selectedOption: any) => {
    if (!formData.category) {
      notifications.show({
        title: "Category Required",
        message: "Please select a category first before choosing a sub category",
        color: "red",
        autoClose: 5000,
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      subClassId: selectedOption?.value || "",
    }));
  };

  return (
    <div className="font-gilroyRegular tracking-wider border rounded-md">
      <button
        type="button"
        onClick={toggleSection}
        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
      >
        <h3 className="text-lg font-medium">Categories</h3>
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-up h-5 w-5"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-down h-5 w-5"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Category*
            </label>
            <Select
              name="category"
              required
              value={
                categories.find((cat) => cat.categoryCode === formData.category)
                  ? {
                      value: formData.category,
                      label: categories.find(
                        (cat) => cat.categoryCode === formData.category
                      )?.categoryName,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                setFormData((prev) => ({
                  ...prev,
                  category: selectedOption?.value || "",
                  subClassId: "", // Reset sub class when category changes
                }));
              }}
              options={categories.map((category) => ({
                value: category.categoryCode,
                label: category.categoryName,
              }))}
              isDisabled={mode === "view" || isLoadingCategories}
              placeholder="Select a Category"
              className="text-sm"
              classNamePrefix="select"
              isSearchable
            />
            {isLoadingCategories && (
              <p className="text-sm text-gray-500 mt-1">
                Loading Categories...
              </p>
            )}
          </div>

          {process.env.REACT_APP_STORE_TYPE !== "book" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Sub Category
                </label>
                <Select
                  name="subCategory"
                  value={
                    subCategories.find(
                      (subCat) =>
                        subCat.subCategoryCode === formData.subCategory
                    )
                      ? {
                          value: formData.subCategory,
                          label: subCategories.find(
                            (subCat) =>
                              subCat.subCategoryCode === formData.subCategory
                          )?.subCategoryName,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setFormData((prev) => ({
                      ...prev,
                      subCategory: selectedOption?.value || "",
                    }));
                  }}
                  options={subCategories.map((subCategory) => ({
                    value: subCategory.subCategoryCode,
                    label: subCategory.subCategoryName,
                  }))}
                  isDisabled={mode === "view" || isLoadingSubCategories}
                  placeholder="Select a Sub Category"
                  className="text-sm"
                  classNamePrefix="select"
                  isSearchable
                />
                {isLoadingSubCategories && (
                  <p className="text-sm text-gray-500 mt-1">
                    Loading Sub Categories...
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Brand
                </label>
                <Select
                  name="brand"
                  value={
                    brands.find((brd) => brd.productBrandId === formData.brand)
                      ? {
                          value: formData.brand,
                          label: brands.find(
                            (brd) => brd.productBrandId === formData.brand
                          )?.productBrandDesc,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    setFormData((prev) => ({
                      ...prev,
                      brand: selectedOption?.value || "",
                    }));
                  }}
                  options={brands.map((brd) => ({
                    value: brd.productBrandId,
                    label: brd.productBrandDesc,
                  }))}
                  isDisabled={mode === "view" || isLoadingBrands}
                  placeholder="Select a Brand"
                  className="text-sm"
                  classNamePrefix="select"
                  isSearchable
                />
                {isLoadingBrands && (
                  <p className="text-sm text-gray-500 mt-1">
                    Loading Brands...
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Model
                </label>
                <select
                  name="model"
                  value={formData.model || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  disabled={mode === "view" || isLoadingModels}
                >
                  <option value="">Select a Model</option>
                  {models.map((model, index) => (
                    <option key={model.id || index} value={model.id.toString()}>
                      {model.prdModelDesc}
                    </option>
                  ))}
                </select>
                {isLoadingModels && (
                  <p className="text-sm text-gray-500 mt-1">
                    Loading Models...
                  </p>
                )}
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Sub Category
            </label>
            <Select
              name="subClass"
              required
              value={
                filteredSubClasses.find(
                  (subCls) => subCls.subClassCode === formData.subClassId
                )
                  ? {
                      value: formData.subClassId,
                      label: filteredSubClasses.find(
                        (subCls) => subCls.subClassCode === formData.subClassId
                      )?.subClassName,
                    }
                  : null
              }
              onChange={handleSubClassChange}
              options={filteredSubClasses.map((subClass) => ({
                value: subClass.subClassCode,
                label: subClass.subClassName,
              }))}
              isDisabled={
                mode === "view" || isLoadingSubClasses || !formData.category
              }
              placeholder={
                formData.category
                  ? "Select a Sub Category"
                  : "Select category first"
              }
              className="text-sm"
              classNamePrefix="select"
              isSearchable
            />
            {isLoadingSubClasses && (
              <p className="text-sm text-gray-500 mt-1">
                Loading Sub Categories...
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Author
            </label>
            <Select
              name="author"
              required
              value={
                authors.find((aut) => aut.author === formData.author)
                  ? {
                      value: formData.author,
                      label: authors.find(
                        (aut) => aut.author === formData.author
                      )?.author,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                setFormData((prev) => ({
                  ...prev,
                  author: selectedOption?.value || "",
                }));
              }}
              options={authors.map((author) => ({
                value: author.author,
                label: author.author,
              }))}
              isDisabled={mode === "view" || isLoadingAuthors}
              placeholder="Select a Author"
              className="text-sm"
              classNamePrefix="select"
              isSearchable
            />
            {isLoadingAuthors && (
              <p className="text-sm text-gray-500 mt-1">Loading Authors...</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Language
            </label>
            <Select
              name="language"
              required
              value={
                languages.find((lang) => lang.language === formData.language)
                  ? {
                      value: formData.language,
                      label: languages.find(
                        (lang) => lang.language === formData.language
                      )?.language,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                setFormData((prev) => ({
                  ...prev,
                  language: selectedOption?.value || "",
                }));
              }}
              options={languages.map((language) => ({
                value: language.language,
                label: language.language,
              }))}
              isDisabled={mode === "view" || isLoadingLanguages}
              placeholder="Select a Language"
              className="text-sm"
              classNamePrefix="select"
              isSearchable
            />
            {isLoadingLanguages && (
              <p className="text-sm text-gray-500 mt-1">Loading Languages...</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Academic
            </label>
            <Select
              name="academic"
              required
              value={
                academics.find((aca) => aca.academic === formData.academic)
                  ? {
                      value: formData.academic,
                      label: academics.find(
                        (aca) => aca.academic === formData.academic
                      )?.academic,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                setFormData((prev) => ({
                  ...prev,
                  academic: selectedOption?.value || "",
                }));
              }}
              options={academics.map((academic) => ({
                value: academic.academic,
                label: academic.academic,
              }))}
              isDisabled={mode === "view" || isLoadingAcademics}
              placeholder="Select a Academic"
              className="text-sm"
              classNamePrefix="select"
              isSearchable
            />
            {isLoadingAcademics && (
              <p className="text-sm text-gray-500 mt-1">Loading Academics...</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Merchandise
            </label>
            <Select
              name="merchandise"
              required
              value={
                merchandises.find(
                  (mer) => mer.merchandise === formData.merchandise
                )
                  ? {
                      value: formData.merchandise,
                      label: merchandises.find(
                        (mer) => mer.merchandise === formData.merchandise
                      )?.merchandise,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                setFormData((prev) => ({
                  ...prev,
                  merchandise: selectedOption?.value || "",
                }));
              }}
              options={merchandises.map((merchandise) => ({
                value: merchandise.merchandise,
                label: merchandise.merchandise,
              }))}
              isDisabled={mode === "view" || isLoadingMerchandises}
              placeholder="Select a Merchandise"
              className="text-sm"
              classNamePrefix="select"
              isSearchable
            />
            {isLoadingMerchandises && (
              <p className="text-sm text-gray-500 mt-1">
                Loading Merchandises...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
