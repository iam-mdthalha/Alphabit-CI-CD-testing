import { SectionProductActions } from "Components/Admin/AdminSection/SectionProductActions";
import { useEffect, useState } from "react";
import { useGetAllAdminProductsQuery } from "Services/Admin/ProductAdminApiSlice";

interface SectionProductTableProps {
  mode?: string;
  formData: {
    category: string;
    subCategory: string;
    brand: string;
    productName?: string;
  };
  onFilterChange: (name: string, value: string) => void;
  onSelectionChange?: (productIds: string[]) => void;
  initialSelectedProducts?: string[];
}

export const SectionProductTable: React.FC<SectionProductTableProps> = ({
  mode,
  formData,
  onFilterChange,
  onSelectionChange,
  initialSelectedProducts = [],
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const [formData, setFormData] = useState({
  //   category: "",
  //   subCategory: "",
  //   brand: "",
  // });

  const { data: productPacker, isLoading } = useGetAllAdminProductsQuery({
    category: formData.category || "",
    subCategory: formData.subCategory || "",
    brand: formData.brand || "",
    activePage: currentPage,
    pageSize: itemsPerPage,
  });

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedProductItem, setSelectedProductItem] = useState<string | null>(
    null
  );
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  // Filter products by product name if provided
  let filteredProducts = productPacker?.products || [];
  const productNameFilter = formData.productName
    ? formData.productName.trim()
    : "";
  if (productNameFilter !== "") {
    filteredProducts = filteredProducts.filter((product) =>
      product.product.itemDesc
        .toLowerCase()
        .includes(productNameFilter.toLowerCase())
    );
  }

  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    initialSelectedProducts || []
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startItem =
    filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  useEffect(() => {
    if (initialSelectedProducts && initialSelectedProducts.length > 0) {
      setSelectedProducts(initialSelectedProducts);
    }
  }, [initialSelectedProducts]);

  const handleSelectAll = () => {
    const currentPageProductItems = filteredProducts
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((product) => product.product.item.toString());

    let newSelectedProducts: string[];

    if (!selectAll) {
      newSelectedProducts = Array.from(
        new Set([...selectedProducts, ...currentPageProductItems])
      );
    } else {
      newSelectedProducts = selectedProducts.filter(
        (item) => !currentPageProductItems.includes(item)
      );
    }

    setSelectedProducts(newSelectedProducts);
    onSelectionChange?.(newSelectedProducts);

    if (newSelectedProducts.length > 0 && !selectAll) {
      setSelectedProductItem(currentPageProductItems[0]);
    } else if (newSelectedProducts.length === 0) {
      setSelectedProductItem(null);
    }
  };

  const handleSelectProduct = (item: string, checked: boolean) => {
    let newSelectedProducts: string[];

    if (checked) {
      newSelectedProducts = [...selectedProducts, item];
    } else {
      newSelectedProducts = selectedProducts.filter(
        (productItem) => productItem !== item
      );
    }

    setSelectedProducts(newSelectedProducts);
    onSelectionChange?.(newSelectedProducts);

    if (newSelectedProducts.length > 0) {
      setSelectedProductItem(newSelectedProducts[0]);
    } else {
      setSelectedProductItem(null);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    onFilterChange(name, value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const currentPageProductItems = filteredProducts
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map((product) => product.product.item.toString());

    const allSelected =
      currentPageProductItems.length > 0 &&
      currentPageProductItems.every((item) => selectedProducts.includes(item));

    setSelectAll(allSelected);
  }, [selectedProducts, currentPage, itemsPerPage, filteredProducts]);

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [formData.category, formData.subCategory, formData.brand]);

  return (
    <>
      <SectionProductActions
        onFilterChange={handleFilterChange}
        mode={mode}
        formData={formData}
      />
      <div className="font-gilroyRegular tracking-wider overflow-x-auto">
        {isLoading ? (
          <div className="py-10 text-center">Loading products...</div>
        ) : (
          <>
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left left-0 bg-white">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      disabled={mode === "view"}
                    />
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-500 whitespace-nowrap">
                    Product Name
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-500">
                    Category
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-500">
                    Sub Category
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold text-gray-500">
                    Brand
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredProducts
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((product) => {
                      const productItem = product.product.item.toString();
                      return (
                        <tr
                          key={productItem}
                          className={`border-t ${
                            selectedProductItem === productItem
                              ? "bg-blue-50"
                              : ""
                          }`}
                          onClick={() => {
                            if (mode !== "view") {
                              setSelectedProductItem(
                                selectedProductItem === productItem
                                  ? null
                                  : productItem
                              );
                            }
                          }}
                        >
                          <td className="py-2 sm:py-3 px-2 sm:px-4">
                            <input
                              type="checkbox"
                              className="w-4 h-4"
                              checked={selectedProducts.includes(productItem)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelectProduct(
                                  productItem,
                                  e.target.checked
                                );
                              }}
                              disabled={mode === "view"}
                            />
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                            {product.product.itemDesc}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                            {product.product.category}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                            {product.product.subCategory}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                            {product.product.brand}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-4 text-xs sm:text-sm gap-2 sm:gap-0">
              <div>
                Showing {startItem} to {endItem} of {filteredProducts.length}{" "}
                entries
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                <select
                  className="p-2 border rounded"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {[100, 500, 1000].map((value) => (
                    <option key={value} value={value}>
                      Show {value}
                    </option>
                  ))}
                </select>
                <div className="flex flex-row items-center gap-2">
                  <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                  >
                    &lt;&lt;
                  </button>
                  <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    &lt;
                  </button>
                  <span className="px-2 py-1 bg-gray-100 border rounded">
                    {currentPage}
                  </span>
                  <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    &gt;
                  </button>
                  <button
                    className="px-2 py-1 border rounded disabled:opacity-50"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    &gt;&gt;
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
