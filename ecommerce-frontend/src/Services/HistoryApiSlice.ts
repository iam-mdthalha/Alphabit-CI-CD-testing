// Services/HistoryApiSlice.ts

import { ApiService } from "./ApiService";
import { AdminHistory, AdminHistoryDTO } from "Types/Admin/AdminHistoryType";

export const HistoryApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /ecom-history/getAll?plant=&search=
     */
    getAllHistory: builder.query<
      AdminHistory[],
      { plant: string; search?: string }
    >({
      query: ({ plant, search }) => ({
        url: "/ecom-history/getAll",
        method: "GET",
        params: {
          plant,
          search: search ?? "",
        },
      }),
      transformResponse: (response: any): AdminHistory[] => {
        const items: any[] = response?.results ?? response ?? [];

        return items.map((item, index): AdminHistory => {
          const hdr = item.ecomHistoryHdr ?? {};

          const id =
            item.id ??
            hdr.id ??
            index; // fallback index just so React has a key

          const plant =
            item.plant ??
            hdr.plant ??
            "";

          return {
            id,
            plant,
            year: item.year ?? hdr.year ?? 0,
            title: item.title ?? hdr.title ?? "",
            description1: item.description1 ?? hdr.description1 ?? "",
            description2: item.description2 ?? hdr.description2 ?? "",
            description3: item.description3 ?? hdr.description3 ?? "",
            imageUrl: item.imageUrl ?? hdr.imageUrl ?? null,
            createdAt: item.crAt ?? hdr.crAt ?? null,
            updatedAt: item.modAt ?? hdr.modAt ?? null,
          };
        });
      },
      providesTags: ["History"],
    }),

    /**
     * GET /ecom-history?id=&plant=
     */
    getHistoryById: builder.query<
      AdminHistory,
      { id: number; plant: string }
    >({
      query: ({ id, plant }) => ({
        url: "/ecom-history",
        method: "GET",
        params: { id, plant },
      }),
      transformResponse: (response: any): AdminHistory => {
        const item = response?.results ?? response ?? {};
        const hdr = item.ecomHistoryHdr ?? {};

        const id =
          item.id ??
          hdr.id ??
          0;

        const plant =
          item.plant ??
          hdr.plant ??
          "";

        return {
          id,
          plant,
          year: item.year ?? hdr.year ?? 0,
          title: item.title ?? hdr.title ?? "",
          description1: item.description1 ?? hdr.description1 ?? "",
          description2: item.description2 ?? hdr.description2 ?? "",
          description3: item.description3 ?? hdr.description3 ?? "",
          imageUrl: item.imageUrl ?? hdr.imageUrl ?? null,
          createdAt: item.crAt ?? hdr.crAt ?? null,
          updatedAt: item.modAt ?? hdr.modAt ?? null,
        };
      },
      providesTags: (result, error, arg) => [
        { type: "History" as const, id: arg.id },
      ],
    }),

    /**
     * POST /ecom-history/save
     * body: multipart/form-data with fields:
     *  - data: JSON string (AdminHistoryDTO)
     *  - file: image (optional)
     */
    createHistory: builder.mutation<
      any,
      { data: AdminHistoryDTO; file?: File | null }
    >({
      query: ({ data, file }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        if (file) {
          formData.append("file", file);
        }

        return {
          url: "/ecom-history/save",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["History"],
    }),

    /**
     * PUT /ecom-history/update
     * body: multipart/form-data with fields:
     *  - data: JSON string (AdminHistoryDTO with id)
     *  - file: image (optional)
     */
    updateHistory: builder.mutation<
      any,
      { data: AdminHistoryDTO; file?: File | null }
    >({
      query: ({ data, file }) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));

        if (file) {
          formData.append("file", file);
        }

        return {
          url: "/ecom-history/update",
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "History" as const, id: arg.data.id },
        "History",
      ],
    }),

    /**
     * DELETE /ecom-history/delete?id=&plant=
     */
    deleteHistory: builder.mutation<
      void,
      { id: number; plant: string }
    >({
      query: ({ id, plant }) => ({
        url: "/ecom-history/delete",
        method: "DELETE",
        params: { id, plant },
      }),
      invalidatesTags: ["History"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllHistoryQuery,
  useGetHistoryByIdQuery,
  useLazyGetAllHistoryQuery,
  useLazyGetHistoryByIdQuery,
  useCreateHistoryMutation,
  useUpdateHistoryMutation,
  useDeleteHistoryMutation,
} = HistoryApiSlice;
