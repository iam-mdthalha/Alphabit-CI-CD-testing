import { ApiService } from "Services/ApiService";

// Define types for dashboard data
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  uniqueVisits: number;
  uniqueVisitsChange: number;
  newUsers: number;
  newUsersChange: number;
  existingUsers: number;
  existingUsersChange: number;
  ordersOverTime: Array<{ time: string; today: number; yesterday: number }>;
  lastSevenDaysSales: Array<{ day: string; amount: number }>;
  totalItemsSold: number;
  topProducts: Array<{ id: number; name: string; image: string; price: number; unitsSold: number }>;
  recentTransactions: Array<{ id: number; name: string; date: string; amount: number; status: string }>;
}

const defaultFromDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
};
const defaultToDate = () => new Date().toISOString().slice(0, 10);

const plant = process.env.REACT_APP_PLANT;

export const DashboardApiSlice = ApiService.injectEndpoints({
  endpoints: (builder) => ({
    getTotalRevenue: builder.query<string, { plant: string }>({
      query: ({ plant }) => ({
        url: `/Dashboard/getTotalRevenue?plant=${plant}`,
        method: "GET",
        responseHandler: "text",
      }),
    }),
    getTotalOrders: builder.query<string, { plant: string }>({
      query: ({ plant }) => ({
        url: `/Dashboard/getTotalOrders?plant=${plant}`,
        method: "GET",
        responseHandler: "text",
      }),
    }),
    getUniqueVisits: builder.query<string, { plant: string }>({
      query: ({ plant }) => ({
        url: `/Dashboard/getUniqueVisits?plant=${plant}`,
        method: "GET",
      }),
    }),
    getNewUser: builder.query<number, { plant: string }>({
      query: ({ plant }) => ({
        url: `/Dashboard/getNewUser?plant=${plant}`,
        method: "GET",
      }),
    }),
    getExistingUser: builder.query<number, { plant: string }>({
      query: ({ plant }) => ({
        url: `/Dashboard/getExistingUser?plant=${plant}`,
        method: "GET",
      }),
    }),
    getOrdersOverTime: builder.query<any, { plant: string; timeRange?: number }>({
      query: ({ plant, timeRange }) => ({
        url: `/Dashboard/getOrdersOverTime?plant=${plant}${timeRange !== undefined ? `&timeRange=${timeRange}` : ''}`,
        method: "GET",
      }),
    }),
    getLast7DaysSales: builder.query<any, { plant: string; timeRange?: number }>({
      query: ({ plant, timeRange }) => ({
        url: `/Dashboard/getLast7DaysSales?plant=${plant}${timeRange !== undefined ? `&timeRange=${timeRange}` : ''}`,
        method: "GET",
      }),
    }),
    getAllTopSelling: builder.query<any, { plant: string }>({
      query: ({ plant }) => ({
        url: `/Dashboard/getAllTopSelling?plant=${plant}`,
        method: "GET",
      }),
    }),
    getRecentTransactions: builder.query<any, { plant: string }>({
      query: ({ plant }) => ({
        url: `/Dashboard/getRecentTransactions?plant=${plant}`,
        method: "GET",
      }),
    }),
    getSalesCountByOrderStatus: builder.query<any, { plant: string; orderStatus?: string; fromDate?: string; toDate?: string }>({
      query: ({ plant, orderStatus = '', fromDate = '', toDate = '' }) => ({
        url: `/Dashboard/getSalesCountByOrderStatus?plant=${plant}&orderStatus=${orderStatus}&fromDate=${fromDate}&toDate=${toDate}`,
        method: "GET",
      }),
    }),
    getSalesValueByOrderStatus: builder.query<any, { plant: string; orderStatus?: string; fromDate?: string; toDate?: string }>({
      query: ({ plant, orderStatus = '', fromDate = '', toDate = '' }) => ({
        url: `/Dashboard/getSalesValueByOrderStatus?plant=${plant}&orderStatus=${orderStatus}&fromDate=${fromDate}&toDate=${toDate}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetTotalRevenueQuery,
  useGetTotalOrdersQuery,
  useGetUniqueVisitsQuery,
  useGetNewUserQuery,
  useGetExistingUserQuery,
  useGetOrdersOverTimeQuery,
  useGetLast7DaysSalesQuery,
  useGetAllTopSellingQuery,
  useGetRecentTransactionsQuery,
  useGetSalesCountByOrderStatusQuery,
  useGetSalesValueByOrderStatusQuery,
} = DashboardApiSlice; 