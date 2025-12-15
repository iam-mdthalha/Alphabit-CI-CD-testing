import { ProductEcomDetailDTO } from "Interface/Client/Products/product.interface";
import { ProductDetailDTO } from "Types/ProductDetailDTO";
import { ProductFilterParams, ProductPackerDTO } from "Types/ProductPackerDTO";
import { ResultsDTO } from "Types/ResultsDTO";
import { ApiService } from "./ApiService";

export const ProductApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getListOfProducts: builder.query<
      ProductPackerDTO,
      {
        category: string | undefined;
        pageSize: number;
        activePage: number;
        items?: string[];
      }
    >({
      query: ({ category, pageSize, activePage, items }) => {
        let url = `/products?category=${category}&mode=criteria&productsCount=${pageSize}&page=${activePage}`;

        if (items && items.length > 0) {
          items.forEach((item) => {
            url += `&items=${encodeURIComponent(item)}`;
          });
        }

        return {
          url,
          method: "GET",
        };
      },
    }),
    getProductsBySearch: builder.query<
      ProductPackerDTO,
      {
        searchValue: string;
        searchOffsetValue: string;
        pageSize: number;
        activePage: number;
      }
    >({
      query: ({ searchValue, searchOffsetValue, pageSize, activePage }) => ({
        url: `/products?search=${searchValue}&mode=criteria&category=${searchOffsetValue}&productsCount=${pageSize}&page=${activePage}`,
        method: "GET",
      }),
    }),
    getFilteredProducts: builder.query<ProductPackerDTO, ProductFilterParams>({
      query: (params) => {
        let url = "/products/filter?";

        const queryParams: string[] = [];

        if (params.brand)
          queryParams.push(`brand=${encodeURIComponent(params.brand)}`);
        if (params.category)
          queryParams.push(`category=${encodeURIComponent(params.category)}`);
        if (params.Collar)
          queryParams.push(`Collar=${encodeURIComponent(params.Collar)}`);
        if (params.Color)
          queryParams.push(`Color=${encodeURIComponent(params.Color)}`);
        if (params.department)
          queryParams.push(
            `department=${encodeURIComponent(params.department)}`
          );
        if (params.Fabric)
          queryParams.push(`Fabric=${encodeURIComponent(params.Fabric)}`);
        if (params.fromprice !== undefined)
          queryParams.push(`fromprice=${params.fromprice}`);
        if (params.items && params.items.length > 0) {
          params.items.forEach((item) => {
            queryParams.push(`items=${encodeURIComponent(item)}`);
          });
        }
        queryParams.push(`mode=${params.mode}`);
        if (params.Occasion)
          queryParams.push(`Occasion=${encodeURIComponent(params.Occasion)}`);
        queryParams.push(`page=${params.page}`);
        if (params.Pattern)
          queryParams.push(`Pattern=${encodeURIComponent(params.Pattern)}`);
        queryParams.push(`productsCount=${params.productsCount}`);
        if (params.search)
          queryParams.push(`search=${encodeURIComponent(params.search)}`);
        if (params.Sleeve)
          queryParams.push(`Sleeve=${encodeURIComponent(params.Sleeve)}`);
        if (params.subCategory)
          queryParams.push(
            `subCategory=${encodeURIComponent(params.subCategory)}`
          );
        if (params.Toprice !== undefined)
          queryParams.push(`Toprice=${params.Toprice}`);

        url += queryParams.join("&");

        return {
          url,
          method: "GET",
        };
      },
    }),
    getTopSellers: builder.query<
      ProductPackerDTO,
      { pageSize: number; activePage: number }
    >({
      query: ({ pageSize, activePage }) => ({
        url: `/products/top-selling?productsCount=${pageSize}&page=${activePage}`,
        method: "GET",
      }),
    }),
    getNewArrivals: builder.query<
      ProductPackerDTO,
      { pageSize: number; activePage: number }
    >({
      query: ({ pageSize, activePage }) => ({
        url: `/products/new-arrivals?productsCount=${pageSize}&page=${activePage}`,
        method: "GET",
      }),
    }),
    getProductById: builder.query<ProductDetailDTO, { productId: string }>({
      query: ({ productId }) => ({
        url: `/products/${encodeURIComponent(productId)}`,
        method: "GET",
      }),
    }),
    getRelatedProducts: builder.query<
      ProductPackerDTO,
      {
        productId: string;
        category: string;
        subCategory: string;
        brand: string;
        dept: string;
      }
    >({
      query: ({ productId, category, subCategory, brand, dept }) => ({
        url: `/products/related-products/${encodeURIComponent(
          productId
        )}?category=${category}&subcategory=${subCategory}&brand=${brand}&dept=${dept}`,
      }),
    }),
    getEcomProductDetailById: builder.query<
      ProductEcomDetailDTO,
      { plant: string; productId: string }
    >({
      query: ({ plant, productId }) => ({
        url: `/products/EcomProductDetailById?plant=${plant}&productId=${productId}`,
        method: "GET",
      }),
      transformResponse: (response: ResultsDTO) => {
        return response.results as ProductEcomDetailDTO;
      },
    }),
    getEcomProductDetailByCollar: builder.query<
      ProductEcomDetailDTO,
      { collar: string; itemgroupid: string; plant: string }
    >({
      query: ({ collar, itemgroupid, plant }) => ({
        url: `/products/EcomProductDetailByCollar?Collar=${encodeURIComponent(
          collar
        )}&itemgroupid=${encodeURIComponent(
          itemgroupid
        )}&plant=${encodeURIComponent(plant)}`,
        method: "GET",
      }),
    }),
    getEcomProductDetailByColor: builder.query<
      ProductEcomDetailDTO,
      { color: string; itemgroupid: string; plant: string }
    >({
      query: ({ color, itemgroupid, plant }) => ({
        url: `/products/EcomProductDetailByColor?Color=${encodeURIComponent(
          color
        )}&itemgroupid=${encodeURIComponent(
          itemgroupid
        )}&plant=${encodeURIComponent(plant)}`,
        method: "GET",
      }),
    }),
    getEcomProductDetailBySize: builder.query<
      ProductEcomDetailDTO,
      { size: string; itemgroupid: string; plant: string }
    >({
      query: ({ size, itemgroupid, plant }) => ({
        url: `/products/EcomProductDetailBySize?Size=${encodeURIComponent(
          size
        )}&itemgroupid=${encodeURIComponent(
          itemgroupid
        )}&plant=${encodeURIComponent(plant)}`,
        method: "GET",
      }),
    }),
    getEcomProductDetailByIdPost: builder.mutation<
      ProductEcomDetailDTO,
      { plant: string; productId: string }
    >({
      query: ({ plant, productId }) => ({
        url: `/products/EcomProductDetailByIdPost?plant=${plant}&productId=${productId}`,
        method: "POST",
      }),
    }),
    getEcomProductDetailByCollarPost: builder.mutation<
      ProductEcomDetailDTO,
      { collar: string; itemgroupid: string; plant: string }
    >({
      query: ({ collar, itemgroupid, plant }) => ({
        url: `/products/EcomProductDetailByCollarPost?Collar=${encodeURIComponent(
          collar
        )}&itemgroupid=${encodeURIComponent(
          itemgroupid
        )}&plant=${encodeURIComponent(plant)}`,
        method: "POST",
      }),
    }),
    getEcomProductDetailByColorPost: builder.mutation<
      ProductEcomDetailDTO,
      { color: string; itemgroupid: string; plant: string }
    >({
      query: ({ color, itemgroupid, plant }) => ({
        url: `/products/EcomProductDetailByColorPost?Color=${encodeURIComponent(
          color
        )}&itemgroupid=${encodeURIComponent(
          itemgroupid
        )}&plant=${encodeURIComponent(plant)}`,
        method: "POST",
      }),
    }),
    getEcomProductDetailBySizePost: builder.mutation<
      ProductEcomDetailDTO,
      { size: string; itemgroupid: string; plant: string }
    >({
      query: ({ size, itemgroupid, plant }) => ({
        url: `/products/EcomProductDetailBySizePost?Size=${encodeURIComponent(
          size
        )}&itemgroupid=${encodeURIComponent(
          itemgroupid
        )}&plant=${encodeURIComponent(plant)}`,
        method: "POST",
      }),
    }),
    getEcomProductDetailByIdDataImageURI: builder.mutation<
      ProductEcomDetailDTO,
      { plant: string; productId: string }
    >({
      query: ({ plant, productId }) => ({
        url: `/products/EcomProductDetailByIdDataImageURl`,
        method: "POST",
        body: {
          plant: plant,
          productId: productId,
        },
      }),
    }),
    getProductImage: builder.query<string, string>({
      query: (imagePath) => ({
        url: `/products/getProductImage?imagePath=${encodeURIComponent(
          imagePath
        )}`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        },
      }),
    }),

    getListOfProductsbygroup: builder.query<
      ProductPackerDTO,
      {
        brand?: string;
        category?: string;
        department?: string;
        items?: string[];
        mode: string;
        page: number;
        productsCount: number;
        search?: string;
        subCategory?: string;
      }
    >({
      query: (params) => {
        let url = "/products/bygroup?";
        const queryParams: string[] = [];

        if (params.brand)
          queryParams.push(`brand=${encodeURIComponent(params.brand)}`);
        if (params.category)
          queryParams.push(`category=${encodeURIComponent(params.category)}`);
        if (params.department)
          queryParams.push(
            `department=${encodeURIComponent(params.department)}`
          );
        if (params.items && params.items.length > 0) {
          params.items.forEach((item) => {
            queryParams.push(`items=${encodeURIComponent(item)}`);
          });
        }
        queryParams.push(`mode=${params.mode}`);
        queryParams.push(`page=${params.page}`);
        queryParams.push(`productsCount=${params.productsCount}`);
        if (params.search)
          queryParams.push(`search=${encodeURIComponent(params.search)}`);
        if (params.subCategory)
          queryParams.push(
            `subCategory=${encodeURIComponent(params.subCategory)}`
          );

        url += queryParams.join("&");
        return {
          url,
          method: "GET",
        };
      },
    }),

    getListOfProductsWithFilterbygroup: builder.query<
      ProductPackerDTO,
      {
        brand?: string;
        category?: string;
        Collar?: string;
        Color?: string;
        department?: string;
        Fabric?: string;
        fromprice?: number;
        items?: string[];
        mode: string;
        Occasion?: string;
        page: number;
        Pattern?: string;
        productsCount: number;
        search?: string;
        Sleeve?: string;
        subCategory?: string;
        Toprice?: number;
      }
    >({
      query: (params) => {
        let url = "/products/filterbygroup?";
        const queryParams: string[] = [];

        if (params.brand)
          queryParams.push(`brand=${encodeURIComponent(params.brand)}`);
        if (params.category)
          queryParams.push(`category=${encodeURIComponent(params.category)}`);
        if (params.Collar)
          queryParams.push(`Collar=${encodeURIComponent(params.Collar)}`);
        if (params.Color)
          queryParams.push(`Color=${encodeURIComponent(params.Color)}`);
        if (params.department)
          queryParams.push(
            `department=${encodeURIComponent(params.department)}`
          );
        if (params.Fabric)
          queryParams.push(`Fabric=${encodeURIComponent(params.Fabric)}`);
        if (params.fromprice !== undefined)
          queryParams.push(`fromprice=${params.fromprice}`);
        if (params.items && params.items.length > 0) {
          params.items.forEach((item) => {
            queryParams.push(`items=${encodeURIComponent(item)}`);
          });
        }
        queryParams.push(`mode=${params.mode}`);
        if (params.Occasion)
          queryParams.push(`Occasion=${encodeURIComponent(params.Occasion)}`);
        queryParams.push(`page=${params.page}`);
        if (params.Pattern)
          queryParams.push(`Pattern=${encodeURIComponent(params.Pattern)}`);
        queryParams.push(`productsCount=${params.productsCount}`);
        if (params.search)
          queryParams.push(`search=${encodeURIComponent(params.search)}`);
        if (params.Sleeve)
          queryParams.push(`Sleeve=${encodeURIComponent(params.Sleeve)}`);
        if (params.subCategory)
          queryParams.push(
            `subCategory=${encodeURIComponent(params.subCategory)}`
          );
        if (params.Toprice !== undefined)
          queryParams.push(`Toprice=${params.Toprice}`);

        url += queryParams.join("&");
        return {
          url,
          method: "GET",
        };
      },
    }),

    getRelatedProductsbygroup: builder.query<
      ProductPackerDTO,
      {
        brand?: string;
        category?: string;
        department?: string;
        productId: string;
        subCategory?: string;
      }
    >({
      query: (params) => {
        let url = "/products/related-products-bygroup?";
        const queryParams: string[] = [];

        if (params.brand)
          queryParams.push(`brand=${encodeURIComponent(params.brand)}`);
        if (params.category)
          queryParams.push(`category=${encodeURIComponent(params.category)}`);
        if (params.department)
          queryParams.push(
            `department=${encodeURIComponent(params.department)}`
          );
        queryParams.push(`productId=${encodeURIComponent(params.productId)}`);
        if (params.subCategory)
          queryParams.push(
            `subCategory=${encodeURIComponent(params.subCategory)}`
          );

        url += queryParams.join("&");
        return {
          url,
          method: "GET",
        };
      },
    }),

    getTopSellingbygroup: builder.query<
      ProductPackerDTO,
      {
        page: number;
        productsCount: number;
      }
    >({
      query: ({ page, productsCount }) => ({
        url: `/products/top-selling-bygroup?page=${page}&productsCount=${productsCount}`,
        method: "GET",
      }),
    }),
    getProductsBySearchbygroup: builder.query<
      ProductPackerDTO,
      {
        search?: string;
        category?: string;
        brand?: string;
        department?: string;
        items?: string[];
        mode: string;
        page: number;
        productsCount: number;
        subCategory?: string;
      }
    >({
      query: (params) => {
        let url = "/products/bygroup?";
        const queryParams: string[] = [];

        if (params.search)
          queryParams.push(`search=${encodeURIComponent(params.search)}`);
        if (params.category)
          queryParams.push(`category=${encodeURIComponent(params.category)}`);
        if (params.brand)
          queryParams.push(`brand=${encodeURIComponent(params.brand)}`);
        if (params.department)
          queryParams.push(
            `department=${encodeURIComponent(params.department)}`
          );
        if (params.items && params.items.length > 0) {
          params.items.forEach((item) => {
            queryParams.push(`items=${encodeURIComponent(item)}`);
          });
        }
        queryParams.push(`mode=${params.mode}`);
        queryParams.push(`page=${params.page}`);
        queryParams.push(`productsCount=${params.productsCount}`);
        if (params.subCategory)
          queryParams.push(
            `subCategory=${encodeURIComponent(params.subCategory)}`
          );

        url += queryParams.join("&");
        return {
          url,
          method: "GET",
        };
      },
    }),
    // Add these endpoints to the existing endpoints object in ProductApiSlice

    getListOfBookProducts: builder.query<
      ProductPackerDTO,
      {
        brand?: string;
        category?: string;
        department?: string;
        items?: string[];
        mode: "CRITERIA" | "ITEM_GROUP";
        page: number;
        productsCount: number;
        search?: string;
        subClass?: string;
      }
    >({
      query: (params) => {
        let url = "/products/books/?";
        const queryParams: string[] = [];

        if (params.brand)
          queryParams.push(`brand=${encodeURIComponent(params.brand)}`);
        if (params.category)
          queryParams.push(`category=${encodeURIComponent(params.category)}`);
        if (params.department)
          queryParams.push(
            `department=${encodeURIComponent(params.department)}`
          );
        if (params.items && params.items.length > 0) {
          params.items.forEach((item) => {
            queryParams.push(`items=${encodeURIComponent(item)}`);
          });
        }
        queryParams.push(`mode=${params.mode}`);
        queryParams.push(`page=${params.page}`);
        queryParams.push(`productsCount=${params.productsCount}`);
        if (params.search)
          queryParams.push(`search=${encodeURIComponent(params.search)}`);
        if (params.subClass)
          queryParams.push(`subClass=${encodeURIComponent(params.subClass)}`);

        url += queryParams.join("&");
        return {
          url,
          method: "GET",
        };
      },
    }),

    getListOfBookAcademicProducts: builder.query<
      ProductPackerDTO,
      {
        academicNames: string[];
        page: number;
        productsCount: number;
      }
    >({
      query: ({ academicNames, page, productsCount }) => {
        let url = `/products/books/academic?page=${page}&productsCount=${productsCount}`;

        if (academicNames && academicNames.length > 0) {
          academicNames.forEach((name) => {
            url += `&academicNames=${encodeURIComponent(name)}`;
          });
        }

        return {
          url,
          method: "GET",
        };
      },
    }),

    getListOfBookAuthorsProducts: builder.query<
      ProductPackerDTO,
      {
        authorNames: string[];
        page: number;
        productsCount: number;
      }
    >({
      query: ({ authorNames, page, productsCount }) => {
        let url = `/products/books/author?page=${page}&productsCount=${productsCount}`;

        if (authorNames && authorNames.length > 0) {
          authorNames.forEach((name) => {
            url += `&authorNames=${encodeURIComponent(name)}`;
          });
        }

        return {
          url,
          method: "GET",
        };
      },
    }),

    getListOfBookProductsWithFilter: builder.query<
      ResultsDTO,
      {
        academic?: string;
        author?: string;
        brand?: string;
        category?: string;
        department?: string;
        fromprice?: number;
        isNewArrival?: boolean;
        isTopSelling?: boolean;
        sort?: string;
        items?: string[];
        language?: string;
        merchandise?: string;
        mode: "CRITERIA" | "ITEM_GROUP";
        page: number;
        productsCount: number;
        search?: string;
        subClass?: string;
        Toprice?: number;
      }
    >({
      query: (params) => {
        let url = "/products/books/filter?";
        const queryParams: string[] = [];

        if (params.academic)
          queryParams.push(`academic=${encodeURIComponent(params.academic)}`);
        if (params.author)
          queryParams.push(`author=${encodeURIComponent(params.author)}`);
        if (params.brand)
          queryParams.push(`brand=${encodeURIComponent(params.brand)}`);
        if (params.category)
          queryParams.push(`category=${encodeURIComponent(params.category)}`);
        if (params.department)
          queryParams.push(
            `department=${encodeURIComponent(params.department)}`
          );
        if (params.fromprice !== undefined)
          queryParams.push(`fromprice=${params.fromprice}`);
        if (params.isNewArrival !== undefined)
          queryParams.push(`isNewArrival=${params.isNewArrival}`);
        if (params.isTopSelling !== undefined)
          queryParams.push(`isTopSelling=${params.isTopSelling}`);
        if (params.sort)
          queryParams.push(`sort=${encodeURIComponent(params.sort)}`);
        if (params.items && params.items.length > 0) {
          params.items.forEach((item) => {
            queryParams.push(`items=${encodeURIComponent(item)}`);
          });
        }
        if (params.language)
          queryParams.push(`language=${encodeURIComponent(params.language)}`);
        if (params.merchandise)
          queryParams.push(
            `merchandise=${encodeURIComponent(params.merchandise)}`
          );
        queryParams.push(`mode=${params.mode}`);
        queryParams.push(`page=${params.page}`);
        queryParams.push(`productsCount=${params.productsCount}`);
        if (params.search)
          queryParams.push(`search=${encodeURIComponent(params.search)}`);
        if (params.subClass)
          queryParams.push(`subClass=${encodeURIComponent(params.subClass)}`);
        if (params.Toprice !== undefined)
          queryParams.push(`Toprice=${params.Toprice}`);

        url += queryParams.join("&");
        return {
          url,
          method: "GET",
        };
      },
    }),

    getListOfBookLanguageProducts: builder.query<
      ProductPackerDTO,
      {
        languageNames: string[];
        page: number;
        productsCount: number;
      }
    >({
      query: ({ languageNames, page, productsCount }) => {
        let url = `/products/books/language?page=${page}&productsCount=${productsCount}`;

        if (languageNames && languageNames.length > 0) {
          languageNames.forEach((name) => {
            url += `&languageNames=${encodeURIComponent(name)}`;
          });
        }

        return {
          url,
          method: "GET",
        };
      },
    }),

    getListOfBookMerchandiseProducts: builder.query<
      ProductPackerDTO,
      {
        merchandiseNames: string[];
        page: number;
        productsCount: number;
      }
    >({
      query: ({ merchandiseNames, page, productsCount }) => {
        let url = `/products/books/merchandise?page=${page}&productsCount=${productsCount}`;

        if (merchandiseNames && merchandiseNames.length > 0) {
          merchandiseNames.forEach((name) => {
            url += `&merchandiseNames=${encodeURIComponent(name)}`;
          });
        }

        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: ResultsDTO) => {
        return response.results as ProductPackerDTO;
      },
    }),
  }),
});

export const {
  useGetTopSellersQuery,
  useGetNewArrivalsQuery,
  useGetListOfProductsQuery,
  useGetProductsBySearchQuery,
  useGetProductByIdQuery,
  useGetRelatedProductsQuery,
  useGetFilteredProductsQuery,
  useGetEcomProductDetailByIdQuery,
  useLazyGetEcomProductDetailByCollarQuery,
  useLazyGetEcomProductDetailByColorQuery,
  useLazyGetEcomProductDetailBySizeQuery,
  useGetEcomProductDetailByIdPostMutation,
  useGetEcomProductDetailByCollarPostMutation,
  useGetEcomProductDetailByColorPostMutation,
  useGetEcomProductDetailBySizePostMutation,
  useGetEcomProductDetailByIdDataImageURIMutation,
  useLazyGetProductImageQuery,
  useGetListOfProductsbygroupQuery,
  useGetListOfProductsWithFilterbygroupQuery,
  useGetRelatedProductsbygroupQuery,
  useGetTopSellingbygroupQuery,
  useGetProductsBySearchbygroupQuery,
  useGetListOfBookProductsQuery,
  useGetListOfBookAcademicProductsQuery,
  useGetListOfBookAuthorsProductsQuery,
  useGetListOfBookProductsWithFilterQuery,
  useGetListOfBookLanguageProductsQuery,
  useGetListOfBookMerchandiseProductsQuery,
} = ProductApiSlice;
