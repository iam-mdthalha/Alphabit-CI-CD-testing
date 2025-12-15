import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowUp, ArrowDown, BarChart2 } from "lucide-react";

const salesOverviewData = [
  { month: "Jan", sales: 4000, revenue: 2400 },
  { month: "Feb", sales: 3000, revenue: 1398 },
  { month: "Mar", sales: 2000, revenue: 9800 },
  { month: "Apr", sales: 2780, revenue: 3908 },
  { month: "May", sales: 1890, revenue: 4800 },
  { month: "Jun", sales: 2390, revenue: 3800 },
  { month: "Jul", sales: 3490, revenue: 4300 },
];

const AdminSalesGrowth = () => {
  const totalSales = salesOverviewData.reduce((acc, curr) => acc + curr.sales, 0);
  const bestMonth = salesOverviewData.reduce((prev, curr) =>
    curr.sales > prev.sales ? curr : prev
  );
  const worstMonth = salesOverviewData.reduce((prev, curr) =>
    curr.sales < prev.sales ? curr : prev
  );

  return (
    <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Sales Growth Rate</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chart */}
        <div className="flex-1 bg-white rounded-xl shadow-sm p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesOverviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#E02424"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#31C48D"
                strokeWidth={2}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-64 flex flex-col gap-4">
          <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl shadow-sm border border-green-200 hover:shadow-md transition-shadow">
            <BarChart2 className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-sm text-gray-600">Total Sales</h3>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {totalSales.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Best Month */}
          <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl shadow-sm border border-indigo-200 hover:shadow-md transition-shadow">
            <ArrowUp className="h-6 w-6 text-indigo-600" />
            <div>
              <h3 className="text-sm text-gray-600">Best Month</h3>
              <p className="text-lg font-semibold text-indigo-600 mt-1">
                {bestMonth.month} — {bestMonth.sales.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Worst Month */}
          <div className="flex items-center gap-4 bg-red-50 p-4 rounded-xl shadow-sm border border-red-200 hover:shadow-md transition-shadow">
            <ArrowDown className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-sm text-gray-600">Worst Month</h3>
              <p className="text-lg font-semibold text-red-600 mt-1">
                {worstMonth.month} — {worstMonth.sales.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSalesGrowth;
