import { Section } from "Types/Section";
import { SectionDetail } from "Types/SectionDetail";
import { ApiService } from "./ApiService";

export const SectionApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getListOfSections: builder.query<Array<Section>, void>({
      query: () => ({
        url: `/sections`,
        method: "GET",
      }),
    }),
    getSectionDetail: builder.query<
      SectionDetail,
      {
        sectionString: string | undefined;
        activePage: number;
        pageSize: number;
      }
    >({
      query: ({ sectionString, activePage, pageSize }) => ({
        url: `/sections/${sectionString}?pageNo=${activePage}&productsCount=${pageSize}&includeProducts=true`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetListOfSectionsQuery, useGetSectionDetailQuery } =
  SectionApiSlice;
