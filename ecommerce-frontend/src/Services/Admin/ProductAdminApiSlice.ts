import { ProductAdminRequestDTO } from "Interface/Admin/Products/admin-product.interface";
import { ApiService } from "Services/ApiService";

import { ProductDetailDTO } from "Types/ProductDetailDTO";
import { ProductPackerDTO } from "Types/ProductPackerDTO";
import { ResultsDTO } from "Types/ResultsDTO";

export const productAdminApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------------------------------------
    // GET ALL PRODUCTS
    // ---------------------------------------------
    getAllAdminProducts: builder.query<
      ProductPackerDTO,
      {
        category: string | undefined;
        pageSize: number;
        activePage: number;
        subCategory: string | undefined;
        brand: string | undefined;
      }
    >({
      query: ({ category, pageSize, activePage, subCategory, brand }) => ({
        url: `/admin/products?mode=criteria&productsCount=${pageSize}&page=${activePage}`,
        method: "GET",
      }),
      transformResponse: (res: ResultsDTO) => res.results,
    }),

    // ---------------------------------------------
    // GET PRODUCT BY ID (Add ISBN fallback here)
    // ---------------------------------------------
    getAdminProductById: builder.query<ProductDetailDTO, { id: number }>({
      query: ({ id }) => ({
        url: `/admin/products/getbyid/${id}`,
        method: "GET",
      }),
      transformResponse: (res: ResultsDTO) => {
        const data: any = res.results;

        return {
          ...data,
          isbn: data?.isbn || "", // <-- Add ISBN safely
        };
      },
    }),

    // ---------------------------------------------
    // CREATE PRODUCT (ISBN included)
    // ---------------------------------------------
    createAdminProduct: builder.mutation<any, ProductAdminRequestDTO>({
      query: (product) => ({
        url: "/admin/products/create",
        method: "POST",
        headers: {
          origin: "origin - origin",
        },
        body: {
          ...product,
          isbn: product.isbn || "", // <--- Add ISBN here
        },
      }),
      transformResponse: (res: ResultsDTO) => res.results,
      invalidatesTags: [{ type: "PrdProduct", id: "LIST" }],
    }),

    
    // UPDATE PRODUCT 
   
    updateAdminProduct: builder.mutation<
      any,
      { id: number; data: ProductAdminRequestDTO }
    >({
      query: ({ id, data }) => ({
        url: `/admin/products/update/${id}`,
        method: "PUT",
        headers: {
          origin: "origin - origin",
        },
        body: {
          ...data,
          isbn: data.isbn || "", 
        },
      }),
      transformResponse: (res: ResultsDTO) => res.results,
      invalidatesTags: (result, error, { id }) => [{ type: "PrdProduct", id }],
    }),

  
    // DELETE PRODUCT
    
    deleteAdminProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/products/delete/${id}`,
        method: "DELETE",
      }),
      transformResponse: (res: ResultsDTO) => res.results,
      invalidatesTags: (result, error) => [{ type: "PrdProduct" }],
    }),

    // ---------------------------------------------
    // UPLOAD MAIN IMAGE
    // ---------------------------------------------
    uploadAdminProductMainImage: builder.mutation<
      void,
      { id: number; image: File }
    >({
      query: ({ id, image }) => {
        const formData = new FormData();
        formData.append("image", image);
        return {
          url: `/admin/products/upload-main-image/${id}`,
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      transformResponse: (res: ResultsDTO) => res.results,
      invalidatesTags: (result, error, { id }) => [{ type: "PrdProduct", id }],
    }),

    // ---------------------------------------------
    // UPLOAD OTHER IMAGES
    // ---------------------------------------------
    uploadAdminProductOtherImages: builder.mutation<
      void,
      { id: number; images: File[]; lnNo: number[] }
    >({
      query: ({ id, images, lnNo }) => {
        const formData = new FormData();
        images.forEach((file) => formData.append("images", file));
        lnNo.forEach((num) => {
          formData.append("lnNo", num.toString());
        });
        return {
          url: `/admin/products/upload-other-images/${id}`,
          method: "POST",
          body: formData,
          formData: true,
          credentials: "same-origin",
        };
      },
      transformResponse: (res: ResultsDTO) => res.results,
      invalidatesTags: (result, error, { id }) => [{ type: "PrdProduct", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllAdminProductsQuery,
  useGetAdminProductByIdQuery,
  useLazyGetAdminProductByIdQuery,
  useCreateAdminProductMutation,
  useUpdateAdminProductMutation,
  useDeleteAdminProductMutation,
  useUploadAdminProductMainImageMutation,
  useUploadAdminProductOtherImagesMutation,
} = productAdminApiSlice;
