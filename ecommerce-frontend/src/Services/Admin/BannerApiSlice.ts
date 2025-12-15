import { ApiService } from "Services/ApiService";
import {
  BannerAdminRequestDTO,
  BannerMstDTO,
  UpdatedBanner,
  BannerWithoutBytesDTO,
} from "Types/Admin/AdminBannerType";
import { ResultsDTO } from "Types/ResultsDTO";

export const bannerApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBanners: builder.query<{ results: BannerMstDTO[] }, void>({
      query: () => ({
        url: "admin/banners",
        method: "GET",
      }),
      providesTags: [{ type: "Banner", id: "LIST" }],
    }),

    getAllBannersWithoutBytes: builder.query<
      { results: BannerWithoutBytesDTO[] },
      void
    >({
      query: () => ({
        url: "admin/banners/allbanner",
        method: "GET",
        headers: {
          origin: "origin",
        },
      }),
      providesTags: [{ type: "Banner", id: "ALL_BANNERS" }],
    }),

    getBannerById: builder.query<
      { results: BannerMstDTO; message: string; statusCode: number },
      number
    >({
      query: (id) => ({
        url: `admin/banners/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Banner", id }],
    }),

    createBanner: builder.mutation<ResultsDTO, BannerAdminRequestDTO>({
      query: (data) => ({
        url: "admin/banners/create",
        method: "POST",
        body: data,
      }),
      transformResponse: (res: any) => {
        return res;
      },
      invalidatesTags: (result, error) => [{ type: "Banner", id: "List" }],
    }),

    updateBanner: builder.mutation<
      ResultsDTO,
      { id: number; data: Partial<UpdatedBanner> }
    >({
      query: ({ id, data }) => ({
        url: `admin/banners/update/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => {
        return response;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Banner", id },
        { type: "Banner", id: "LIST" },
      ],
    }),

    deleteBanner: builder.mutation<ResultsDTO, number>({
      query: (id) => ({
        url: `admin/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error) => [{ type: "Banner" }],
    }),

    uploadBannerImage: builder.mutation<any, { id: number; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `admin/banners/upload/${id}`,
          method: "POST",
          body: formData,
        };
      },
      transformErrorResponse: (err: any) => {
        console.error(err);
      },
      transformResponse: (res: any) => {
        return res;
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Banner", id },
        { type: "Banner", id: "LIST" },
      ],
    }),

    uploadBanner2Image: builder.mutation<void, { id: number; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: `/admin/banners/upload2/${id}`,
          method: "POST",
          body: formData,
          headers: {
            origin: "origin",
          },
        };
      },
    }),
  }),
});

export const {
  useGetAdminBannersQuery,
  useGetAllBannersWithoutBytesQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useUploadBannerImageMutation,
  useUploadBanner2ImageMutation,
} = bannerApiSlice;
