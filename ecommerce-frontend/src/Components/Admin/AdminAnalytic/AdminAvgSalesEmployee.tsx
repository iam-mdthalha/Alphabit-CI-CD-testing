import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminAvgSalesEmployee = () => {
  const salesData = [
    { month: "Jan", avgSales: 4200 },
    { month: "Feb", avgSales: 3800 },
    { month: "Mar", avgSales: 4600 },
    { month: "Apr", avgSales: 5000 },
    { month: "May", avgSales: 4700 },
    { month: "Jun", avgSales: 5200 },
  ];

  return (
    <div className="p-4 rounded-2xl shadow-md bg-white dark:bg-neutral-900">
      <h3 className="font-semibold mb-4 text-gray-700 dark:text-white">
        Average Sales per Employee
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={salesData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
          <YAxis tick={{ fill: "#6b7280" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
          <Area
            type="monotone"
            dataKey="avgSales"
            stroke="#4f46e5"
            fill="url(#colorGradient)"
            strokeWidth={3}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#4f46e5" stopOpacity={0.7} />
              <stop offset="90%" stopColor="#4f46e5" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminAvgSalesEmployee;
