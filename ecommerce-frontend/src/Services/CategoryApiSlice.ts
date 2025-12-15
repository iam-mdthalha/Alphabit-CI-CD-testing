import { Category } from "Types/Category";
import { ApiService } from "./ApiService";

export const CategoryApiSlice = ApiService.injectEndpoints({
    endpoints: builder => ({
        getListOfCategories: builder.query<Array<Category>, void>({
            query: () => ({
                url: `/categories`,
                method: 'GET'
            })
        }),
    
    }),
});

export const {
    useGetListOfCategoriesQuery
} = CategoryApiSlice;