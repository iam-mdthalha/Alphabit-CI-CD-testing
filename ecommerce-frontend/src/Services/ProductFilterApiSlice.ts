import { ApiService } from "./ApiService";

export const productFilterApi = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getAllPrdCollarMst: builder.query<string[], { plant: string; search?: string }>({
      query: ({ plant, search }) => 
        `/ProductFilter/getAllPrdCollarMst?plant=${plant}${search ? `&search=${search}` : ''}`
    }),
    getAllPrdColorMst: builder.query<string[], { plant: string; search?: string }>({
      query: ({ plant, search }) => 
        `/ProductFilter/getAllPrdColorMst?plant=${plant}${search ? `&search=${search}` : ''}`
    }),
    getAllPrdFabricMst: builder.query<string[], { plant: string; search?: string }>({
      query: ({ plant, search }) => 
        `/ProductFilter/getAllPrdFabricMst?plant=${plant}${search ? `&search=${search}` : ''}`
    }),
    getAllPrdOccasionMst: builder.query<string[], { plant: string; search?: string }>({
      query: ({ plant, search }) => 
        `/ProductFilter/getAllPrdOccasionMst?plant=${plant}${search ? `&search=${search}` : ''}`
    }),
    getAllPrdPatternMst: builder.query<string[], { plant: string; search?: string }>({
      query: ({ plant, search }) => 
        `/ProductFilter/getAllPrdPatternMst?plant=${plant}${search ? `&search=${search}` : ''}`
    }),
    getAllPrdSizeMst: builder.query<string[], { plant: string; search?: string }>({
      query: ({ plant, search }) => 
        `/ProductFilter/getAllPrdSizeMst?plant=${plant}${search ? `&search=${search}` : ''}`
    }),
    getAllPrdSleeveMst: builder.query<string[], { plant: string; search?: string }>({
      query: ({ plant, search }) => 
        `/ProductFilter/getAllPrdSleeveMst?plant=${plant}${search ? `&search=${search}` : ''}`
    })
  })
});

export const {
  useGetAllPrdCollarMstQuery,
  useGetAllPrdColorMstQuery,
  useGetAllPrdFabricMstQuery,
  useGetAllPrdOccasionMstQuery,
  useGetAllPrdPatternMstQuery,
  useGetAllPrdSizeMstQuery,
  useGetAllPrdSleeveMstQuery
} = productFilterApi;