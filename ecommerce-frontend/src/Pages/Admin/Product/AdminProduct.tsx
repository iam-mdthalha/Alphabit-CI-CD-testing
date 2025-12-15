"use client";

import { notifications } from "@mantine/notifications";
import { ProductActions } from "Components/Admin/AdminProduct/AdminProduct/ProductActions";
import { ProductForm } from "Components/Admin/AdminProduct/AdminProduct/ProductForm";
import { ProductTable } from "Components/Admin/AdminProduct/AdminProduct/ProductTable";
import { Header } from "Components/Admin/StyleComponent/Header";
import { ProductAdminRequestDTO } from "Interface/Admin/Products/admin-product.interface";
import { useEffect, useState } from "react";
import {
  useCreateAdminProductMutation,
  useDeleteAdminProductMutation,
  useGetAllAdminProductsQuery,
  useLazyGetAdminProductByIdQuery,
  useUpdateAdminProductMutation,
  useUploadAdminProductMainImageMutation,
  useUploadAdminProductOtherImagesMutation,
} from "Services/Admin/ProductAdminApiSlice";
import { ProductDetailDTO } from "Types/ProductDetailDTO";
import { ProductMetaDTO } from "Types/ProductMetaDTO";

const AdminProduct = () => {
  const [pageSize, setPageSize] = useState(100);
  const [activePage, setActivePage] = useState(1);
  const {
    data: productPacker,
    isLoading,
    refetch,
  } = useGetAllAdminProductsQuery({
    category: "",
    subCategory: "",
    brand: "",
    activePage,
    pageSize,
  });

  const [createProduct] = useCreateAdminProductMutation();
  const [updateProduct] = useUpdateAdminProductMutation();
  const [deleteProduct] = useDeleteAdminProductMutation();

  const [uploadMainImage] = useUploadAdminProductMainImageMutation();
  const [uploadAdditionalImages] = useUploadAdminProductOtherImagesMutation();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  // const [editingProduct, setEditingProduct] = useState<ProductMetaDTO | null>(
  //   null
  // );
  const [editingProduct, setEditingProduct] = useState<ProductDetailDTO | null>(
    null
  );
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const [filteredProducts, setFilteredProducts] = useState<ProductMetaDTO[]>(
    []
  );
  const [filterOption, setFilterOption] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let filtered = productPacker ? [...productPacker.products] : [];

    if (filterOption === "Active") {
      filtered = filtered.filter(
        (product) => product.product.isActive.toString() === "Y"
      );
    } else if (filterOption === "Inactive") {
      filtered = filtered.filter(
        (product) => product.product.isActive.toString() !== "Y"
      );
    }

    if (searchText) {
      filtered = filtered.filter(
        (product) =>
          product.product.itemDesc
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          product.product.item.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [productPacker, searchText]);

  const [getProductDetailById] = useLazyGetAdminProductByIdQuery();

  const handleViewProduct = async (id: number) => {
    if (typeof id !== "number") {
      console.error("Invalid product ID:", id);
      return;
    }

    try {
      const productDetail = await getProductDetailById({ id }).unwrap();

      if (productDetail && productDetail.productWrapper?.product?.id) {
        setEditingProduct(productDetail);
        setViewMode(true);
        setShowForm(true);
      } else {
        throw new Error("Invalid product data received");
      }
    } catch (error) {
      console.error("Failed to get product details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load product details",
        color: "red",
      });
    }
  };

  const handleEditProduct = async (id: number) => {
    if (typeof id !== "number") {
      console.error("Invalid product ID:", id);
      return;
    }
    try {
      const productDetail = await getProductDetailById({ id }).unwrap();
      if (productDetail && productDetail.productWrapper?.product?.id) {
        setEditingProduct(productDetail);
        setViewMode(false);
        setShowForm(true);
      } else {
        throw new Error("Invalid product data received");
      }
    } catch (error) {
      console.error("Failed to get product details:", error);
      notifications.show({
        title: "Error!",
        message: "Failed to load product details",
        color: "red",
      });
    }
  };

  const handleSubmit = async (
    data: ProductAdminRequestDTO,
    mainImageFile: File | null,
    additionalImageFiles: (File | null)[],
    addImgsLineNo: number[]
  ) => {
    try {
      const additionalFilesWithIndex = additionalImageFiles
        .map((file, index) => ({ file, index }))
        .filter(({ file }) => file !== null);

      const additionalFileArray = additionalFilesWithIndex.map(
        ({ file }) => file as File
      );
      const lineNumbers = additionalFilesWithIndex.map(({ index }) => index);

      if (editingProduct && editingProduct.productWrapper?.product?.id) {
        const response = await updateProduct({
          id: editingProduct.productWrapper.product.id,
          data,
        }).unwrap();

        if (mainImageFile) {
          const mainImgResponse = await uploadMainImage({
            id: response as number,
            image: mainImageFile,
          }).unwrap();
        }

        if (additionalFileArray.length > 0) {
          const addImgResponse = await uploadAdditionalImages({
            id: response as number,
            images: additionalFileArray,
            lnNo: lineNumbers,
          }).unwrap();
        }

        notifications.show({
          title: "Success!",
          message: "Product updated successfully",
          color: "teal",
        });
      } else {
        const response = await createProduct(data).unwrap();

        if (mainImageFile) {
          const mainImgResponse = await uploadMainImage({
            id: response as number,
            image: mainImageFile,
          }).unwrap();
        }

        if (additionalFileArray.length > 0) {
          const addImgResponse = await uploadAdditionalImages({
            id: response as number,
            images: additionalFileArray,
            lnNo: lineNumbers,
          }).unwrap();
        }

        notifications.show({
          title: "Success!",
          message: "Product added successfully",
          color: "teal",
        });
      }

      refetch();
      setShowForm(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error("Full Error Details:", error);
      notifications.show({
        title: "Error!",
        message: error.data.message,
        color: "red",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id).unwrap();
      notifications.show({
        title: "Success!",
        message: "Product deleted successfully",
        color: "teal",
      });
      refetch();
    } catch (error) {
      notifications.show({
        title: "Error!",
        message: "Failed to delete product",
        color: "red",
      });
      console.error("Failed to delete product:", error);
    }
  };

  const productMappingFromProductDetailDTOToRequest = (
    editingProduct: ProductDetailDTO | null
  ): ProductAdminRequestDTO | null => {
    if (
      !editingProduct ||
      !editingProduct.productWrapper ||
      !editingProduct.productWrapper.product
    ) {
      return null;
    }

    const product = editingProduct.productWrapper.product;

    const mappedData: ProductAdminRequestDTO = {
      productCode: product.item || "",
      productName: product.itemDesc || "",
      productDescription: editingProduct.detailDesc || [],
      category: editingProduct.categoryWrapper?.id || "",
      subCategory: editingProduct.subCategoryWrapper?.id || "",
      brand: editingProduct.brandWrapper?.id || "",
      // subClassId: editingProduct.subClassWrapper?.subClassCode || "",
      subClassId: product?.subClassId || "",
      author: product?.author || "",
      
      language: product?.language || "",
      academic: product?.academic || "",
      merchandise: product?.merchandise || "",
      purchaseUom: product.purchaseUom || "",
      cost: product.cost || 0,
      salesUom: product.salesUom || "",
      mrp: product.mrp || 0,
      sellingPrice: product.sellingPrice || 0,
      minimumSellingPrice: product.minimumSellingPrice || 0,
      inventoryUom: product.inventoryUom || "",
      minimumStkQty: product.minimumStkQty || 0,
      maximumStkQty: product.maximumStkQty || 0,
      isNewArrival: product.isNewArrival || 0,
      isTopSelling: product.isTopSelling || 0,
      isActive: product.isActive?.toString() || "Y",
      model: product.model || "",
      baseUom: product.baseUom || "",
      remarkTwo: product.remarkTwo || "",
      productGarmentType: editingProduct.productGarmentTypeDTO || {
        id: 0,
        size: "",
        fabric: "",
        collar: "",
        color: "",
        sleeve: "",
        occasion: "",
        pattern: "",
      },
      gst: product.gst || 0,
      cgst: product.cgst || 0,
      sgst: product.sgst || 0,
      cess: product.cess || 0,
      hsCode: product.hsCode || "",
      minimumInvQty: product.minimumInvQty || 0,
      labelPara1: product.labelPara1 || "",
      labelPara2: product.labelPara2 || "",
      labelPara3: product.labelPara3 || "",
      labelPara4: product.labelPara4 || "",
      labelPara5: product.labelPara5 || "",
      labelPara6: product.labelPara6 || "",
      labelPara7: product.labelPara7 || "",
      labelPara8: product.labelPara8 || "",
      parameter1: product.parameter1 || "",
      parameter2: product.parameter2 || "",
      parameter3: product.parameter3 || "",
      parameter4: product.parameter4 || "",
      parameter5: product.parameter5 || "",
      parameter6: product.parameter6 || "",
      parameter7: product.parameter7 || "",
      parameter8: product.parameter8 || "",
      detailDescription: product.detailDescription || "",
      itemGroupId: product.itemGroupId
        ? Number(product.itemGroupId)
        : undefined,
    };

    return mappedData;
  };

  return (
    <div className="font-gilroyRegular p-6 max-w-7xl mx-auto">
      {!showForm ? (
        <>
          <Header
            title="Products"
            onAdd={() => setShowForm(true)}
            addLabel="Add Product"
          />
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-4 pt-8">
            <ProductActions
              onDelete={() =>
                selectedProductId && handleDeleteProduct(selectedProductId)
              }
              onFilterChange={setFilterOption}
              onSearchChange={setSearchText}
              isDeleteDisabled={!selectedProductId}
            />

            <ProductTable
              products={filteredProducts}
              onSelectProduct={setSelectedProductId}
              onDeleteProduct={handleDeleteProduct}
              onViewProduct={handleViewProduct}
              onEditProduct={handleEditProduct}
              selectedProduct={selectedProductId}
              isLoading={isLoading}
              onPageChange={setActivePage}
              onItemsPerPageChange={setPageSize}
              currentPage={activePage}
              itemsPerPage={pageSize}
            />
          </div>
        </>
      ) : (
        <>
          <button
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4"
            onClick={() => {
              setShowForm(false);
              setEditingProduct(null);
              setViewMode(false);
            }}
          >
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
              className="lucide lucide-arrow-left-icon lucide-arrow-left h-4 w-4"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span className="text-sm">Back</span>
          </button>
          <Header
            title={
              viewMode
                ? "View Product"
                : editingProduct
                ? "Edit Product"
                : "Add Product"
            }
          />
          <ProductForm
            initialValues={
              productMappingFromProductDetailDTOToRequest(editingProduct) ||
              ({
                brand: "",
                category: "",
                cost: 0,
                inventoryUom: "pcs",
                isNewArrival: 0,
                isTopSelling: 0,
                maximumStkQty: 0,
                minimumSellingPrice: 0,
                minimumStkQty: 0,
                mrp: 0,
                productCode: "",
                productDescription: [],
                productName: "",
                purchaseUom: "pcs",
                salesUom: "pcs",
                sellingPrice: 0,
                subCategory: "",
                isActive: "Y",
                model: "",
                baseUom: "pcs",
                remarkTwo: "",
                productgarmenttype: {
                  id: 0,
                  size: "",
                  fabric: "",
                  collar: "",
                  color: "",
                  sleeve: "",
                  occasion: "",
                  pattern: "",
                },
                gst: 0,
                cgst: 0,
                sgst: 0,
                cess: 0,
                hsCode: "",
                minimumInvQty: 0,
                labelPara1: "",
                labelPara2: "",
                labelPara3: "",
                labelPara4: "",
                labelPara5: "",
                labelPara6: "",
                labelPara7: "",
                labelPara8: "",
                parameter1: "",
                parameter2: "",
                parameter3: "",
                parameter4: "",
                parameter5: "",
                parameter6: "",
                parameter7: "",
                parameter8: "",
                detailDescription: "",
                itemGroupId: undefined,
              } as unknown as ProductAdminRequestDTO)
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setViewMode(false);
              setEditingProduct(null);
            }}
            existingMainImage={
              editingProduct?.productWrapper.imagePath || undefined
            }
            existingAdditionalImages={editingProduct?.imagePaths}
            mode={viewMode ? "view" : editingProduct ? "edit" : "add"}
          />
        </>
      )}
    </div>
  );
};

export default AdminProduct;
