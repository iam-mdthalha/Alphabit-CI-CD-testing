import React from "react";
import { useGetSalesCountByOrderStatusQuery } from "Services/Admin/DashboardApiSlice";
import TimeRangeDropdown from "./TimeRangeDropdown";

const orderStatusOptions = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

const getDateRange = (range: string): { fromDate: string; toDate: string } => {
  const today = new Date();
  let fromDate = "";
  let toDate = "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  const format = (d: Date) =>
    `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  switch (range) {
    case "today":
      fromDate = toDate = format(today);
      break;
    case "yesterday": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      fromDate = toDate = format(y);
      break;
    }
    case "last7": {
      const f = new Date(today);
      f.setDate(f.getDate() - 6);
      fromDate = format(f);
      toDate = format(today);
      break;
    }
    case "last15": {
      const f = new Date(today);
      f.setDate(f.getDate() - 14);
      fromDate = format(f);
      toDate = format(today);
      break;
    }
    case "last30": {
      const f = new Date(today);
      f.setDate(f.getDate() - 29);
      fromDate = format(f);
      toDate = format(today);
      break;
    }
    default:
      fromDate = "";
      toDate = "";
  }
  return { fromDate, toDate };
};

const SalesCountByOrderStatusChart: React.FC = () => {
  const plant = process.env.REACT_APP_PLANT;
  const [orderStatus, setOrderStatus] = React.useState("pending");
  const [timeRange, setTimeRange] = React.useState("last7");
  const { fromDate, toDate } = getDateRange(timeRange);
  const { data, isLoading, error } = useGetSalesCountByOrderStatusQuery({
    plant,
    orderStatus,
    fromDate,
    toDate,
  });

  return (
    <div className="font-gilroyRegular tracking-wider bg-white p-5 rounded-lg border shadow-sm">
      <h2 className="text-base font-medium mb-4">
        Sales Count by Order Status
      </h2>
      <div className="bg-gray-50 rounded-lg p-4 mb-4 flex flex-col gap-y-4 w-full shadow-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-700">
            Order Status:
          </span>
          <select
            className="border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition w-40"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            {orderStatusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-700">
            Time Range:
          </span>
          <TimeRangeDropdown value={timeRange} onChange={setTimeRange} />
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center md:text-left">From: {fromDate} To: {toDate}</div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-gray-500 mb-2">No data available.</div>
      ) : !data || data.length === 0 ? (
        <div>No data available.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium text-xs">
                  Status
                </th>
                <th className="text-left py-3 px-2 font-medium text-xs">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map ? (
                data.map((row: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="py-3 px-2 text-sm">
                      {row.status || row["Order Status"] || orderStatus}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {row.count || row["Total Value:"] || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 px-2 text-sm">
                    {data["Order Status"] || orderStatus}
                  </td>
                  <td className="py-3 px-2 text-sm">
                    {data["Total Value:"] || "-"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesCountByOrderStatusChart;
