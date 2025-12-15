// ALL API
import { useGetAllBrandsQuery } from "Services/Admin/BrandApiSlice";
import { useGetAllCategoriesQuery } from "Services/Admin/CategoryAdminApiSlice";
import { useGetAllAdminProductsQuery } from "Services/Admin/ProductAdminApiSlice";
import { useGetAllSubCategoriesQuery } from "Services/Admin/SubCategoryApiSlice";
// ALL TYPES
import { Brand } from "Types/Admin/AdminBrandType";
import { CategoryAdminDTO } from "Types/Admin/AdminCategoryType";
import { SubCategoryAdminRequestDTO } from "Types/Admin/AdminSubCategoryType";
import { ProductMetaDTO } from "Types/ProductMetaDTO";

interface ActionsProps {
  onFilterChange: (name: string, value: string) => void;
  mode?: string;
  formData: {
    category: string;
    subCategory: string;
    brand: string;
    productName?: string;
  };
}

const PLANT = process.env.REACT_APP_PLANT;

export const SectionProductActions = ({
  onFilterChange,
  mode,
  formData,
}: ActionsProps) => {
  const { data: apiCategories, isLoading: isLoadingCategories } =
    useGetAllCategoriesQuery();
  const { data: apiSubCategories, isLoading: isLoadingSubCategories } =
    useGetAllSubCategoriesQuery();
  const { data: apiBrands, isLoading: isLoadingBrands } = useGetAllBrandsQuery({
    plant: PLANT,
  });
  const { data: productsData, isLoading: isLoadingProducts } =
    useGetAllAdminProductsQuery({
      category: formData.category || "",
      subCategory: formData.subCategory || "",
      brand: formData.brand || "",
      activePage: 1,
      pageSize: 1000,
    });

  const categories: CategoryAdminDTO[] = apiCategories || [];
  const subCategories: SubCategoryAdminRequestDTO[] = apiSubCategories || [];
  const brands: Brand[] = apiBrands || [];
  const products: ProductMetaDTO[] = productsData?.products || [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <>
      <div className="font-gilroyRegular tracking-wider grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            className="w-full px-3 py-2 border rounded-md text-sm border-gray-300 focus:outline-none focus:ring-0"
            disabled={mode === "view"}
            value={formData.productName || ""}
            onChange={handleChange}
            placeholder="Search by product name..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-sm"
            disabled={mode === "view" || isLoadingCategories}
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.categoryCode} value={category.categoryCode}>
                {category.categoryName}
              </option>
            ))}
          </select>
          {isLoadingCategories && (
            <p className="text-sm text-gray-500 mt-1">Loading Categories...</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Sub Category
          </label>
          <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-sm"
            disabled={mode === "view" || isLoadingSubCategories}
          >
            <option value="">Select a Sub Category</option>
            {subCategories.map((subCategory) => (
              <option
                key={subCategory.subCategoryCode}
                value={subCategory.subCategoryCode}
              >
                {subCategory.subCategoryName}
              </option>
            ))}
          </select>
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
          <select
            name="brand"
            value={formData.brand || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md text-sm"
            disabled={mode === "view" || isLoadingBrands}
          >
            <option value="">Select a Brand</option>
            {brands.map((brand, index) => (
              <option key={brand.id || index} value={brand.id}>
                {brand.productBrandDesc}
              </option>
            ))}
          </select>
          {isLoadingBrands && (
            <p className="text-sm text-gray-500 mt-1">Loading Brands...</p>
          )}
        </div>
      </div>
    </>
  );
};
