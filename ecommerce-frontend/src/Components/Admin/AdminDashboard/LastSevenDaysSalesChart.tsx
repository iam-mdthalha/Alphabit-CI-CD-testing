import React from "react";
import { useGetLast7DaysSalesQuery } from "Services/Admin/DashboardApiSlice";

export const LastSevenDaysSalesChart: React.FC = () => {
  const plant = process.env.REACT_APP_PLANT;

  const {
    data: salesData,
    isLoading,
    error,
  } = useGetLast7DaysSalesQuery({ plant, timeRange: 7 });

  // After fetching salesData
  const salesArray =
    salesData && typeof salesData === "object" && !Array.isArray(salesData)
      ? Object.entries(salesData).map(([day, amount]) => ({
          day,
          amount: Number(amount),
        }))
      : Array.isArray(salesData)
      ? salesData
      : [];

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-lg border shadow-sm">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="text-gray-500 mb-2">
        No data available.
      </div>
    );
  }

  if (!Array.isArray(salesArray) || salesArray.length === 0) {
    return (
      <div className="bg-white p-5 rounded-lg border shadow-sm">
        No data available.
      </div>
    );
  }

  // Only show the last 7 days
  const last7Sales = salesArray.slice(-7);
  // Only sum the last 7 days for total revenue and items sold
  const totalRevenue = last7Sales.reduce((sum, item) => sum + item.amount, 0);
  const totalItemsSold = last7Sales.reduce(
    (sum: any, item: any) => sum + (item.itemsSold || 0),
    0
  );
  const maxAmount = Math.max(1, ...salesArray.map((item) => item.amount)); // avoid division by zero

  // Helper to get day name from date string
  const getDayName = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // If all values are zero, show an empty bar chart with faint bars
  const allZero = last7Sales.every((item) => item.amount === 0);


  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-5 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center pb-2">
        <h2 className="text-sm font-medium">Last 7 Days Sales</h2>
      </div>
      <p className="text-xs text-gray-500">
        {totalItemsSold.toLocaleString()} Items Sold
      </p>
      <p className="text-lg font-bold mt-1">
        Rs: {totalRevenue.toLocaleString()} Revenue
      </p>
      <div className="h-[300px] mt-4 overflow-x-auto">
        <div className="h-[250px] flex items-end gap-x-1 min-w-full">
          {last7Sales.map((item, index) => {
            const barHeight = allZero
              ? 4
              : item.amount > 0
              ? (item.amount / maxAmount) * 200
              : 4;
            return (
              <div key={index} className="flex flex-col items-center w-20">
                <div
                  className="w-16 bg-blue-500 rounded-t-sm"
                  style={{
                    height: `${barHeight}px`,
                    opacity: allZero ? 0.15 : item.amount > 0 ? 1 : 0.3,
                  }}
                  title={item.amount}
                ></div>
                <div className="mt-2 text-xs text-gray-500 whitespace-nowrap">
                  {getDayName(item.day)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
